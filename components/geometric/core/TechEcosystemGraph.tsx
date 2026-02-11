'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface TechNode {
  name: string
  category: 'ml' | 'backend' | 'frontend' | 'devops'
  position: [number, number, number]
  connections: number[]
}

function TechGraph() {
  const groupRef = useRef<THREE.Group>(null!)

  const technologies = useMemo(() => {
    const techs = [
      { name: 'PyTorch', category: 'ml' as const },
      { name: 'TensorFlow', category: 'ml' as const },
      { name: 'scikit-learn', category: 'ml' as const },
      { name: 'NumPy', category: 'ml' as const },
      { name: 'FastAPI', category: 'backend' as const },
      { name: 'Flask', category: 'backend' as const },
      { name: 'PostgreSQL', category: 'backend' as const },
      { name: 'Docker', category: 'devops' as const },
      { name: 'AWS', category: 'devops' as const },
      { name: 'Next.js', category: 'frontend' as const },
      { name: 'React', category: 'frontend' as const },
    ]

    const categoryPositions = {
      ml: { center: [-4, 3, 0], radius: 2 },
      backend: { center: [4, 3, 0], radius: 2 },
      frontend: { center: [-4, -3, 0], radius: 2 },
      devops: { center: [4, -3, 0], radius: 2 },
    }

    const nodes: TechNode[] = techs.map((tech, index) => {
      const catTechs = techs.filter(t => t.category === tech.category)
      const catIndex = catTechs.findIndex(t => t.name === tech.name)
      const { center, radius } = categoryPositions[tech.category]

      const angle = (catIndex / catTechs.length) * Math.PI * 2

      return {
        name: tech.name,
        category: tech.category,
        position: [
          center[0] + Math.cos(angle) * radius,
          center[1] + Math.sin(angle) * radius,
          center[2] + (Math.random() - 0.5)
        ] as [number, number, number],
        connections: techs
          .map((_, i) => i)
          .filter(i => i !== index && (
            // Connect within category
            techs[i].category === tech.category ||
            // Connect across related categories
            (tech.category === 'ml' && techs[i].category === 'backend') ||
            (tech.category === 'backend' && techs[i].category === 'devops') ||
            (tech.category === 'frontend' && techs[i].category === 'backend')
          ))
          .filter(() => Math.random() < 0.4)
      }
    })

    return nodes
  }, [])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3
    }
  })

  const getColor = (category: string) => {
    const colors = {
      ml: '#06b6d4',
      backend: '#a855f7',
      frontend: '#f59e0b',
      devops: '#10b981',
    }
    return colors[category as keyof typeof colors]
  }

  return (
    <group ref={groupRef}>
      {/* Draw connections */}
      {technologies.map((node, i) => (
        <group key={`connections-${i}`}>
          {node.connections.map(targetIndex => {
            const target = technologies[targetIndex]
            return (
              <Line
                key={`${i}-${targetIndex}`}
                points={[node.position, target.position]}
                color="#06b6d4"
                lineWidth={1}
                transparent
                opacity={0.3}
              />
            )
          })}
        </group>
      ))}

      {/* Draw nodes */}
      {technologies.map((node, i) => (
        <group key={i} position={node.position}>
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={getColor(node.category)}
              emissive={getColor(node.category)}
              emissiveIntensity={0.5}
            />
          </mesh>
          <Text
            position={[0, -0.7, 0]}
            fontSize={0.3}
            color="white"
            anchorX="center"
            anchorY="middle"
          >
            {node.name}
          </Text>
        </group>
      ))}

      {/* Category labels */}
      <Text position={[-4, 5, 0]} fontSize={0.5} color="#06b6d4">ML & AI</Text>
      <Text position={[4, 5, 0]} fontSize={0.5} color="#a855f7">Backend</Text>
      <Text position={[-4, -5, 0]} fontSize={0.5} color="#f59e0b">Frontend</Text>
      <Text position={[4, -5, 0]} fontSize={0.5} color="#10b981">DevOps</Text>
    </group>
  )
}

export default function TechEcosystemGraph() {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, -10, 10]} intensity={0.5} color="#a855f7" />

        <TechGraph />

        <OrbitControls
          enableZoom={true}
          minDistance={10}
          maxDistance={25}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
