'use client'

// Injects a hidden SVG feTurbulence + feDisplacementMap filter into the DOM.
// Cards that reference url(#schlieren-filter) will show background refraction
// on hover — the geometry behind them appears to bend, as if the data has mass
// and a refractive index. Zero canvas overhead — pure SVG filter primitive.
export default function SchlierenFilter() {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'fixed', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      <defs>
        {/* Static refraction used at rest — very subtle */}
        <filter id="schlieren-filter" x="-20%" y="-20%" width="140%" height="140%"
          colorInterpolationFilters="sRGB">
          {/* Turbulence generates the refractive wavefront */}
          <feTurbulence
            type="turbulence"
            baseFrequency="0.018 0.024"
            numOctaves="3"
            seed="7"
            result="noise"
          />
          {/* Displacement: uses noise to bend the source image */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="10"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          {/* Slight blur softens harsh displacement edges */}
          <feGaussianBlur in="displaced" stdDeviation="0.4" result="blurred" />
          {/* Composite back over original to preserve sharp text */}
          <feBlend in="SourceGraphic" in2="blurred" mode="luminosity" />
        </filter>

        {/* Stronger version for the active (hovered) state */}
        <filter id="schlieren-active" x="-25%" y="-25%" width="150%" height="150%"
          colorInterpolationFilters="sRGB">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.022 0.028"
            numOctaves="4"
            seed="11"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="18"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feGaussianBlur in="displaced" stdDeviation="0.6" result="blurred" />
          <feColorMatrix
            in="blurred"
            type="matrix"
            values="1.05 0    0    0  0
                    0    1.05 0    0  0
                    0    0    1.08 0  0
                    0    0    0    1  0"
            result="boosted"
          />
          <feBlend in="SourceGraphic" in2="boosted" mode="screen" />
        </filter>
      </defs>
    </svg>
  )
}
