import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Torus, Sphere } from '@react-three/drei';
import { Suspense, useRef } from 'react';

const RotatingGroup = ({ children }) => {
  const groupRef = useRef();
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.08;
    }
  });
  return <group ref={groupRef}>{children}</group>;
};

const HeroScene3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 50 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[8, 8, 8]} intensity={1} color="#ffffff" />
      <pointLight position={[-8, -4, 4]} intensity={0.6} color="#22c55e" />
      <Suspense fallback={null}>
        <RotatingGroup>
          <Float speed={1.4} rotationIntensity={1} floatIntensity={1.8}>
            <Icosahedron args={[1.4, 0]} position={[-3, 1, 0]}>
              <MeshDistortMaterial color="#ffffff" speed={2} distort={0.4} transparent opacity={0.9} roughness={0.2} metalness={0.3} />
            </Icosahedron>
          </Float>
          <Float speed={1} rotationIntensity={1.4} floatIntensity={1.2}>
            <Torus args={[1, 0.35, 16, 100]} position={[3, -0.5, -1]}>
              <MeshDistortMaterial color="#22c55e" speed={1.5} distort={0.3} transparent opacity={0.85} roughness={0.3} metalness={0.4} />
            </Torus>
          </Float>
          <Float speed={1.7} rotationIntensity={0.9} floatIntensity={2}>
            <Sphere args={[0.7, 32, 32]} position={[2.5, 2, 1]}>
              <MeshDistortMaterial color="#f59e0b" speed={2.5} distort={0.5} transparent opacity={0.85} roughness={0.2} metalness={0.5} />
            </Sphere>
          </Float>
        </RotatingGroup>
      </Suspense>
    </Canvas>
  );
};

export default HeroScene3D;