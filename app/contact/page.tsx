import { Metadata } from 'next'
import { Github, Linkedin, Mail, MapPin, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact | Sulayman Yusuf',
  description: 'Get in touch for research collaboration, ML engineering opportunities, or to discuss geometric deep learning.',
}

export default function ContactPage() {
  return (
    <div className="bg-[#080c1e] min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl py-16">

        {/* Header */}
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-4 font-mono">
            Open to collaboration
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-none mb-6">
            Let&apos;s build<br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
              something
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
            Interested in geometric deep learning research, ML engineering,
            or just want to talk math? My inbox is open.
          </p>
        </div>

        {/* Primary CTA */}
        <a href="mailto:sulaymanyusuf.a@gmail.com"
          className="group flex items-center justify-between w-full p-6 rounded-2xl mb-4 transition-all duration-300 hover:border-cyan-400/40 hover:bg-cyan-500/10"
          style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)' }}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.3)' }}>
              <Mail className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-mono mb-0.5">Email</p>
              <p className="text-white font-medium">sulaymanyusuf.a@gmail.com</p>
            </div>
          </div>
          <ArrowUpRight className="h-5 w-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </a>

        {/* Social links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
          <a href="https://github.com/xyro-coder" target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:bg-purple-500/10 hover:border-purple-400/30"
            style={{ background: 'rgba(168,85,247,0.05)', border: '1px solid rgba(168,85,247,0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(168,85,247,0.12)' }}>
                <Github className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-mono mb-0.5">GitHub</p>
                <p className="text-slate-300 text-sm font-medium">@xyro-coder</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
          </a>

          <a href="https://www.linkedin.com/in/sulayman-yusuf-a84940214/" target="_blank" rel="noopener noreferrer"
            className="group flex items-center justify-between p-5 rounded-2xl transition-all duration-300 hover:bg-indigo-500/10 hover:border-indigo-400/30"
            style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(99,102,241,0.12)' }}>
                <Linkedin className="h-4 w-4 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-slate-600 font-mono mb-0.5">LinkedIn</p>
                <p className="text-slate-300 text-sm font-medium">Sulayman Yusuf</p>
              </div>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors" />
          </a>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="p-8" style={{ background: '#080c1e' }}>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-cyan-500" />
              <p className="text-xs uppercase tracking-widest text-slate-600 font-mono">Location</p>
            </div>
            <p className="text-white font-medium mb-1">Seattle, WA</p>
            <p className="text-slate-500 text-sm">University of Washington</p>
            <p className="text-slate-500 text-sm">Paul G. Allen School of CS</p>
          </div>
          <div className="p-8" style={{ background: '#080c1e' }}>
            <p className="text-xs uppercase tracking-widest text-slate-600 font-mono mb-4">Availability</p>
            <ul className="space-y-2">
              {['Research collaborations', 'ML engineering internships (Summer 2026)', 'Speaking engagements', 'Open source contributions'].map(item => (
                <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Resume CTA */}
        <div className="mt-8 flex gap-3">
          <a href="/resume/resume.pdf" download
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-white hover:opacity-90 transition-opacity"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(168,85,247,0.2))', border: '1px solid rgba(255,255,255,0.1)' }}>
            Download Resume
          </a>
          <a href="https://github.com/xyro-coder" target="_blank" rel="noopener noreferrer"
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            View GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
