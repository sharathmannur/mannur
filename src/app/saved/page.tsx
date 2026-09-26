"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

export default function Saved() {
  const [saved, setSaved] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSaved() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUser(user)

      const { data } = await supabase
        .from('saved_opportunities')
        .select('*, opportunities(*)')
        .eq('user_id', user.id)
      
      if (data) setSaved(data)
      setLoading(false)
    }
    fetchSaved()
  }, [supabase])

  const handleUnsave = async (savedId: string) => {
    await supabase.from('saved_opportunities').delete().eq('id', savedId)
    setSaved(saved.filter(s => s.id !== savedId))
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading saved items...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">Saved Opportunities</h1>
      
      {saved.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">You haven't saved any opportunities yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {saved.map(item => {
            const opp = item.opportunities
            return (
              <Card key={item.id} className="border-slate-200">
                <CardHeader>
                  <CardTitle className="text-xl text-slate-900">{opp.title}</CardTitle>
                  <p className="text-sm text-slate-500">{opp.organization}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4">
                    Deadline: {format(new Date(opp.deadline), 'MMM d, yyyy')}
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleUnsave(item.id)}>
                      Remove
                    </Button>
                    <Button className="w-full bg-[#8b0000] hover:bg-[#700000] text-white" onClick={async () => {
                      await supabase.from('applications').insert({ user_id: user?.id, opportunity_id: item.opportunity_id, status: 'Applied' })
                      if (opp.application_url) {
                        window.open(opp.application_url, '_blank')
                      } else {
                        alert("Success! Your application has been submitted (Demo Mode).")
                      }
                    }}>
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
