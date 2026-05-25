import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from "recharts";

const weeklyData = [
  { week: "W1", revenue: 42000 }, { week: "W2", revenue: 38000 },
  { week: "W3", revenue: 51000 }, { week: "W4", revenue: 46000 },
];

const monthlyData = [
  { month: "Jan", revenue: 180000 }, { month: "Feb", revenue: 165000 },
  { month: "Mar", revenue: 210000 }, { month: "Apr", revenue: 195000 },
  { month: "May", revenue: 240000 }, { month: "Jun", revenue: 284000 },
];

const topProducts = [
  { name: "Rice", sales: 450 }, { name: "Oil", sales: 380 },
  { name: "Flour", sales: 320 }, { name: "Sugar", sales: 290 },
  { name: "Tea", sales: 210 },
];

const slowMoving = [
  { name: "Hand Soap", stock: 85, daysSinceLastSale: 12 },
  { name: "Biscuits", stock: 120, daysSinceLastSale: 8 },
  { name: "Candles", stock: 200, daysSinceLastSale: 15 },
  { name: "Notebooks", stock: 95, daysSinceLastSale: 10 },
];

const beforeAfter = [
  { product: "Rice", before: 12000, after: 15200 },
  { product: "Tea", before: 4500, after: 6800 },
  { product: "Oil", before: 9200, after: 11500 },
  { product: "Sugar", before: 3800, after: 4900 },
];

const COLORS = [
  "hsl(217, 91%, 60%)", "hsl(199, 89%, 48%)", "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)", "hsl(0, 72%, 51%)",
];

export default function Analytics() {
  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Revenue Tabs */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monthly">
              <TabsList className="mb-4">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
              <TabsContent value="weekly">
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none" }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="monthly">
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none" }} />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Top-Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={topProducts} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {topProducts.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Slow Moving */}
          <Card className="shadow-card border-0">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Slow-Moving Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {slowMoving.map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div>
                      <p className="font-medium text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Stock: {item.stock} units</p>
                    </div>
                    <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                      {item.daysSinceLastSale}d idle
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Before vs After */}
        <Card className="shadow-card border-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Discount Impact: Before vs After</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={beforeAfter}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="product" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none" }} />
                <Legend />
                <Bar dataKey="before" name="Before Discount" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="after" name="After Discount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
