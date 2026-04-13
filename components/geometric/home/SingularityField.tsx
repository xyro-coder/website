'use client'

import { useEffect, useRef } from 'react'

// ─── 40 × 28 × 8 = 8960 points ───────────────────────────────────────────────
// Pure WebGL2 — no library dependency, guaranteed to render.
// Vertex shader: Y-axis rotation + refractive lens push in NDC.
// Fragment shader: Gaussian disc sprite, cyan→purple by depth/lens.
// AdditiveBlending via gl.blendFunc(SRC_ALPHA, ONE).

const GX = 40, GY = 28, GZ = 8
const SXY = 0.10, SZ = 0.38
const N   = GX * GY * GZ   // 8 960

const VERT = `#version 300 es
precision highp float;

uniform vec2  u_cursor;
uniform float u_radius;
uniform float u_strength;
uniform float u_time;
uniform float u_aspect;
uniform float u_vph;

out float v_defocus;
out float v_lens;
out float v_tz;

const float PI = 3.14159265;

void main() {
  // Unpack grid index → 3D lattice position
  int idx = gl_VertexID;
  int iz  = idx / (${GX} * ${GY});
  int rem = idx - iz * (${GX} * ${GY});
  int iy  = rem / ${GX};
  int ix  = rem - iy * ${GX};

  float x = (float(ix) - float(${GX}-1)*0.5) * ${SXY.toFixed(4)};
  float y = (float(iy) - float(${GY}-1)*0.5) * ${SXY.toFixed(4)};
  float z = (float(iz) - float(${GZ}-1)*0.5) * ${SZ.toFixed(4)};

  // Slow Y-axis auto-rotation
  float ry   = u_time * 0.10;
  float cosR = cos(ry), sinR = sin(ry);
  float rx   = x * cosR + z * sinR;
  float rz   = -x * sinR + z * cosR;

  // Perspective projection (fov ~55°, camera at z=5)
  float camZ  = 5.0;
  float fov   = 0.95;   // tan(fov/2)
  float depth = camZ - rz;
  vec2  ndc   = vec2(rx / (depth * fov * u_aspect),
                     y  / (depth * fov));

  // ── Refractive lens ──────────────────────────────────────────────────────
  vec2  delta    = ndc - u_cursor;
  float dist     = length(delta);
  float distNorm = clamp(dist / u_radius, 0.0, 1.0);
  v_lens = max(0.0, 1.0 - distNorm) * step(dist, u_radius);

  if (dist < u_radius) {
    float t    = 1.0 - distNorm;
    float push = sin(t * PI * 0.5) * u_strength;
    vec2  dir  = dist > 0.001 ? normalize(delta) : vec2(1.0, 0.0);
    ndc += dir * push;
  }

  gl_Position = vec4(ndc, 0.0, 1.0);

  // ── DoF ──────────────────────────────────────────────────────────────────
  float zDist = max(0.0, abs(z) - ${SZ.toFixed(4)} * 0.5);
  v_defocus   = clamp(zDist / (${SZ.toFixed(4)} * 2.8), 0.0, 1.0);
  v_tz        = z;   // sign: positive = front, negative = back

  // Perspective-correct point size
  float worldR = 0.008 + v_defocus * 0.068 + v_lens * 0.022;
  gl_PointSize = max(1.2, worldR * u_vph / depth);
}
`

const FRAG = `#version 300 es
precision mediump float;

in float v_defocus;
in float v_lens;
in float v_tz;

out vec4 o;

void main() {
  vec2  pc = gl_PointCoord - 0.5;
  float r  = length(pc) * 2.0;
  if (r > 1.0) discard;

  float sigma = mix(3.8, 1.0, v_defocus);
  float disc  = exp(-r * r * sigma);

  // Cyan (focal/in-lens) → purple (deep/far)
  float t      = clamp(v_defocus * 0.8 + (1.0 - v_lens) * 0.4, 0.0, 1.0);
  vec3  cyan   = vec3(0.05, 0.82, 0.95);
  vec3  purple = vec3(0.42, 0.16, 0.72);
  vec3  col    = mix(cyan, purple, t);

  float bright = 1.0 + v_lens * 1.8;
  float alpha  = disc * mix(0.85, 0.18, v_defocus) * bright;
  if (alpha < 0.015) discard;

  o = vec4(col * bright, clamp(alpha, 0.0, 1.0));
}
`

function mkShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s))
    return null
  }
  return s
}

function mkProg(gl: WebGL2RenderingContext, vert: string, frag: string) {
  const v = mkShader(gl, gl.VERTEX_SHADER, vert)!
  const f = mkShader(gl, gl.FRAGMENT_SHADER, frag)!
  const p = gl.createProgram()!
  gl.attachShader(p, v); gl.attachShader(p, f)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p))
    return null
  }
  gl.deleteShader(v); gl.deleteShader(f)
  return p
}

export default function SingularityField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cursorRef = useRef({ x: 0.0, y: 0.0 })
  const lerpedRef = useRef({ x: 0.0, y: 0.0 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const gl = canvas.getContext('webgl2', { alpha: false, antialias: false })
    if (!gl) { console.error('WebGL2 not available'); return }

    const pr = Math.min(window.devicePixelRatio, 2)

    const resize = () => {
      canvas.width  = canvas.clientWidth  * pr
      canvas.height = canvas.clientHeight * pr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener('resize', resize)

    const prog = mkProg(gl, VERT, FRAG)
    if (!prog) return

    const ul = {
      cursor:   gl.getUniformLocation(prog, 'u_cursor'),
      radius:   gl.getUniformLocation(prog, 'u_radius'),
      strength: gl.getUniformLocation(prog, 'u_strength'),
      time:     gl.getUniformLocation(prog, 'u_time'),
      aspect:   gl.getUniformLocation(prog, 'u_aspect'),
      vph:      gl.getUniformLocation(prog, 'u_vph'),
    }

    // Use a dummy VAO — gl_VertexID needs no buffer
    const vao = gl.createVertexArray()!
    gl.bindVertexArray(vao)

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)   // additive blending = natural glow
    gl.disable(gl.DEPTH_TEST)

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      cursorRef.current.x =  ((e.clientX - r.left)  / r.width)  * 2 - 1
      cursorRef.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1)
    }
    window.addEventListener('mousemove', onMove)

    let raf: number
    let isVisible = true
    const obs = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    obs.observe(canvas)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (!isVisible) return

      // Lerp cursor
      const C = cursorRef.current
      const L = lerpedRef.current
      L.x += (C.x - L.x) * 0.10
      L.y += (C.y - L.y) * 0.10

      const W = canvas.width, H = canvas.height
      gl.viewport(0, 0, W, H)
      gl.clearColor(0, 0, 0, 1)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(prog)
      gl.uniform2f(ul.cursor,   L.x, L.y)
      gl.uniform1f(ul.radius,   0.30)
      gl.uniform1f(ul.strength, 0.40)
      gl.uniform1f(ul.time,     t * 0.001)
      gl.uniform1f(ul.aspect,   W / H)
      gl.uniform1f(ul.vph,      H * 0.5)

      gl.drawArrays(gl.POINTS, 0, N)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      gl.deleteProgram(prog)
      gl.deleteVertexArray(vao)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        display: 'block',
        WebkitMaskImage: 'radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, rgba(0,0,0,0.55) 55%, transparent 100%)',
        maskImage:       'radial-gradient(ellipse 90% 80% at 50% 50%, black 20%, rgba(0,0,0,0.55) 55%, transparent 100%)',
      }}
    />
  )
}
