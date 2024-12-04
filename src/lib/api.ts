import { Role, User } from "./utils";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let users: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Editor",
    status: "Active",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Viewer",
    status: "Inactive",
  },
];

let roles: Role[] = [
  { id: 1, name: "Admin", permissions: ["Read", "Write", "Delete"] },
  { id: 2, name: "Editor", permissions: ["Read", "Write"] },
  { id: 3, name: "Viewer", permissions: ["Read"] },
];

export const api = {
  users: {
    getAll: async (): Promise<User[]> => {
      await delay(300);
      return [...users];
    },
    getById: async (id: number): Promise<User | undefined> => {
      await delay(200);
      return users.find((user) => user.id === id);
    },
    create: async (user: Omit<User, "id">): Promise<User> => {
      await delay(400);
      const newUser = { ...user, id: users.length + 1 };
      users.push(newUser);
      return newUser;
    },
    update: async (id: number, updates: Partial<User>): Promise<User> => {
      await delay(300);
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) throw new Error("User not found");
      users[index] = { ...users[index], ...updates };
      return users[index];
    },
    delete: async (id: number): Promise<void> => {
      await delay(200);
      users = users.filter((user) => user.id !== id);
    },
  },
  roles: {
    getAll: async (): Promise<Role[]> => {
      await delay(300);
      return [...roles];
    },
    getById: async (id: number): Promise<Role | undefined> => {
      await delay(200);
      return roles.find((role) => role.id === id);
    },
    create: async (role: Omit<Role, "id">): Promise<Role> => {
      await delay(400);
      const newRole = { ...role, id: roles.length + 1 };
      roles.push(newRole);
      return newRole;
    },
    update: async (id: number, updates: Partial<Role>): Promise<Role> => {
      await delay(300);
      const index = roles.findIndex((role) => role.id === id);
      if (index === -1) throw new Error("Role not found");
      roles[index] = { ...roles[index], ...updates };
      return roles[index];
    },
    delete: async (id: number): Promise<void> => {
      await delay(200);
      roles = roles.filter((role) => role.id !== id);
    },
  },
};
