import { Metadata } from 'next'
import { Mail, Phone, Github, Linkedin, MapPin } from 'lucide-react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Contact | Sulayman Yusuf',
  description: 'Get in touch for research collaboration, ML engineering opportunities, or to discuss geometric deep learning.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
            Interested in collaborating on geometric deep learning research or discussing ML engineering opportunities? I&apos;d love to hear from you.
          </p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email */}
          <Card hover className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-accent-light to-cyan-accent flex items-center justify-center">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text-dark dark:text-text-light">
              Email
            </h3>
            <a
              href="mailto:sulaymanyusuf.a@gmail.com"
              className="text-cyan-accent-light dark:text-cyan-accent hover:underline"
            >
              sulaymanyusuf.a@gmail.com
            </a>
          </Card>

          {/* Phone */}
          <Card hover className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-accent-light to-purple-accent flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-text-dark dark:text-text-light">
              Phone
            </h3>
            <a
              href="tel:+12067986222"
              className="text-purple-accent-light dark:text-purple-accent hover:underline"
            >
              206-798-6222
            </a>
          </Card>
        </div>

        {/* Social Links */}
        <Card className="p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-text-dark dark:text-text-light">
            Connect on Social Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <a
              href="https://github.com/xyro-coder"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-light-surface dark:hover:bg-navy-dark transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-light-surface dark:bg-navy-dark flex items-center justify-center group-hover:bg-cyan-accent-light/20 dark:group-hover:bg-cyan-accent/20 transition-colors">
                <Github className="h-6 w-6 text-text-muted-light dark:text-text-muted" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark dark:text-text-light">GitHub</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted">@xyro-coder</p>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/in/sulayman-yusuf-a84940214/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-4 p-4 rounded-lg hover:bg-light-surface dark:hover:bg-navy-dark transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-light-surface dark:bg-navy-dark flex items-center justify-center group-hover:bg-purple-accent-light/20 dark:group-hover:bg-purple-accent/20 transition-colors">
                <Linkedin className="h-6 w-6 text-text-muted-light dark:text-text-muted" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text-dark dark:text-text-light">LinkedIn</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted">Sulayman Yusuf</p>
              </div>
            </a>
          </div>
        </Card>

        {/* Location & Availability */}
        <Card className="p-8 bg-gradient-to-br from-cyan-accent-light/10 to-purple-accent-light/10 dark:from-cyan-accent/10 dark:to-purple-accent/10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <MapPin className="h-6 w-6 mr-3 text-cyan-accent-light dark:text-cyan-accent" />
                <h3 className="text-xl font-semibold text-text-dark dark:text-text-light">
                  Location
                </h3>
              </div>
              <p className="text-text-muted-light dark:text-text-muted">
                Seattle, WA<br />
                University of Washington<br />
                Paul G. Allen School of Computer Science
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light">
                Availability
              </h3>
              <p className="text-text-muted-light dark:text-text-muted mb-4">
                Currently open to:
              </p>
              <ul className="space-y-2 text-text-muted-light dark:text-text-muted">
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2">▸</span>
                  Research collaborations
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2">▸</span>
                  ML engineering internships (Summer 2026)
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2">▸</span>
                  Speaking engagements
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2">▸</span>
                  Open source contributions
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-lg text-text-muted-light dark:text-text-muted mb-6">
            Want to learn more about my work?
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="/resume/resume.pdf" download>
              <Button size="lg" variant="primary">
                Download Resume
              </Button>
            </a>
            <a href="https://github.com/xyro-coder" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                View GitHub Profile
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
