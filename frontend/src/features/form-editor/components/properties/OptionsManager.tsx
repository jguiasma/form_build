import React, { useState, useEffect } from 'react';
import { useFieldOptions, type FieldOption } from '../../hooks/useFieldOptions';
import { useFormEditorStore } from '../../store/useFormEditorStore';
import { 
  Settings, 
  Trash2, 
  Plus, 
  Loader2, 
  GripVertical
} from 'lucide-react';
import _ from 'lodash';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OptionsManagerProps {
  fieldId: string | number;
}

const SortableOption = ({ option, onUpdate, onDelete }: { option: FieldOption, onUpdate: (id: number, updates: any) => void, onDelete: (id: number) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: option.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="flex items-center gap-2 group/item">
      <div {...attributes} {...listeners} className="p-1 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500">
        <GripVertical className="w-4 h-4" />
      </div>
      <input 
        type="text"
        defaultValue={option.label}
        onBlur={(e) => {
          if (e.target.value !== option.label) {
             onUpdate(option.id, { label: e.target.value });
          }
        }}
        className="flex-[2] px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold focus:bg-white focus:border-[#1148ad]/30 transition-all shadow-inner"
        placeholder="Label"
      />
      <input 
        type="text"
        defaultValue={option.value}
        onBlur={(e) => {
          if (e.target.value !== option.value) {
             onUpdate(option.id, { value: e.target.value });
          }
        }}
        className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-mono text-slate-400 focus:bg-white transition-all"
        placeholder="Value"
      />
      <button 
        onClick={() => onDelete(option.id)}
        className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover/item:opacity-100"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};

const OptionsManager: React.FC<OptionsManagerProps> = ({ fieldId }) => {
  const { options, addOption, updateOption, deleteOption, reorderBulk, isMutating } = useFieldOptions(fieldId);
  const { updateField } = useFormEditorStore();
  const [newLabel, setNewLabel] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // OPTIMISTIC SYNC WITH CANVAS
  // Whenever options from the hook change, we push them to the store's field object
  // so the canvas reflects them instantly.
  useEffect(() => {
    if (options && options.length >= 0) {
        updateField(fieldId, { options });
    }
  }, [options, fieldId, updateField]);

  const isTemp = !fieldId || String(fieldId).startsWith('temp_');

  const handleAdd = async () => {
    if (!newLabel.trim()) return;
    const value = _.snakeCase(newLabel);
    await addOption({ label: newLabel, value, option_order: options.length + 1 });
    setNewLabel('');
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
       const oldIndex = options.findIndex(o => o.id === active.id);
       const newIndex = options.findIndex(o => o.id === over.id);
       const newOptions = arrayMove(options, oldIndex, newIndex);
       
       // Update store locally for instant feedback
       updateField(fieldId, { options: newOptions });
       
       // Sync to backend
       await reorderBulk(newOptions.map(o => o.id));
    }
  };

  const handleDelete = (id: number) => {
     if (confirm('Delete option?')) {
        // Optimistic store update
        const newOptions = options.filter(o => o.id !== id);
        updateField(fieldId, { options: newOptions });
        
        // Backend sync
        deleteOption(id);
     }
  };

  if (isTemp) {
    return (
      <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl space-y-3">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-[#1148ad] rounded-lg text-white shadow-lg shadow-blue-500/20">
             <Loader2 className="w-4 h-4 animate-spin" />
           </div>
           <span className="text-xs font-black text-[#1148ad] uppercase tracking-tight">Syncing Field...</span>
        </div>
        <p className="text-[10px] font-bold text-blue-600/80 leading-relaxed">
          Establishing secure connection to the database. Choices management will be available in a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Choices Management</label>
         <div className="flex items-center gap-2">
           {isMutating && <Loader2 className="w-3 h-3 animate-spin text-[#1148ad]" />}
           <span className="text-[10px] font-bold text-slate-300">{options.length} Options</span>
         </div>
      </div>

      <div className="space-y-2">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={options.map(o => o.id)}
            strategy={verticalListSortingStrategy}
          >
            {options.map((option) => (
              <SortableOption 
                key={option.id} 
                option={option} 
                onUpdate={(id, updates) => {
                    // Update store locally for instant feedback
                    const newOptions = options.map(o => o.id === id ? { ...o, ...updates } : o);
                    updateField(fieldId, { options: newOptions });
                    // API sync
                    updateOption({ id, ...updates });
                }} 
                onDelete={handleDelete} 
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
        <input 
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="New Choice Label..."
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
        />
        <button 
          onClick={handleAdd}
          disabled={isMutating || !newLabel.trim()}
          className="p-2 bg-[#1148ad] text-white rounded-lg shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      {options.length < 2 && (
        <p className="text-[9px] font-bold text-amber-500 italic mt-2 text-center">
          * Drag handle to reorder choices
        </p>
      )}
    </div>
  );
};

export default OptionsManager;

