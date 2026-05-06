import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../lib/dndConfig';
import { useFormEditorStore } from '../store/useFormEditorStore';
import type { FormField } from '../types/form-builder.types';
import { MoreVertical, Settings, Trash2 } from 'lucide-react';

interface FieldItemProps {
  field: FormField;
}

const FieldItem: React.FC<FieldItemProps> = ({ field }) => {
  const { selectedFieldId, setSelectedField, removeField, addField, moveField } = useFormEditorStore();
  const isSelected = selectedFieldId === field.id;

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.FIELD_ITEM,
    item: { type: field.type, id: field.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const renderFieldInput = () => {
    switch (field.type) {
      case 'divider':
        return <hr className="border-t-2 border-slate-100 my-4" />;
      case 'spacer':
        return <div className="h-8 w-full" />;
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className="material-symbols-outlined text-2xl text-amber-400">star</span>
            ))}
          </div>
        );
      case 'location':
        return (
          <div className="w-full h-32 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 grayscale" style={{ backgroundImage: 'radial-gradient(#1148ad 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }}></div>
            <div className="flex flex-col items-center gap-2 z-10">
              <span className="material-symbols-outlined text-[#1148ad]">location_on</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Google Maps Integration</span>
            </div>
          </div>
        );
      case 'text':
      case 'email':
      case 'number':
        return <input type={field.type} placeholder={field.placeholder || ''} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-slate-50/50" readOnly />;
      case 'textarea':
        return <textarea placeholder={field.placeholder || ''} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-slate-50/50 h-24" readOnly />;
      case 'select':
        return (
          <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-slate-50/50 text-slate-400" readOnly>
            {field.validation_rules?.allow_empty && <option></option>}
            {field.options && field.options.length > 0 ? (
              field.options.map(opt => <option key={opt.id} value={opt.value}>{opt.label}</option>)
            ) : (
              <option>No options added...</option>
            )}
          </select>
        );
      case 'checkbox':
      case 'radio':
        return (
          <div className={`space-y-2 ${field.validation_rules?.display_inline ? 'flex flex-wrap gap-4 space-y-0' : ''}`}>
            {field.options && field.options.length > 0 ? (
              field.options.map(opt => (
                <div key={opt.id} className="flex items-center space-x-2">
                  <input type={field.type} name={field.field_key} className="w-4 h-4 rounded border-slate-300 text-[#1148ad]" readOnly />
                  <span className="text-xs text-slate-500 font-medium">{opt.label}</span>
                </div>
              ))
            ) : (
              [1, 2].map(i => (
                <div key={i} className="flex items-center space-x-2 opacity-50">
                  <input type={field.type} name={field.field_key} className="w-4 h-4 rounded border-slate-300" readOnly />
                  <span className="text-xs text-slate-400 italic">Option {i}</span>
                </div>
              ))
            )}
          </div>
        );
      case 'date':
        return (
          <input 
            type="date" 
            className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-slate-50/50 text-slate-500" 
            readOnly 
          />
        );
      case 'grouped':
        return (
          <div className="space-y-3">
            {/* Rue */}
            <input type="text" placeholder="Rue" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50" readOnly />
            {/* Ville + Code postal */}
            <div className="grid grid-cols-2 gap-3">
              <input type="text" placeholder="Ville" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50" readOnly />
              <input type="text" placeholder="Code postal" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm bg-slate-50/50" readOnly />
            </div>
          </div>
        );
      default:
        return <input type="text" placeholder={field.placeholder || ''} className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none bg-slate-50/50" readOnly />;
    }
  };

  const [{ isOver, canDrop, dropPos }, drop] = useDrop({
    accept: [ItemTypes.PALETTE_ITEM, ItemTypes.FIELD_ITEM],
    hover: (item: any, monitor) => {
      if (!ref.current) return;
      
      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;

      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Logic from scenario:
      // Vertical line = Drop adds to SAME ROW
      // Horizontal line = Drop creates NEW ROW
      
      let pos: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      
      // Modifier keys
      const initialEvent = window.event as any; // Fallback to window event for access to shiftKey
      if (initialEvent?.shiftKey) {
         pos = hoverClientX < hoverMiddleX ? 'left' : 'right';
      } else if (initialEvent?.altKey) {
         pos = hoverClientY < hoverMiddleY ? 'top' : 'bottom';
      } else {
        // Default smart detection: wider side zones for easier multi-column drops
        const sideSlice = Math.min(60, hoverBoundingRect.width * 0.25);
        if (hoverClientX < sideSlice) pos = 'left';
        else if (hoverClientX > hoverBoundingRect.width - sideSlice) pos = 'right';
        else if (hoverClientY < hoverMiddleY) pos = 'top';
        else pos = 'bottom';
      }
      
      // Update monitor for re-rendering if needed, but we'll use local state for the line
      setLocalDropPos(pos);
    },
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) return;

      if (!localDropPos) return;

      if (item.isPaletteItem) {
        if (localDropPos === 'left' || localDropPos === 'right') {
           addField(useFormEditorStore.getState().activeStepId!, item.type, 'SAME_ROW', field.id, localDropPos);
        } else {
           addField(useFormEditorStore.getState().activeStepId!, item.type, 'NEW_ROW', field.id, localDropPos);
        }
      } else {
        moveField(item.id, field.id, localDropPos);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    })
  });

  const [localDropPos, setLocalDropPos] = React.useState<'top' | 'bottom' | 'left' | 'right' | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

  return (
    <div 
      ref={ref}
      onClick={() => setSelectedField(field.id!)}
      className={`group relative p-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-[#1148ad] bg-blue-50/50 rounded-2xl' : 'hover:bg-slate-50 rounded-2xl'} ${isDragging ? 'opacity-30 scale-95 shadow-inner' : 'opacity-100'} cursor-pointer`}
    >
      {/* Visual Drop Indicators (The Blue Lines) */}
      {isOver && localDropPos && (
        <>
          {/* Horizontal Line (New Row) */}
          {(localDropPos === 'top' || localDropPos === 'bottom') && (
            <div className={`absolute left-0 right-0 h-[3px] bg-blue-500 z-30 pointer-events-none rounded-full
              ${localDropPos === 'top' ? '-top-1' : '-bottom-1'}
            `}>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 bg-blue-500 rounded-full border border-white" />
            </div>
          )}
          {/* Vertical Line (Same Row) */}
          {(localDropPos === 'left' || localDropPos === 'right') && (
            <div className={`absolute top-0 bottom-0 w-[3px] bg-blue-500 z-30 pointer-events-none rounded-full
              ${localDropPos === 'left' ? '-left-0.5' : '-right-0.5'}
            `}>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 bg-blue-500 rounded-full border border-white" />
            </div>
          )}
        </>
      )}

      {field.type !== 'divider' && field.type !== 'spacer' && (
        <>
          <label className="block text-sm font-bold text-slate-800 mb-1 pointer-events-none">
            {field.is_required && <span className="text-rose-500 mr-1">*</span>}
            {field.label}
          </label>

          {field.description && (
            <p className="text-[10px] text-slate-400 font-medium mb-2 pointer-events-none">{field.description}</p>
          )}
        </>
      )}
      
      <div className="pointer-events-none">
        {field.type === 'submit' ? (
          <div className="flex justify-center">
            <button className={`w-full py-3 px-6 rounded-2xl text-sm font-black shadow-lg transition-all ${
              (field.validation_rules?.button_style || 'primary') === 'primary' 
                ? 'bg-[#1148ad] text-white shadow-blue-500/20' 
                : (field.validation_rules?.button_style === 'secondary' 
                  ? 'bg-slate-700 text-white shadow-slate-500/20'
                  : 'bg-white text-[#1148ad] border-2 border-[#1148ad]')
            }`}>
              {field.label || 'Submit'}
            </button>
          </div>
        ) : (
          renderFieldInput()
        )}
      </div>

      <div className={`absolute top-2 right-2 flex space-x-1 ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'} transition-all`}>
        <button 
          onClick={(e) => { e.stopPropagation(); setSelectedField(field.id!); }}
          className="p-1.5 text-slate-400 hover:text-[#1148ad] bg-white rounded-md shadow-sm border border-slate-100 active:scale-90 transition-transform"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); removeField(field.id!); }}
          className="p-1.5 text-slate-400 hover:text-rose-500 bg-white rounded-md shadow-sm border border-slate-100 active:scale-90 transition-transform"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        <div className="p-1.5 cursor-move text-slate-400 bg-white rounded-md shadow-sm border border-slate-100 active:scale-90 transition-transform">
           <MoreVertical className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default FieldItem;

