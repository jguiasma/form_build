import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../auth/store/authStore";
import { profileApi } from "../../profile/api/profile.api";
import { useGetGlobalStats } from "../../form-editor/hooks/useFormApi";
import { FooterLink, MiniChart, StatCard, TableRow } from "../components/DashboardUI";
import { DashboardHeader } from "../components/DashboardHeader";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { MyFormsView } from "../components/MyFormsView";
import { SubmissionsView } from "../components/SubmissionsView";
import { useDashboardTabs } from "../hooks/useDashboardTabs";
import { useGlobalExport } from "../hooks/useGlobalExport";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeTab, selectedFormId, setActiveTab } = useDashboardTabs();
  const { exportGlobalReport } = useGlobalExport();
  const { email, clearAlerts, setView } = useAuthStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profileProgress"],
    queryFn: profileApi.getProgress,
  });

  const { data: globalStats } = useGetGlobalStats();

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    clearAlerts();
    setView("login");
    navigate("/auth");
  };

  const stats = [
    { label: "Total Submissions", value: globalStats?.total_responses || "0", icon: "description", color: "blue", trend: "+12.5%", trendIcon: "trending_up" },
    { label: "Completion Rate", value: `${globalStats?.completion_rate || 0}%`, icon: "checklist_rtl", color: "emerald", trend: "+5.2%", trendIcon: "trending_up" },
    { label: "Active Forms", value: globalStats?.active_forms || "0", icon: "list_alt", color: "indigo", trend: "-2%", trendIcon: "trending_down" },
    { label: "Total Forms Created", value: globalStats?.total_forms || "0", icon: "folder", color: "amber", trend: "+18.1%", trendIcon: "trending_up" },
  ];

  const sidebar = (
    <DashboardSidebar
      activeTab={activeTab}
      selectedFormId={selectedFormId}
      email={email}
      profile={profile}
      onTabChange={setActiveTab}
      onLogout={handleLogout}
    />
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
        {sidebar}
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
            {sidebar}
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen relative">
        <DashboardHeader profile={profile} onOpenSidebar={() => setIsSidebarOpen(true)} />

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
                    onClick={() => queryClient.invalidateQueries({ queryKey: ["global-stats"] })}
                    className="size-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-[#1148ad] hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    title="Refresh Data"
                  >
                    <span className="material-symbols-outlined text-xl">refresh</span>
                  </button>
                  <button
                    onClick={exportGlobalReport}
                    className="size-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-emerald-600 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
                    title="Export Global Report"
                  >
                    <span className="material-symbols-outlined text-xl">download</span>
                  </button>
                  <button
                    onClick={() => navigate("/categories")}
                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-[#1148ad] text-white rounded-2xl text-sm font-black hover:bg-[#0033cc] transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-lg">
                      add_circle
                    </span>
                    New Form
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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
                            pending={res.status !== "completed"}
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
              <p>� 2026 FormFlow</p>
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
