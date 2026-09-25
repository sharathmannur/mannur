"use client"
import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { format } from 'date-fns'

export default function Applications() {
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchApps() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('applications')
        .select('*, opportunities(*)')
        .eq('user_id', user.id)
      
      if (data) setApplications(data)
      setLoading(false)
    }
    fetchApps()
  }, [supabase])

  if (loading) return <div className="p-12 text-center text-slate-500">Loading applications...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">My Applications</h1>
      
      {applications.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500">You haven't applied to any opportunities yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-sm font-medium text-slate-500">
                <th className="p-4">Opportunity</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Applied On</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="p-4 font-medium text-slate-900">{app.opportunities.title}</td>
                  <td className="p-4 text-slate-600">{app.opportunities.organization}</td>
                  <td className="p-4 text-slate-600">{format(new Date(app.created_at), 'MMM d, yyyy')}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {app.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
