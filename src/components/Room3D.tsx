import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Grid } from "@react-three/drei";
import { GameTable } from "@/components/GameTable";
import { Suspense } from "react";

interface Room3DProps {
  roomId: string;
  onSeatClick: (tableId: string, seatId: string, tableName: string, seatNumber: number) => void;
  onTableClick: (tableId: string, tableName: string) => void;
}

// Room layouts with different table configurations
const roomLayouts = {
  "room-a": [
    { id: "table-1", type: "rectangle", position: [-4, 0, -2], name: "Table 1", seats: 4, status: "available" },
    { id: "table-2", type: "rectangle", position: [-4, 0, 2], name: "Table 2", seats: 4, status: "booked" },
    { id: "table-3", type: "square", position: [0, 0, -2], name: "Table 3", seats: 4, status: "available" },
    { id: "table-4", type: "square", position: [0, 0, 2], name: "Table 4", seats: 4, status: "current" },
    { id: "table-5", type: "rectangle", position: [4, 0, -2], name: "Table 5", seats: 4, status: "available" },
    { id: "table-6", type: "rectangle", position: [4, 0, 2], name: "Table 6", seats: 4, status: "available" },
    { id: "table-7", type: "square", position: [-2, 0, 0], name: "Table 7", seats: 4, status: "booked" },
    { id: "table-8", type: "square", position: [2, 0, 0], name: "Table 8", seats: 4, status: "available" },
  ],
  "room-b": [
    { id: "table-1", type: "circle", position: [-3, 0, -3], name: "Table 1", seats: 6, status: "available" },
    { id: "table-2", type: "circle", position: [3, 0, -3], name: "Table 2", seats: 6, status: "booked" },
    { id: "table-3", type: "circle", position: [-3, 0, 0], name: "Table 3", seats: 4, status: "current" },
    { id: "table-4", type: "circle", position: [3, 0, 0], name: "Table 4", seats: 4, status: "available" },
    { id: "table-5", type: "circle", position: [-3, 0, 3], name: "Table 5", seats: 6, status: "available" },
    { id: "table-6", type: "circle", position: [3, 0, 3], name: "Table 6", seats: 6, status: "available" },
  ],
  "room-c": [
    { id: "table-1", type: "hexagon", position: [-4, 0, -3], name: "Table 1", seats: 6, status: "available" },
    { id: "table-2", type: "hexagon", position: [0, 0, -3], name: "Table 2", seats: 6, status: "booked" },
    { id: "table-3", type: "hexagon", position: [4, 0, -3], name: "Table 3", seats: 6, status: "current" },
    { id: "table-4", type: "pentagon", position: [-2, 0, 0], name: "Table 4", seats: 5, status: "available" },
    { id: "table-5", type: "pentagon", position: [2, 0, 0], name: "Table 5", seats: 5, status: "available" },
    { id: "table-6", type: "hexagon", position: [-4, 0, 3], name: "Table 6", seats: 6, status: "available" },
    { id: "table-7", type: "hexagon", position: [0, 0, 3], name: "Table 7", seats: 6, status: "booked" },
    { id: "table-8", type: "hexagon", position: [4, 0, 3], name: "Table 8", seats: 6, status: "available" },
    { id: "table-9", type: "pentagon", position: [-6, 0, 0], name: "Table 9", seats: 5, status: "available" },
    { id: "table-10", type: "pentagon", position: [6, 0, 0], name: "Table 10", seats: 5, status: "available" },
  ]
};

function SceneContent({ roomId, onSeatClick, onTableClick }: Room3DProps) {
  const tables = roomLayouts[roomId as keyof typeof roomLayouts] || [];

  return (
    <>
      {/* Environment and lighting */}
      <Environment preset="warehouse" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      
      {/* Room floor grid */}
      <Grid
        position={[0, -0.01, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#00d4ff"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#0099cc"
        fadeDistance={25}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />

      {/* Room boundaries */}
      <mesh position={[0, 2, -8]} receiveShadow>
        <boxGeometry args={[16, 4, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      <mesh position={[0, 2, 8]} receiveShadow>
        <boxGeometry args={[16, 4, 0.1]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      <mesh position={[-8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, 4, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      <mesh position={[8, 2, 0]} receiveShadow>
        <boxGeometry args={[0.1, 4, 16]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>

      {/* Render tables */}
      {tables.map((table) => (
        <GameTable
          key={table.id}
          tableId={table.id}
          type={table.type as "rectangle" | "circle" | "hexagon" | "pentagon" | "square"}
          position={table.position as [number, number, number]}
          name={table.name}
          seats={table.seats}
          status={table.status as "available" | "booked" | "current"}
          onSeatClick={onSeatClick}
          onTableClick={onTableClick}
        />
      ))}
    </>
  );
}

export function Room3D({ roomId, onSeatClick, onTableClick }: Room3DProps) {
  return (
    <Canvas
      camera={{ position: [8, 8, 8], fov: 60 }}
      shadows
      className="w-full h-full"
    >
      <Suspense fallback={null}>
        <SceneContent roomId={roomId} onSeatClick={onSeatClick} onTableClick={onTableClick} />
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2.2}
          target={[0, 0, 0]}
        />
      </Suspense>
    </Canvas>
  );
}