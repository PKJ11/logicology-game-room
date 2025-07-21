import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Gamepad2, Sparkles, User } from "lucide-react";
import { RoomSelector } from "@/components/RoomSelector";
import { RoomViewer } from "@/components/RoomViewer";
import { useQuery } from "@tanstack/react-query";
import {
  roomService,
  type Room,
  type AvailabilityResponse,
  RoomAvailability,
} from "@/services/room.service";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const today = format(new Date(), "yyyy-MM-dd");
  const [user, setUser] = useState<{
    username: string;
    email: string;
    role: string;
  } | null>(null);

  const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        const userData = {
          username: decoded.id, // or use appropriate field from your JWT
          email: '', // add if available in JWT
          role: '' // add if available in JWT
        };
        setUser(userData);
      }
    }
  }, []);

  const isAuthenticated = !!user;
  const userName = localStorage.getItem('user')
  


  const { data: rooms } = useQuery<Room[]>({
    queryKey: ["rooms"],
    queryFn: roomService.getAllRooms,
  });
  

  const { data: availability } = useQuery<RoomAvailability[]>({
    queryKey: ["rooms-availability", today],
    queryFn: () => roomService.getRoomAvailability(today),
  });

  if (selectedRoom) {
    return (
      <RoomViewer roomId={selectedRoom} onBack={() => setSelectedRoom(null)} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-gaming">
      {/* Hero Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Gamepad2 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              GameSpace
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Book your perfect gaming table in our interactive 3D rooms. Choose
            your seat, pick your time, and dive into the ultimate board game
            experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="btn-electric">
              <Sparkles className="mr-2 h-4 w-4" />
              Start Booking
            </Button>
            <Button variant="outline" className="btn-neon">
              View Rooms
            </Button>
          </div>

          {/* Auth Buttons */}
            <div className="flex justify-center gap-4 mt-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full">
                <User className="h-4 w-4" />
                <span className="font-medium">{userName}</span>
              </div>
            ) : (
              <>
                <Button asChild variant="outline">
                  <a href="/login">Sign In</a>
                </Button>
                <Button asChild className="btn-electric">
                  <a href="/signup">Sign Up</a>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="gaming-card">
            <CardHeader>
              <Calendar className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Flexible Booking</CardTitle>
              <CardDescription>
                Book individual seats or entire tables for any time slot
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gaming-card">
            <CardHeader>
              <Users className="h-8 w-8 text-accent mb-2" />
              <CardTitle>3D Room View</CardTitle>
              <CardDescription>
                Interactive 3D visualization of all rooms and table layouts
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="gaming-card">
            <CardHeader>
              <Clock className="h-8 w-8 text-success mb-2" />
              <CardTitle>Real-time Status</CardTitle>
              <CardDescription>
                Live availability updates and booking confirmations
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Room Stats */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-6">Choose Your Gaming Room</h2>
          <div className="flex justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {rooms?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Gaming Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">
                {rooms?.reduce(
                  (acc, room) => acc + (room.tables?.length || 0),
                  0
                ) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Gaming Tables</div>
            </div>
            {/* <div className="text-center">
              <div className="text-3xl font-bold text-success">
                {availability?.totalAvailableSeats || 0}
              </div>
              <div className="text-sm text-muted-foreground">Available Seats</div>
            </div> */}
          </div>
        </div>

        {/* Room Selection */}
        <RoomSelector onRoomSelect={setSelectedRoom} />
        {/* Current Status */}
        <Card className="gaming-card mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
              Live Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {rooms?.map((room) => {
                console.log(availability);
                const roomAvailability = availability?.find(
                  (avail) => avail.roomId === room._id
                );

                return (
                  <div
                    key={room._id}
                    className="flex flex-col p-3 rounded-lg bg-muted/30 border"
                  >
                    {/* Room Header with Availability */}
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{room.name}</span>
                      {roomAvailability ? (
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            roomAvailability.availabilityPercentage >= 70
                              ? "bg-green-100 text-green-800"
                              : roomAvailability.availabilityPercentage >= 40
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {roomAvailability.availabilityPercentage}% available
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
                          No data
                        </span>
                      )}
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {room.description}
                    </p>

                    {/* Availability Details */}
                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Tables</div>
                        <div>
                          {roomAvailability ? (
                            <span>
                              <span className="font-medium">
                                {roomAvailability.availableTables}
                              </span>
                              <span className="text-muted-foreground">
                                /{roomAvailability.totalTables}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-/-</span>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Hours</div>
                        <div>
                          {room.openingTime} - {room.closingTime}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Capacity</div>
                        <div>{room.capacity} people</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Status</div>
                        {/* <div className="flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${
                    room.status === 'ACTIVE' ? 'bg-green-500' : 
                    room.status === 'MAINTENANCE' ? 'bg-yellow-500' : 
                    'bg-gray-500'
                  }`}></span>
                  {room?.status.charAt(0) + room?.status.slice(1).toLowerCase()}
                </div> */}
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mt-auto pt-2 border-t">
                      <div className="text-xs text-muted-foreground mb-1">
                        Amenities
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.map((amenity) => (
                          <Badge
                            key={amenity}
                            variant="outline"
                            className="text-xs py-0.5 px-2 font-normal"
                          >
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
