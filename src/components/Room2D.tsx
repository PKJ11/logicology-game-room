import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";

interface Room2DProps {
  roomId: string;
  onSeatClick: (tableId: string, seatId: string, tableName: string, seatNumber: number) => void;
  onTableClick: (tableId: string, tableName: string) => void;
}

interface Table {
  id: string;
  type: string;
  name: string;
  seats: number;
  status: "available" | "booked" | "current";
  position: { row: number; col: number };
}

// Room layouts with 2D grid positioning
const roomLayouts = {
  "room-a": [
    { id: "table-1", type: "rectangle", name: "Table 1", seats: 4, status: "available", position: { row: 0, col: 0 } },
    { id: "table-2", type: "rectangle", name: "Table 2", seats: 4, status: "booked", position: { row: 0, col: 1 } },
    { id: "table-3", type: "square", name: "Table 3", seats: 4, status: "available", position: { row: 0, col: 2 } },
    { id: "table-4", type: "square", name: "Table 4", seats: 4, status: "current", position: { row: 1, col: 0 } },
    { id: "table-5", type: "rectangle", name: "Table 5", seats: 4, status: "available", position: { row: 1, col: 1 } },
    { id: "table-6", type: "rectangle", name: "Table 6", seats: 4, status: "available", position: { row: 1, col: 2 } },
    { id: "table-7", type: "square", name: "Table 7", seats: 4, status: "booked", position: { row: 2, col: 0 } },
    { id: "table-8", type: "square", name: "Table 8", seats: 4, status: "available", position: { row: 2, col: 1 } },
  ],
  "room-b": [
    { id: "table-1", type: "circle", name: "Table 1", seats: 6, status: "available", position: { row: 0, col: 0 } },
    { id: "table-2", type: "circle", name: "Table 2", seats: 6, status: "booked", position: { row: 0, col: 1 } },
    { id: "table-3", type: "circle", name: "Table 3", seats: 4, status: "current", position: { row: 1, col: 0 } },
    { id: "table-4", type: "circle", name: "Table 4", seats: 4, status: "available", position: { row: 1, col: 1 } },
    { id: "table-5", type: "circle", name: "Table 5", seats: 6, status: "available", position: { row: 2, col: 0 } },
    { id: "table-6", type: "circle", name: "Table 6", seats: 6, status: "available", position: { row: 2, col: 1 } },
  ],
  "room-c": [
    { id: "table-1", type: "hexagon", name: "Table 1", seats: 6, status: "available", position: { row: 0, col: 0 } },
    { id: "table-2", type: "hexagon", name: "Table 2", seats: 6, status: "booked", position: { row: 0, col: 1 } },
    { id: "table-3", type: "hexagon", name: "Table 3", seats: 6, status: "current", position: { row: 0, col: 2 } },
    { id: "table-4", type: "pentagon", name: "Table 4", seats: 5, status: "available", position: { row: 1, col: 0 } },
    { id: "table-5", type: "pentagon", name: "Table 5", seats: 5, status: "available", position: { row: 1, col: 1 } },
    { id: "table-6", type: "hexagon", name: "Table 6", seats: 6, status: "available", position: { row: 1, col: 2 } },
    { id: "table-7", type: "hexagon", name: "Table 7", seats: 6, status: "booked", position: { row: 2, col: 0 } },
    { id: "table-8", type: "hexagon", name: "Table 8", seats: 6, status: "available", position: { row: 2, col: 1 } },
    { id: "table-9", type: "pentagon", name: "Table 9", seats: 5, status: "available", position: { row: 2, col: 2 } },
    { id: "table-10", type: "pentagon", name: "Table 10", seats: 5, status: "available", position: { row: 3, col: 1 } },
  ]
};

const getTableIcon = (type: string) => {
  switch (type) {
    case "rectangle":
      return "⬜";
    case "square":
      return "🟦";
    case "circle":
      return "🟢";
    case "hexagon":
      return "⬡";
    case "pentagon":
      return "⬟";
    default:
      return "⬜";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "available":
      return "status-available";
    case "booked":
      return "status-booked";
    case "current":
      return "status-current";
    default:
      return "status-available";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "available":
      return "Available";
    case "booked":
      return "Booked";
    case "current":
      return "In Session";
    default:
      return "Available";
  }
};

export function Room2D({ roomId, onSeatClick, onTableClick }: Room2DProps) {
  const tables = roomLayouts[roomId as keyof typeof roomLayouts] || [];
  
  // Create a grid layout
  const maxRows = Math.max(...tables.map(t => t.position.row)) + 1;
  const maxCols = Math.max(...tables.map(t => t.position.col)) + 1;
  
  const grid = Array(maxRows).fill(null).map(() => Array(maxCols).fill(null));
  
  tables.forEach(table => {
    grid[table.position.row][table.position.col] = table;
  });

  return (
    <div className="w-full h-full p-6">
      <div className="grid gap-4" style={{ gridTemplateRows: `repeat(${maxRows}, 1fr)` }}>
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${maxCols}, 1fr)` }}>
            {row.map((table: Table | null, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="aspect-square">
                {table ? (
                  <Card className={`gaming-card h-full cursor-pointer transition-all duration-200 hover:scale-105 ${
                    table.status === 'available' ? 'hover:border-success/50' :
                    table.status === 'booked' ? 'border-destructive/50' :
                    'border-warning/50'
                  }`}>
                    <div className="h-full p-4 flex flex-col justify-between">
                      {/* Table Header */}
                      <div className="text-center">
                        <div className="text-3xl mb-2">{getTableIcon(table.type)}</div>
                        <h3 className="font-semibold text-sm">{table.name}</h3>
                        <Badge className={`text-xs ${getStatusColor(table.status)}`}>
                          {getStatusText(table.status)}
                        </Badge>
                      </div>
                      
                      {/* Seats */}
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          <span>{table.seats} seats</span>
                        </div>
                        
                        {/* Seat Grid */}
                        <div className="grid grid-cols-2 gap-1 w-full">
                          {Array.from({ length: table.seats }, (_, i) => (
                            <Button
                              key={i}
                              variant="ghost"
                              size="sm"
                              className={`h-6 text-xs p-0 ${
                                table.status === 'available' ? 'hover:bg-success/20' :
                                table.status === 'booked' ? 'bg-destructive/20 cursor-not-allowed' :
                                'bg-warning/20 cursor-not-allowed'
                              }`}
                              disabled={table.status !== 'available'}
                              onClick={() => onSeatClick(table.id, `seat-${i + 1}`, table.name, i + 1)}
                            >
                              {i + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* Book Entire Table */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-xs"
                        disabled={table.status !== 'available'}
                        onClick={() => onTableClick(table.id, table.name)}
                      >
                        Book Table
                      </Button>
                      
                      {/* Time Info */}
                      {table.status === 'current' && (
                        <div className="flex items-center justify-center gap-1 text-xs text-warning mt-1">
                          <Clock className="h-3 w-3" />
                          <span>Until 5 PM</span>
                        </div>
                      )}
                    </div>
                  </Card>
                ) : (
                  <div className="h-full border-2 border-dashed border-muted/20 rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground/50 text-xs">Empty</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}