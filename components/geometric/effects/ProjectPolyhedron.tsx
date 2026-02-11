'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ProjectPolyhedronProps {
  type: 'octahedron' | 'icosahedron' | 'dodecahedron' | 'tetrahedron' | 'cube'
  color?: string
  size?: number
}

function RotatingPolyhedron({ type, color = '#06b6d4', size = 1 }: ProjectPolyhedronProps) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5

      // Gentle float
      meshRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.2
    }
  })

  const geometryMap = {
    octahedron: <octahedronGeometry args={[size, 0]} />,
    icosahedron: <icosahedronGeometry args={[size, 0]} />,
    dodecahedron: <dodecahedronGeometry args={[size, 0]} />,
    tetrahedron: <tetrahedronGeometry args={[size, 0]} />,
    cube: <boxGeometry args={[size * 1.5, size * 1.5, size * 1.5]} />,
  }

  return (
    <mesh ref={meshRef}>
      {geometryMap[type]}
      <meshStandardMaterial
        color={color}
        wireframe
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

export default function ProjectPolyhedron({ type, color, size }: ProjectPolyhedronProps) {
  return (
    <div className="w-full h-[200px]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={color} />
        <RotatingPolyhedron type={type} color={color} size={size} />
      </Canvas>
    </div>
  )
}
