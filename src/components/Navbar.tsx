"use client"
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { LogOut, Menu, User as UserIcon } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase.from('profiles').select('avatar_url').eq('id', data.user.id).single().then(({data: p}) => setProfile(p))
      }
    })
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
      if (session?.user) {
        supabase.from('profiles').select('avatar_url').eq('id', session.user.id).single().then(({data: p}) => setProfile(p))
      } else {
        setProfile(null)
      }
    })
    
    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50 border-b-[#8b0000]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <Image src="/niat-logo.jpg" alt="NIAT" width={100} height={40} className="rounded-sm" />
              </Link>
            </div>
            {user && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/dashboard" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/dashboard' ? 'border-[#8b0000] text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors'}`}>
                  Dashboard
                </Link>
                <Link href="/opportunities" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname.startsWith('/opportunities') ? 'border-[#8b0000] text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors'}`}>
                  Opportunities
                </Link>
                <Link href="/saved" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/saved' ? 'border-[#8b0000] text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors'}`}>
                  Saved
                </Link>
                <Link href="/applications" className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${pathname === '/applications' ? 'border-[#8b0000] text-slate-900' : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors'}`}>
                  Applications
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
            {user ? (
              <>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 p-1 pl-2">
                    {profile?.avatar_url ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden relative">
                        <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
                      </div>
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                    Profile
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="flex items-center gap-2 border-slate-200">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="hover:text-[#8b0000] hover:bg-red-50">Log in</Button>
                </Link>
                <Link href="/signup">
                  <Button className="bg-[#8b0000] hover:bg-[#700000] text-white">Sign up</Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
