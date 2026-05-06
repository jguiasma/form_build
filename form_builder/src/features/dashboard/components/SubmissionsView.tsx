import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useGetForm, useGetFormResponses } from "../../form-editor/hooks/useFormApi";
import { QRCodeCanvas } from "qrcode.react";
import { ResponseDetailsView } from "./ResponseDetailsView";
import { AnimatePresence, motion } from "framer-motion";

export const SubmissionsView = ({ formId, onEdit, onBack }: { formId: number | null; onEdit: (id: any) => void; onBack: () => void }) => {
  const queryClient = useQueryClient();
  const { data: form, isLoading: isLoadingForm } = useGetForm(formId || 0);
  const { data: responses, isLoading: isLoadingResponses, refetch: refetchResponses } = useGetFormResponses(formId || 0);
  const [selectedResponseId, setSelectedResponseId] = useState<number | null>(null);
  const [viewingResponseId, setViewingResponseId] = useState<number | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);

  const [logSearch, setLogSearch] = useState("");
  const [logStatusFilter, setLogStatusFilter] = useState("");
  const [logSortBy, setLogSortBy] = useState("latest");
  const [logPage, setLogPage] = useState(1);
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false });

  const triggerToast = (message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  useEffect(() => {
    setLogPage(1);
  }, [logSearch, logStatusFilter, logSortBy, selectedVersion]);

  const selectedResponse = responses?.find((r: any) => r.id === selectedResponseId) || responses?.[0];
  const publicUrl = `${import.meta.env.VITE_FRONTEND_URL || window.location.origin}/f/${form?.uuid}`;

  const handleRefresh = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ['form', formId] }),
      refetchResponses()
    ]);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        triggerToast("Copied to clipboard!");
      }).catch(() => {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  };

  const fallbackCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      triggerToast("Copied to clipboard!");
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const downloadQR = () => {
    const canvas = document.getElementById("modal-qr") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = url;
      link.download = `${form?.title || 'form'}-qr.png`;
      link.click();
    }
  };

  const sortedVersions = [...(form?.versions || [])].sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const defaultVersion = sortedVersions.length > 0 ? sortedVersions[sortedVersions.length - 1] : { id: 'default', version: '1.0.0', created_at: new Date(0).toISOString() };
  
  useEffect(() => {
    if (sortedVersions.length > 0 && !selectedVersion) {
      setSelectedVersion(sortedVersions[sortedVersions.length - 1]);
    }
  }, [form?.versions]);

  if (viewingResponseId) {
    const response = responses?.find((r: any) => r.id === viewingResponseId);
    return <ResponseDetailsView response={response} onBack={() => setViewingResponseId(null)} />;
  }

  if (isLoadingForm || isLoadingResponses) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="size-12 border-4 border-blue-100 border-t-[#1148ad] rounded-full animate-spin"></div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Aggregating Statistics...</p>
      </div>
    );
  }

  const currentVersion = selectedVersion || defaultVersion;

  const getResponsesForVersion = (version: any) => {
    if (!responses) return [];
    const vIndex = sortedVersions.findIndex((v: any) => v.id === version.id);
    const startTime = new Date(version.created_at).getTime();
    const endTime = vIndex < sortedVersions.length - 1 ? new Date(sortedVersions[vIndex + 1].created_at).getTime() : Infinity;

    return responses.filter((r: any) => {
      const submissionTime = new Date(r.created_at).getTime();
      return submissionTime >= startTime && submissionTime < endTime;
    });
  };

  const versionResponses = getResponsesForVersion(currentVersion);

  const totalSubmissions = responses?.length || 0;
  const completedResponses = responses?.filter((r: any) => r.status === 'completed') || [];
  const successRate = totalSubmissions > 0 ? ((completedResponses.length / totalSubmissions) * 100).toFixed(1) : "0";
  const latestVersion = form?.versions?.[form.versions.length - 1]?.version || "1.0.0";

  let avgTime = "N/A";
  const validTimeResponses = completedResponses.filter((r: any) => r.started_at && r.submitted_at);
  if (validTimeResponses.length > 0) {
    const totalMs = validTimeResponses.reduce((acc: number, r: any) => {
      return acc + (new Date(r.submitted_at).getTime() - new Date(r.started_at).getTime());
    }, 0);
    const avgMs = totalMs / validTimeResponses.length;
    avgTime = avgMs < 1000 ? `${Math.round(avgMs)}ms` : `${(avgMs / 1000).toFixed(1)}s`;
  }

  const globalStats = [
    { label: "Total Submissions", value: totalSubmissions, trend: null, icon: "analytics", color: "blue" },
    { label: "Success Rate", value: `${successRate}%`, trend: null, icon: "check_circle", color: "emerald" },
    { label: "Active Version", value: latestVersion, sub: form?.status === 'published' ? "Production" : "Draft", icon: "history", color: "amber" },
    { label: "Avg Completion", value: avgTime, trend: null, icon: "bolt", color: "blue" },
  ];

  const vTotalSubmissions = versionResponses.length;
  const vCompletedResponses = versionResponses.filter((r: any) => r.status === 'completed');
  const vSuccessRate = vTotalSubmissions > 0 ? ((vCompletedResponses.length / vTotalSubmissions) * 100).toFixed(1) : "0";

  let vAvgTime = "N/A";
  const vValidTimeResponses = vCompletedResponses.filter((r: any) => r.started_at && r.submitted_at);
  if (vValidTimeResponses.length > 0) {
    const totalMs = vValidTimeResponses.reduce((acc: number, r: any) => {
      return acc + (new Date(r.submitted_at).getTime() - new Date(r.started_at).getTime());
    }, 0);
    const avgMs = totalMs / vValidTimeResponses.length;
    vAvgTime = avgMs < 1000 ? `${Math.round(avgMs)}ms` : `${(avgMs / 1000).toFixed(1)}s`;
  }

  const versionStats = [
    { label: `v${currentVersion.version} Submissions`, value: vTotalSubmissions, icon: "analytics", color: "indigo" },
    { label: `v${currentVersion.version} Success Rate`, value: `${vSuccessRate}%`, icon: "check_circle", color: "emerald" },
    { label: `v${currentVersion.version} Avg Time`, value: vAvgTime, icon: "bolt", color: "indigo" },
  ];

  let filteredLogs = versionResponses.filter((r: any) => {
    const searchStr = logSearch.toLowerCase();
    const fullId = `#fb-${r.id}-x`;
    const searchMatch = r.id.toString().includes(searchStr) || 
                        fullId.includes(searchStr) ||
                        (r.user?.name || "").toLowerCase().includes(searchStr) || 
                        (r.user?.email || "").toLowerCase().includes(searchStr);
    
    let statusMatch = true;
    if (logStatusFilter === 'completed') {
      statusMatch = r.status === 'completed';
    } else if (logStatusFilter === 'pending') {
      statusMatch = r.status !== 'completed';
    }
    
    return searchMatch && statusMatch;
  });

  filteredLogs.sort((a: any, b: any) => {
    const timeA = new Date(a.created_at || a.submitted_at).getTime();
    const timeB = new Date(b.created_at || b.submitted_at).getTime();
    return logSortBy === "latest" ? timeB - timeA : timeA - timeB;
  });

  const logsPerPage = 10;
  const totalLogPages = Math.ceil(filteredLogs.length / logsPerPage) || 1;
  const paginatedLogs = filteredLogs.slice((logPage - 1) * logsPerPage, logPage * logsPerPage);

  const downloadCSV = () => {
    if (!filteredLogs || filteredLogs.length === 0) {
      alert("No responses to export.");
      return;
    }
    
    const allFieldKeys = new Set<string>();
    filteredLogs.forEach((r: any) => {
      r.answers?.forEach((a: any) => {
        allFieldKeys.add(a.field?.label || `Field ${a.field_id}`);
      });
    });

    const headers = ["Submission ID", "User Name", "User Email", "Status", "Date", ...Array.from(allFieldKeys)];
    
    const rows = filteredLogs.map((r: any) => {
      const rowData = [
        `FB-${r.id}-X`,
        r.user?.name || "Anonymous",
        r.user?.email || "N/A",
        r.status,
        new Date(r.created_at || r.submitted_at).toLocaleString()
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
    link.setAttribute("download", `${form?.title || 'form'}-v${currentVersion.version}-responses.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="size-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-slate-400">arrow_back</span>
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">{form?.title}</h2>
              <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border ${
                form?.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>
                {form?.status === 'published' ? 'Active Production' : 'Development Mode'}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium mt-1">Form Analytics and Response Monitoring</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => onEdit(form?.id)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1148ad] text-white rounded-xl text-sm font-black hover:bg-[#0033cc] transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_box</span>
            Add New Version
          </button>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">refresh</span>
            Sync Data
          </button>
        </div>
      </div>

      {form?.status === 'published' ? (
        <div className="bg-[#f8faff] p-8 rounded-[2.5rem] border border-blue-50 relative overflow-hidden group">
           <AnimatePresence>
            {toast.visible && (
              <motion.div 
                initial={{ opacity: 0, y: -20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                className="fixed top-10 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10"
              >
                <div className="size-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
                <span className="text-sm font-black tracking-tight">{toast.message}</span>
              </motion.div>
            )}
           </AnimatePresence>
           <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-all">
              <span className="material-symbols-outlined text-[10rem] rotate-12">share</span>
           </div>
           <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
              <div className="size-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-blue-50 shrink-0 p-3">
                 {form?.uuid && <QRCodeCanvas value={publicUrl} size={56} />}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h4 className="text-xl font-black text-slate-900">Your form is live!</h4>
                <p className="text-slate-500 font-medium text-sm mt-1">Share this link to start collecting responses and generating insights.</p>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="flex-1 lg:w-96 bg-white border border-slate-200 rounded-2xl p-2.5 flex items-center justify-between gap-4 shadow-inner">
                  <span className="text-xs font-bold text-slate-400 truncate pl-3">{publicUrl}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => copyToClipboard(publicUrl)}
                      className="p-2 text-slate-400 hover:text-[#1148ad] transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">content_copy</span>
                    </button>
                    <a 
                      href={publicUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-[#1148ad] transition-all"
                    >
                      <span className="material-symbols-outlined text-xl">open_in_new</span>
                    </a>
                  </div>
                </div>
                <button 
                  onClick={() => setShowQR(true)}
                  className="px-6 py-4 border border-slate-200 rounded-2xl text-sm font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">qr_code</span>
                  Show QR
                </button>
              </div>
           </div>
        </div>
      ) : (
        <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
           <div className="size-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 ring-1 ring-amber-100 mb-2">
              <span className="material-symbols-outlined text-2xl">visibility_off</span>
           </div>
           <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Share Link Disabled</h4>
           <p className="text-slate-400 text-xs font-bold max-w-sm">
             This form is currently in <span className="text-amber-600">Draft</span> mode. Publish the form to generate a public share link and QR code.
           </p>
        </div>
      )}

      {/* Global Stats Grid */}
      <div>
        <div className="mb-4">
          <h3 className="text-lg font-black text-slate-900 tracking-tight">Global Form Statistics</h3>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">All-time data across all versions</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {globalStats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 bg-${stat.color}-50 rounded-xl text-${stat.color}-600`}>
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                {stat.sub && <span className="text-[10px] font-bold text-slate-400">{stat.sub}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version Stats Grid */}
      <div className="pt-4">
        <div className="mb-4 flex items-center gap-3">
          <h3 className="text-lg font-black text-[#1148ad] tracking-tight">Version v{currentVersion.version} Statistics</h3>
          <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#1148ad] text-[9px] font-black uppercase tracking-widest">Selected View</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {versionStats.map((stat, i) => (
            <div key={`v-${i}`} className="bg-gradient-to-br from-[#f8fbfe] to-white p-6 rounded-[2rem] border border-blue-50 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 bg-${stat.color}-50 rounded-xl text-${stat.color}-600`}>
                  <span className="material-symbols-outlined text-xl">{stat.icon}</span>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
              </div>
              <h3 className="text-2xl font-black text-[#1148ad] tracking-tight">{stat.value}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        {/* Main Table Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/10 flex-wrap gap-4">
              <h4 className="font-black text-xl text-slate-900 tracking-tight">Submissions Log</h4>
              <div className="flex gap-3 items-center flex-wrap">
                 <div className="relative">
                   <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                   <input 
                     type="text"
                     placeholder="Search ID or Name..."
                     value={logSearch}
                     onChange={(e) => setLogSearch(e.target.value)}
                     className="pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-100 shadow-sm"
                   />
                 </div>
                 <select 
                   value={logStatusFilter} 
                   onChange={(e) => setLogStatusFilter(e.target.value)}
                   className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer"
                 >
                   <option value="">All Statuses</option>
                   <option value="completed">Success</option>
                   <option value="pending">Pending</option>
                 </select>
                 <select 
                   value={logSortBy} 
                   onChange={(e) => setLogSortBy(e.target.value)}
                   className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 focus:outline-none shadow-sm cursor-pointer"
                 >
                   <option value="latest">Latest First</option>
                   <option value="oldest">Oldest First</option>
                 </select>
                 
                 <div className="relative group/export inline-block">
                   <button className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 transition-all shadow-sm flex items-center">
                     <span className="material-symbols-outlined text-base">more_vert</span>
                   </button>
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 shadow-xl rounded-xl py-2 z-[100] hidden group-hover/export:block ring-1 ring-black/5">
                     <button onClick={downloadCSV} className="w-full px-4 py-2 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-emerald-600 flex items-center gap-3 transition-colors">
                       <span className="material-symbols-outlined text-base">table_view</span> Export CSV
                     </button>
                     <button onClick={() => window.print()} className="w-full px-4 py-2 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-3 transition-colors">
                       <span className="material-symbols-outlined text-base">picture_as_pdf</span> Print to PDF
                     </button>
                   </div>
                 </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-5">Submission ID</th>
                    <th className="px-8 py-5">Submitter</th>
                    <th className="px-8 py-5">Date/Time</th>
                    <th className="px-8 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedLogs.map((res: any) => (
                    <tr 
                      key={res.id} 
                      onClick={() => setSelectedResponseId(res.id)}
                      className={`group hover:bg-blue-50/30 transition-all cursor-pointer ${selectedResponseId === res.id ? 'bg-blue-50/50' : ''}`}
                    >
                      <td className="px-8 py-5" onClick={(e) => { e.stopPropagation(); setViewingResponseId(res.id); }}>
                        <span className="text-sm font-black text-[#1148ad] tracking-tight hover:underline">#FB-{res.id}-X</span>
                      </td>
                      <td className="px-8 py-5" onClick={(e) => { e.stopPropagation(); setViewingResponseId(res.id); }}>
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                             {res.user?.name?.[0] || "?"}
                          </div>
                          <span className="text-sm font-bold text-slate-600 truncate max-w-[150px] group-hover:text-[#1148ad]">
                            {res.user?.name || res.user?.email || "anonymous_user"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
                          {new Date(res.submitted_at || res.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className={`w-fit px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            res.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {res.status === 'completed' ? 'SUCCESS' : 'PENDING'}
                          </span>
                          {res.biometric_verified && (
                            <span className="flex items-center gap-1 text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-1.5 py-0.5 rounded w-fit border border-blue-100">
                               <span className="material-symbols-outlined text-[10px]">verified</span>
                               Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="relative group/menu inline-block">
                          <button 
                            onClick={(e) => { e.stopPropagation(); }}
                            className="p-2 text-slate-300 hover:text-[#1148ad] transition-all focus:outline-none"
                          >
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-slate-100 shadow-2xl rounded-2xl py-3 z-[100] invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 transition-all transform scale-95 group-hover/menu:scale-100 origin-top-right ring-1 ring-black/5">
                             <button 
                                onClick={(e) => { 
                                  e.stopPropagation(); 
                                  setViewingResponseId(res.id); 
                                }}
                                className="w-full px-5 py-3 text-left text-xs font-black text-slate-600 hover:bg-slate-50 hover:text-[#1148ad] flex items-center gap-4 transition-colors"
                             >
                                <span className="material-symbols-outlined text-xl opacity-50">visibility</span>
                                See response details
                             </button>
                             <div className="mx-3 my-2 h-px bg-slate-50"></div>
                             <button className="w-full px-5 py-3 text-left text-xs font-black text-slate-400 hover:bg-rose-50 hover:text-rose-600 flex items-center gap-4 transition-colors">
                                <span className="material-symbols-outlined text-xl opacity-50">delete</span>
                                Delete Response
                             </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedLogs.length === 0 && (
                     <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No submissions match your filters.</td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalLogPages > 1 && (
              <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Page {logPage} of {totalLogPages}
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setLogPage(p => Math.max(1, p - 1))}
                    disabled={logPage === 1}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
                  </button>
                  <button 
                    onClick={() => setLogPage(p => Math.min(totalLogPages, p + 1))}
                    disabled={logPage === totalLogPages}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
                  >
                    Next <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Active Endpoint Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-[#1148ad] text-lg">terminal</span>
              <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Active Endpoint</h5>
            </div>
            <div className="bg-slate-900 rounded-2xl p-4 relative group">
              <button 
                onClick={() => copyToClipboard(`http://${window.location.hostname}:8000/api/forms/${form?.id}/submit`)}
                className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
              <code className="text-[10px] text-blue-400 font-mono break-all leading-relaxed">
                POST http://{window.location.hostname}:8000/api/forms/{form?.id}/submit
              </code>
            </div>
          </div>

          {/* Response Body Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm h-[500px] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500 text-lg">code</span>
                <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Response Body</h5>
              </div>
              <span className="text-[9px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
                #FB-{selectedResponse?.id || '?'}-X
              </span>
            </div>
            <div className="bg-slate-50/50 rounded-2xl p-6 flex-1 overflow-auto custom-scrollbar border border-slate-100 font-mono text-[11px]">
              <pre className="text-slate-600 leading-loose">
                {selectedResponse ? JSON.stringify({
                  submission_id: `#FB-${selectedResponse.id}-X`,
                  status: selectedResponse.status,
                  submitted_at: selectedResponse.submitted_at,
                  payload: selectedResponse.answers?.reduce((acc: any, curr: any) => ({
                    ...acc,
                    [curr.field?.field_key || `field_${curr.field_id}`]: curr.value
                  }), {}),
                  metadata: {
                    user: selectedResponse.user?.name || "Guest",
                    email: selectedResponse.user?.email || "N/A"
                  }
                }, null, 2) : "// Select a submission to view details"}
              </pre>
            </div>
          </div>

          {/* Version Timeline Card */}
          <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
            <h5 className="text-[11px] font-black text-slate-900 uppercase tracking-widest mb-6">Version Timeline</h5>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
               {form?.versions?.length ? form.versions.map((v: any, idx: number) => {
                  const isSelected = currentVersion?.id === v.id;
                  const isLatest = idx === form.versions.length - 1;
                  return (
                  <div 
                    key={v.id} 
                    className="flex gap-4 relative cursor-pointer group"
                    onClick={() => setSelectedVersion(v)}
                  >
                    <div className={`size-6 rounded-full border-4 shadow-sm shrink-0 z-10 transition-all ${isSelected ? 'bg-blue-600 border-white ring-4 ring-blue-50' : 'bg-slate-200 border-white group-hover:bg-blue-400'}`}></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`text-xs font-black transition-colors ${isSelected ? 'text-[#1148ad]' : 'text-slate-900'}`}>v{v.version} {isLatest ? '(Stable)' : ''}</p>
                        {isLatest && <span className="text-[9px] font-bold text-slate-400">Current</span>}
                        {isSelected && !isLatest && <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded">Viewing</span>}
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Released {new Date(v.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
               )}) : (
                <div className="flex gap-4 relative cursor-pointer group" onClick={() => setSelectedVersion(defaultVersion)}>
                  <div className="size-6 rounded-full bg-blue-600 border-4 border-white ring-4 ring-blue-50 shadow-sm shrink-0 z-10"></div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-black text-[#1148ad]">v1.0.0 (Stable)</p>
                      <span className="text-[9px] font-bold text-slate-400">Current</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">Initial production release</p>
                  </div>
                </div>
               )}
            </div>
          </div>
        </div>
      </div>

      {/* QR Modal - Viewport Level */}
      {showQR && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
           <div 
            onClick={() => setShowQR(false)}
            className="absolute inset-0 cursor-pointer"
           />
           <div className="bg-white w-full max-w-md rounded-[3.5rem] p-12 shadow-2xl relative animate-in zoom-in-95 duration-500 ring-1 ring-white/20">
              <button 
                onClick={() => setShowQR(false)}
                className="absolute right-8 top-8 p-2 text-slate-400 hover:text-slate-900 transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Form QR Code</h3>
                <p className="text-slate-400 text-sm font-bold mt-1">Scan to open the public form</p>
              </div>

              <div className="bg-slate-50 rounded-[2.5rem] p-12 flex items-center justify-center border border-slate-100 mb-8">
                 {form?.uuid && <QRCodeCanvas value={publicUrl} size={200} id="modal-qr" />}
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => {
                    downloadQR();
                    triggerToast("QR Code download started!");
                  }}
                  className="w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black hover:bg-[#0033cc] transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20"
                >
                  <span className="material-symbols-outlined text-xl">download</span>
                  Download as Image
                </button>
                <button 
                  onClick={() => setShowQR(false)}
                  className="w-full py-4 border border-slate-100 text-slate-400 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all"
                >
                  Close Preview
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

