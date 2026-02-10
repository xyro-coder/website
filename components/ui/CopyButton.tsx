'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from './Button'

interface CopyButtonProps {
  text: string
  label?: string
}

export default function CopyButton({ text, label = 'Copy' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleCopy}
    >
      {copied ? (
        <>
          <Check className="mr-2 h-5 w-5" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="mr-2 h-5 w-5" />
          {label}
        </>
      )}
    </Button>
  )
}
