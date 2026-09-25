"use client"
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format, differenceInDays } from 'date-fns'
import { Briefcase, Bookmark, FileText } from 'lucide-react'

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null)
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [saved, setSaved] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, institutions(name)')
        .eq('id', user.id)
        .single()
      
      setProfile(profileData)

      const { data: oppsData } = await supabase
        .from('opportunities')
        .select('*')
        .gte('deadline', new Date().toISOString())
        .order('deadline', { ascending: true })
        .limit(3)
        
      if (oppsData) setOpportunities(oppsData)

      const { count: savedCount } = await supabase
        .from('saved_opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        
      setSaved(savedCount as any || 0)

      const { count: appCount } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        
      setApplications(appCount as any || 0)

      setLoading(false)
    }

    loadDashboard()
  }, [supabase])

  if (loading) {
    return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome, {profile?.full_name || 'Student'}</h1>
        <p className="text-slate-500 mt-2">Here's what's happening with your opportunities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
          <CardContent className="p-6 flex items-center justify-between bg-white">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Discover</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">Explore</h3>
            </div>
            <div className="h-14 w-14 bg-red-50 rounded-full flex items-center justify-center text-[#8b0000]">
              <Briefcase className="h-7 w-7" />
            </div>
          </CardContent>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
            <Link href="/opportunities" className="text-sm text-[#8b0000] font-medium hover:text-[#700000] flex items-center gap-1">
              Explore Opportunities <span>&rarr;</span>
            </Link>
          </div>
        </Card>
        
        <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
          <CardContent className="p-6 flex items-center justify-between bg-white">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Saved</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{saved as any} <span className="text-xl text-slate-500 font-medium">items</span></h3>
            </div>
            <div className="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
              <Bookmark className="h-7 w-7" />
            </div>
          </CardContent>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
            <Link href="/saved" className="text-sm text-[#8b0000] font-medium hover:text-[#700000] flex items-center gap-1">
              View Saved <span>&rarr;</span>
            </Link>
          </div>
        </Card>

        <Card className="overflow-hidden transition-all hover:shadow-md border-slate-200">
          <CardContent className="p-6 flex items-center justify-between bg-white">
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Applications</p>
              <h3 className="text-3xl font-bold mt-1 text-slate-900">{applications as any} <span className="text-xl text-slate-500 font-medium">tracked</span></h3>
            </div>
            <div className="h-14 w-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
              <FileText className="h-7 w-7" />
            </div>
          </CardContent>
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-100">
            <Link href="/applications" className="text-sm text-[#8b0000] font-medium hover:text-[#700000] flex items-center gap-1">
              My Applications <span>&rarr;</span>
            </Link>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Closing Soon</h2>
          {opportunities.length === 0 ? (
            <Card className="border-dashed border-2 border-slate-200">
              <CardContent className="p-12 text-center text-slate-500 flex flex-col items-center">
                <Briefcase className="h-12 w-12 text-slate-300 mb-4" />
                <p>No upcoming deadlines found.</p>
                <Button variant="outline" className="mt-4 border-slate-200">Explore all</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {opportunities.map(opp => {
                const daysLeft = differenceInDays(new Date(opp.deadline), new Date())
                return (
                  <Card key={opp.id} className="border-slate-200 hover:border-red-200 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-xs font-semibold bg-red-50 text-[#8b0000] px-2.5 py-1 rounded-md">
                            {opp.category}
                          </span>
                          <h3 className="text-lg font-bold mt-3 text-slate-900">{opp.title}</h3>
                          <p className="text-sm text-slate-500 mt-1">{opp.organization}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${daysLeft <= 3 ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                            {daysLeft} days left
                          </span>
                          <p className="text-xs text-slate-400 mt-2 font-medium">
                            {format(new Date(opp.deadline), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="mt-5 pt-5 border-t border-slate-100 flex justify-end gap-3">
                        <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">Save</Button>
                        <Link href={`/opportunities/${opp.id}`}>
                          <Button variant="outline" size="sm" className="border-slate-200">View Details</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-xl font-bold mb-4 text-slate-900">Your Profile</h2>
          <Card className="border-slate-200">
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Institution</p>
                <p className="font-medium text-slate-900">{profile?.institutions?.name || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Branch & Year</p>
                <p className="font-medium text-slate-900">{profile?.branch || 'Not set'} <span className="text-slate-300 mx-1">•</span> {profile?.year || 'Not set'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {profile?.skills?.length ? (
                    profile.skills.map((skill: string) => (
                      <span key={skill} className="bg-slate-100 text-slate-700 text-xs px-2.5 py-1 rounded-md font-medium border border-slate-200/60">{skill}</span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">None added</span>
                  )}
                </div>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <Link href="/profile">
                  <Button variant="ghost" className="w-full text-[#8b0000] hover:text-[#700000] hover:bg-red-50 font-medium">Edit Profile</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
