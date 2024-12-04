'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { api } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { User } from '@/lib/utils'

export default function UserManagement({ searchQuery, activeFilter }: { searchQuery: string, activeFilter: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({ name: '', email: '', role: '', status: 'Active' })
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const fetchedUsers = await api.users.getAll()
      setUsers(fetchedUsers)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    try {
      const createdUser = await api.users.create(newUser)
      setUsers([...users, createdUser])
      setNewUser({ name: '', email: '', role: '', status: 'Active' })
      setIsAddingUser(false)
      toast({
        title: "Success",
        description: "User added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await api.users.delete(id)
      setUsers(users.filter(user => user.id !== id))
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (id: number) => {
    setEditingId(id)
  }

  const handleSave = async (id: number) => {
    const userToUpdate = users.find(user => user.id === id)
    if (!userToUpdate) return

    try {
      const updatedUser = await api.users.update(id, userToUpdate)
      setUsers(users.map(user => user.id === id ? updatedUser : user))
      setEditingId(null)
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    }
  }

  const filteredUsers = users.filter(user => 
    (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.email.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (activeFilter === 'All' || user.role === activeFilter)
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex justify-end">
        <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600">
              <Plus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-white">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Input
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-gray-700 text-white border-gray-600"
              />
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value })}
              >
                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Moderator">Moderator</SelectItem>
                  <SelectItem value="View">View</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={newUser.status}
                onValueChange={(value) => setNewUser({ ...newUser, status: value as 'Active' | 'Inactive' })}
              >
                <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} className="bg-blue-600 text-white hover:bg-blue-700">Add User</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="border-gray-700 bg-gray-800">
            <TableHead className="text-gray-300">Name</TableHead>
            <TableHead className="text-gray-300">Email</TableHead>
            <TableHead className="text-gray-300">Role</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.map((user) => (
            <TableRow key={user.id} className="border-gray-700">
              <TableCell className="font-medium">
                {editingId === user.id ? (
                  <Input
                    value={user.name}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, name: e.target.value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  user.name
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Input
                    value={user.email}
                    onChange={(e) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, email: e.target.value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                    className="bg-gray-700 text-white border-gray-600"
                  />
                ) : (
                  user.email
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Select
                    value={user.role}
                    onValueChange={(value) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, role: value } : u
                      );
                      setUsers(updatedUsers);
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Editor">Editor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  user.role
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Select
                    value={user.status}
                    onValueChange={(value) => {
                      const updatedUsers = users.map(u => 
                        u.id === user.id ? { ...u, status: value as 'Active' | 'Inactive' } : u
                      );
                      setUsers(updatedUsers);
                    }}
                  >
                    <SelectTrigger className="bg-gray-700 text-white border-gray-600">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                    {user.status}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {editingId === user.id ? (
                  <Button variant="ghost" size="icon" onClick={() => handleSave(user.id)} className="text-gray-300 hover:text-white">
                    <Check className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(user.id)} className="text-gray-300 hover:text-white hover:bg-gray-500">
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => handleDeleteUser(user.id)} className="text-gray-300 hover:text-white hover:bg-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}

