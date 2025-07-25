'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Users, UserCheck, UserX, Shield, Settings, Mail, Phone, Calendar, Plus, Edit, Trash2 } from 'lucide-react'

interface UserData {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'operator' | 'viewer'
  status: 'active' | 'inactive' | 'suspended'
  lastLogin: string
  createdAt: string
  permissions: string[]
  avatar: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showAddUser, setShowAddUser] = useState(false)

  const mockUsers: UserData[] = [
    {
      id: 'user-001',
      name: 'Mohammed Ajhas',
      email: 'ajhas@mandlac.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      lastLogin: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['full_access', 'user_management', 'system_config', 'incident_management'],
      avatar: 'MA'
    },
    {
      id: 'user-002',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@mandlac.com',
      phone: '+1 (555) 234-5678',
      role: 'operator',
      status: 'active',
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['incident_management', 'camera_access', 'scene_management'],
      avatar: 'SJ'
    },
    {
      id: 'user-003',
      name: 'Michael Chen',
      email: 'michael.chen@mandlac.com',
      phone: '+1 (555) 345-6789',
      role: 'operator',
      status: 'inactive',
      lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['incident_management', 'camera_access'],
      avatar: 'MC'
    },
    {
      id: 'user-004',
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@mandlac.com',
      phone: '+1 (555) 456-7890',
      role: 'viewer',
      status: 'active',
      lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['camera_access', 'incident_view'],
      avatar: 'ER'
    },
    {
      id: 'user-005',
      name: 'David Williams',
      email: 'david.williams@mandlac.com',
      phone: '+1 (555) 567-8901',
      role: 'admin',
      status: 'suspended',
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['full_access', 'user_management'],
      avatar: 'DW'
    },
    {
      id: 'user-006',
      name: 'Lisa Thompson',
      email: 'lisa.thompson@mandlac.com',
      phone: '+1 (555) 678-9012',
      role: 'viewer',
      status: 'active',
      lastLogin: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      permissions: ['camera_access'],
      avatar: 'LT'
    }
  ]

  useEffect(() => {
    // Simulate loading users
    const timer = setTimeout(() => {
      setUsers(mockUsers)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'operator': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'viewer': return 'text-green-400 bg-green-400/10 border-green-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'inactive': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'suspended': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const formatLastLogin = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return `${minutes}m ago`
  }

  const activeUsers = users.filter(u => u.status === 'active').length
  const inactiveUsers = users.filter(u => u.status === 'inactive').length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const suspendedUsers = users.filter(u => u.status === 'suspended').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
      <Navbar />
      
      <div className="px-4 sm:px-8 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage user accounts and permissions</p>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="flex items-center space-x-2 bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <Users className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-green-400">{activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Admins</p>
                <p className="text-3xl font-bold text-red-400">{adminUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Suspended</p>
                <p className="text-3xl font-bold text-orange-400">{suspendedUsers}</p>
              </div>
              <UserX className="h-8 w-8 text-orange-400" />
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black/20 border-b border-gray-700">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-semibold">User</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Role</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Last Login</th>
                  <th className="text-left p-4 text-gray-400 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-700/50 hover:bg-black/20">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold">
                          {user.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium capitalize ${getRoleColor(user.role)}`}>
                        {user.role}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(user.status)}`}>
                        {user.status}
                      </div>
                    </td>
                    <td className="p-4 text-gray-400">
                      {formatLastLogin(user.lastLogin)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 text-gray-400 hover:text-amber-400 transition-colors"
                          title="View Details"
                        >
                          <Settings className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedUser(null)}>
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-black font-bold text-lg">
                    {selectedUser.avatar}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedUser.name}</h2>
                    <p className="text-gray-400">{selectedUser.email}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Email:</span>
                        <span className="text-white">{selectedUser.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Phone:</span>
                        <span className="text-white">{selectedUser.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Created:</span>
                        <span className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Shield className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Role:</span>
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${getRoleColor(selectedUser.role)}`}>
                          {selectedUser.role}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <UserCheck className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-400">Status:</span>
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${getStatusColor(selectedUser.status)}`}>
                          {selectedUser.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Permissions */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Permissions</h3>
                    <div className="space-y-2">
                      {selectedUser.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm text-gray-300 capitalize">
                            {permission.replace('_', ' ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors">
                    Edit User
                  </button>
                  <button 
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedUser.status === 'suspended'
                        ? 'bg-green-600 hover:bg-green-500 text-white'
                        : 'bg-red-600 hover:bg-red-500 text-white'
                    }`}
                  >
                    {selectedUser.status === 'suspended' ? 'Activate' : 'Suspend'} User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAddUser(false)}>
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-white">Add New User</h2>
                <button 
                  onClick={() => setShowAddUser(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Form */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
                      placeholder="Enter phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
                    <select className="w-full px-3 py-2 bg-black/20 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-400">
                      <option value="viewer">Viewer</option>
                      <option value="operator">Operator</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-3 mt-6 pt-6 border-t border-gray-700">
                  <button 
                    onClick={() => setShowAddUser(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-amber-400 text-black rounded-lg hover:bg-amber-300 transition-colors">
                    Create User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}