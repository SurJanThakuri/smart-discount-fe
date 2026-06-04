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
    <Card 
      className={`relative overflow-hidden group transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md border-border/50 ${
        gradient ? "gradient-card text-primary-foreground border-transparent" : "bg-card"
      }`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-5 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 ${gradient ? "text-white" : "text-primary"}`}>
        <Icon className="h-24 w-24" />
      </div>
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className={`text-sm font-medium tracking-tight ${gradient ? "text-primary-foreground/90" : "text-muted-foreground"}`}>
              {title}
            </p>
            <p className={`text-3xl font-bold tracking-tight ${gradient ? "" : "text-foreground"}`}>
              {value}
            </p>
            {change && (
              <p className={`text-xs font-medium flex items-center gap-1 ${
                changeType === "positive"
                  ? gradient ? "text-primary-foreground" : "text-success"
                  : changeType === "negative"
                  ? gradient ? "text-rose-100" : "text-destructive"
                  : gradient ? "text-primary-foreground/80" : "text-muted-foreground"
              }`}>
                {change}
              </p>
            )}
          </div>
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110 ${
            gradient ? "bg-white/20 backdrop-blur-sm text-white" : "bg-primary/10 text-primary"
          }`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
