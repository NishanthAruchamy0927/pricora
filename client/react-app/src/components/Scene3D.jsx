import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Icosahedron, Torus, Octahedron } from '@react-three/drei';
import { Suspense } from 'react';

const FloatingShape = ({ position, color, geometry, scale = 1, speed = 1 }) => {
  const Shape = geometry;
  return (
    <Float speed={speed} rotationIntensity={1.2} floatIntensity={1.5}>
      <Shape args={geometry === Torus ? [1, 0.35, 16, 100] : [1, 1]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          speed={2}
          distort={0.35}
          radius={1}
          transparent
          opacity={0.28}
        />
      </Shape>
    </Float>
  );
};

const Scene3D = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <Suspense fallback={null}>
        <FloatingShape position={[-4, 2, -2]} color="#4f46e5" geometry={Icosahedron} scale={1.1} speed={1.2} />
        <FloatingShape position={[4, -1.5, -3]} color="#22c55e" geometry={Torus} scale={0.9} speed={0.9} />
        <FloatingShape position={[3.5, 2.5, -4]} color="#f59e0b" geometry={Octahedron} scale={0.8} speed={1.5} />
        <FloatingShape position={[-3.5, -2, -3]} color="#4f46e5" geometry={Octahedron} scale={0.7} speed={1.1} />
      </Suspense>
    </Canvas>
  );
};

export default Scene3D;