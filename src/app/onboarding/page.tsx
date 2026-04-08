'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const steps = ['Academic', 'Preferences', 'Goals', 'Budget']

export default function Onboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    current_level: '',
    gpa: '',
    test_scores: '',
    preferred_countries: [] as string[],
    preferred_courses: [] as string[],
    career_goals: '',
    budget_range: '',
    extracurriculars: '',
    priorities: [] as string[],
  })

  const update = (field: string, value: any) => setData(prev => ({ ...prev, [field]: value }))

  const toggleArray = (field: string, value: string) => {
    const arr = data[field as keyof typeof data] as string[]
    if (arr.includes(value)) {
      update(field, arr.filter((v: string) => v !== value))
    } else {
      update(field, [...arr, value])
    }
  }

  const handleFinish = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('student_profiles').insert({
        user_id: user.id,
        ...data,
        test_scores: { scores: data.test_scores },
        onboarding_completed: true,
      })
    }
    router.push('/dashboard')
    setLoading(false)
  }

  const btnClass = (active: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium border transition cursor-pointer ${active ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-lg p-8">
        
        {/* Logo */}
        <div className="text-2xl font-bold text-blue-600 mb-6">ApplyHelp</div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${i <= step ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                {i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>{s}</span>
              {i < steps.length - 1 && <div className={`h-px w-6 ${i < step ? 'bg-blue-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 - Academic */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Academic Background</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Level</label>
              <div className="flex flex-wrap gap-2">
                {['High School', 'Undergraduate', 'Graduate', 'Working Professional'].map(l => (
                  <button key={l} onClick={() => update('current_level', l)} className={btnClass(data.current_level === l)}>{l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GPA / Percentage</label>
              <input type="text" value={data.gpa} onChange={e => update('gpa', e.target.value)} placeholder="e.g. 8.5 CGPA or 85%" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Scores (if any)</label>
              <input type="text" value={data.test_scores} onChange={e => update('test_scores', e.target.value)} placeholder="e.g. IELTS 7.5, GRE 320" className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        )}

        {/* Step 2 - Preferences */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Countries</label>
              <div className="flex flex-wrap gap-2">
                {['USA', 'UK', 'Canada', 'Australia', 'Germany', 'India', 'Singapore', 'Netherlands'].map(c => (
                  <button key={c} onClick={() => toggleArray('preferred_countries', c)} className={btnClass(data.preferred_countries.includes(c))}>{c}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Courses</label>
              <div className="flex flex-wrap gap-2">
                {['Computer Science', 'Data Science', 'MBA', 'Engineering', 'Design', 'Medicine', 'Law', 'Finance'].map(c => (
                  <button key={c} onClick={() => toggleArray('preferred_courses', c)} className={btnClass(data.preferred_courses.includes(c))}>{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 - Goals */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Your Goals</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Career Goal</label>
              <textarea value={data.career_goals} onChange={e => update('career_goals', e.target.value)} placeholder="e.g. I want to become a data scientist at a top tech company..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-28 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Extracurricular Activities</label>
              <textarea value={data.extracurriculars} onChange={e => update('extracurriculars', e.target.value)} placeholder="e.g. Hackathons, open source, sports captain..." className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none" />
            </div>
          </div>
        )}

        {/* Step 4 - Budget */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Budget & Priorities</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range (per year)</label>
              <div className="flex flex-wrap gap-2">
                {['Under ₹5L', '₹5L–₹15L', '₹15L–₹30L', '₹30L–₹50L', 'Above ₹50L'].map(b => (
                  <button key={b} onClick={() => update('budget_range', b)} className={btnClass(data.budget_range === b)}>{b}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">What matters most to you?</label>
              <div className="flex flex-wrap gap-2">
                {['Rankings', 'Placements', 'Low Fees', 'Scholarships', 'Campus Life', 'Research', 'Location', 'ROI'].map(p => (
                  <button key={p} onClick={() => toggleArray('priorities', p)} className={btnClass(data.priorities.includes(p))}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep(s => s - 1)} disabled={step === 0} className="px-6 py-3 rounded-lg border border-gray-200 text-gray-600 font-medium disabled:opacity-30 hover:border-gray-300">
            Back
          </button>
          {step < steps.length - 1 ? (
            <button onClick={() => setStep(s => s + 1)} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
              Next
            </button>
          ) : (
            <button onClick={handleFinish} disabled={loading} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50">
              {loading ? 'Saving...' : 'Finish Setup'}
            </button>
          )}
        </div>
      </div>
    </main>
  )
}