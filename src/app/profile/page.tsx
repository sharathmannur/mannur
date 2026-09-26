"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { UserCircle } from 'lucide-react'

export default function Profile() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (data) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await supabase.from('profiles').update({
      full_name: profile.full_name,
      campus: profile.campus,
      branch: profile.branch,
      year: profile.year,
      skills: typeof profile.skills === 'string' ? profile.skills.split(',').map((s:string) => s.trim()) : profile.skills
    }).eq('id', profile.id)
    setSaving(false)
    alert('Profile updated!')
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!event.target.files || event.target.files.length === 0) return
      
      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      
      await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', profile.id)
      setProfile({ ...profile, avatar_url: data.publicUrl })
      
    } catch (error: any) {
      console.error(error)
      alert('Error uploading avatar: ' + (error.message || 'Unknown error. Check console.'))
    } finally {
      setUploading(false)
    }
  }

  if (loading) return <div className="p-12 text-center text-slate-500">Loading profile...</div>

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-slate-900">My Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Avatar Section */}
        <div className="md:col-span-1">
          <Card className="border-slate-200 text-center">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-red-50 bg-slate-100 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                ) : (
                  <UserCircle className="w-20 h-20 text-slate-300" />
                )}
              </div>
              <div className="w-full">
                <label className="cursor-pointer">
                  <span className="block w-full py-2 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    {uploading ? 'Uploading...' : 'Change Photo'}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} disabled={uploading} />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="md:col-span-2">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Full Name</label>
                  <Input 
                    value={profile?.full_name || ''} 
                    onChange={e => setProfile({...profile, full_name: e.target.value})} 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Branch</label>
                    <Input 
                      value={profile?.branch || ''} 
                      onChange={e => setProfile({...profile, branch: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Year</label>
                    <Input 
                      value={profile?.year || ''} 
                      onChange={e => setProfile({...profile, year: e.target.value})} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Skills (comma separated)</label>
                  <Input 
                    value={Array.isArray(profile?.skills) ? profile.skills.join(', ') : profile?.skills || ''} 
                    onChange={e => setProfile({...profile, skills: e.target.value})} 
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" disabled={saving} className="bg-[#8b0000] hover:bg-[#700000] text-white">
                    {saving ? 'Saving...' : 'Save Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
