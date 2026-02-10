import { ComponentPropsWithoutRef } from 'react'

// Callout component for notes, warnings, tips
interface CalloutProps {
  type?: 'note' | 'warning' | 'tip'
  children: React.ReactNode
}

function Callout({ type = 'note', children }: CalloutProps) {
  const colors = {
    note: 'bg-cyan-accent-light/10 dark:bg-cyan-accent/10 border-cyan-accent-light dark:border-cyan-accent',
    warning: 'bg-purple-accent-light/10 dark:bg-purple-accent/10 border-purple-accent-light dark:border-purple-accent',
    tip: 'bg-cyan-accent/10 border-cyan-accent',
  }

  const icons = {
    note: 'ℹ️',
    warning: '⚠️',
    tip: '💡',
  }

  return (
    <div className={`my-6 p-4 rounded-lg border-l-4 ${colors[type]}`}>
      <div className="flex items-start">
        <span className="text-2xl mr-3">{icons[type]}</span>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}

// Code block with copy button
function Pre(props: ComponentPropsWithoutRef<'pre'>) {
  return (
    <div className="relative group">
      <pre {...props} className="overflow-x-auto" />
    </div>
  )
}

// Enhanced blockquote
function Blockquote(props: ComponentPropsWithoutRef<'blockquote'>) {
  return (
    <blockquote
      {...props}
      className="border-l-4 border-cyan-accent-light dark:border-cyan-accent pl-4 my-6 italic text-text-muted-light dark:text-text-muted"
    />
  )
}

// Enhanced table
function Table(props: ComponentPropsWithoutRef<'table'>) {
  return (
    <div className="overflow-x-auto my-8">
      <table {...props} className="w-full border-collapse" />
    </div>
  )
}

function Th(props: ComponentPropsWithoutRef<'th'>) {
  return (
    <th
      {...props}
      className="bg-light-surface dark:bg-navy-surface p-3 text-left font-semibold border border-text-muted-light/20 dark:border-text-muted/20"
    />
  )
}

function Td(props: ComponentPropsWithoutRef<'td'>) {
  return (
    <td
      {...props}
      className="p-3 border border-text-muted-light/20 dark:border-text-muted/20"
    />
  )
}

// Enhanced image with caption
function Image(props: ComponentPropsWithoutRef<'img'>) {
  return (
    <figure className="my-8">
      <img {...props} className="rounded-lg w-full" alt={props.alt || ''} />
      {props.alt && (
        <figcaption className="text-center text-sm text-text-muted-light dark:text-text-muted mt-2">
          {props.alt}
        </figcaption>
      )}
    </figure>
  )
}

// Math equation block
function MathBlock({ children }: { children: string }) {
  return (
    <div className="my-6 overflow-x-auto p-4 bg-light-surface dark:bg-navy-surface rounded-lg">
      <div className="katex-display">{children}</div>
    </div>
  )
}

// MDX Components export
export const mdxComponents = {
  Callout,
  pre: Pre,
  blockquote: Blockquote,
  table: Table,
  th: Th,
  td: Td,
  img: Image,
  MathBlock,
}
