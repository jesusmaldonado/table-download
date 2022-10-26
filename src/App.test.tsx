import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { data, columns } from "./data";
import { constructAlertmessage } from "./helpers";

describe("table for files", () => {
  it("renders all fields headers", () => {
    render(<App />);
    const columnDisplayValues = columns.map((col) => col.header);
    const columnElements = screen.getAllByTestId("column");
    for (let i = 0; i < columnElements.length; i++) {
      const columnElement = columnElements[i];
      const columnDisplayValue = columnDisplayValues[i];
      expect(columnElement).toBeInTheDocument();
      expect(columnElement.textContent).toMatch(columnDisplayValue);
    }
  });

  it("renders a default header width if not given", () => {
    render(<App />);
    const columnWidths = columns.map((col) => col.width);
    const columnElements = screen.getAllByTestId("column");
    for (let i = 0; i < columnElements.length; i++) {
      const columnElement = columnElements[i];
      const columnWidth = columnWidths[i];
      const expectation = columnWidth ? `${columnWidth}px` : "100px";
      expect(columnElement.style.minWidth).toMatch(expectation);
    }
  });

  it("renders all values for all keys without custom renderers", () => {
    render(<App />);
    const fields = columns
      .map((col) => col.key)
      .filter((col) => !col.match("status"));
    //check that every row contains all fields
    for (let i = 0; i < data.length; i++) {
      const dataEl = data[i];
      const row = screen.getByTestId(`tableRow-${i}`);
      expect(row).toBeInTheDocument();
      for (let j = 0; j < fields.length; j++) {
        const cell = screen.getByTestId(`row-${i}-${fields[j]}`);
        const expectedCellValue = dataEl[fields[j]];
        expect(cell).toHaveTextContent(expectedCellValue);
      }
    }
  });

  it("renders the custom field correctly", () => {
    render(<App />);
    const fileStatuses = data.map((file) => file.status);
    const statusfields = screen.getAllByTestId("custom-renderer");
    for (let i = 0; i < statusfields.length; i++) {
      const statusField = statusfields[i];
      const fileStatus = fileStatuses[i];

      //we expect the same general content
      expect(statusField.textContent?.toLowerCase()).toMatch(
        fileStatus.toLowerCase()
      );

      //we expect it to look different
      expect(statusField).not.toContainHTML(
        `<td data-testid='custom-renderer'>${fileStatus}</td>`
      );
      //we expect it to contain something different
      const uniqueExpectation = fileStatus === "available" ? "🟢" : "Scheduled";
      expect(statusField.innerHTML).toContain(uniqueExpectation);
    }
  });
  describe("when selecting", () => {
    it("only updates active elements", () => {
      render(<App />);
      const countEl = screen.getByTestId("numberSelected");
      expect(countEl.textContent).toMatch("None Selected");
      let count = 0;
      const selectAll = screen.getByTestId(
        "selectAllCheckbox"
      ) as HTMLInputElement;
      for (let i = 0; i < data.length; i++) {
        const dataEl = data[i];
        const row = screen.getByTestId(`tableRow-${i}`);
        const inputCheckbox = screen.getByTestId(
          `checkbox-${i}`
        ) as HTMLInputElement;
        expect(row).toBeInTheDocument();
        expect(inputCheckbox.checked).toBe(false);
        const disabledExpectation = dataEl.status === "available" ? null : "";
        const disabledAttr = inputCheckbox.getAttribute("disabled");
        expect(disabledAttr).toEqual(disabledExpectation);
        fireEvent.click(row);
        if (dataEl.status === "available") {
          count++;
        }
        let countExpectation =
          count === 0 ? "None Selected" : `${count} Selected`;
        expect(inputCheckbox.checked).toBe(dataEl.status === "available");
        expect(countEl.textContent).toMatch(countExpectation);
        expect(selectAll.indeterminate).toBe(count !== 0 && count < 2);
      }
      expect(selectAll.checked).toBe(true);
      expect(selectAll.indeterminate).toBe(false);
    });
    it("toggles on and off when individually selection", () => {
      render(<App />);
      const countEl = screen.getByTestId("numberSelected");
      expect(countEl.textContent).toMatch("None Selected");
      const row1 = screen.getByTestId(`tableRow-1`);
      fireEvent.click(row1);
      expect(countEl.textContent).toMatch("1 Selected");
      fireEvent.click(row1);
      expect(countEl.textContent).toMatch("None Selected");
    });
    it("selects all selectable files if i press select all button", () => {
      render(<App />);
      const countEl = screen.getByTestId("numberSelected");
      expect(countEl.textContent).toMatch("None Selected");
      const checkboxes = data.map((data, i) =>
        screen.getByTestId(`checkbox-${i}`)
      ) as HTMLInputElement[];
      const expectations = data.map((d) => d.status === "available");
      expect(checkboxes[0].hasAttribute("checked")).toBe(false);
      const selectAll = screen.getByTestId(
        "selectAllCheckbox"
      ) as HTMLInputElement;
      fireEvent.click(selectAll);
      for (let i = 0; i < expectations.length; i++) {
        expect(checkboxes[i].checked).toBe(expectations[i]);
      }
      expect(countEl.textContent).toMatch("2 Selected");
      expect(selectAll.checked).toBe(true);
    });
    it("selects all selectable files if some are already partially selected", () => {
      render(<App />);
      const countEl = screen.getByTestId("numberSelected");
      expect(countEl.textContent).toMatch("None Selected");
      const row1 = screen.getByTestId(`tableRow-1`);
      fireEvent.click(row1);
      expect(countEl.textContent).toMatch("1 Selected");
      const selectAll = screen.getByTestId(
        "selectAllCheckbox"
      ) as HTMLInputElement;
      fireEvent.click(selectAll);
      expect(countEl.textContent).toMatch("2 Selected");
      expect(selectAll.checked).toBe(true);
      const expectations = data.map((d) => d.status === "available");
      const checkboxes = data.map((data, i) =>
        screen.getByTestId(`checkbox-${i}`)
      ) as HTMLInputElement[];
      for (let i = 0; i < expectations.length; i++) {
        expect(checkboxes[i].checked).toBe(expectations[i]);
      }
    });
    it("removes all from selection when i press selectall", () => {
      render(<App />);
      const checkboxes = data.map((data, i) =>
        screen.getByTestId(`checkbox-${i}`)
      ) as HTMLInputElement[];
      const countEl = screen.getByTestId("numberSelected");
      expect(countEl.textContent).toMatch("None Selected");
      const row1 = screen.getByTestId(`tableRow-1`);
      const row2 = screen.getByTestId(`tableRow-2`);
      fireEvent.click(row1);
      fireEvent.click(row2);
      expect(countEl.textContent).toMatch("2 Selected");
      const selectAll = screen.getByTestId(
        "selectAllCheckbox"
      ) as HTMLInputElement;
      fireEvent.click(selectAll);
      for (let i = 0; i < checkboxes.length; i++) {
        expect(checkboxes[i].checked).toBe(false);
      }
    });
  });
  describe("when downloading", () => {
    beforeEach(() => {
      jest.spyOn(window, "alert").mockImplementation((arg) => {
        console.log(arg);
      });
    });
    it("disables the download button when no items are selected", () => {
      render(<App />);
      const downloadButton = screen.getByTestId(
        "downloadButton"
      ) as HTMLButtonElement;
      expect(downloadButton.disabled).toBe(true);
      expect(window.alert).not.toBeCalled();
    });
    it("enables the download button when 1+ item is selected", () => {
      render(<App />);
      const downloadButton = screen.getByTestId(
        "downloadButton"
      ) as HTMLButtonElement;
      const row1 = screen.getByTestId(`tableRow-1`);
      fireEvent.click(row1);
      expect(downloadButton.disabled).toBe(false);
      fireEvent.click(downloadButton);
      const processedData = data.map((d, i) => {
        return {
          ...d,
          selectable: d.status === "available",
          selected: i === 1,
        };
      });
      const message = constructAlertmessage(processedData);
      expect(window.alert).toBeCalledWith(message);
    });
    it("disables again the download button when item is deselected", () => {
      render(<App />);
      const downloadButton = screen.getByTestId(
        "downloadButton"
      ) as HTMLButtonElement;
      expect(downloadButton.disabled).toBe(true);
      const row1 = screen.getByTestId(`tableRow-1`);
      fireEvent.click(row1);
      expect(downloadButton.disabled).toBe(false);
      fireEvent.click(row1);
      expect(downloadButton.disabled).toBe(true);
    });
    it("renders the correct results when the select all button is used", () => {
      render(<App />);
      const downloadButton = screen.getByTestId(
        "downloadButton"
      ) as HTMLButtonElement;
      expect(downloadButton.disabled).toBe(true);
      const selectAll = screen.getByTestId(
        "selectAllCheckbox"
      ) as HTMLInputElement;
      fireEvent.click(selectAll);
      const processedData = data.map((d, i) => {
        return {
          ...d,
          selectable: d.status === "available",
          selected: i === 1 || i === 2,
        };
      });
      fireEvent.click(downloadButton);
      const message = constructAlertmessage(processedData);
      expect(window.alert).toBeCalledWith(message);
    });
  });
});
