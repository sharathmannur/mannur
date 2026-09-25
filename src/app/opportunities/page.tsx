"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { Briefcase, Building, MapPin, Calendar } from 'lucide-react'

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function fetchOpps() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data } = await supabase
        .from('opportunities')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (data) setOpportunities(data)
      setLoading(false)
    }
    fetchOpps()
  }, [supabase])

  const handleSave = async (oppId: string) => {
    if (!user) return alert("Please log in to save opportunities.")
    await supabase.from('saved_opportunities').insert({ user_id: user.id, opportunity_id: oppId })
    alert("Opportunity saved!")
  }

  const handleApply = async (oppId: string, url: string) => {
    if (!user) return alert("Please log in to apply.")
    await supabase.from('applications').insert({ user_id: user.id, opportunity_id: oppId, status: 'Applied' })
    window.open(url, '_blank')
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading opportunities...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Explore Opportunities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <Card key={opp.id} className="border-slate-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-semibold bg-red-50 text-[#8b0000] px-2 py-1 rounded-md">
                  {opp.category}
                </span>
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {format(new Date(opp.deadline), 'MMM d, yyyy')}
                </span>
              </div>
              <CardTitle className="text-xl text-slate-900">{opp.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm text-slate-600 gap-2">
                  <Building className="w-4 h-4 text-slate-400" />
                  {opp.organization}
                </div>
                <div className="flex items-center text-sm text-slate-600 gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {opp.location || opp.mode}
                </div>
              </div>
              
              <p className="text-sm text-slate-600 line-clamp-3 mb-6">
                {opp.description}
              </p>

              <div className="flex gap-3">
                <Button variant="outline" className="w-full border-slate-200" onClick={() => handleSave(opp.id)}>
                  Save
                </Button>
                <Button className="w-full bg-[#8b0000] hover:bg-[#700000] text-white" onClick={() => handleApply(opp.id, opp.application_url)}>
                  Apply Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
