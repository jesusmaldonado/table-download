import { useMemo, useCallback, useRef, useEffect } from "react";
import { TableProps, TableItem } from "../types";
import { TableRow } from "./TableRow";
import "./Table.css";
export const Table = <T extends TableItem>({
  data,
  columns,
  onSelect,
  onSelectAll,
  onDownload,
  customRenderers,
}: TableProps<T>) => {
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);
  const isIndetereminate = useMemo(() => {
    const selectable = data.filter((i) => i.selectable);
    const selected = data.filter((i) => i.selected);
    return (
      selectable.length !== 0 &&
      selected.length !== 0 &&
      selectable.length !== selected.length
    );
  }, [data]);
  const allSelected = useMemo(() => {
    const selectable = data.filter((i) => i.selectable);
    const selected = data.filter((i) => i.selected);
    return selectable.length !== 0 && selectable.length === selected.length;
  }, [data]);
  const numberSelected = useMemo(() => {
    return data.filter((i) => i.selected).length;
  }, [data]);
  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      selectAllCheckboxRef.current.indeterminate = isIndetereminate;
    }
  }, [isIndetereminate, selectAllCheckboxRef]);

  const handleSelectAll = useCallback(() => {
    onSelectAll(allSelected);
  }, [allSelected, onSelectAll]);

  return (
    <table>
      <caption>A Table of Files</caption>
      <thead>
        <tr>
          <td>
            <input
              type="checkbox"
              data-testid="selectAllCheckbox"
              onChange={handleSelectAll}
              ref={selectAllCheckboxRef}
              checked={allSelected}
            ></input>
          </td>
          <td data-testid="numberSelected" className="table-selected-statement">
            {numberSelected === 0
              ? "None Selected"
              : `${numberSelected} Selected`}
          </td>
          <td>
            <button
              onClick={onDownload}
              disabled={numberSelected === 0}
              type="button"
              className={`${
                numberSelected !== 0 ? "table-download-active" : ""
              }`}
              data-testid="downloadButton"
            >
              Download Selected
            </button>
          </td>
        </tr>
        <tr>
          <th className="table-header-spacer"></th>
          {columns.map((col) => (
            <th
              key={`${col.key}`}
              scope="col"
              data-testid="column"
              className="tables-header"
              style={{
                minWidth: col.width ? col.width : 100,
              }}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, itemKey) => (
          <TableRow
            key={itemKey}
            row={row}
            columns={columns}
            onSelect={onSelect}
            itemKey={itemKey}
            customRenderers={customRenderers}
          />
        ))}
      </tbody>
    </table>
  );
};
