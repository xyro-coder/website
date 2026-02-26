import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Sulayman Yusuf',
  description: 'Learn more about Sulayman Yusuf - Computer Science researcher and ML engineer specializing in geometric deep learning and mechanistic interpretability.',
}

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
