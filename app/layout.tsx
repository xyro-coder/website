import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import 'katex/dist/katex.min.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PageTransitionWrapper from '@/components/layout/PageTransitionWrapper'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Sulayman Yusuf | ML Research & Geometric Deep Learning',
  description: 'Computer Science researcher and ML engineer specializing in geometric deep learning, mechanistic interpretability, and sparse autoencoders. Research Fellow at Algoverse AI, Student at UW Allen School.',
  keywords: ['Geometric Deep Learning', 'Machine Learning', 'Sparse Autoencoders', 'Mechanistic Interpretability', 'Equivariant Neural Networks', 'PyTorch', 'Computer Science'],
  authors: [{ name: 'Sulayman Yusuf' }],
  creator: 'Sulayman Yusuf',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://sulaymanyusuf.com',
    title: 'Sulayman Yusuf | ML Research & Geometric Deep Learning',
    description: 'Computer Science researcher and ML engineer specializing in geometric deep learning and mechanistic interpretability.',
    siteName: 'Sulayman Yusuf Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sulayman Yusuf | ML Research & Geometric Deep Learning',
    description: 'Computer Science researcher and ML engineer specializing in geometric deep learning and mechanistic interpretability.',
    creator: '@sulaymanyusuf',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#080c1e] text-slate-200`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <PageTransitionWrapper>
            {children}
          </PageTransitionWrapper>
          <Footer />
        </div>
      </body>
    </html>
  )
}
