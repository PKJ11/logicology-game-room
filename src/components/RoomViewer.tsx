import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, Calendar, Settings } from "lucide-react";
import { Room2D } from "@/components/Room2D";
import { BookingModal } from "@/components/BookingModal";

interface RoomViewerProps {
  roomId: string;
  onBack: () => void;
}

interface BookingData {
  tableId: string;
  seatId?: string;
  tableName: string;
  seatNumber?: number;
  isFullTable?: boolean;
}

const roomData = {
  "room-a": {
    name: "Room A",
    description: "Classic rectangular and square tables",
    tables: 8,
    currentBookings: 12
  },
  "room-b": {
    name: "Room B", 
    description: "Circular tables for strategic gameplay",
    tables: 6,
    currentBookings: 8
  },
  "room-c": {
    name: "Room C",
    description: "Hexagonal tables for unique experiences", 
    tables: 10,
    currentBookings: 15
  }
};

export function RoomViewer({ roomId, onBack }: RoomViewerProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  const room = roomData[roomId as keyof typeof roomData];

  const handleSeatClick = (tableId: string, seatId: string, tableName: string, seatNumber: number) => {
    setSelectedBooking({
      tableId,
      seatId,
      tableName,
      seatNumber,
      isFullTable: false
    });
  };

  const handleTableClick = (tableId: string, tableName: string) => {
    setSelectedBooking({
      tableId,
      tableName,
      isFullTable: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-gaming">
      {/* Header */}
      <div className="border-b border-border/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Rooms
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{room.name}</h1>
                <p className="text-sm text-muted-foreground">{room.description}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="status-available">
                <Users className="h-3 w-3 mr-1" />
                {room.tables - Math.floor(room.currentBookings / 4)} Available Tables
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* 2D Room View */}
          <div className="lg:col-span-3">
            <Card className="gaming-card p-0 overflow-hidden">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Room Layout</span>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 bg-success rounded-full"></div>
                    Available
                    <div className="w-2 h-2 bg-destructive rounded-full ml-3"></div>
                    Booked
                    <div className="w-2 h-2 bg-warning rounded-full ml-3"></div>
                    Current
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="min-h-[600px]">
                  <Room2D 
                    roomId={roomId}
                    onSeatClick={handleSeatClick}
                    onTableClick={handleTableClick}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="space-y-6">
            {/* Room Stats */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg">Room Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Tables</span>
                  <span className="font-medium">{room.tables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Bookings</span>
                  <span className="font-medium">{room.currentBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Available Seats</span>
                  <span className="font-medium text-success">{(room.tables * 4) - room.currentBookings}</span>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Info */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Current Session
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Today, Dec 16, 2024</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>3:00 PM - 5:00 PM</span>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="text-sm font-medium text-warning">Next Available</div>
                  <div className="text-sm text-muted-foreground">5:00 PM - 7:00 PM</div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg">Quick Book</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full btn-electric" size="sm">
                  Book Next Available
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  View Schedule
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Create Group Booking
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onConfirm={(bookingDetails) => {
            console.log("Booking confirmed:", bookingDetails);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
}