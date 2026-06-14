"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { GraphicsTier } from "@/lib/graphics-tier";

interface MolecularHeroCanvasProps {
  onReady: () => void;
  tier: Exclude<GraphicsTier, 0>;
}

const moleculePoints: [number, number, number][] = [
  [-1.45, 1.68, 0.05],
  [-0.72, 2.02, 0.14],
  [0.18, 2.03, -0.08],
  [1.04, 1.68, 0.04],
  [1.38, 1.02, -0.04],
  [0.78, 0.46, 0.12],
  [-0.12, 0.32, -0.05],
  [-0.94, 0.04, 0.08],
  [-1.12, -0.62, -0.1],
  [-0.42, -1.02, 0.08],
  [0.48, -1.04, -0.04],
  [1.16, -1.42, 0.08],
  [0.95, -2.05, -0.08],
  [0.08, -2.3, 0.1],
  [-0.84, -2.08, -0.05],
];

function Bond({
  end,
  start,
}: {
  end: [number, number, number];
  start: [number, number, number];
}) {
  const transform = useMemo(() => {
    const startVector = new THREE.Vector3(...start);
    const endVector = new THREE.Vector3(...end);
    const direction = endVector.clone().sub(startVector);
    const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      direction.clone().normalize(),
    );

    return {
      length: direction.length(),
      midpoint,
      quaternion,
    };
  }, [end, start]);

  return (
    <mesh
      position={transform.midpoint}
      quaternion={transform.quaternion}
    >
      <cylinderGeometry args={[0.035, 0.035, transform.length, 10]} />
      <meshStandardMaterial
        color="#8ca7b4"
        metalness={0.88}
        roughness={0.24}
      />
    </mesh>
  );
}

function MolecularMark({ tier }: { tier: Exclude<GraphicsTier, 0> }) {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    const count = tier === 2 ? 180 : 64;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const angle = index * 2.399963;
      const radius = 2.6 + ((index * 37) % 31) / 24;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = ((index * 53) % 101) / 18 - 2.8;
      values[index * 3 + 2] = Math.sin(angle) * radius * 0.65 - 0.6;
    }

    return values;
  }, [tier]);

  useFrame(({ clock, pointer }) => {
    if (!group.current) {
      return;
    }

    const scrollProgress = Math.min(
      window.scrollY / Math.max(window.innerHeight, 1),
      1,
    );
    const targetRotationX = pointer.y * 0.11 - scrollProgress * 0.08;
    const targetRotationY = pointer.x * 0.17 + scrollProgress * 0.2;

    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      targetRotationX,
      0.035,
    );
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotationY,
      0.035,
    );
    group.current.position.y =
      Math.sin(clock.elapsedTime * 0.42) * 0.055 - scrollProgress * 0.18;
  });

  return (
    <group ref={group} rotation={[0.03, -0.12, -0.08]}>
      <points rotation={[0.2, 0, 0.35]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[particles, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#16a8b8"
          opacity={tier === 2 ? 0.48 : 0.3}
          size={0.025}
          sizeAttenuation
          transparent
        />
      </points>

      <mesh rotation={[Math.PI / 2, 0.08, 0.3]}>
        <torusGeometry args={[2.55, 0.012, 8, tier === 2 ? 128 : 64]} />
        <meshBasicMaterial color="#0f708c" transparent opacity={0.42} />
      </mesh>
      <mesh rotation={[Math.PI / 2, -0.24, -0.52]}>
        <torusGeometry args={[2.12, 0.009, 8, tier === 2 ? 96 : 48]} />
        <meshBasicMaterial color="#f7941d" transparent opacity={0.28} />
      </mesh>

      {moleculePoints.slice(0, -1).map((point, index) => (
        <Bond
          end={moleculePoints[index + 1]}
          key={`bond-${index}`}
          start={point}
        />
      ))}

      {moleculePoints.map((point, index) => {
        const accent = index === 4 || index === 8 || index === 12;
        const cyan = index === 1 || index === 6 || index === 14;
        return (
          <mesh key={`node-${index}`} position={point}>
            <sphereGeometry
              args={[
                accent ? 0.19 : 0.135,
                tier === 2 ? 24 : 14,
                tier === 2 ? 24 : 14,
              ]}
            />
            <meshStandardMaterial
              color={accent ? "#f7941d" : cyan ? "#16a8b8" : "#c3d0d7"}
              emissive={accent ? "#5a2400" : cyan ? "#043e48" : "#101820"}
              emissiveIntensity={accent || cyan ? 0.85 : 0.18}
              metalness={accent ? 0.58 : 0.92}
              roughness={accent ? 0.22 : 0.16}
            />
          </mesh>
        );
      })}

      <mesh position={[0, -0.1, -0.8]} rotation={[0.08, 0.14, 0]}>
        <icosahedronGeometry args={[2.85, tier === 2 ? 2 : 1]} />
        <meshPhysicalMaterial
          color="#0b5f76"
          opacity={0.07}
          roughness={0.18}
          side={THREE.DoubleSide}
          transparent
          wireframe
        />
      </mesh>
    </group>
  );
}

export function MolecularHeroCanvas({
  onReady,
  tier,
}: MolecularHeroCanvasProps) {
  return (
    <Canvas
      camera={{ fov: 39, position: [0, 0, 8.6] }}
      dpr={tier === 2 ? [1, 1.5] : 1}
      gl={{
        alpha: true,
        antialias: tier === 2,
        powerPreference: tier === 2 ? "high-performance" : "low-power",
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        onReady();
      }}
    >
      <ambientLight intensity={0.72} />
      <directionalLight color="#d9f4ff" intensity={2.8} position={[4, 5, 7]} />
      <pointLight color="#16a8b8" intensity={38} position={[-3, 0.5, 3]} />
      <pointLight color="#f7941d" intensity={28} position={[3, -2, 2]} />
      <MolecularMark tier={tier} />
    </Canvas>
  );
}
