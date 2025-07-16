import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Square, Circle, Hexagon } from "lucide-react";

interface RoomSelectorProps {
  onRoomSelect: (roomId: string) => void;
}

const rooms = [
  {
    id: "room-a",
    name: "Room A",
    description: "Classic gaming setup with rectangular tables",
    tables: 8,
    capacity: 32,
    tableTypes: ["Rectangle", "Square"],
    status: "available",
    icon: Square,
    gradient: "from-primary/20 to-primary/5"
  },
  {
    id: "room-b", 
    name: "Room B",
    description: "Circular tables perfect for strategy games",
    tables: 6,
    capacity: 24,
    tableTypes: ["Circle", "Round"],
    status: "available",
    icon: Circle,
    gradient: "from-accent/20 to-accent/5"
  },
  {
    id: "room-c",
    name: "Room C", 
    description: "Hexagonal tables for unique gameplay",
    tables: 10,
    capacity: 40,
    tableTypes: ["Hexagon", "Pentagon"],
    status: "busy",
    icon: Hexagon,
    gradient: "from-success/20 to-success/5"
  }
];

export function RoomSelector({ onRoomSelect }: RoomSelectorProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {rooms.map((room) => (
        <Card key={room.id} className={`gaming-card bg-gradient-to-br ${room.gradient} hover:scale-105 transition-transform duration-300`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <room.icon className="h-8 w-8 text-primary" />
              <Badge 
                className={room.status === "available" ? "status-available" : "status-current"}
              >
                {room.status === "available" ? "Available" : "In Session"}
              </Badge>
            </div>
            <CardTitle className="text-xl">{room.name}</CardTitle>
            <CardDescription>{room.description}</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tables:</span>
              <span className="font-medium">{room.tables}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Capacity:</span>
              <span className="font-medium flex items-center gap-1">
                <Users className="h-3 w-3" />
                {room.capacity}
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Table Types:</span>
              <div className="flex gap-2 flex-wrap">
                {room.tableTypes.map((type) => (
                  <Badge key={type} variant="outline" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full btn-electric mt-4"
              onClick={() => onRoomSelect(room.id)}
              disabled={room.status === "busy"}
            >
              {room.status === "available" ? "Enter Room" : "Room Busy"}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}