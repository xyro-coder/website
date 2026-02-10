'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Rotating icosahedron representing sparse autoencoder feature directions
function Icosahedron() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const edgesRef = useRef<THREE.LineSegments>(null!)

  // Create vertices for icosahedron (12 vertices)
  const vertices = useMemo(() => {
    const t = (1.0 + Math.sqrt(5.0)) / 2.0
    return new Float32Array([
      -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t, 0,
      0, -1, t, 0, 1, t, 0, -1, -t, 0, 1, -t,
      t, 0, -1, t, 0, 1, -t, 0, -1, -t, 0, 1,
    ])
  }, [])

  // Animate rotation (SO(3) equivariance)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.2
      meshRef.current.rotation.y = t * 0.3
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x = t * 0.2
      edgesRef.current.rotation.y = t * 0.3
    }
  })

  return (
    <group>
      {/* Main icosahedron */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 0]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.6}
          wireframe={false}
          emissive="#06b6d4"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(2, 0)]} />
        <lineBasicMaterial color="#a855f7" linewidth={2} />
      </lineSegments>

      {/* Feature direction points (vertices) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const x = vertices[i * 3]
        const y = vertices[i * 3 + 1]
        const z = vertices[i * 3 + 2]
        const scale = 2 / Math.sqrt(x * x + y * y + z * z)

        return (
          <Sphere key={i} args={[0.08, 16, 16]} position={[x * scale, y * scale, z * scale]}>
            <meshStandardMaterial
              color="#a855f7"
              emissive="#a855f7"
              emissiveIntensity={0.5}
            />
          </Sphere>
        )
      })}
    </group>
  )
}

// Particle system representing high-dimensional data
function ParticleField() {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 200

  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return pos
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function HeroScene() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        <Icosahedron />
        <ParticleField />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
