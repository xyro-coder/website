import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Sulayman Yusuf',
  description: 'Get in touch for research collaboration, ML engineering opportunities, or to discuss geometric deep learning.',
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
