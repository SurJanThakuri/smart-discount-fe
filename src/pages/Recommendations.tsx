import { Brain, Sparkles, TrendingUp, AlertTriangle, Zap } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const recommendations = [
  { product: "Basmati Rice (5kg)", discount: 15, salesLift: "+23%", revenueImpact: "+₹4,200", confidence: 92, tag: "high", reason: "Stock overage + declining weekly sales" },
  { product: "Green Tea Pack", discount: 20, salesLift: "+31%", revenueImpact: "+₹1,800", confidence: 78, tag: "slow-moving", reason: "Near expiry date, low turnover rate" },
  { product: "Cooking Oil (1L)", discount: 10, salesLift: "+18%", revenueImpact: "+₹3,100", confidence: 87, tag: "high", reason: "Competitor offering lower prices" },
  { product: "Wheat Flour (2kg)", discount: 8, salesLift: "+12%", revenueImpact: "+₹1,500", confidence: 85, tag: "medium", reason: "Seasonal demand starting next week" },
  { product: "Sugar (1kg)", discount: 12, salesLift: "+15%", revenueImpact: "+₹900", confidence: 80, tag: "slow-moving", reason: "Excess stock, minimal movement in 2 weeks" },
  { product: "Hand Soap (250ml)", discount: 25, salesLift: "+40%", revenueImpact: "+₹650", confidence: 73, tag: "high", reason: "Critical stock but low demand, need clearance" },
];

const tagConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High Priority", className: "bg-destructive/10 text-destructive" },
  medium: { label: "Medium Priority", className: "bg-warning/10 text-warning" },
  "slow-moving": { label: "Slow Moving", className: "bg-info/10 text-info" },
};

export default function Recommendations() {
  return (
    <DashboardLayout title="AI Recommendations">
      {/* Hero banner */}
      <Card className="shadow-card border-0 gradient-hero mb-6">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
            <Brain className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary-foreground">AI-Powered Insights</h3>
            <p className="text-sm text-primary-foreground/80">
              {recommendations.length} recommendations generated based on your sales patterns, stock levels, and market trends.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <Card key={rec.product} className="shadow-card border-0 hover:shadow-card-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{rec.product}</h4>
                    <Badge variant="secondary" className={tagConfig[rec.tag].className}>
                      {tagConfig[rec.tag].label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    {rec.reason}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-xl font-bold text-primary">{rec.discount}%</p>
                    <p className="text-[10px] text-muted-foreground">Optimal Discount</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-success flex items-center gap-0.5">
                      <TrendingUp className="h-4 w-4" /> {rec.salesLift}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Sales Lift</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-foreground">{rec.revenueImpact}</p>
                    <p className="text-[10px] text-muted-foreground">Revenue Impact</p>
                  </div>
                  <div className="text-center w-20">
                    <p className="text-sm font-semibold text-foreground mb-1">{rec.confidence}%</p>
                    <Progress value={rec.confidence} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-0.5">Confidence</p>
                  </div>
                  <Button size="sm" className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
                    <Zap className="h-3.5 w-3.5 mr-1" /> Apply
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
