import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { roomService } from "@/services/room.service";

interface RoomSelectorProps {
  onRoomSelect: (roomId: string) => void;
}

export function RoomSelector({ onRoomSelect }: RoomSelectorProps) {
  const { data: rooms, isLoading } = useQuery({
    queryKey: ['rooms'],
    queryFn: roomService.getAllRooms
  });

  const today = new Date().toISOString().split('T')[0];
  const { data: availability } = useQuery({
    queryKey: ['rooms-availability', today],
    queryFn: () => roomService.getRoomAvailability(today)
  });

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {rooms?.map((room) => {
        const roomAvailability = availability?.find(avail => avail.roomId === room._id);
        const availableTables = roomAvailability?.availableTables ?? 0;
        const totalTables = roomAvailability?.totalTables ?? room.tables?.length ?? 0;
        const isAvailable = availableTables > 0;
        console.log("room available ",{availableTables,room})
        return (
          <Card key={room._id} className="gaming-card hover:scale-105 transition-transform duration-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {room.openingTime} - {room.closingTime}
                  </span>
                </div>
                
              </div>
              <CardTitle className="text-xl">{room.name}</CardTitle>
              <CardDescription>{room.description}</CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tables:</span>
                <span className="font-medium">
                  {availableTables}/{totalTables} available
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Capacity:</span>
                <span className="font-medium flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {room.capacity}
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">Amenities:</span>
                <div className="flex gap-2 flex-wrap">
                  {room.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline" className="text-xs">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button 
                className="w-full mt-4"
                variant={isAvailable ? "default" : "secondary"}
                onClick={() => onRoomSelect(room._id)}
                disabled={!isAvailable}
              >
                {isAvailable ? "Enter Room" : "Not Available"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}