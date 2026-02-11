'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text, Line, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface TimelineEvent {
  title: string
  organization: string
  date: string
  position: [number, number, number]
  color: string
}

function HelixTimeline() {
  const groupRef = useRef<THREE.Group>(null!)

  const events = useMemo((): TimelineEvent[] => {
    const items = [
      { title: 'Research Fellow', organization: 'Algoverse AI', date: 'Sep 2025 - Present', color: '#06b6d4' },
      { title: 'AI Engineering Intern', organization: 'Outamation', date: 'Jan 2025 - Mar 2025', color: '#a855f7' },
      { title: 'Started at UW', organization: 'Allen School', date: 'Sep 2023', color: '#06b6d4' },
    ]

    return items.map((item, i) => {
      const angle = (i / items.length) * Math.PI * 4
      const radius = 3
      const height = i * 3

      return {
        ...item,
        position: [
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ] as [number, number, number]
      }
    })
  }, [])

  // Create helix curve
  const helixPoints = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 100; i++) {
      const t = i / 100
      const angle = t * Math.PI * 4
      const radius = 3
      const height = t * (events.length - 1) * 3

      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      ))
    }
    return points
  }, [events.length])

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={[0, -4, 0]}>
      {/* Helix spine */}
      <Line
        points={helixPoints}
        color="#06b6d4"
        lineWidth={2}
        transparent
        opacity={0.6}
      />

      {/* Timeline events */}
      {events.map((event, i) => (
        <group key={i} position={event.position}>
          {/* Event marker */}
          <mesh>
            <sphereGeometry args={[0.3, 16, 16]} />
            <meshStandardMaterial
              color={event.color}
              emissive={event.color}
              emissiveIntensity={0.5}
            />
          </mesh>

          {/* Connection line to helix */}
          <Line
            points={[[0, 0, 0], [0, -event.position[1], 0]]}
            color={event.color}
            lineWidth={1}
            transparent
            opacity={0.3}
          />

          {/* Labels */}
          <Text
            position={[1.5, 0, 0]}
            fontSize={0.4}
            color="white"
            anchorX="left"
            anchorY="middle"
          >
            {event.title}
          </Text>
          <Text
            position={[1.5, -0.5, 0]}
            fontSize={0.25}
            color={event.color}
            anchorX="left"
            anchorY="middle"
          >
            {event.organization}
          </Text>
          <Text
            position={[1.5, -0.9, 0]}
            fontSize={0.2}
            color="#94a3b8"
            anchorX="left"
            anchorY="middle"
          >
            {event.date}
          </Text>
        </group>
      ))}

      {/* Connecting rings at each level */}
      {events.map((event, i) => (
        <mesh key={`ring-${i}`} position={[0, event.position[1], 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[3, 0.05, 8, 32]} />
          <meshStandardMaterial
            color={event.color}
            transparent
            opacity={0.2}
            emissive={event.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function ExperienceHelix() {
  return (
    <div className="w-full h-[500px]">
      <Canvas
        camera={{ position: [8, 4, 8], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#a855f7" />

        <HelixTimeline />

        <OrbitControls
          enableZoom={true}
          minDistance={6}
          maxDistance={15}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
