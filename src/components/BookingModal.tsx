import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, User, Calendar as CalendarIcon } from "lucide-react";

interface BookingData {
  tableId: string;
  seatId?: string;
  tableName: string;
  seatNumber?: number;
  isFullTable?: boolean;
}

interface BookingModalProps {
  booking: BookingData;
  onClose: () => void;
  onConfirm: (bookingDetails: any) => void;
}

const timeSlots = [
  "9:00 AM - 11:00 AM",
  "11:00 AM - 1:00 PM", 
  "1:00 PM - 3:00 PM",
  "3:00 PM - 5:00 PM",
  "5:00 PM - 7:00 PM",
  "7:00 PM - 9:00 PM",
  "9:00 PM - 11:00 PM"
];

export function BookingModal({ booking, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [playerCount, setPlayerCount] = useState<string>("1");

  const handleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) return;

    const bookingDetails = {
      ...booking,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      playerCount: parseInt(playerCount),
      bookingId: `booking-${Date.now()}`,
      timestamp: new Date()
    };

    onConfirm(bookingDetails);
  };

  const isFormValid = selectedDate && selectedTimeSlot && playerCount;

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <MapPin className="h-5 w-5 text-primary" />
            {booking.isFullTable ? "Book Entire Table" : "Book Seat"}
          </DialogTitle>
          <DialogDescription>
            {booking.isFullTable 
              ? `Reserve the entire ${booking.tableName} for your gaming session`
              : `Reserve seat ${booking.seatNumber} at ${booking.tableName}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Booking Details */}
          <div className="space-y-4">
            <Card className="gaming-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Table:</span>
                  <span className="font-medium">{booking.tableName}</span>
                </div>
                
                {!booking.isFullTable && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Seat:</span>
                    <Badge variant="outline">#{booking.seatNumber}</Badge>
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <Badge className={booking.isFullTable ? "bg-accent" : "bg-primary"}>
                    {booking.isFullTable ? "Full Table" : "Single Seat"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Number of Players</label>
                  <Select value={playerCount} onValueChange={setPlayerCount}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select player count" />
                    </SelectTrigger>
                    <SelectContent>
                      {booking.isFullTable ? (
                        [2, 3, 4, 5, 6].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "Player" : "Players"}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="1">1 Player</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card className="gaming-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedTimeSlot} onValueChange={setSelectedTimeSlot}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <div className="space-y-4">
            <Card className="gaming-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => 
                    date < new Date() || date > new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  }
                  className="rounded-md border border-border bg-background"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            className="btn-electric"
            onClick={handleConfirm}
            disabled={!isFormValid}
          >
            {booking.isFullTable ? "Reserve Table" : "Reserve Seat"}
          </Button>
        </div>

        {/* Pricing Info */}
        <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">
              {booking.isFullTable ? "Table reservation" : "Seat reservation"} (2 hours)
            </span>
            <span className="font-bold text-lg">
              ${booking.isFullTable ? "40" : "10"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Includes table/seat, basic game library access, and refreshments
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}