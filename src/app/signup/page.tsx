"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'

export default function Signup() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()
  const [institutions, setInstitutions] = useState<any[]>([])
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', institutionId: '', campus: '', year: '1st Year', branch: '', skills: '', interests: '' })

  useEffect(() => {
    const fetchInstitutions = async () => { const { data } = await supabase.from('institutions').select('*').order('name'); if (data) setInstitutions(data) }
    fetchInstitutions()
  }, [supabase])

  const handleChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError(null)
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: formData.email, password: formData.password, options: { data: { full_name: formData.fullName } } })
    if (authError) { setError(authError.message); setLoading(false); return }
    if (authData.user) {
      await supabase.from('profiles').update({ institution_id: formData.institutionId || null, campus: formData.campus, year: formData.year, branch: formData.branch, skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean), interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean) }).eq('id', authData.user.id)
      router.push('/dashboard'); router.refresh()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-64px)] bg-slate-50 py-8 px-4">
      <Card className="w-full max-w-2xl border-slate-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-900">Create an account</CardTitle>
          <CardDescription className="text-center text-slate-500">Join to discover opportunities</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
              <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
              <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required minLength={6} />
              <select name="institutionId" value={formData.institutionId} onChange={handleChange} className="flex h-10 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8b0000]">
                <option value="">Select Institution</option>
                {institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)}
              </select>
            </div>
            {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Account'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
