import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Users, Clock, Calendar, Settings } from "lucide-react";
import { Room2D } from "@/components/Room2D";
import { BookingModal } from "@/components/BookingModal";
import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/services/room.service";
import { format } from "date-fns";

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

export function RoomViewer({ roomId, onBack }: RoomViewerProps) {
  const [selectedBooking, setSelectedBooking] = useState<BookingData | null>(null);
  
  // Fetch room data
  const { data: room, isLoading, isError } = useQuery({
    queryKey: ['room', roomId],
    queryFn: () => roomService.getRoomById(roomId)
  });

  // Fetch availability data
  const today = format(new Date(), 'yyyy-MM-dd');
  const { data: availability } = useQuery({
    queryKey: ['room-availability', roomId, today],
    queryFn: () => roomService.getRoomAvailability(today),
    enabled: !!roomId
  });

  const roomAvailability = availability?.find(avail => avail.roomId === roomId);
  const availableTables = roomAvailability?.availableTables ?? 0;
  const totalTables = room?.tables?.length ?? 0;
  const currentBookings = totalTables - availableTables;

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

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading room data...</div>;
  }

  if (isError || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="gaming-card">
          <CardHeader>
            <CardTitle>Error loading room</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={onBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Rooms
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
              <Badge className={room.status === 'ACTIVE' ? 
                (availableTables > 0 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800") : 
                "bg-gray-100 text-gray-800"}>
                <Users className="h-3 w-3 mr-1" />
                {availableTables} Available Tables
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
                  <span className="font-medium">{totalTables}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Bookings</span>
                  <span className="font-medium">{currentBookings}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Capacity</span>
                  <span className="font-medium">{room.capacity} people</span>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Info */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Operating Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{room.openingTime} - {room.closingTime}</span>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-muted/10 border border-muted/20">
                  <div className="text-sm font-medium">Current Time</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(), 'h:mm a')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-lg">Amenities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {room.amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{amenity}</span>
                  </div>
                ))}
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