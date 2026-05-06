export const ResponseDetailsView = ({ response, onBack }: { response: any; onBack: () => void }) => {
  if (!response) return null;

  const formattedDate = new Date(response.submitted_at || response.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const formattedTime = new Date(response.submitted_at || response.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Header with Breadcrumbs */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
        <div className="animate-in slide-in-from-left duration-700">
          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">
             <button onClick={onBack} className="hover:text-[#1148ad] transition-all flex items-center gap-1.5 group">
               <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
               Submissions
             </button>
             <span className="material-symbols-outlined text-[10px] opacity-30">chevron_right</span>
             <span className="text-[#1148ad] bg-blue-50 px-2 py-0.5 rounded font-black">#SUB-{response.id}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Submission Details: <span className="text-[#1148ad]">{response.user?.name || "Guest User"}</span>
            </h2>
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5 ${
              response.status === 'completed' 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100'
            }`}>
               {response.status === 'completed' ? 'REVIEWED & VERIFIED' : 'PENDING REVIEW'}
            </span>
            {response.user && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-[#1148ad] rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100">
                <span className="material-symbols-outlined text-xs">person</span>
                Registered User
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 text-slate-400 text-sm font-bold mt-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100/50">
                <span className="material-symbols-outlined text-sm text-[#1148ad]">calendar_today</span>
                <span>{formattedDate}</span>
             </div>
             <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-100/50">
                <span className="material-symbols-outlined text-sm text-[#1148ad]">schedule</span>
                <span>{formattedTime}</span>
             </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 animate-in slide-in-from-right duration-700">
           <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95">
             <span className="material-symbols-outlined text-xl text-slate-400">download</span>
             Download PDF
           </button>
           <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black text-slate-900 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm active:scale-95">
             <span className="material-symbols-outlined text-xl text-slate-400">archive</span>
             Archive
           </button>
           <button className="px-8 py-4 bg-[#1148ad] text-white rounded-2xl text-xs font-black hover:bg-[#0033cc] transition-all flex items-center gap-2 shadow-xl shadow-blue-500/25 active:scale-95">
             <span className="material-symbols-outlined text-xl">verified</span>
             Approve Response
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Accurate Form Data Card */}
          <div className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
            <div className="flex items-center justify-between mb-12">
               <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 ring-1 ring-indigo-100">
                     <span className="material-symbols-outlined text-2xl">dynamic_form</span>
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Accurate Form Submission Data</h3>
               </div>
               <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[9px] font-black uppercase tracking-widest border border-slate-100">
                 {response.answers?.length || 0} Fields Captured
               </span>
            </div>
            
            <div className="grid grid-cols-1 gap-8">
               {response.answers?.map((ans: any) => (
                  <div key={ans.id} className="space-y-3 group/ans">
                    <div className="flex items-center gap-2">
                       <span className="size-2 rounded-full bg-indigo-100 group-hover/ans:bg-indigo-500 transition-all"></span>
                       <p className="text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 group-hover/ans:text-indigo-600 transition-all">
                        {ans.field?.label || `Field ${ans.field_id}`}
                       </p>
                    </div>
                    <div className="text-sm font-bold text-slate-800 bg-slate-50/50 p-6 rounded-3xl border border-slate-100 group-hover/ans:border-indigo-100 group-hover/ans:bg-white transition-all shadow-sm group-hover/ans:shadow-md">
                      {typeof ans.value === 'object' ? (
                        <pre className="text-xs font-mono text-indigo-600 leading-relaxed whitespace-pre-wrap">
                          {JSON.stringify(ans.value, null, 2)}
                        </pre>
                      ) : (ans.value || "—")}
                    </div>
                  </div>
               ))}
               {(!response.answers || response.answers.length === 0) && (
                 <div className="py-20 text-center bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-100">
                    <span className="material-symbols-outlined text-4xl text-slate-200 mb-4 block">receipt_long</span>
                    <p className="text-slate-400 font-bold italic text-sm">No recorded answers found.</p>
                 </div>
               )}
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
           {/* Metadata Card */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-10 text-slate-900">
                 <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1148ad]">
                    <span className="material-symbols-outlined text-lg">info</span>
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">System Metadata</h4>
              </div>
              <div className="space-y-8">
                 <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-4">
                    <span className="text-slate-400">Submission ID</span>
                    <span className="text-slate-900 font-black">#SUB-{response.id}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-4">
                    <span className="text-slate-400">Date/Time</span>
                    <span className="text-slate-900">{formattedDate} {formattedTime}</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold border-b border-slate-50 pb-4">
                    <span className="text-slate-400">Device</span>
                    <span className="text-slate-900">iPad Pro (VA-M02)</span>
                 </div>
                 <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-400">OS Version</span>
                    <span className="text-slate-900">iPadOS 17.1</span>
                 </div>
              </div>
           </div>

           {/* History Card */}
           <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-10 text-slate-900">
                 <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center text-[#1148ad]">
                    <span className="material-symbols-outlined text-lg">history</span>
                 </div>
                 <h4 className="text-sm font-black uppercase tracking-widest">Submission History</h4>
              </div>
              <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-100">
                 <div className="flex gap-5 relative">
                    <div className="size-6 rounded-full bg-emerald-500 border-4 border-white shadow-sm shrink-0 z-10 ring-4 ring-emerald-50"></div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900">Review Completed</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">by Admin • Just now</p>
                    </div>
                 </div>
                 <div className="flex gap-5 relative opacity-50">
                    <div className="size-6 rounded-full bg-slate-300 border-4 border-white shadow-sm shrink-0 z-10 ring-4 ring-slate-50"></div>
                    <div>
                      <p className="text-[13px] font-black text-slate-900">Form Submitted</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">by {response.user?.name || "Guest User"}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* CTA Card */}
           <div className="bg-gradient-to-br from-[#1148ad] to-[#0033cc] p-10 rounded-[3rem] shadow-2xl shadow-blue-500/30 text-center space-y-6 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 size-40 bg-white/5 rounded-full blur-3xl"></div>
              <h4 className="text-white text-xl font-black leading-tight relative z-10">Need to verify something?</h4>
              <p className="text-blue-100/60 text-xs font-medium relative z-10">Request additional verification from the user if information seems incomplete.</p>
              <button className="w-full py-5 bg-white text-[#1148ad] rounded-2xl text-xs font-black hover:bg-blue-50 transition-all active:scale-95 shadow-lg relative z-10">
                 Request Clarification
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

