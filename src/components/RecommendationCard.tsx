import { Brain, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RecommendationCardProps {
  product: string;
  discount: number;
  revenueIncrease: string;
  confidence: number;
  reason: string;
  priority?: "high" | "medium" | "low";
}

export function RecommendationCard({
  product,
  discount,
  revenueIncrease,
  confidence,
  reason,
  priority = "medium",
}: RecommendationCardProps) {
  return (
    <Card className="group shadow-sm border-border/50 hover:-translate-y-1 hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">{product}</h4>
              <p className="text-xs text-muted-foreground line-clamp-1">{reason}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={`text-xs ${
              priority === "high"
                ? "bg-destructive/10 text-destructive"
                : priority === "medium"
                ? "bg-warning/10 text-warning"
                : "bg-success/10 text-success"
            }`}
          >
            {priority}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-primary">{discount}%</p>
            <p className="text-[10px] text-muted-foreground">Discount</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-success flex items-center justify-center gap-0.5">
              <TrendingUp className="h-3.5 w-3.5" />
              {revenueIncrease}
            </p>
            <p className="text-[10px] text-muted-foreground">Revenue ↑</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-2.5 text-center">
            <p className="text-lg font-bold text-foreground">{confidence}%</p>
            <p className="text-[10px] text-muted-foreground">Confidence</p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-muted-foreground">Confidence Score</span>
            <span className="font-medium text-foreground">{confidence}%</span>
          </div>
          <Progress value={confidence} className="h-1.5" />
        </div>

        <Button size="sm" className="w-full shadow-sm hover:shadow-md transition-all">
          <Sparkles className="h-3.5 w-3.5 mr-2" />
          Apply Discount
        </Button>
      </CardContent>
    </Card>
  );
}
