import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

interface GameTableProps {
  tableId: string;
  type: "rectangle" | "circle" | "hexagon" | "pentagon" | "square";
  position: [number, number, number];
  name: string;
  seats: number;
  status: "available" | "booked" | "current";
  onSeatClick: (tableId: string, seatId: string, tableName: string, seatNumber: number) => void;
  onTableClick: (tableId: string, tableName: string) => void;
}

const statusColors = {
  available: "#22c55e", // green
  booked: "#ef4444",    // red
  current: "#f59e0b"    // amber
};

function getTableGeometry(type: string) {
  switch (type) {
    case "rectangle":
      return <boxGeometry args={[2, 0.1, 1.2]} />;
    case "square":
      return <boxGeometry args={[1.5, 0.1, 1.5]} />;
    case "circle":
      return <cylinderGeometry args={[0.8, 0.8, 0.1, 16]} />;
    case "hexagon":
      return <cylinderGeometry args={[0.9, 0.9, 0.1, 6]} />;
    case "pentagon":
      return <cylinderGeometry args={[0.8, 0.8, 0.1, 5]} />;
    default:
      return <boxGeometry args={[2, 0.1, 1.2]} />;
  }
}

function getSeatPositions(type: string, seats: number): [number, number, number][] {
  const positions: [number, number, number][] = [];
  
  switch (type) {
    case "rectangle":
      return [
        [-0.8, 0.3, 0],   // left
        [0.8, 0.3, 0],    // right
        [0, 0.3, -0.5],   // back
        [0, 0.3, 0.5]     // front
      ];
    case "square":
      return [
        [-0.6, 0.3, -0.6], // back-left
        [0.6, 0.3, -0.6],  // back-right
        [-0.6, 0.3, 0.6],  // front-left
        [0.6, 0.3, 0.6]    // front-right
      ];
    case "circle":
      for (let i = 0; i < seats; i++) {
        const angle = (i * 2 * Math.PI) / seats;
        positions.push([
          Math.cos(angle) * 1.1,
          0.3,
          Math.sin(angle) * 1.1
        ]);
      }
      return positions;
    case "hexagon":
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        positions.push([
          Math.cos(angle) * 1.2,
          0.3,
          Math.sin(angle) * 1.2
        ]);
      }
      return positions;
    case "pentagon":
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5;
        positions.push([
          Math.cos(angle) * 1.1,
          0.3,
          Math.sin(angle) * 1.1
        ]);
      }
      return positions;
    default:
      return positions;
  }
}

function Seat({ 
  position, 
  seatNumber, 
  tableId, 
  tableName, 
  status, 
  onSeatClick 
}: { 
  position: [number, number, number];
  seatNumber: number;
  tableId: string;
  tableName: string;
  status: "available" | "booked" | "current";
  onSeatClick: (tableId: string, seatId: string, tableName: string, seatNumber: number) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const backrestRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current && backrestRef.current) {
      const scale = hovered ? 1.15 : 1;
      meshRef.current.scale.setScalar(scale);
      backrestRef.current.scale.setScalar(scale);
      
      // Add subtle floating animation when hovered
      if (hovered) {
        const float = Math.sin(state.clock.elapsedTime * 3) * 0.02;
        meshRef.current.position.y = 0.05 + float;
        backrestRef.current.position.y = 0.25 + float;
      } else {
        meshRef.current.position.y = 0.05;
        backrestRef.current.position.y = 0.25;
      }
    }
  });

  const handleClick = () => {
    if (status === "available") {
      onSeatClick(tableId, `seat-${seatNumber}`, tableName, seatNumber);
    }
  };

  const getSeatColor = () => {
    if (status === "available") {
      return hovered ? "#00d4ff" : "#1a73e8";
    }
    return status === "booked" ? "#ff4757" : "#ffa726";
  };

  const getEmissiveColor = () => {
    if (status === "available" && hovered) return "#0099cc";
    if (status === "current") return "#ff6b35";
    return "#000000";
  };

  return (
    <group position={position}>
      {/* Chair seat - more realistic proportions */}
      <mesh
        ref={meshRef}
        position={[0, 0.05, 0]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.3, 0.1, 0.3]} />
        <meshStandardMaterial 
          color={getSeatColor()}
          metalness={0.2}
          roughness={0.3}
          emissive={getEmissiveColor()}
          emissiveIntensity={hovered ? 0.3 : status === "current" ? 0.1 : 0}
        />
      </mesh>

      {/* Chair backrest */}
      <mesh
        ref={backrestRef}
        position={[0, 0.25, -0.12]}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
      >
        <boxGeometry args={[0.28, 0.3, 0.05]} />
        <meshStandardMaterial 
          color={getSeatColor()}
          metalness={0.2}
          roughness={0.3}
          emissive={getEmissiveColor()}
          emissiveIntensity={hovered ? 0.3 : status === "current" ? 0.1 : 0}
        />
      </mesh>

      {/* Chair legs */}
      {[
        [-0.12, -0.05, -0.12],
        [0.12, -0.05, -0.12],
        [-0.12, -0.05, 0.12],
        [0.12, -0.05, 0.12]
      ].map((legPos, index) => (
        <mesh
          key={index}
          position={legPos as [number, number, number]}
          castShadow
        >
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial 
            color="#2c3e50"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}

      {/* Seat number with better styling */}
      <Text
        position={[0, 0.12, 0]}
        fontSize={0.06}
        color={status === "available" ? "#ffffff" : "#000000"}
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {seatNumber}
      </Text>

      {/* Status indicator ring */}
      {status !== "available" && (
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.18, 0.22, 16]} />
          <meshStandardMaterial 
            color={status === "booked" ? "#ff4757" : "#ffa726"}
            emissive={status === "booked" ? "#ff4757" : "#ffa726"}
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
}

export function GameTable({ 
  tableId, 
  type, 
  position, 
  name, 
  seats, 
  status, 
  onSeatClick, 
  onTableClick 
}: GameTableProps) {
  const tableRef = useRef<THREE.Mesh>(null);
  const tableBaseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const seatPositions = getSeatPositions(type, seats);

  useFrame((state) => {
    if (tableRef.current && tableBaseRef.current) {
      const hoverOffset = hovered ? 0.03 : 0;
      tableRef.current.position.y = position[1] + 0.05 + hoverOffset;
      tableBaseRef.current.position.y = position[1] - 0.35;

      // Add subtle glow animation for current status
      if (status === "current" && tableRef.current.material instanceof THREE.MeshStandardMaterial) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.1 + 0.2;
        tableRef.current.material.emissiveIntensity = pulse;
      }
    }
  });

  const handleTableClick = () => {
    onTableClick(tableId, name);
  };

  const getTableColor = () => {
    switch (status) {
      case "available": return hovered ? "#2ecc71" : "#27ae60";
      case "booked": return "#e74c3c";
      case "current": return "#f39c12";
      default: return "#27ae60";
    }
  };

  const getTableMaterial = () => {
    return {
      color: getTableColor(),
      metalness: 0.3,
      roughness: 0.1,
      emissive: status === "current" ? "#f39c12" : (hovered ? getTableColor() : "#000000"),
      emissiveIntensity: status === "current" ? 0.2 : (hovered ? 0.15 : 0)
    };
  };

  return (
    <group position={position}>
      {/* Table base/pedestal */}
      <mesh
        ref={tableBaseRef}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.3, 0.4, 0.7, 16]} />
        <meshStandardMaterial 
          color="#34495e"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Table surface with improved styling */}
      <mesh
        ref={tableRef}
        position={[0, 0.05, 0]}
        onClick={handleTableClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        {getTableGeometry(type)}
        <meshStandardMaterial {...getTableMaterial()} />
      </mesh>

      {/* Table edge/border for better definition */}
      <mesh
        position={[0, 0.055, 0]}
        onClick={handleTableClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {type === "circle" ? (
          <torusGeometry args={[0.8, 0.03, 8, 32]} />
        ) : type === "hexagon" ? (
          <torusGeometry args={[0.9, 0.03, 6, 32]} />
        ) : type === "pentagon" ? (
          <torusGeometry args={[0.8, 0.03, 5, 32]} />
        ) : (
          <boxGeometry args={type === "square" ? [1.53, 0.02, 1.53] : [2.03, 0.02, 1.23]} />
        )}
        <meshStandardMaterial 
          color="#2c3e50"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Table name with better styling */}
      <Text
        position={[0, 0.18, 0]}
        fontSize={0.1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/inter-bold.woff"
      >
        {name}
      </Text>

      {/* Status indicator for table */}
      {status !== "available" && (
        <mesh position={[0, 0.8, 0]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color={status === "booked" ? "#e74c3c" : "#f39c12"}
            emissive={status === "booked" ? "#e74c3c" : "#f39c12"}
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {/* Table surface pattern/texture */}
      <mesh position={[0, 0.052, 0]}>
        {getTableGeometry(type)}
        <meshStandardMaterial 
          color="#1a252f"
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Seats with improved positioning */}
      {seatPositions.slice(0, seats).map((seatPos, index) => (
        <Seat
          key={`${tableId}-seat-${index + 1}`}
          position={seatPos}
          seatNumber={index + 1}
          tableId={tableId}
          tableName={name}
          status={status}
          onSeatClick={onSeatClick}
        />
      ))}
    </group>
  );
}