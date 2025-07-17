import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/services/room.service";

interface Room2DProps {
  roomId: string;
  onSeatClick: (tableId: string, seatId: string, tableName: string, seatNumber: number) => void;
  onTableClick: (tableId: string, tableName: string) => void;
}

interface Table {
  _id: string;
  roomId: string;
  tableNumber: string;
  capacity: number;
  gameType: string;
  isAvailable: boolean;
  hourlyRate: number;
  createdAt: string;
}

const getGameIcon = (gameType: string) => {
  switch (gameType.toLowerCase()) {
    case "pool":
      return "🎱";
    case "foosball":
      return "⚽";
    case "air hockey":
      return "🏒";
    case "ping pong":
      return "🏓";
    case "chess":
      return "♟️";
    case "board games":
      return "🎲";
    default:
      return "🕹️";
  }
};

const getStatusColor = (isAvailable: boolean) => {
  return isAvailable ? "bg-green-100 text-green-800" : "bg-destructive/20 text-destructive-foreground";
};

const getStatusText = (isAvailable: boolean) => {
  return isAvailable ? "Available" : "Occupied";
};

export function Room2D({ roomId, onSeatClick, onTableClick }: Room2DProps) {
  const { data: tables, isLoading } = useQuery({
    queryKey: ['room-tables', roomId],
    queryFn: () => roomService.getRoomTables(roomId)
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div>Loading tables...</div>
      </div>
    );
  }

  if (!tables || tables.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div>No tables found for this room</div>
      </div>
    );
  }

  // Create a simple grid layout (3 columns)
  const rows = [];
  for (let i = 0; i < tables.length; i += 3) {
    rows.push(tables.slice(i, i + 3));
  }

  return (
    <div className="w-full h-full p-6">
      <div className="grid gap-4">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-3 gap-4">
            {row.map((table: Table) => (
              <div key={table._id} className="aspect-square">
                <Card className={`gaming-card h-full cursor-pointer transition-all duration-200 hover:scale-105 ${
                  table.isAvailable ? 'hover:border-success/50' : 'border-destructive/50'
                }`}>
                  <div className="h-full p-4 flex flex-col justify-between">
                    {/* Table Header */}
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getGameIcon(table.gameType)}</div>
                      <h3 className="font-semibold text-sm">{table.tableNumber}</h3>
                      <div className="flex justify-center gap-2 mt-1">
                        <Badge className={`text-xs ${getStatusColor(table.isAvailable)}`}>
                          {getStatusText(table.isAvailable)}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          ${table.hourlyRate}/hr
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Game Info */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        <span>Capacity: {table.capacity}</span>
                      </div>
                      
                      <div className="text-sm font-medium capitalize">
                        {table.gameType}
                      </div>
                      
                      {/* Seat Grid */}
                      <div className="grid grid-cols-2 gap-1 w-full">
                        {Array.from({ length: table.capacity }, (_, i) => (
                          <Button
                            key={i}
                            variant="ghost"
                            size="sm"
                            className={`h-6 text-xs p-0 ${
                              table.isAvailable ? 'hover:bg-success/20' : 'bg-destructive/20 cursor-not-allowed'
                            }`}
                            disabled={!table.isAvailable}
                            onClick={() => onSeatClick(table._id, `seat-${i + 1}`, table.tableNumber, i + 1)}
                          >
                            Seat {i + 1}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    {/* Book Entire Table */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                      disabled={!table.isAvailable}
                      onClick={() => onTableClick(table._id, table.tableNumber)}
                    >
                      {table.isAvailable ? (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          Book Table (${table.hourlyRate}/hr)
                        </span>
                      ) : (
                        "Currently Occupied"
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}