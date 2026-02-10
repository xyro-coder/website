'use client'

import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei'
import * as THREE from 'three'

// Main rotating icosahedron with enhanced effects
function MainIcosahedron() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const edgesRef = useRef<THREE.LineSegments>(null!)

  // Animate rotation (SO(3) equivariance)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.15
      meshRef.current.rotation.y = t * 0.25
      meshRef.current.rotation.z = t * 0.1
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.x = t * 0.15
      edgesRef.current.rotation.y = t * 0.25
      edgesRef.current.rotation.z = t * 0.1
    }
  })

  return (
    <group>
      {/* Main icosahedron with distortion */}
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[3, 1]} />
        <MeshDistortMaterial
          color="#06b6d4"
          transparent
          opacity={0.7}
          distort={0.3}
          speed={2}
          emissive="#06b6d4"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Wireframe edges */}
      <lineSegments ref={edgesRef}>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(3, 1)]} />
        <lineBasicMaterial color="#a855f7" linewidth={3} />
      </lineSegments>
    </group>
  )
}

// Multiple orbiting polyhedrons
function OrbitingPolyhedrons() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  const polyhedrons = [
    { position: [5, 0, 0], color: '#06b6d4', geometry: 'octahedron' },
    { position: [-5, 0, 0], color: '#a855f7', geometry: 'tetrahedron' },
    { position: [0, 5, 0], color: '#06b6d4', geometry: 'dodecahedron' },
    { position: [0, -5, 0], color: '#a855f7', geometry: 'octahedron' },
  ]

  return (
    <group ref={groupRef}>
      {polyhedrons.map((poly, i) => (
        <mesh key={i} position={poly.position as [number, number, number]}>
          {poly.geometry === 'octahedron' && <octahedronGeometry args={[0.5]} />}
          {poly.geometry === 'tetrahedron' && <tetrahedronGeometry args={[0.5]} />}
          {poly.geometry === 'dodecahedron' && <dodecahedronGeometry args={[0.5]} />}
          <meshStandardMaterial
            color={poly.color}
            transparent
            opacity={0.8}
            emissive={poly.color}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

// Enhanced particle system with geometric patterns
function EnhancedParticleField() {
  const particlesRef = useRef<THREE.Points>(null!)
  const particleCount = 1000 // 5x more particles

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3)
    const col = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      // Create spherical distribution
      const radius = 8 + Math.random() * 4
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = radius * Math.cos(phi)

      // Alternate colors
      const color = i % 2 === 0 ? new THREE.Color('#06b6d4') : new THREE.Color('#a855f7')
      col[i * 3] = color.r
      col[i * 3 + 1] = color.g
      col[i * 3 + 2] = color.b
    }
    return { positions: pos, colors: col }
  }, [])

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.08
      particlesRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.2
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
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  )
}

// Torus knot representing manifold structure
function ManifoldTorus() {
  const torusRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (torusRef.current) {
      torusRef.current.rotation.x = state.clock.getElapsedTime() * 0.2
      torusRef.current.rotation.y = state.clock.getElapsedTime() * 0.3
    }
  })

  return (
    <mesh ref={torusRef}>
      <torusKnotGeometry args={[2, 0.3, 128, 32]} />
      <meshStandardMaterial
        color="#a855f7"
        transparent
        opacity={0.3}
        wireframe
        emissive="#a855f7"
        emissiveIntensity={0.2}
      />
    </mesh>
  )
}

// Pulsating spheres representing feature activations
function FeatureSpheres() {
  const count = 12
  const positions = useMemo(() => {
    const t = (1.0 + Math.sqrt(5.0)) / 2.0
    return [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ].map(([x, y, z]) => {
      const scale = 4 / Math.sqrt(x * x + y * y + z * z)
      return [x * scale, y * scale, z * scale]
    })
  }, [])

  return (
    <>
      {positions.map((pos, i) => (
        <PulsatingSphere key={i} position={pos as [number, number, number]} delay={i * 0.1} />
      ))}
    </>
  )
}

function PulsatingSphere({ position, delay }: { position: [number, number, number], delay: number }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2 + delay) * 0.3
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color="#a855f7"
        emissive="#a855f7"
        emissiveIntensity={0.6}
      />
    </mesh>
  )
}

export default function EnhancedHeroScene() {
  return (
    <div className="w-full h-[800px] md:h-[900px] lg:h-[1000px]">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
        <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} />

        {/* Background stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

        {/* Main geometric elements */}
        <MainIcosahedron />
        <OrbitingPolyhedrons />
        <ManifoldTorus />
        <FeatureSpheres />
        <EnhancedParticleField />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.3}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>
    </div>
  )
}
