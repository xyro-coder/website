'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

// Sparse Autoencoder Feature Space - Main Hero Visualization
function FeatureVectors() {
  const groupRef = useRef<THREE.Group>(null!)
  const lineCount = 500 // Sparse feature directions

  const { positions, colors, activations } = useMemo(() => {
    const pos: THREE.Vector3[] = []
    const col: THREE.Color[] = []
    const act: number[] = []

    for (let i = 0; i < lineCount; i++) {
      // Random direction (feature direction in latent space)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 3 + Math.random() * 2

      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.sin(phi) * Math.sin(theta)
      const z = r * Math.cos(phi)

      pos.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, y, z))

      // Activation strength (sparse - most near zero)
      const activation = Math.random() < 0.1 ? Math.random() : Math.random() * 0.2
      act.push(activation)

      // Color by activation (cyan = active, purple = inactive)
      const color = activation > 0.5
        ? new THREE.Color('#06b6d4')
        : new THREE.Color('#a855f7').lerp(new THREE.Color('#1e293b'), 1 - activation * 2)

      col.push(color, color)
    }

    return { positions: pos, colors: col, activations: act }
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.1
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => {
        if (i % 2 === 1) return null
        const endPos = positions[i + 1]
        const activation = activations[Math.floor(i / 2)]

        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  pos.x, pos.y, pos.z,
                  endPos.x, endPos.y, endPos.z
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={colors[i]}
              transparent
              opacity={0.3 + activation * 0.7}
              linewidth={1 + activation * 2}
            />
          </line>
        )
      })}

      {/* Central origin sphere */}
      <mesh>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#06b6d4"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

// Top-K Selection Visualization
function TopKSelection() {
  const spheresRef = useRef<THREE.Group>(null!)
  const count = 50

  const positions = useMemo(() => {
    return Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8,
      active: Math.random() < 0.15, // Top-k = 15%
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame((state) => {
    if (spheresRef.current) {
      spheresRef.current.children.forEach((child, i) => {
        const pos = positions[i]
        const pulse = Math.sin(state.clock.getElapsedTime() * 2 + pos.phase) * 0.1 + 1
        child.scale.setScalar(pos.active ? pulse : 0.5)
      })
    }
  })

  return (
    <group ref={spheresRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y, pos.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color={pos.active ? '#06b6d4' : '#a855f7'}
            emissive={pos.active ? '#06b6d4' : '#a855f7'}
            emissiveIntensity={pos.active ? 0.8 : 0.2}
            transparent
            opacity={pos.active ? 1 : 0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function SparseAutoencoderFeatureSpace() {
  return (
    <div className="w-full h-[500px] md:h-[600px]">
      <Canvas
        camera={{ position: [6, 4, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />

        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#a855f7" />

        <FeatureVectors />
        <TopKSelection />

        <OrbitControls
          enableZoom={true}
          enablePan={true}
          autoRotate
          autoRotateSpeed={0.5}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  )
}
