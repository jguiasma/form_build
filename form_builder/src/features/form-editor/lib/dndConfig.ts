export const ItemTypes = {
  PALETTE_ITEM: 'PALETTE_ITEM',
  FIELD_ITEM: 'FIELD_ITEM',
};

export interface DragItem {
  id?: string | number;         // Existing field ID (if reordering)
  type: string;                 // Field type (text, email, etc.)
  isPaletteItem?: boolean;      // True if dragging from palette
  originalIndex?: number;
  stepId?: string | number;
}
