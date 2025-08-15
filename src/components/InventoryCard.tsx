// src/components/InventoryCard.tsx
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const InventoryCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card 
      className="gaming-card hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={() => navigate('/games')}
    >
      <CardHeader>
        <Gamepad2 className="h-8 w-8 text-purple-500 mb-2" />
        <CardTitle>Game Inventory</CardTitle>
        <CardDescription>
          Browse our complete collection of board games and card games
        </CardDescription>
      </CardHeader>
    </Card>
  );
};