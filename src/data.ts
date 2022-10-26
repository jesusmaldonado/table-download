import { File, Column } from "./types";
export const data: File[] = [
  {
    name: "smss.exe",
    device: "Stark",
    path: "\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe",
    status: "scheduled",
  },

  {
    name: "netsh.exe",
    device: "Targaryen",
    path: "\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe",
    status: "available",
  },

  {
    name: "uxtheme.dll",
    device: "Lannister",
    path: "\\Device\\HarddiskVolume1\\Windows\\System32\\uxtheme.dll",
    status: "available",
  },

  {
    name: "cryptbase.dll",
    device: "Martell",
    path: "\\Device\\HarddiskVolume1\\Windows\\System32\\cryptbase.dll",
    status: "scheduled",
  },

  {
    name: "7za.exe",
    device: "Baratheon",
    path: "\\Device\\HarddiskVolume1\\temp\\7za.exe",
    status: "scheduled",
  },
];

export const columns: Column<File>[] = [
  {
    header: "Name",
    key: "name",
  },
  {
    header: "Device",
    key: "device",
  },
  {
    header: "Path",
    key: "path",
    width: 200,
  },
  {
    header: "Status",
    key: "status",
  },
];
