import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100">
        <div className="text-2xl font-bold text-blue-600">ApplyHelp</div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium">
            Login
          </Link>
          <Link href="/signup" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-8 py-24">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-2 rounded-full mb-6">
          AI-Powered Education Guidance
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Find the right university.<br />Build the perfect application.
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          ApplyHelp uses AI to guide students from confusion to clarity — personalized university recommendations, SOP writing, resume building and more.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/signup" className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700">
            Start for Free
          </Link>
          <Link href="#features" className="text-gray-600 px-8 py-4 rounded-lg text-lg font-medium border border-gray-200 hover:border-blue-300">
            See Features
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-5xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to get admitted</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "AI Advisor", desc: "Get personalized guidance based on your profile, goals and budget.", icon: "🤖" },
            { title: "University Shortlist", desc: "Dream, Realistic and Safe options matched to your profile.", icon: "🎓" },
            { title: "SOP Writer", desc: "Generate and polish your Statement of Purpose with AI.", icon: "✍️" },
            { title: "Resume Builder", desc: "Build a strong academic resume tailored for admissions.", icon: "📄" },
            { title: "Scholarship Finder", desc: "Find scholarships you are eligible for automatically.", icon: "💰" },
            { title: "Application Tracker", desc: "Track every application, deadline and document in one place.", icon: "📋" },
          ].map((f) => (
            <div key={f.title} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center px-8 py-20 mt-16">
        <h2 className="text-3xl font-bold mb-4">Ready to get into your dream university?</h2>
        <p className="text-blue-100 mb-8 text-lg">Join thousands of students who use ApplyHelp to build stronger applications.</p>
        <Link href="/signup" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50">
          Get Started Free
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-gray-400 text-sm py-8">
        © 2026 ApplyHelp. All rights reserved.
      </footer>
    </main>
  )
}