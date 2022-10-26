export type File = {
  name: string;
  device: string;
  path: string;
  status: "available" | "scheduled";
};

export type Column<T> = {
  header: string;
  width?: number;
  key: StringKeys<T>;
};

export type StringKeys<T> = Extract<keyof T, string>;

interface CustomRenderer<T> {
  [field: string]: (item: T) => string;
}
export interface TableProps<T extends TableItem> {
  columns: Array<Column<T>>;
  data: Array<T>;
  onSelect: (item: T) => void;
  onSelectAll: (allSelected: boolean) => void;
  onDownload: () => void;
  customRenderers: CustomRenderer<T>;
}

export type PrimitiveType = string | number | boolean;
export type FileKeys = Extract<keyof File, string>;
export interface TableItem {
  selectable: boolean;
  selected: boolean;
}

export interface TableRowProps<T extends TableItem> {
  columns: Array<Column<T>>;
  row: T;
  itemKey: number;
  onSelect: (item: T) => void;
  customRenderers: CustomRenderer<T>;
}

export type FileTableItem = File & TableItem;
