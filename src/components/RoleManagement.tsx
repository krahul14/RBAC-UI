"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Role } from "@/lib/utils";

const allPermissions = ["Read", "Write", "Delete"];

export default function RoleManagement({
  searchQuery,
  activeFilter,
}: {
  searchQuery: string;
  activeFilter: string;
}) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [newRole, setNewRole] = useState<Omit<Role, "id">>({
    name: "",
    permissions: [],
  });
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const fetchedRoles = await api.roles.getAll();
      setRoles(fetchedRoles);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch roles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRole = async () => {
    try {
      const createdRole = await api.roles.create(newRole);
      setRoles([...roles, createdRole]);
      setNewRole({ name: "", permissions: [] });
      setIsAddingRole(false);
      toast({
        title: "Success",
        description: "Role added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add role",
        variant: "destructive",
      });
    }
  };

  const handleDeleteRole = async (id: number) => {
    try {
      await api.roles.delete(id);
      setRoles(roles.filter((role) => role.id !== id));
      toast({
        title: "Success",
        description: "Role deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete role",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = async (id: number) => {
    const roleToUpdate = roles.find((role) => role.id === id);
    if (!roleToUpdate) return;

    try {
      const updatedRole = await api.roles.update(id, roleToUpdate);
      setRoles(roles.map((role) => (role.id === id ? updatedRole : role)));
      setEditingId(null);
      toast({
        title: "Success",
        description: "Role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role",
        variant: "destructive",
      });
    }
  };

  const handlePermissionChange = (permission: string) => {
    setNewRole((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter((p) => p !== permission)
        : [...prev.permissions, permission],
    }));
  };

  const handlePermissionToggle = (roleId: number, permission: string) => {
    setRoles(
      roles.map((role) => {
        if (role.id === roleId) {
          const updatedPermissions = role.permissions.includes(permission)
            ? role.permissions.filter((p) => p !== permission)
            : [...role.permissions, permission];
          return { ...role, permissions: updatedPermissions };
        }
        return role;
      })
    );
  };

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilter === "All" ||
        (activeFilter === "With Delete" &&
          role.permissions.includes("Delete")) ||
        (activeFilter === "Without Delete" &&
          !role.permissions.includes("Delete")))
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-end">
        <Dialog open={isAddingRole} onOpenChange={setIsAddingRole}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New Role</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Role Name"
                value={newRole.name}
                onChange={(e) =>
                  setNewRole({ ...newRole, name: e.target.value })
                }
                className="bg-gray-700 text-white border-gray-600"
              />
              <div>
                <h4 className="mb-2 font-semibold">Permissions</h4>
                {allPermissions.map((permission) => (
                  <div key={permission} className="flex items-center space-x-2">
                    <Checkbox
                      id={`permission-${permission}`}
                      checked={newRole.permissions.includes(permission)}
                      onCheckedChange={() => handlePermissionChange(permission)}
                    />
                    <label
                      htmlFor={`permission-${permission}`}
                      className="text-white"
                    >
                      {permission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <Button
              onClick={handleAddRole}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Add Role
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 bg-gray-800">
            <TableHead className="text-gray-300">Role Name</TableHead>
            <TableHead className="text-gray-300">Permissions</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRoles.map((role) => (
            <TableRow key={role.id} className="border-gray-700">
              <TableCell className="font-medium">
                {editingId === role.id ? (
                  <Input
                    value={role.name}
                    onChange={(e) => {
                      const updatedRoles = roles.map((r) =>
                        r.id === role.id ? { ...r, name: e.target.value } : r
                      );
                      setRoles(updatedRoles);
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  role.name
                )}
              </TableCell>
              <TableCell>
                {editingId === role.id ? (
                  <div className="flex flex-wrap gap-2">
                    {allPermissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`permission-${role.id}-${permission}`}
                          checked={role.permissions.includes(permission)}
                          onCheckedChange={() =>
                            handlePermissionToggle(role.id, permission)
                          }
                        />
                        <label
                          htmlFor={`permission-${role.id}-${permission}`}
                          className="text-white"
                        >
                          {permission}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission) => (
                      <span
                        key={permission}
                        className={`${
                          permission === "Read"
                            ? "bg-green-500 text-white px-2 py-1 rounded"
                            : permission === "Write"
                            ? "bg-gray-400 text-white px-2 py-1 rounded"
                            : permission === "Delete"
                            ? "bg-red-500 text-white px-2 py-1 rounded"
                            : ""
                        }`}
                      >
                        {permission}
                      </span>
                    ))}
                  </div>
                )}
              </TableCell>
              <TableCell>
                {editingId === role.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(role.id)}
                    className="text-gray-300 hover:text-white"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(role.id)}
                    className="text-gray-300 hover:text-white hover:bg-gray-500"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-gray-300 hover:text-white hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  );
}
