import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../lib/dndConfig';
import { useFormEditorStore } from '../store/useFormEditorStore';
import FieldItem from './FieldItem';
import { Plus } from 'lucide-react';
import type { FormField } from '../types/form-builder.types';

const FormCanvas: React.FC = () => {
  const { schema, activeStepId, addField } = useFormEditorStore();

  const step = schema.steps.find((s) => s.id === activeStepId);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [ItemTypes.PALETTE_ITEM, ItemTypes.FIELD_ITEM],
    drop: (item: any, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        const dropResult = monitor.getDropResult() as any;
        if (dropResult && dropResult.dropMode === 'SAME_ROW') {
           if (item.isPaletteItem) {
             addField(activeStepId!, item.type, 'SAME_ROW', dropResult.targetFieldId);
           }
        }
        return; // Important: Stop here if dropped on a child
      }
      
      // Otherwise, vertical drop on the canvas background (new row)
      if (item.isPaletteItem && activeStepId) {
        addField(activeStepId, item.type, 'NEW_ROW');
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  if (!step) {
    return (
      <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-10 min-h-[600px] flex flex-col items-center justify-center text-slate-400">
        No step selected. Add a step to begin generating form fields.
      </div>
    );
  }

  // Pre-process fields into rows based on field_order
  const rowMap = new Map<number, FormField[]>();
  step.fields.forEach((field) => {
    if (!rowMap.has(field.field_order)) rowMap.set(field.field_order, []);
    rowMap.get(field.field_order)!.push(field);
  });
  
  const rows = Array.from(rowMap.entries()).sort((a, b) => a[0] - b[0]);
  
  // Sort fields within each row by column_index
  rows.forEach(([_, rowFields]) => {
    rowFields.sort((a, b) => (a.column_index || 0) - (b.column_index || 0));
  });

  return (
    <div className="bg-white border border-slate-200 rounded-[2rem] shadow-sm p-10 min-h-[600px] flex flex-col">
      <div ref={drop} className="space-y-6 flex-1 min-h-[200px]">
        {rows.length === 0 && !isOver && (
          <div className="border-2 border-dashed border-[#1148ad]/30 bg-[#1148ad]/5 rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors hover:bg-[#1148ad]/10">
            <div className="size-10 rounded-full bg-white flex items-center justify-center text-[#1148ad] shadow-sm mb-3">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-[#1148ad]">Drop here to add component</span>
          </div>
        )}

        {rows.map(([order, rowFields]) => (
          <div key={order} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${Math.max(1, rowFields.length)}, minmax(0, 1fr))` }}>
            {rowFields.map((field) => (
              <FieldItem key={field.id} field={field} />
            ))}
          </div>
        ))}
        
        {isOver && canDrop && (
           <div className="border-2 border-dashed border-blue-400 bg-blue-50/50 rounded-2xl p-6 flex justify-center text-blue-600 font-bold mt-4">
             Drop here...
           </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-100 group">
        <button className="px-6 py-4 text-sm font-black uppercase tracking-widest bg-[#1148ad] hover:bg-[#0033cc] text-white rounded-[1.25rem] transition-all shadow-lg shadow-blue-500/20 w-full flex items-center justify-center gap-2">
          Submit Form
        </button>
      </div>
    </div>
  );
};

export default FormCanvas;

