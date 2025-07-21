import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MapPin, Clock, Users, User, Calendar as CalendarIcon } from "lucide-react";
import { format, parseISO, addHours } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { bookingService, type TimeSlot } from "@/services/booking.service";

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

const formatTimeSlot = (slot: TimeSlot) => {
  const start = format(parseISO(slot.startTime), 'h:mm a');
  const end = format(parseISO(slot.endTime), 'h:mm a');
  return `${start} - ${end}`;
};

export function BookingModal({ booking, onClose, onConfirm }: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [playerCount, setPlayerCount] = useState<string>("1");
  const { toast } = useToast();

  // Fetch available time slots when date changes
  const { data: slotsData, isLoading: isSlotsLoading } = useQuery({
  queryKey: ['available-slots', booking.tableId, selectedDate],
  queryFn: () => bookingService.getAvailableSlots(
    booking.tableId,
    format(selectedDate!, 'yyyy-MM-dd')
  ),
  enabled: !!selectedDate,
});

// The API returns the full response object, so extract availableSlots
const availableSlots = (slotsData?.availableSlots || []).map(slot => ({
  ...slot,
  available: true // Add the missing available property
}));
  

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: bookingService.createBooking,
    onSuccess: (data) => {
      toast({
        title: "🎉 Booking Confirmed!",
        description: (
          <div>
            <p>Your booking for {booking.tableName} has been confirmed!</p>
            <p className="font-medium mt-1">
              {format(parseISO(data.startTime), 'EEEE, MMMM d')} from{' '}
              {format(parseISO(data.startTime), 'h:mm a')} to{' '}
              {format(parseISO(data.endTime), 'h:mm a')}
            </p>
          </div>
        ),
        duration: 5000, // Show for 5 seconds
      });
      onConfirm(data);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.response?.data?.message || "Something went wrong",
      });
    },
  });

  const handleConfirm = () => {
    if (!selectedDate || !selectedTimeSlot) return;

    const bookingDetails = {
      tableId: booking.tableId,
      startTime: selectedTimeSlot.startTime,
      endTime: selectedTimeSlot.endTime,
      numberOfPlayers: parseInt(playerCount),
      ...(booking.seatId && { seatId: booking.seatId }),
    };

    createBookingMutation.mutate(bookingDetails);
  };

  const isFormValid = selectedDate && selectedTimeSlot && playerCount && !createBookingMutation.isPending;

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
                <Select
                  value={selectedTimeSlot ? JSON.stringify(selectedTimeSlot) : ""}
                  onValueChange={(value) => setSelectedTimeSlot(JSON.parse(value))}
                  disabled={isSlotsLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={isSlotsLoading ? "Loading..." : "Choose time slot"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSlots
                      .filter(slot => slot.available)
                      .map((slot) => (
                        <SelectItem 
                          key={slot.startTime} 
                          value={JSON.stringify(slot)}
                        >
                          {formatTimeSlot(slot)}
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
              {booking.isFullTable ? "Table reservation" : "Seat reservation"}
              {selectedTimeSlot && ` (${format(parseISO(selectedTimeSlot.startTime), 'h:mm a')} - ${format(parseISO(selectedTimeSlot.endTime), 'h:mm a')})`}
            </span>
            <span className="font-bold text-lg">
              ${booking.isFullTable ? (parseInt(playerCount) * 15) : "10"}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Includes {booking.isFullTable ? "table" : "seat"}, game library access, and complimentary refreshments
          </p>
          {createBookingMutation.isError && (
            <p className="text-xs text-destructive mt-2">
              {createBookingMutation.error?.message || "Error creating booking"}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}