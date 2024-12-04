import { clsx, type ClassValue } from "clsx";
import { Key, ShieldCheck, Users } from "lucide-react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const initialPermissions = [
  { id: 1, name: "Read", description: "Ability to view resources" },
  { id: 2, name: "Write", description: "Ability to create and edit resources" },
  { id: 3, name: "Delete", description: "Ability to remove resources" },
];

export const menuItems = [
  { id: "users", label: "Users", icon: Users },
  { id: "roles", label: "Roles", icon: ShieldCheck },
  { id: "permissions", label: "Permissions", icon: Key },
];

export const getFilterOptions = (activeTab: string) => {
  switch (activeTab) {
    case "users":
      return ["All", "Admin", "Editor", "Viewer"];
    case "roles":
      return ["All", "With Delete", "Without Delete"];
    case "permissions":
      return ["All", "Read", "Write", "Delete"];
    default:
      return ["All"];
  }
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

export interface Role {
  id: number;
  name: string;
  permissions: string[];
}
