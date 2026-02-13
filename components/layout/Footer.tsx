import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(8,12,30,0.8)' }}>
      <div className="container mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div>
            <span className="text-lg font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
              Sulayman Yusuf
            </span>
            <p className="text-sm text-slate-600 mt-1 font-mono">
              CS Researcher · ML Engineer · UW Allen School
            </p>
          </div>

          {/* Nav */}
          <div className="flex gap-6 text-sm text-slate-500">
            {['/about', '/projects', '/publications', '/contact'].map(href => (
              <Link key={href} href={href}
                className="hover:text-cyan-400 transition-colors capitalize">
                {href.replace('/', '')}
              </Link>
            ))}
          </div>

          {/* Socials */}
          <div className="flex gap-3">
            {[
              { href: 'https://github.com/xyro-coder', icon: Github, label: 'GitHub' },
              { href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/', icon: Linkedin, label: 'LinkedIn' },
              { href: 'mailto:sulaymanyusuf.a@gmail.com', icon: Mail, label: 'Email' },
            ].map(({ href, icon: Icon, label }) => (
              <a key={label} href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2 rounded-lg text-slate-600 hover:text-cyan-400 transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
          <p className="text-xs text-slate-700 font-mono">
            © {new Date().getFullYear()} Sulayman Yusuf
          </p>
          <p className="text-xs text-slate-700 font-mono">
            Built with geometric precision
          </p>
        </div>
      </div>
    </footer>
  )
}
