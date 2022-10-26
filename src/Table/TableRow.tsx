import { useCallback } from "react";
import { TableItem, TableRowProps } from "../types";
import { isPrimitive } from "../helpers";

export const TableRow = <T extends TableItem>({
  row,
  columns,
  onSelect,
  itemKey,
  customRenderers,
}: TableRowProps<T>) => {
  const handleClick = useCallback(() => {
    onSelect(row);
  }, [row, onSelect]);
  return (
    <tr
      key={`${itemKey}`}
      data-testid={`tableRow-${itemKey}`}
      className={`table-row 
          ${row.selectable ? "table-row--selectable" : ""} 
          ${row.selected ? "table-row--selected" : ""}
          `}
      onClick={handleClick}
    >
      <td>
        <input
          type="checkbox"
          name="interest"
          data-testid={`checkbox-${itemKey}`}
          disabled={!row.selectable}
          checked={row.selected}
          onChange={handleClick}
        />
      </td>
      {columns.map((column, key) => {
        if (customRenderers[column.key]) {
          return (
            <td
              data-testid="custom-renderer"
              key="status"
              className="table-row-cell"
            >
              {customRenderers[column.key](row)}
            </td>
          );
        }
        const rowVal = row[column.key];
        const toDisplay = isPrimitive(rowVal) ? rowVal : "";
        return key === 0 ? (
          <th
            data-testid={`row-${itemKey}-${column.key}`}
            key={`${column.key}`}
            scope="row"
            className="table-row-cell"
          >
            {toDisplay}
          </th>
        ) : (
          <td
            data-testid={`row-${itemKey}-${column.key}`}
            key={`${column.key}`}
            className="table-row-cell"
          >
            {toDisplay}
          </td>
        );
      })}
    </tr>
  );
};
