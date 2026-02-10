import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-text-muted-light/20 dark:border-text-muted/20 bg-white dark:bg-navy-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-dark dark:text-text-light">
              Sulayman Yusuf
            </h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted mb-4">
              CS Researcher & ML Engineer specializing in geometric deep learning and mechanistic interpretability.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/xyro-coder"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/sulayman-yusuf-a84940214/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="mailto:sulaymanyusuf.a@gmail.com"
                className="text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-dark dark:text-text-light">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-sm text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/publications"
                  className="text-sm text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                >
                  Publications
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-dark dark:text-text-light">
              Get In Touch
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-sm text-text-muted-light dark:text-text-muted">
                <Mail className="h-4 w-4" />
                <a
                  href="mailto:sulaymanyusuf.a@gmail.com"
                  className="hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                >
                  sulaymanyusuf.a@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-text-muted-light/20 dark:border-text-muted/20">
          <p className="text-center text-sm text-text-muted-light dark:text-text-muted">
            © {currentYear} Sulayman Yusuf. Built with Next.js and geometric precision.
          </p>
        </div>
      </div>
    </footer>
  )
}
