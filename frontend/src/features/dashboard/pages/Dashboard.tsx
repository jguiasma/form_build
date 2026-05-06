import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "../../profile/api/profile.api";
import { useCreateForm, useGetFieldTypes, useGetGlobalStats, api } from "../../form-editor/hooks/useFormApi";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarLink, StatCard, HealthRow, TableRow, FooterLink, MiniChart } from "../components/DashboardUI";
import { MyFormsView } from "../components/MyFormsView";
import { SubmissionsView } from "../components/SubmissionsView";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "dashboard";
  const selectedFormId = searchParams.get("formId") ? Number(searchParams.get("formId")) : null;

  const setActiveTab = (tab: string, formId: number | null = selectedFormId) => {
    const params: any = { tab };
    if (formId && (tab === "submissions" || tab === "insights")) {
      params.formId = formId;
    }
    setSearchParams(params);
  };

  const { email, clearAlerts, setView } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newFormDetails, setNewFormDetails] = useState({
    title: "",
    description: "",
    form_type_id: 0,
  });

  const { data: profile } = useQuery({
    queryKey: ["profileProgress"],
    queryFn: profileApi.getProgress,
  });

  const createFormMutation = useCreateForm();
  const { data: formTypes, isLoading: isLoadingTypes } = useGetFieldTypes();
  const { data: globalStats, isLoading: isLoadingStats } = useGetGlobalStats();

  useEffect(() => {
    if (formTypes?.length && newFormDetails.form_type_id === 0) {
      setNewFormDetails((prev) => ({ ...prev, form_type_id: formTypes[0].id }));
    }
  }, [formTypes]);

  const handleOpenModal = () => {
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormError(null);
    setNewFormDetails({
      title: "",
      description: "",
      form_type_id: formTypes?.[0]?.id ?? 0,
    });
  };

  const handleNewFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const form_type_id = newFormDetails.form_type_id || formTypes?.[0]?.id;
    if (!form_type_id) {
      setFormError("No form type available. Please wait for types to load.");
      return;
    }

    try {
      const selectedType = formTypes?.find(t => t.id === form_type_id);
      const newForm = await createFormMutation.mutateAsync({
        title: newFormDetails.title || "Untitled Form",
        description: newFormDetails.description,
        form_type_id,
        require_biometrics: selectedType?.name === 'require_biometrics'
      } as any);
      navigate(`/editor/${newForm.id}`);
    } catch (error: any) {
      const errors = error.response?.data?.errors;
      if (errors) {
        const messages = Object.values(errors).flat().join(" ");
        setFormError(messages);
      } else {
        setFormError(error.response?.data?.message || "Failed to create form. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    clearAlerts();
    setView("login");
    navigate("/auth");
  };

  const handleGlobalExport = async () => {
    try {
      const { data } = await api.get('/admin/forms/export/all');
      const filteredLogs = data.data;
      if (!filteredLogs || filteredLogs.length === 0) return;
      
      const allFieldKeys = new Set<string>();
      filteredLogs.forEach((r: any) => {
        r.answers?.forEach((a: any) => {
          allFieldKeys.add(a.field?.label || `Field ${a.field_id}`);
        });
      });

      const headers = ["Submission ID", "Form Title", "User Name", "User Email", "Status", "Date", ...Array.from(allFieldKeys)];
      const rows = filteredLogs.map((r: any) => {
        const rowData = [
          `FB-${r.id}-X`,
          r.form?.title || "Unknown",
          r.user?.name || "Anonymous",
          r.user?.email || "N/A",
          r.status,
          new Date(r.created_at).toLocaleString()
        ];
        
        const answerMap = new Map();
        r.answers?.forEach((a: any) => {
          answerMap.set(a.field?.label || `Field ${a.field_id}`, a.value);
        });

        Array.from(allFieldKeys).forEach(key => {
          let val = answerMap.get(key) || "";
          if (typeof val === 'object') val = JSON.stringify(val);
          rowData.push(`"${String(val).replace(/"/g, '""')}"`);
        });

        return rowData.join(",");
      });

      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Global-Report-${new Date().toLocaleDateString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  const stats = [
    { label: "Total Submissions", value: globalStats?.total_responses || "0", icon: "description", color: "blue", trend: "+12.5%", trendIcon: "trending_up" },
    { label: "Biometric Pass Rate", value: `${globalStats?.biometric_stats?.pass_rate || 0}%`, icon: "face", color: "indigo", trend: "High", trendIcon: "verified" },
    { label: "Completion Rate", value: `${globalStats?.completion_rate || 0}%`, icon: "checklist_rtl", color: "emerald", trend: "+5.2%", trendIcon: "trending_up" },
    { label: "Active Forms", value: globalStats?.active_forms || "0", icon: "list_alt", color: "indigo", trend: "-2%", trendIcon: "trending_down" },
    { label: "Total Forms Created", value: globalStats?.total_forms || "0", icon: "folder", color: "amber", trend: "+18.1%", trendIcon: "trending_up" },
  ];

  const sidebarContent = (
    <div className="h-full flex flex-col">
      <div className="p-6 flex items-center gap-3">
        <div className="size-10 bg-[#1148ad] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <span className="material-symbols-outlined text-white text-2xl">dynamic_form</span>
        </div>
        <div>
          <h1 className="font-black text-lg leading-tight text-[#104aac] tracking-tight">AI FormFlow</h1>
          <p className="text-[10px] uppercase font-black tracking-widest text-[#104aac]/40 mt-0.5">Enterprise</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-6 overflow-y-auto custom-scrollbar">
        <div className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Workspace</div>
        <SidebarLink icon="dashboard" label="Dashboard" active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard", null)} />
        <SidebarLink icon="description" label="My Forms" active={activeTab === "my-forms"} onClick={() => setActiveTab("my-forms", null)} />
        {(selectedFormId || activeTab === "submissions") && (
          <SidebarLink icon="group" label="Submissions" active={activeTab === "submissions"} onClick={() => setActiveTab("submissions")} />
        )}
        <SidebarLink icon="analytics" label="Insights" active={activeTab === "insights"} onClick={() => setActiveTab("insights")} />

        <div className="pt-8 pb-4 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">System</div>
        <SidebarLink icon="settings" label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        <SidebarLink icon="help" label="Support" badge="New" active={activeTab === "support"} onClick={() => setActiveTab("support")} />
      </nav>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-[#0033cc] to-[#1148ad] rounded-2xl p-5 text-white relative overflow-hidden group shadow-xl shadow-blue-500/10">
          <div className="absolute -top-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <p className="text-xs font-black uppercase tracking-widest opacity-70 mb-1">Current Plan</p>
          <h4 className="font-bold text-sm mb-4">Pro Membership</h4>
          <button className="w-full py-2.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 border border-white/10 group/btn">
            Upgrade Now
            <span className="material-symbols-outlined text-sm transition-transform group-hover/btn:translate-x-1">arrow_forward</span>
          </button>
        </div>

        <div className="mt-4 bg-[#0033cc]/5 rounded-2xl p-3 border border-blue-50/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-xl bg-[#1148ad] flex items-center justify-center text-sm font-bold text-white overflow-hidden shadow-inner relative">
              {profile?.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
              ) : null}
              <span className={`${profile?.avatar ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                {profile?.name?.[0] || email?.[0] || "U"}
              </span>
            </div>
            <div className="overflow-hidden min-w-0">
              <p className="text-sm font-black truncate text-[#104aac]">{profile?.name || "User Account"}</p>
              <p className="text-[11px] text-[#104aac]/50 truncate font-bold">{email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 hover:bg-[#1148ad] hover:text-white rounded-xl text-xs font-black transition-all bg-[#0033cc]/10 text-[#0033cc] flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Exit Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#f8fbfe] font-['Inter'] text-slate-900 selection:bg-blue-100 overflow-x-hidden">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex w-72 flex-col shrink-0 bg-white border-r border-slate-100 z-50 sticky top-0 h-screen overflow-hidden">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-72 bg-white z-[70] shadow-2xl lg:hidden"
          >
            {sidebarContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 hover:bg-slate-50 rounded-xl text-slate-500 lg:hidden"
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
            <div className="relative w-full max-w-sm hidden sm:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input
                className="w-full pl-12 pr-4 py-2.5 rounded-[1.25rem] border-transparent bg-slate-50 focus:ring-4 focus:ring-blue-100 focus:bg-white outline-none text-sm font-medium transition-all shadow-inner"
                placeholder="Search resources..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2.5 rounded-full text-slate-400 hover:bg-slate-50 relative transition-colors">
              <span className="material-symbols-outlined text-2xl">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-blue-600 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-1 sm:mx-2"></div>
            <button className="flex items-center gap-2 sm:gap-3 p-1.5 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
              <div className="size-9 rounded-xl bg-[#1148ad] flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-blue-500/20 overflow-hidden relative">
                {profile?.avatar ? (
                  <img 
                    src={profile.avatar} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span className={`${profile?.avatar ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}>
                  {profile?.name?.[0] || "U"}
                </span>
              </div>
              <div className="text-left hidden xs:block">
                <p className="text-[13px] font-black text-slate-900 leading-none">{profile?.name || "User"}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Overview</p>
              </div>
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {activeTab === "dashboard" && (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-[1.1]">Dashboard Overlook</h2>
                  <p className="text-slate-500 mt-2 font-medium max-w-lg">Track real-time data flow and AI performance metrics across all your active forms.</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => queryClient.invalidateQueries({ queryKey: ['global-stats'] })}
                    className="size-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1148ad] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    title="Refresh Data"
                  >
                    <span className="material-symbols-outlined text-xl">refresh</span>
                  </button>
                  <button
                    onClick={handleGlobalExport}
                    className="size-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    title="Export Global Report"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                  </button>
                  <button
                    onClick={handleOpenModal}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1148ad] text-white rounded-2xl text-sm font-black hover:bg-[#0033cc] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {createFormMutation.isPending ? "hourglass_empty" : "add_circle"}
                    </span>
                    {createFormMutation.isPending ? "Creating..." : "New Form"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
                {stats.map((stat, i) => (
                  <StatCard key={i} {...stat} delay={i * 100} />
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h4 className="font-black text-xl text-slate-900 tracking-tight">Submission Trends</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Last 14 days activity</p>
                    </div>
                    <span className="material-symbols-outlined text-emerald-500 animate-pulse">monitoring</span>
                  </div>
                  <div className="flex-1 flex items-end mb-6">
                    <MiniChart data={globalStats?.chart_data || []} />
                  </div>
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                    <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400">
                      <span>Completion Accuracy</span>
                      <span className="text-[#1148ad]">{globalStats?.completion_rate || 0}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${globalStats?.completion_rate || 0}%` }}
                        className="h-full bg-[#1148ad]"
                      />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                  <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                    <div>
                      <h4 className="font-black text-xl text-slate-900 tracking-tight">Recent Submissions</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Across all forms</p>
                    </div>
                    <button onClick={() => setActiveTab("my-forms")} className="text-xs font-black text-[#1148ad] bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-all">My Forms</button>
                  </div>
                  <div className="overflow-x-auto flex-1">
                    <table className="w-full text-left min-w-[600px]">
                      <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                        <tr>
                          <th className="px-8 py-5">Source</th>
                          <th className="px-8 py-5">Form</th>
                          <th className="px-8 py-5">Time</th>
                          <th className="px-8 py-5">Result</th>
                          <th className="px-8 py-5 text-right"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 leading-none">
                        {globalStats?.recent_submissions?.length ? globalStats.recent_submissions.map((res: any) => (
                          <TableRow 
                            key={res.id}
                            initial={res.user?.name?.[0] || "?"} 
                            name={res.user?.name || "Guest"} 
                            form={res.form?.title || "Unknown Form"} 
                            time={new Date(res.created_at).toLocaleDateString()} 
                            color="blue" 
                            pending={res.status !== 'completed'}
                          />
                        )) : (
                          <tr>
                            <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No recent submissions yet.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "my-forms" && (
             <MyFormsView 
              onEdit={(id) => navigate(`/editor/${id}`)} 
              onStats={(id) => setActiveTab("submissions", id)} 
             />
          )}

          {activeTab === "submissions" && (
             <SubmissionsView 
              formId={selectedFormId} 
              onEdit={(id) => navigate(`/editor/${id}`)}
              onBack={() => setActiveTab("my-forms", null)} 
             />
          )}
        </main>

        <footer className="mt-auto px-4 sm:px-10 py-12 bg-white border-t border-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8 text-[13px] font-bold text-slate-400">
            <div className="flex items-center gap-6">
              <p>© 2026 AI FormFlow</p>
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-600/70">All systems online</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <FooterLink label="Security" />
              <FooterLink label="Privacy" />
              <FooterLink label="Terms" />
              <FooterLink label="API Docs" />
            </div>
          </div>
        </footer>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseModal} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl relative z-10 border border-slate-100">
              <div className="p-10">
                <h3 className="font-black text-2xl text-slate-900 mb-8">Create New Form</h3>
                {formError && (
                  <div className="mb-6 px-5 py-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3">
                    <p className="text-sm font-bold text-rose-600">{formError}</p>
                  </div>
                )}
                <form onSubmit={handleNewFormSubmit} className="space-y-6">
                  <input type="text" required value={newFormDetails.title} onChange={(e) => setNewFormDetails({ ...newFormDetails, title: e.target.value })} placeholder="Form Title" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none" />
                  <select value={newFormDetails.form_type_id} onChange={(e) => setNewFormDetails({ ...newFormDetails, form_type_id: parseInt(e.target.value) })} className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none">
                    {formTypes?.map((type: any) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </select>
                  <textarea rows={3} value={newFormDetails.description} onChange={(e) => setNewFormDetails({ ...newFormDetails, description: e.target.value })} placeholder="Description" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold outline-none resize-none" />
                  <div className="flex gap-4">
                    <button type="button" onClick={handleCloseModal} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black rounded-2xl">Cancel</button>
                    <button type="submit" className="flex-[2] py-4 bg-[#1148ad] text-white font-black rounded-2xl shadow-xl">Create Form</button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default Dashboard;
