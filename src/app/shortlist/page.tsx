'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Shortlist() {
  const router = useRouter()
  const [shortlist, setShortlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    university_name: '',
    course: '',
    country: '',
    category: 'Realistic',
    notes: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data } = await supabase.from('shortlist').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
      setShortlist(data || [])
      setLoading(false)
    }
    init()
  }, [])

  const addUniversity = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data } = await supabase.from('shortlist').insert({ ...form, user_id: user.id }).select().single()
    if (data) setShortlist(prev => [data, ...prev])
    setForm({ university_name: '', course: '', country: '', category: 'Realistic', notes: '' })
    setShowForm(false)
  }

  const removeUniversity = async (id: string) => {
    await supabase.from('shortlist').delete().eq('id', id)
    setShortlist(prev => prev.filter(u => u.id !== id))
  }

  const categories = ['Dream', 'Realistic', 'Safe']
  const categoryColors: any = {
    Dream: 'bg-purple-100 text-purple-700',
    Realistic: 'bg-blue-100 text-blue-700',
    Safe: 'bg-green-100 text-green-700',
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold text-blue-600">ApplyHelp</Link>
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-blue-600">← Back to Dashboard</Link>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">University Shortlist</h1>
            <p className="text-gray-500">Your Dream, Realistic and Safe university options</p>
          </div>
          <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-700">
            + Add University
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add University</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University Name</label>
                <input type="text" value={form.university_name} onChange={e => setForm(p => ({ ...p, university_name: e.target.value }))} placeholder="e.g. MIT" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <input type="text" value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} placeholder="e.g. MS Computer Science" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))} placeholder="e.g. USA" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <input type="text" value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any notes..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={addUniversity} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Add</button>
              <button onClick={() => setShowForm(false)} className="border border-gray-200 text-gray-600 px-6 py-2 rounded-lg font-medium hover:border-gray-300">Cancel</button>
            </div>
          </div>
        )}

        {/* Categories */}
        {loading ? (
          <div className="text-center text-gray-400 py-20">Loading...</div>
        ) : shortlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No universities yet</h3>
            <p className="text-gray-400 mb-6">Add universities to your shortlist to get started</p>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">Add Your First University</button>
          </div>
        ) : (
          categories.map(cat => {
            const items = shortlist.filter(u => u.category === cat)
            if (items.length === 0) return null
            return (
              <div key={cat} className="mb-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${categoryColors[cat]}`}>{cat}</span>
                  <span className="text-gray-400 text-sm font-normal">{items.length} universities</span>
                </h2>
                <div className="space-y-3">
                  {items.map(u => (
                    <div key={u.id} className="bg-white rounded-xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-sm transition">
                      <div>
                        <h3 className="font-semibold text-gray-900">{u.university_name}</h3>
                        <p className="text-sm text-gray-500">{u.course} • {u.country}</p>
                        {u.notes && <p className="text-xs text-gray-400 mt-1">{u.notes}</p>}
                      </div>
                      <button onClick={() => removeUniversity(u.id)} className="text-gray-300 hover:text-red-400 text-xl transition">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </main>
  )
}