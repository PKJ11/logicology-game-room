import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, Gamepad2, Sparkles } from "lucide-react";
import { RoomSelector } from "@/components/RoomSelector";
import { RoomViewer } from "@/components/RoomViewer";

const Index = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  if (selectedRoom) {
    return (
      <RoomViewer 
        roomId={selectedRoom} 
        onBack={() => setSelectedRoom(null)} 
      />
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
            Book your perfect gaming table in our interactive 3D rooms. Choose your seat, 
            pick your time, and dive into the ultimate board game experience.
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
            <Button asChild variant="outline">
              <a href="/login">Sign In</a>
            </Button>
            <Button asChild className="btn-electric">
              <a href="/signup">Sign Up</a>
            </Button>
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
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Gaming Rooms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">24</div>
              <div className="text-sm text-muted-foreground">Gaming Tables</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success">96</div>
              <div className="text-sm text-muted-foreground">Available Seats</div>
            </div>
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
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span>Room A</span>
                <Badge className="status-available">8 Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span>Room B</span>
                <Badge className="status-available">12 Available</Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span>Room C</span>
                <Badge className="status-current">In Session</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Index;
