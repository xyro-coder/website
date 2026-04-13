'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Sparse 40×20 grid — same barycentric wireframe as the hero but dialled way
// back in density, speed, and alpha so it reads as a background texture.

const GX = 40, GY = 20
const WX = 2.0, WY = 0.90

function buildGeometry(): THREE.BufferGeometry {
  const NV   = GX * GY * 6
  const pos  = new Float32Array(NV * 3)
  const bary = new Float32Array(NV * 3)
  let p = 0, b = 0

  for (let iy = 0; iy < GY; iy++) {
    for (let ix = 0; ix < GX; ix++) {
      const x0 = (ix     / GX) * WX * 2 - WX
      const x1 = ((ix+1) / GX) * WX * 2 - WX
      const y0 = (iy     / GY) * WY * 2 - WY
      const y1 = ((iy+1) / GY) * WY * 2 - WY

      pos[p]=x0;pos[p+1]=y1;pos[p+2]=0; bary[b]=1;bary[b+1]=0;bary[b+2]=0; p+=3;b+=3
      pos[p]=x1;pos[p+1]=y1;pos[p+2]=0; bary[b]=0;bary[b+1]=1;bary[b+2]=0; p+=3;b+=3
      pos[p]=x0;pos[p+1]=y0;pos[p+2]=0; bary[b]=0;bary[b+1]=0;bary[b+2]=1; p+=3;b+=3

      pos[p]=x1;pos[p+1]=y1;pos[p+2]=0; bary[b]=1;bary[b+1]=0;bary[b+2]=0; p+=3;b+=3
      pos[p]=x1;pos[p+1]=y0;pos[p+2]=0; bary[b]=0;bary[b+1]=1;bary[b+2]=0; p+=3;b+=3
      pos[p]=x0;pos[p+1]=y0;pos[p+2]=0; bary[b]=0;bary[b+1]=0;bary[b+2]=1; p+=3;b+=3
    }
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(pos,  3))
  geo.setAttribute('a_bary',   new THREE.BufferAttribute(bary, 3))
  return geo
}

// Slower, gentler waves — minimal distraction behind page content
const VERT = /* glsl */`
attribute vec3 a_bary;
uniform float u_t;
uniform vec2  u_cur;
varying vec3  v_bary;
varying float v_z;
varying float v_fade;
void main() {
  vec2 gp = position.xy;
  float z = sin(gp.x * 2.60 + u_t * 0.40) * cos(gp.y * 1.90 + u_t * 0.32) * 0.11
          + sin(gp.x * 1.10 - u_t * 0.22) * sin(gp.y * 1.40 + u_t * 0.35) * 0.055;
  float d    = length(gp - u_cur);
  float pull = exp(-d * d * 2.4) * 0.32;
  z += pull;
  float ex = 1.0 - smoothstep(0.68, 1.0, abs(gp.x) / ${WX.toFixed(2)});
  float ey = 1.0 - smoothstep(0.65, 1.0, abs(gp.y) / ${WY.toFixed(2)});
  v_fade = ex * ey;
  v_bary = a_bary;
  v_z    = z;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(gp.x, gp.y, z, 1.0);
}
`

const FRAG = /* glsl */`
#extension GL_OES_standard_derivatives : enable
varying vec3  v_bary;
varying float v_z;
varying float v_fade;
void main() {
  float e    = min(min(v_bary.x, v_bary.y), v_bary.z);
  float fw   = fwidth(e);
  float line = 1.0 - smoothstep(0.0, fw * 1.5, e);
  float tz    = clamp(v_z * 5.0, -1.0, 1.0);
  vec3 cyan   = vec3(0.024, 0.714, 0.831);
  vec3 purple = vec3(0.659, 0.333, 0.969);
  vec3 dark   = vec3(0.014, 0.030, 0.072);
  vec3 col = tz > 0.0 ? mix(dark, cyan, tz) : mix(dark, purple, -tz);
  float faceA = 0.010 * v_fade * (1.0 - line);
  float edgeA = line * (0.14 + abs(v_z) * 1.2) * v_fade;  // much quieter
  float alpha = faceA + edgeA;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(col, alpha);
}
`

function LatticeBg() {
  const lerped  = useRef({ x: 0.0, y: 0.0 })
  const geometry = useMemo(buildGeometry, [])

  const uniforms = useMemo(() => ({
    u_t:   { value: 0.0 },
    u_cur: { value: new THREE.Vector2(0, 0) },
  }), [])

  const material = useMemo(() => new THREE.ShaderMaterial({
    vertexShader:   VERT,
    fragmentShader: FRAG,
    uniforms,
    transparent: true,
    side:        THREE.DoubleSide,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  }), [uniforms])

  useFrame((state) => {
    const { width, height } = state.size
    const halfH = 2.5 * Math.tan((60 * Math.PI) / 180 / 2)
    const halfW = halfH * (width / height)
    const L = lerped.current
    L.x += (state.pointer.x * halfW - L.x) * 0.08
    L.y += (state.pointer.y * halfH - L.y) * 0.08
    uniforms.u_t.value = state.clock.elapsedTime
    uniforms.u_cur.value.set(L.x, L.y)
  })

  return <mesh geometry={geometry} material={material} rotation={[-0.28, 0, 0]} />
}

export default function GraphNeuralNetworkBackground() {
  const mask = [
    'radial-gradient(ellipse 95% 88% at 50% 46%,',
    'black 18%, rgba(0,0,0,0.4) 55%, transparent 100%)',
  ].join(' ')

  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ WebkitMaskImage: mask, maskImage: mask }}>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
        dpr={[1, 1.5]}
        style={{ background: '#000' }}
      >
        <LatticeBg />
      </Canvas>
    </div>
  )
}
