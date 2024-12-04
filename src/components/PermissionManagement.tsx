"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Check } from "lucide-react";
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
import { initialPermissions } from "@/lib/utils";

export default function PermissionManagement({
  searchQuery,
  activeFilter,
}: {
  searchQuery: string;
  activeFilter: string;
}) {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [newPermission, setNewPermission] = useState({
    name: "",
    description: "",
  });
  const [isAddingPermission, setIsAddingPermission] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleAddPermission = () => {
    setPermissions([
      ...permissions,
      { id: permissions.length + 1, ...newPermission },
    ]);
    setNewPermission({ name: "", description: "" });
    setIsAddingPermission(false);
  };

  const handleDeletePermission = (id: number) => {
    setPermissions(permissions.filter((permission) => permission.id !== id));
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
  };

  const handleSave = (id: number) => {
    setEditingId(null);
  };

  const filteredPermissions = useMemo(() => {
    return permissions.filter(
      (permission) =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        (activeFilter === "All" || permission.name === activeFilter)
    );
  }, [permissions, searchQuery, activeFilter]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Permission Management</h2>
        <Dialog open={isAddingPermission} onOpenChange={setIsAddingPermission}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              <Plus className="mr-2 h-4 w-4" /> Add Permission
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Permission</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Permission Name"
                value={newPermission.name}
                onChange={(e) =>
                  setNewPermission({ ...newPermission, name: e.target.value })
                }
              />
              <Input
                placeholder="Description"
                value={newPermission.description}
                onChange={(e) =>
                  setNewPermission({
                    ...newPermission,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <Button onClick={handleAddPermission}>Add Permission</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Permission Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPermissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>
                {editingId === permission.id ? (
                  <Input
                    value={permission.name}
                    onChange={(e) => {
                      const updatedPermissions = permissions.map((p) =>
                        p.id === permission.id
                          ? { ...p, name: e.target.value }
                          : p
                      );
                      setPermissions(updatedPermissions);
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  <span
                    className={`${
                      permission.name === "Read"
                        ? "bg-green-500 text-white px-2 py-1 rounded"
                        : permission.name === "Write"
                        ? "bg-gray-400 text-white px-2 py-1 rounded"
                        : permission.name === "Delete"
                        ? "bg-red-500 text-white px-2 py-1 rounded"
                        : ""
                    }`}
                  >
                    {permission.name}
                  </span>
                )}
              </TableCell>
              <TableCell>
                {editingId === permission.id ? (
                  <Input
                    value={permission.description}
                    onChange={(e) => {
                      const updatedPermissions = permissions.map((p) =>
                        p.id === permission.id
                          ? { ...p, description: e.target.value }
                          : p
                      );
                      setPermissions(updatedPermissions);
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  permission.description
                )}
              </TableCell>
              <TableCell>
                {editingId === permission.id ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleSave(permission.id)}
                    className="text-gray-300 hover:text-white"
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(permission.id)}
                    className="text-gray-300 hover:text-white hover:bg-gray-500"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeletePermission(permission.id)}
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
