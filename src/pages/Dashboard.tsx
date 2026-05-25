import { DollarSign, Package, AlertTriangle, Percent, Brain } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Mon", sales: 4200 }, { name: "Tue", sales: 3800 },
  { name: "Wed", sales: 5100 }, { name: "Thu", sales: 4600 },
  { name: "Fri", sales: 6200 }, { name: "Sat", sales: 7100 },
  { name: "Sun", sales: 5800 },
];

const productData = [
  { name: "Rice", revenue: 12400 }, { name: "Sugar", revenue: 9800 },
  { name: "Oil", revenue: 8200 }, { name: "Flour", revenue: 7600 },
  { name: "Tea", revenue: 6100 }, { name: "Soap", revenue: 5400 },
];

const recommendations = [
  { product: "Basmati Rice (5kg)", discount: 15, revenueIncrease: "+23%", confidence: 92, reason: "High stock, declining sales trend", priority: "high" as const },
  { product: "Cooking Oil (1L)", discount: 10, revenueIncrease: "+18%", confidence: 87, reason: "Competitor pricing pressure", priority: "medium" as const },
  { product: "Green Tea Pack", discount: 20, revenueIncrease: "+31%", confidence: 78, reason: "Slow-moving, near expiry", priority: "high" as const },
  { product: "Wheat Flour (2kg)", discount: 8, revenueIncrease: "+12%", confidence: 85, reason: "Seasonal demand opportunity", priority: "low" as const },
];

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={DollarSign} title="Total Revenue" value="₹2,84,500" change="+12.5% from last month" changeType="positive" gradient />
          <StatCard icon={Package} title="Total Products" value="1,247" change="+24 new this week" changeType="positive" />
          <StatCard icon={AlertTriangle} title="Low Stock Items" value="18" change="3 critical" changeType="negative" />
          <StatCard icon={Percent} title="Active Discounts" value="12" change="4 AI-suggested" changeType="neutral" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none", boxShadow: "var(--shadow-md)" }} />
                  <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={productData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none", boxShadow: "var(--shadow-md)" }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Brain className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">AI Recommendations</h3>
              <p className="text-xs text-muted-foreground">Based on sales trends and stock levels</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((rec) => (
              <RecommendationCard key={rec.product} {...rec} />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
