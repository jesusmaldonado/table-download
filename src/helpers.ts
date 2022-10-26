import { FileTableItem, File, PrimitiveType } from "./types";

export function constructAlertmessage(tableData: FileTableItem[]): string {
  const filePartOfMessage = tableData
    .filter((i) => i.selected)
    .map(
      (selectedItem) =>
        `Device: ${selectedItem.device}\nPath: ${selectedItem.path}`
    )
    .join("\n");
  const alertMessage = `Downloading:\n\n${filePartOfMessage}`;
  return alertMessage;
}

export function processTableData(data: File[]): FileTableItem[] {
  return data.map((item) => ({
    ...item,
    selectable: item.status === "available",
    selected: false,
  }));
}

export function isPrimitive(value: any): value is PrimitiveType {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}
