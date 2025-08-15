import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const GamesInventory = ({ games }) => {
  return (
    <Card className="gaming-card mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-primary" />
          Games Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {games.map((game) => (
            <Card key={game.game} className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{game.game}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Players:</span>
                  {game.players_min && game.players_max ? (
                    <span>
                      {game.players_min}-{game.players_max}
                    </span>
                  ) : (
                    <span>N/A</span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Time:</span>
                  <span>{game.play_time_mins || "N/A"} mins</span>
                </div>
                
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{game.age_group || "N/A"}+</span>
                </div>
                
                {game.bgg_rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-muted-foreground">BGG:</span>
                    <span>{game.bgg_rating}</span>
                    {game.bgg_overall_ranking && (
                      <span>(#{game.bgg_overall_ranking})</span>
                    )}
                  </div>
                )}
                
                {game.categories && game.categories.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Categories</div>
                    <div className="flex flex-wrap gap-1">
                      {game.categories.map((category) => (
                        <Badge 
                          key={category} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {game.mechanisms && game.mechanisms.filter(Boolean).length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground mb-1">Mechanics</div>
                    <div className="flex flex-wrap gap-1">
                      {game.mechanisms.filter(Boolean).map((mechanism) => (
                        <Badge 
                          key={mechanism} 
                          variant="outline"
                          className="text-xs"
                        >
                          {mechanism}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GamesInventory;