'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

// Loss Landscape as 3D Surface
function LossLandscape() {
  const meshRef = useRef<THREE.Mesh>(null!)
  const resolution = 50

  const geometry = useMemo(() => {
    const geom = new THREE.PlaneGeometry(10, 10, resolution, resolution)
    const positions = geom.attributes.position.array as Float32Array

    // Create loss landscape (multiple local minima)
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]

      // Complex loss surface with multiple minima
      const z1 = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 2
      const z2 = Math.exp(-(x * x + y * y) / 10) * 3
      const z3 = Math.sin(x * y * 0.1) * 0.5

      positions[i + 2] = z1 + z2 + z3
    }

    geom.computeVertexNormals()
    return geom
  }, [])

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 3, 0, 0]}>
      <meshStandardMaterial
        color="#06b6d4"
        wireframe
        transparent
        opacity={0.6}
        emissive="#06b6d4"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

// Optimization Trajectory
function OptimizationPath() {
  const points = useMemo(() => {
    const path: THREE.Vector3[] = []
    let x = -4, y = -4

    // Gradient descent path
    for (let i = 0; i < 100; i++) {
      const z1 = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 2
      const z2 = Math.exp(-(x * x + y * y) / 10) * 3
      const z3 = Math.sin(x * y * 0.1) * 0.5
      const z = z1 + z2 + z3 + 0.5

      path.push(new THREE.Vector3(x, y, z))

      // Gradient step
      const lr = 0.1
      x += lr * Math.cos(x * 0.5) * Math.cos(y * 0.5)
      y += lr * Math.sin(x * 0.5) * Math.sin(y * 0.5)
    }

    return path
  }, [])

  return (
    <Line
      points={points}
      color="#a855f7"
      lineWidth={3}
    />
  )
}

// Gradient Vectors
function GradientVectors() {
  const groupRef = useRef<THREE.Group>(null!)

  const vectors = useMemo(() => {
    const vecs = []
    for (let x = -4; x <= 4; x += 1.5) {
      for (let y = -4; y <= 4; y += 1.5) {
        const gx = -Math.sin(x * 0.5) * Math.cos(y * 0.5)
        const gy = -Math.sin(x * 0.5) * Math.sin(y * 0.5)
        const z1 = Math.sin(x * 0.5) * Math.cos(y * 0.5) * 2
        const z2 = Math.exp(-(x * x + y * y) / 10) * 3
        const z = z1 + z2

        vecs.push({ start: [x, y, z], direction: [gx, gy, 0] })
      }
    }
    return vecs
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const pulse = Math.sin(state.clock.getElapsedTime() * 2 + i * 0.1) * 0.2 + 1
        child.scale.set(pulse, pulse, pulse)
      })
    }
  })

  return (
    <group ref={groupRef}>
      {vectors.map((vec, i) => (
        <Line
          key={i}
          points={[
            vec.start as [number, number, number],
            [vec.start[0] + vec.direction[0], vec.start[1] + vec.direction[1], vec.start[2]] as [number, number, number]
          ]}
          color="#a855f7"
          lineWidth={2}
          transparent
          opacity={0.6}
        />
      ))}
    </group>
  )
}

export default function GradientFlowVisualization() {
  return (
    <div className="w-full h-[400px]">
      <Canvas
        camera={{ position: [8, 8, 12], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#a855f7" />

        <LossLandscape />
        <OptimizationPath />
        <GradientVectors />
      </Canvas>
    </div>
  )
}
