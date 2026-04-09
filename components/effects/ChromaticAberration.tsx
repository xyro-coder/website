'use client'

// Wide-angle lens chromatic aberration — RGB channels diverge at screen edges.
// Red fringe bottom-right, blue fringe top-left: pure CSS radial gradients with
// screen blend mode. Zero canvas overhead, purely declarative.

export default function ChromaticAberration() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'none',
        // Isolate blend modes within this stacking context
        isolation: 'isolate',
      }}
    >
      {/* Red channel — bottom-right corner, lens aberration outward */}
      <div style={{
        position: 'absolute',
        inset: '-4px',
        background: 'radial-gradient(ellipse at 104% 104%, rgba(255, 32, 0, 0.048) 0%, rgba(255,32,0,0.016) 28%, transparent 52%)',
        mixBlendMode: 'screen',
      }} />
      {/* Cyan/blue channel — top-left corner, opposite aberration */}
      <div style={{
        position: 'absolute',
        inset: '-4px',
        background: 'radial-gradient(ellipse at -4% -4%, rgba(0, 48, 255, 0.048) 0%, rgba(0,48,255,0.016) 28%, transparent 52%)',
        mixBlendMode: 'screen',
      }} />
      {/* Secondary red fringe — top-right */}
      <div style={{
        position: 'absolute',
        inset: '-4px',
        background: 'radial-gradient(ellipse at 104% -4%, rgba(255, 16, 0, 0.028) 0%, transparent 44%)',
        mixBlendMode: 'screen',
      }} />
      {/* Secondary blue fringe — bottom-left */}
      <div style={{
        position: 'absolute',
        inset: '-4px',
        background: 'radial-gradient(ellipse at -4% 104%, rgba(0, 16, 255, 0.028) 0%, transparent 44%)',
        mixBlendMode: 'screen',
      }} />
      {/* Subtle vignette — darkens corners, keeps center sharp (optical lens) */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,5,0.28) 100%)',
        mixBlendMode: 'multiply',
      }} />
    </div>
  )
}
