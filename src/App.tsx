import { useState, useMemo } from "react";
import "./App.css";
import { Table } from "./Table/Table";
import { data, columns } from "./data";
import { FileTableItem } from "./types";
import { constructAlertmessage, processTableData } from "./helpers";

function App() {
  const [tableData, setTableData] = useState(processTableData(data));
  const onSelect = (selectedItem: FileTableItem) => {
    const newItems = tableData.map((tableItem) => {
      if (tableItem.name === selectedItem.name && tableItem.selectable) {
        return {
          ...tableItem,
          selected: !tableItem.selected,
        };
      }
      return {
        ...tableItem,
      };
    });
    setTableData(newItems);
  };
  const onSelectAll = (allSelected: boolean) => {
    let newItems: FileTableItem[];
    if (allSelected) {
      newItems = tableData.map((tableItem) => {
        return { ...tableItem, selected: false };
      });
    } else {
      newItems = tableData.map((tableItem) => {
        return {
          ...tableItem,
          selected: tableItem.selectable,
        };
      });
    }
    setTableData(newItems);
  };
  const alertMessage = useMemo(() => {
    return constructAlertmessage(tableData);
  }, [tableData]);
  const onDownload = () => {
    alert(`${alertMessage}`);
  };
  return (
    <div className="App">
      <Table
        data={tableData}
        columns={columns}
        customRenderers={{
          status: (item: FileTableItem) => {
            if (item.status === "available") {
              return `🟢 Available`;
            }
            return `Scheduled`;
          },
        }}
        onSelect={onSelect}
        onDownload={onDownload}
        onSelectAll={onSelectAll}
      />
    </div>
  );
}

export default App;
