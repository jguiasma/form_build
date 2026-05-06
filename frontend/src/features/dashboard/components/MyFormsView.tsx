import { useState, useEffect } from "react";
import { useGetForms, useGetFieldTypes, useDeleteForm, useArchiveForm } from "../../form-editor/hooks/useFormApi";
import { motion, AnimatePresence } from "framer-motion";

export const MyFormsView = ({ onEdit, onStats }: { onEdit: (id: any) => void; onStats: (id: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [formToDelete, setFormToDelete] = useState<any>(null);

  const { data: formsData, isLoading } = useGetForms({ 
    search: searchTerm, 
    status: statusFilter, 
    form_type_id: typeFilter, 
    page 
  });
  const { data: formTypes } = useGetFieldTypes();
  const deleteMutation = useDeleteForm();
  const archiveMutation = useArchiveForm();

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, typeFilter]);

  const forms = formsData?.data || [];
  const total = formsData?.total || 0;
  const currentPage = formsData?.current_page || 1;
  const lastPage = formsData?.last_page || 1;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">My Created Forms</h2>
          <div className="flex items-center gap-2 mt-2 px-4 py-1.5 bg-slate-100 rounded-full w-fit">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{total} Total Forms</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-48">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
              type="text"
              placeholder="Search by ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-[#1148ad] transition-all shadow-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all shadow-sm appearance-none cursor-pointer"
          >
            <option value="">All Types</option>
            {formTypes?.map((type: any) => (
              <option key={type.id} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 text-center">
            <div className="size-12 border-4 border-blue-100 border-t-[#1148ad] rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Indexing Resources...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-slate-50/50 text-slate-400 uppercase text-[9px] font-black tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-6">ID</th>
                  <th className="px-8 py-6">Form Title</th>
                  <th className="px-8 py-6">Form Type</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {forms?.map((form: any) => (
                  <tr key={form.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 text-sm font-black text-slate-400">form-{form.id}</td>                    <td className="px-8 py-5">
                      <span className="text-sm font-black text-slate-800 block">{form.title}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Modified {new Date(form.updated_at).toLocaleDateString()}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-bold text-slate-600 px-3 py-1 bg-slate-100 rounded-lg">{form.type?.name || 'Standard'}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        form.status === 'published' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        form.status === 'archived' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        <div className={`size-1.5 rounded-full ${
                          form.status === 'published' ? 'bg-emerald-500' :
                          form.status === 'archived' ? 'bg-slate-400' :
                          'bg-amber-500'
                        }`} />
                        {form.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onStats(form.id)}
                          className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Statistics"
                        >
                          <span className="material-symbols-outlined text-xl">analytics</span>
                        </button>
                        <button 
                          onClick={() => onEdit(form.id)}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                          title="Edit Form"
                        >
                          <span className="material-symbols-outlined text-xl">edit_note</span>
                        </button>
                        <button 
                          onClick={() => archiveMutation.mutate(form.id)}
                          disabled={form.status !== 'published' || archiveMutation.isPending}
                          className={`p-2.5 rounded-xl transition-all ${
                            form.status === 'published' 
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50' 
                              : 'text-slate-200 cursor-not-allowed'
                          }`}
                          title={form.status === 'published' ? 'Archive' : 'Only published forms can be archived'}
                        >
                          <span className="material-symbols-outlined text-xl">archive</span>
                        </button>
                        <button 
                          onClick={() => setFormToDelete(form)}
                          disabled={form.status === 'published' || deleteMutation.isPending}
                          className={`p-2.5 rounded-xl transition-all ${
                            form.status === 'published'
                              ? 'text-slate-200 cursor-not-allowed'
                              : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                          }`}
                          title={form.status === 'published' ? 'Published forms cannot be deleted. Archive first.' : 'Delete'}
                        >
                          <span className="material-symbols-outlined text-xl">delete_forever</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {(!forms || forms.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center text-slate-400 font-bold italic">No forms found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!isLoading && total > 0 && (
          <div className="px-8 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {lastPage}
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span> Prev
              </button>
              <button 
                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                disabled={currentPage === lastPage}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center gap-1"
              >
                Next <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {formToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFormToDelete(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="p-10 text-center">
                <div className="size-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6 ring-8 ring-rose-50/50">
                  <span className="material-symbols-outlined text-4xl">warning</span>
                </div>
                <h3 className="font-black text-2xl text-slate-900 leading-tight mb-2">Delete Form?</h3>
                <p className="text-sm font-medium text-slate-500 mb-8">
                  Are you sure you want to permanently delete <strong className="text-slate-900">{formToDelete.title}</strong>? This action cannot be undone and all associated data will be lost.
                </p>
                
                <div className="flex gap-4">
                  <button
                    onClick={() => setFormToDelete(null)}
                    className="flex-1 py-4 bg-slate-50 text-slate-600 font-black rounded-2xl text-sm hover:bg-slate-100 transition-all active:scale-95 border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteMutation.mutate(formToDelete.id, {
                        onSuccess: () => setFormToDelete(null)
                      });
                    }}
                    disabled={deleteMutation.isPending}
                    className="flex-1 py-4 bg-rose-500 text-white font-black rounded-2xl text-sm hover:bg-rose-600 transition-all active:scale-95 shadow-lg shadow-rose-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {deleteMutation.isPending ? (
                      <>
                        <span className="material-symbols-outlined text-lg animate-spin">sync</span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-lg">delete_forever</span>
                        Yes, Delete
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


