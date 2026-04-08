'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(profile)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-blue-600 font-medium">Loading...</div>
    </div>
  )

  const modules = [
    { title: 'AI Advisor', desc: 'Get personalized guidance', icon: '🤖', href: '/advisor', color: 'bg-blue-50 border-blue-100' },
    { title: 'University Shortlist', desc: 'Your matched universities', icon: '🎓', href: '/shortlist', color: 'bg-purple-50 border-purple-100' },
    { title: 'SOP Writer', desc: 'Generate your SOP with AI', icon: '✍️', href: '/sop', color: 'bg-green-50 border-green-100' },
    { title: 'Resume Builder', desc: 'Build your academic resume', icon: '📄', href: '/resume', color: 'bg-yellow-50 border-yellow-100' },
    { title: 'Scholarship Finder', desc: 'Find scholarships for you', icon: '💰', href: '/scholarships', color: 'bg-orange-50 border-orange-100' },
    { title: 'Application Tracker', desc: 'Track all your applications', icon: '📋', href: '/tracker', color: 'bg-red-50 border-red-100' },
  ]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <div className="text-xl font-bold text-blue-600">ApplyHelp</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">👋 {profile?.full_name || user?.email}</span>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 font-medium">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'there'} 👋
          </h1>
          <p className="text-gray-500">Here's your ApplyHelp dashboard. What would you like to work on today?</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Universities Shortlisted', value: '0', icon: '🎓' },
            { label: 'Applications Tracking', value: '0', icon: '📋' },
            { label: 'Profile Completion', value: '40%', icon: '👤' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-5">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Modules */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map(m => (
            <Link key={m.title} href={m.href} className={`rounded-xl border p-6 hover:shadow-md transition ${m.color}`}>
              <div className="text-3xl mb-3">{m.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{m.title}</h3>
              <p className="text-sm text-gray-500">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}191