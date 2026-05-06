import React from 'react';
import { X, Copy, Check, ExternalLink, QrCode, Share2, Smartphone } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  publishData: {
    uuid: string;
    share_link: string;
    version: number;
  } | null;
}

const PublishModal: React.FC<PublishModalProps> = ({ isOpen, onClose, publishData }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (publishData?.share_link) {
      navigator.clipboard.writeText(publishData.share_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !publishData) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl shadow-blue-500/10 overflow-hidden border border-slate-100"
        >
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="size-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                  <Share2 className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Form Published!</h2>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Version {publishData.version} is now live</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {(publishData.share_link.includes('localhost') || publishData.share_link.includes('127.0.0.1')) && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
                <div className="text-amber-500 mt-0.5">⚠️</div>
                <p className="text-xs font-bold text-amber-700 leading-relaxed">
                  <strong>Dev Warning:</strong> You are accessing this dashboard via <code className="bg-amber-100 px-1 rounded">localhost</code>. This means the QR code below also points to localhost, which will fail when scanned by a phone. To generate a scannable QR code, please access your dashboard using your local network IP (e.g., <code className="bg-amber-100 px-1 rounded">http://192.168.x.x:5173</code>) instead.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Shareable Link</label>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div className="flex-1 px-3 py-2 text-sm font-bold text-slate-600 truncate">
                      {publishData.share_link}
                    </div>
                    <button 
                      onClick={handleCopy}
                      className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-emerald-500 text-white' : 'bg-white text-[#1148ad] hover:bg-blue-50 border border-slate-100 shadow-sm'}`}
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                    <a 
                      href={publishData.share_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-4 bg-[#1148ad] text-white rounded-2xl text-sm font-black shadow-lg shadow-blue-500/20 hover:bg-[#0033cc] hover:-translate-y-0.5 transition-all"
                    >
                        View Live Form <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
                        <Smartphone className="w-5 h-5 text-[#1148ad]" />
                        <p className="text-[11px] font-bold text-slate-600 leading-tight">
                            Your form is automatically optimized for mobile, tablet, and desktop devices.
                        </p>
                    </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[2rem] text-center">
                <div className="bg-white p-4 rounded-3xl shadow-xl shadow-slate-200/50 mb-4 border border-slate-50">
                    <QRCodeSVG 
                        value={publishData.share_link} 
                        size={140}
                        level="H"
                        includeMargin={false}
                        imageSettings={{
                            src: "/logo.png",
                            x: undefined,
                            y: undefined,
                            height: 24,
                            width: 24,
                            excavate: true,
                        }}
                    />
                </div>
                <div className="flex items-center gap-2 text-[#1148ad] mb-1">
                    <QrCode className="w-4 h-4" />
                    <span className="text-xs font-black uppercase tracking-widest">QR Code</span>
                </div>
                <p className="text-[10px] font-bold text-slate-400">Scan to open on your phone</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">FormFlow Enterprise Security</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PublishModal;
