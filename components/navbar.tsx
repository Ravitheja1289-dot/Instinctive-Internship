'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Camera, Users, AlertTriangle, LayoutDashboard, Film, Menu, X } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  
  const isActive = (path: string) => pathname === path

  return (
    <nav className="border-b border-[#2a231a] bg-gradient-to-r from-[#19181c] via-[#23201e] to-[#2a231a] text-white px-4 sm:px-8 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md flex items-center justify-center font-bold text-black text-xl">M</div>
            <span className="text-lg sm:text-xl font-bold tracking-wide text-white">MANDLACX</span>
          </div>
          <div className="hidden md:flex items-center space-x-4 lg:space-x-8 text-sm font-medium ml-8">
            <Link href="/" className={`flex items-center gap-2 hover:text-amber-300 ${isActive('/') ? 'text-amber-400' : 'text-gray-300'}`}>
              <LayoutDashboard className="h-5 w-5" />Dashboard
            </Link>
            <Link href="/cameras" className={`flex items-center gap-2 hover:text-amber-300 ${isActive('/cameras') ? 'text-amber-400' : 'text-gray-300'}`}>
              <Camera className="h-5 w-5" />Cameras
            </Link>
            <Link href="/scenes" className={`flex items-center gap-2 hover:text-amber-300 ${isActive('/scenes') ? 'text-amber-400' : 'text-gray-300'}`}>
              <Film className="h-5 w-5" />Scenes
            </Link>
            <Link href="/incidents" className={`flex items-center gap-2 hover:text-amber-300 ${isActive('/incidents') ? 'text-amber-400' : 'text-gray-300'}`}>
              <AlertTriangle className="h-5 w-5" />Incidents
            </Link>
            <Link href="/users" className={`flex items-center gap-2 hover:text-amber-300 ${isActive('/users') ? 'text-amber-400' : 'text-gray-300'}`}>
              <Users className="h-5 w-5" />Users
            </Link>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 sm:space-x-6">
          <Bell className="h-5 w-5 text-gray-400 hover:text-amber-400 cursor-pointer" />
          <div className="hidden sm:flex items-center space-x-3">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-amber-400">
              <AvatarFallback className="bg-gray-700 text-amber-400 text-sm sm:text-base font-bold">MA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-end">
              <span className="text-sm sm:text-base font-semibold text-white">Mohammed Ajhas</span>
              <span className="text-xs text-gray-400">ajhas@mandlac.com</span>
            </div>
          </div>
          <button 
            className="md:hidden text-white p-1" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden pt-4 pb-3 border-t border-[#2a231a] mt-3">
          <div className="flex flex-col space-y-3 text-sm font-medium">
            <Link href="/" className={`flex items-center gap-2 py-2 hover:text-amber-300 ${isActive('/') ? 'text-amber-400' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
              <LayoutDashboard className="h-5 w-5" />Dashboard
            </Link>
            <Link href="/cameras" className={`flex items-center gap-2 py-2 hover:text-amber-300 ${isActive('/cameras') ? 'text-amber-400' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
              <Camera className="h-5 w-5" />Cameras
            </Link>
            <Link href="/scenes" className={`flex items-center gap-2 py-2 hover:text-amber-300 ${isActive('/scenes') ? 'text-amber-400' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
              <Film className="h-5 w-5" />Scenes
            </Link>
            <Link href="/incidents" className={`flex items-center gap-2 py-2 hover:text-amber-300 ${isActive('/incidents') ? 'text-amber-400' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
              <AlertTriangle className="h-5 w-5" />Incidents
            </Link>
            <Link href="/users" className={`flex items-center gap-2 py-2 hover:text-amber-300 ${isActive('/users') ? 'text-amber-400' : 'text-gray-300'}`} onClick={() => setIsMenuOpen(false)}>
              <Users className="h-5 w-5" />Users
            </Link>
          </div>
          <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-[#2a231a]">
            <Avatar className="h-8 w-8 border-2 border-amber-400">
              <AvatarFallback className="bg-gray-700 text-amber-400 text-sm font-bold">MA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-white">Mohammed Ajhas</span>
              <span className="text-xs text-gray-400">ajhas@mandlac.com</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}