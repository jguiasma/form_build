import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/api/api';
import { 
  Terminal, 
  Search, 
  ShieldCheck, 
  AlertCircle, 
  Clock, 
  User, 
  Database,
  Cpu,
  Monitor
} from 'lucide-react';
import { motion } from 'framer-motion';

export const TelescopeLogsView: React.FC = () => {
    const { data: logs, isLoading } = useQuery({
        queryKey: ['telescopeLogs'],
        queryFn: async () => {
            const { data } = await api.get('/admin/telescope/logs');
            return data.data;
        }
    });

    const getBiometricLogs = () => {
        if (!logs) return [];
        return logs.filter((log: any) => 
            log.content?.message === 'face_recognition_attempt' || 
            (log.content?.context && JSON.stringify(log.content.context).includes('face'))
        );
    };

    const biometricLogs = getBiometricLogs();

    if (isLoading) return (
        <div className="flex items-center justify-center h-64">
            <Terminal className="w-8 h-8 text-blue-500 animate-pulse" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <Database className="w-6 h-6 text-blue-600" />
                        System Logs (Telescope)
                    </h2>
                    <p className="text-sm text-slate-500 font-medium">Real-time biometric auditing and system events.</p>
                </div>
                <div className="flex gap-2">
                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold border border-emerald-200">
                        Live Tracking Active
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Events</p>
                    <p className="text-2xl font-black text-slate-900">{logs?.length || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Biometric Hits</p>
                    <p className="text-2xl font-black text-blue-600">{biometricLogs.length}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Security Status</p>
                    <p className="text-2xl font-black text-emerald-500">Nominal</p>
                </div>
            </div>

            <div className="bg-slate-900 rounded-[2rem] border border-slate-800 shadow-2xl overflow-hidden">
                <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Biometric recognition stream</span>
                    </div>
                    <div className="flex gap-1">
                        <div className="size-2 rounded-full bg-rose-500" />
                        <div className="size-2 rounded-full bg-amber-500" />
                        <div className="size-2 rounded-full bg-emerald-500" />
                    </div>
                </div>

                <div className="max-h-[600px] overflow-y-auto p-4 space-y-3 font-mono">
                    {biometricLogs.length === 0 ? (
                        <p className="text-slate-500 text-xs text-center py-12 italic">No biometric logs found in this batch.</p>
                    ) : (
                        biometricLogs.map((log: any) => {
                            const ctx = log.content?.context || {};
                            const isSuccess = ctx.result === 'success';
                            
                            return (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={log.uuid} 
                                    className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/50 flex flex-col gap-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${isSuccess ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                                                {isSuccess ? 'PASS' : 'FAIL'}
                                            </div>
                                            <span className="text-blue-400 text-xs font-bold">{ctx.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                                            <Clock className="w-3 h-3" />
                                            {new Date(log.created_at).toLocaleTimeString()}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-black">
                                                <ShieldCheck className="w-3 h-3" /> Similarity Score
                                            </div>
                                            <div className="text-sm font-bold text-white">
                                                {(ctx.similarity * 100).toFixed(2)}%
                                                <span className="text-[10px] text-slate-500 ml-2">(Threshold: 80%)</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <div className="flex items-center justify-end gap-2 text-slate-500 text-[10px] uppercase font-black">
                                                <Monitor className="w-3 h-3" /> Identity ID
                                            </div>
                                            <div className="text-sm font-bold text-blue-300">
                                                #{ctx.user_id || 'GUEST'}
                                            </div>
                                        </div>
                                    </div>

                                    {!isSuccess && ctx.reason && (
                                        <div className="mt-1 p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-[10px] flex items-start gap-2">
                                            <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
                                            <span>Security Reject: {ctx.reason}</span>
                                        </div>
                                    )}

                                    <div className="text-[9px] text-slate-600 flex gap-4 mt-1 border-t border-slate-700/30 pt-2">
                                        <span>IP: {ctx.ip}</span>
                                        <span className="truncate max-w-[300px]">UA: {ctx.user_agent}</span>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

