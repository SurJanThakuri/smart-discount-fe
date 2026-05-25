import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  gradient?: boolean;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, gradient }: StatCardProps) {
  return (
    <Card className={`shadow-card border-0 ${gradient ? "gradient-primary text-primary-foreground" : ""}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className={`text-sm font-medium ${gradient ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
              {title}
            </p>
            <p className={`text-2xl font-bold mt-1 ${gradient ? "" : "text-foreground"}`}>{value}</p>
            {change && (
              <p className={`text-xs mt-1 font-medium ${
                changeType === "positive"
                  ? gradient ? "text-primary-foreground/90" : "text-success"
                  : changeType === "negative"
                  ? "text-destructive"
                  : "text-muted-foreground"
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${
            gradient ? "bg-primary-foreground/20" : "bg-primary/10"
          }`}>
            <Icon className={`h-5 w-5 ${gradient ? "text-primary-foreground" : "text-primary"}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
