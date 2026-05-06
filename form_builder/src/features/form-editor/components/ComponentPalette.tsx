import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from '../lib/dndConfig';
import { 
  Type, Mail, AlignLeft, CheckSquare, Phone, Menu, 
  Calendar, CheckCircle, MapPin, Link as LinkIcon, Star, Minus,
  CreditCard, Mic, UploadCloud, PenTool, Octagon
} from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import api from '../../../shared/api/api';

// Mapping field types to icons - extensible
export const iconMap: Record<string, React.ElementType> = {
  text: Type,
  email: Mail,
  textarea: AlignLeft,
  checkbox: CheckSquare,
  phone: Phone,
  spacer: Menu,
  date: Calendar,
  radio: CheckCircle,
  location: MapPin,
  url: LinkIcon,
  rating: Star,
  divider: Minus,
  payment: CreditCard,
  voice: Mic,
  file: UploadCloud,
  signature: PenTool,
  grouped: MapPin,
};


interface PaletteItemProps {
  type: string;
  label: string;
  icon?: string;
  isPro?: boolean;
}

const PaletteItem: React.FC<PaletteItemProps> = ({ type, label, icon, isPro }) => {
  const Icon = icon && iconMap[icon] ? iconMap[icon] : (iconMap[type] || Type);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PALETTE_ITEM,
    item: { type, isPaletteItem: true },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`flex flex-col items-center justify-center p-4 border border-slate-200 rounded-xl hover:border-[#1148ad] hover:bg-blue-50/30 transition-all group relative bg-white cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <Icon className="text-slate-400 group-hover:text-[#1148ad] transition-colors w-5 h-5 mb-2" />
      <span className="text-[10px] font-bold text-slate-700 text-center">{label}</span>
      {isPro && (
        <span className="absolute top-1.5 right-1.5 text-[8px] font-black text-[#1148ad] bg-blue-50 px-1 py-0.5 rounded leading-none">PRO</span>
      )}
    </div>
  );
};

const ComponentPalette: React.FC = () => {
  const { data: palette, isLoading } = useQuery({
    queryKey: ['palette'], //If another component asks for the same queryKey, it can reuse the cached data instead of fetching again.
    queryFn: async () => { //function that actually fetches the data.
      const res = await api.get('/admin/palette');
      return res.data;
    }
  });

  const groupedPalette = (palette || []).reduce((acc: any, field: any) => {
    const cat = field.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(field);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <aside className="w-[300px] bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-5 pb-2 sticky top-0 bg-white z-10 border-b border-slate-100">
        <h3 className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Component Palette</h3>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 opacity-50">
             <div className="size-8 rounded-full border-2 border-[#1148ad] border-t-transparent animate-spin"></div>
             <span className="text-[10px] font-bold text-slate-400">Loading Palette...</span>
          </div>
        ) : (palette || []).length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
            <div className="size-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 shadow-sm mb-4">
              <Octagon className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-900 mb-1">Empty Palette</h4>
            <p className="text-[10px] font-bold text-slate-400 leading-relaxed px-4">
               No components have been registered. Only the Super Admin can add components to the registry.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedPalette).map(([category, fields]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-bold text-slate-700 font-display">{category}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {(fields as any[]).map(field => (
                    <PaletteItem 
                      key={field.id} 
                      type={field.type} 
                      label={field.label} 
                      icon={field.icon}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default ComponentPalette;

