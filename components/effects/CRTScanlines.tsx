'use client'

// Subtle CRT aesthetic — static scanline grid at 3% opacity
// + a slow laser sweep line that traverses the full viewport height over 14s.
// Both layers are fixed, pointer-events-none, z-index 50 (below chrome).

export default function CRTScanlines() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
    >
      {/* Static horizontal scanlines — repeating 4px pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.022) 3px, rgba(0,0,0,0.022) 4px)',
        }}
      />

      {/* Moving laser sweep — single bright line traverses screen top→bottom */}
      <div
        className="absolute left-0 right-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.055) 20%, rgba(168,85,247,0.04) 50%, rgba(6,182,212,0.055) 80%, transparent 100%)',
          animation: 'crt-scan 14s linear infinite',
          boxShadow: '0 0 8px rgba(6,182,212,0.08)',
        }}
      />
    </div>
  )
}
