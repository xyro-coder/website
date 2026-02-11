'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, ThreeEvent } from '@react-three/fiber'
import { Text, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

interface Skill {
  name: string
  category: 'ml' | 'backend' | 'languages'
  proficiency: number
  position: [number, number, number]
  connections: number[]
}

const skillsData: Omit<Skill, 'position' | 'connections'>[] = [
  // ML & AI
  { name: 'PyTorch', category: 'ml', proficiency: 0.95 },
  { name: 'TensorFlow', category: 'ml', proficiency: 0.85 },
  { name: 'PyTorch Lightning', category: 'ml', proficiency: 0.9 },
  { name: 'scikit-learn', category: 'ml', proficiency: 0.85 },
  { name: 'NumPy', category: 'ml', proficiency: 0.9 },
  { name: 'Pandas', category: 'ml', proficiency: 0.85 },
  // Backend
  { name: 'FastAPI', category: 'backend', proficiency: 0.9 },
  { name: 'Flask', category: 'backend', proficiency: 0.85 },
  { name: 'PostgreSQL', category: 'backend', proficiency: 0.8 },
  { name: 'Docker', category: 'backend', proficiency: 0.85 },
  { name: 'AWS', category: 'backend', proficiency: 0.8 },
  // Languages
  { name: 'Python', category: 'languages', proficiency: 0.95 },
  { name: 'TypeScript', category: 'languages', proficiency: 0.85 },
  { name: 'JavaScript', category: 'languages', proficiency: 0.85 },
  { name: 'C++', category: 'languages', proficiency: 0.75 },
  { name: 'Java', category: 'languages', proficiency: 0.8 },
]

function SkillNode({ skill, onClick, isSelected }: {
  skill: Skill
  onClick: () => void
  isSelected: boolean
}) {
  const meshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  const color = skill.category === 'ml' ? '#06b6d4' :
                skill.category === 'backend' ? '#a855f7' : '#f59e0b'

  const size = 0.3 + skill.proficiency * 0.7

  useFrame((state) => {
    if (meshRef.current) {
      const scale = (hovered || isSelected) ? 1.3 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)

      if (isSelected) {
        meshRef.current.rotation.y = state.clock.getElapsedTime() * 2
      }
    }
  })

  return (
    <group position={skill.position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <octahedronGeometry args={[size, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.2}
          transparent
          opacity={isSelected ? 1 : hovered ? 0.9 : 0.8}
        />
      </mesh>

      {(hovered || isSelected) && (
        <Text
          position={[0, size + 0.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {skill.name}
        </Text>
      )}
    </group>
  )
}

function SkillConnections({ skills, selectedIndex }: {
  skills: Skill[]
  selectedIndex: number | null
}) {
  if (selectedIndex === null) return null

  const selectedSkill = skills[selectedIndex]

  return (
    <>
      {selectedSkill.connections.map(targetIndex => {
        const target = skills[targetIndex]
        return (
          <line key={`${selectedIndex}-${targetIndex}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([
                  ...selectedSkill.position,
                  ...target.position
                ])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#06b6d4" transparent opacity={0.6} linewidth={2} />
          </line>
        )
      })}
    </>
  )
}

function SkillsScene() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const skills = useMemo((): Skill[] => {
    const categoryPositions = {
      ml: { x: -4, y: 2, z: 0 },
      backend: { x: 4, y: 2, z: 0 },
      languages: { x: 0, y: -2, z: 0 },
    }

    return skillsData.map((skill, index) => {
      const center = categoryPositions[skill.category]
      const angle = (index * 2 * Math.PI) / skillsData.length
      const radius = 2

      return {
        ...skill,
        position: [
          center.x + Math.cos(angle) * radius,
          center.y + Math.sin(angle) * radius,
          center.z + (Math.random() - 0.5) * 2
        ] as [number, number, number],
        connections: skillsData
          .map((_, i) => i)
          .filter(i => i !== index && Math.random() < 0.3)
          .slice(0, 3)
      }
    })
  }, [])

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#06b6d4" />
      <pointLight position={[-10, -10, 10]} intensity={0.5} color="#a855f7" />

      {skills.map((skill, index) => (
        <SkillNode
          key={skill.name}
          skill={skill}
          onClick={() => setSelectedIndex(index === selectedIndex ? null : index)}
          isSelected={index === selectedIndex}
        />
      ))}

      <SkillConnections skills={skills} selectedIndex={selectedIndex} />

      {/* Category labels */}
      <Text position={[-4, 4, 0]} fontSize={0.5} color="#06b6d4">
        ML & AI
      </Text>
      <Text position={[4, 4, 0]} fontSize={0.5} color="#a855f7">
        Backend
      </Text>
      <Text position={[0, -4, 0]} fontSize={0.5} color="#f59e0b">
        Languages
      </Text>
    </>
  )
}

export default function Skills3DCluster() {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <color attach="background" args={['transparent']} />
        <SkillsScene />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={8}
          maxDistance={20}
        />
      </Canvas>
      <div className="text-center mt-4 text-text-muted text-sm">
        Click on skills to see connections • Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
