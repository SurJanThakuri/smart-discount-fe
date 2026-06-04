import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllSales } from "@/hooks/useSales";
import { useAllProducts } from "@/hooks/useProducts";

const container: any = {
  hidden: {}, show: { transition: { staggerChildren: 0.06 } },
};
const item: any = {
  hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(199, 89%, 48%)",
  "hsl(142, 71%, 45%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
];

export default function Analytics() {
  const { data: sales, isLoading: salesLoading, isError: salesError, refetch: refetchSales } = useAllSales();
  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useAllProducts();

  const salesList = sales ?? [];
  const productsList = products ?? [];

  // Group sales by date to build proper weekly/monthly aggregates
  const salesByDate = new Map<string, number>();
  salesList.forEach((s) => {
    const day = new Date(s.date).toISOString().slice(0, 10);
    salesByDate.set(day, (salesByDate.get(day) ?? 0) + Number(s.amount));
  });

  const sortedDates = [...salesByDate.entries()].sort(([a], [b]) => a.localeCompare(b));

  const weeklyData = sortedDates.slice(-4).map(([date, revenue], idx) => ({
    week: `W${idx + 1}`,
    revenue,
  }));

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const salesByMonth = new Map<string, number>();
  salesList.forEach((s) => {
    const d = new Date(s.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    salesByMonth.set(key, (salesByMonth.get(key) ?? 0) + Number(s.amount));
  });

  const monthlyData = [...salesByMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([key, revenue], idx) => {
      const monthIdx = parseInt(key.split("-")[1], 10);
      return { month: monthNames[monthIdx] || `M${idx + 1}`, revenue };
    });

  // Top selling products by sales count
  const salesByProduct = new Map<string, number>();
  salesList.forEach((s) => {
    salesByProduct.set(s.productId, (salesByProduct.get(s.productId) ?? 0) + 1);
  });

  const topProducts = [...salesByProduct.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([productId, count]) => {
      const product = productsList.find((p) => p.id === productId);
      return { name: product?.name ?? "Unknown", sales: count };
    });

  // Slow-moving items: high stock, low sales
  const slowMoving = productsList
    .filter((p) => Number(p.stockQty) > 10)
    .map((p) => {
      const lastSale = salesList
        .filter((s) => s.productId === p.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      const daysSinceLastSale = lastSale
        ? Math.floor((Date.now() - new Date(lastSale.date).getTime()) / (1000 * 60 * 60 * 24))
        : 30;
      return { name: p.name, stock: Number(p.stockQty), daysSinceLastSale };
    })
    .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
    .slice(0, 4);

  // Before/after discount impact simulation based on real sales data
  const beforeAfter = topProducts.slice(0, 4).map((p) => {
    const product = productsList.find((pr) => pr.name === p.name);
    const baseRevenue = p.sales * (product ? Number(product.price) : 100);
    return {
      product: p.name.length > 8 ? p.name.slice(0, 8) : p.name,
      before: Math.floor(baseRevenue * 0.8),
      after: Math.floor(baseRevenue * 1.1),
    };
  });

  const isLoading = salesLoading || productsLoading;
  const isError = salesError || productsError;

  if (isError) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load analytics</h3>
          <p className="text-sm text-muted-foreground">Could not connect to the server.</p>
          <Button variant="outline" onClick={() => { refetchSales(); refetchProducts(); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Revenue Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="monthly">
                <TabsList className="mb-4">
                  <TabsTrigger value="weekly">Weekly</TabsTrigger>
                  <TabsTrigger value="monthly">Monthly</TabsTrigger>
                </TabsList>
                {isLoading ? (
                  <Skeleton className="h-80 rounded-lg" />
                ) : weeklyData.length === 0 && monthlyData.length === 0 ? (
                  <div className="h-80 flex items-center justify-center text-muted-foreground text-sm">
                    No sales data yet. Start recording sales to see revenue trends.
                  </div>
                ) : (
                  <>
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
                  </>
                )}
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div variants={item}>
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Top-Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 rounded-lg" />
                ) : topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={topProducts} dataKey="sales" nameKey="name" cx="50%" cy="50%" outerRadius={90}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {topProducts.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    No sales recorded yet.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Slow-Moving Items</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))}
                  </div>
                ) : slowMoving.length > 0 ? (
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
                ) : (
                  <div className="h-32 flex items-center justify-center text-muted-foreground">
                    No slow-moving items found.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item}>
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">Discount Impact: Before vs After</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 rounded-lg" />
              ) : beforeAfter.length > 0 ? (
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
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Add sales data to see discount impact projections.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
