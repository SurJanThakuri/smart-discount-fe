import { motion } from "framer-motion";
import {
  DollarSign,
  Package,
  AlertTriangle,
  Percent,
  Brain,
  RefreshCw,
  Cpu,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { StatCard } from "@/components/StatCard";
import { RecommendationCard } from "@/components/RecommendationCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAllSales } from "@/hooks/useSales";
import { useAllProducts } from "@/hooks/useProducts";
import { useDiscountPredictions } from "@/hooks/useDiscounts";
import { Skeleton } from "@/components/ui/skeleton";

const container: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const item: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Dashboard() {
  const { data: sales, isLoading: salesLoading, isError: salesError, refetch: refetchSales } = useAllSales();
  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useAllProducts();

  const salesList = sales ?? [];
  const productsList = products ?? [];

  const { recommendations, isMlDriven } = useDiscountPredictions({
    products: productsList,
    sales: salesList,
    enabled: !!products && !!sales,
  });

  const totalRevenue = salesList.reduce((acc, sale) => acc + Number(sale.amount), 0);
  const totalProducts = productsList.length;
  const lowStockItems = productsList.filter((p) => Number(p.stockQty) < 10).length;

  const salesData = salesList.slice(-7).map((sale, idx) => ({
    name: new Date(sale.date).toLocaleDateString("en-IN", { weekday: "short" }) || `Day ${idx + 1}`,
    sales: Number(sale.amount),
  }));

  const productSalesMap = new Map<string, number>();
  salesList.forEach((s) => {
    productSalesMap.set(s.productId, (productSalesMap.get(s.productId) ?? 0) + Number(s.amount));
  });

  const productData = productsList
    .slice(0, 6)
    .map((p) => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + "..." : p.name,
      revenue: productSalesMap.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const dashboardRecommendations = recommendations.slice(0, 4);

  const isLoading = salesLoading || productsLoading;
  const isError = salesError || productsError;

  if (isError) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load dashboard</h3>
          <p className="text-sm text-muted-foreground">Could not connect to the server. Please try again.</p>
          <Button variant="outline" onClick={() => { refetchSales(); refetchProducts(); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            [...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)
          ) : (
            <>
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${(totalRevenue / 1000).toFixed(1)}K`}
                change={`${salesList.length} sales recorded`}
                changeType="positive"
                gradient
              />
              <StatCard
                icon={Package}
                title="Total Products"
                value={totalProducts.toString()}
                change={`${productsList.filter((p) => Number(p.stockQty) > 0).length} in stock`}
                changeType="positive"
              />
              <StatCard
                icon={AlertTriangle}
                title="Low Stock Items"
                value={lowStockItems.toString()}
                change={`out of ${totalProducts} products`}
                changeType={lowStockItems > 0 ? "negative" : "neutral"}
              />
              <StatCard
                icon={Percent}
                title="Active Discounts"
                value={dashboardRecommendations.length.toString()}
                change="AI-suggested discounts"
                changeType="neutral"
              />
            </>
          )}
        </motion.div>

        <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : salesData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No sales data yet. Start recording sales to see trends.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none", boxShadow: "var(--shadow-md)" }} />
                    <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Product Performance</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 rounded-lg" />
              ) : productData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  Add products and record sales to see performance.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={productData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none" }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Brain className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-foreground">AI Recommendations</h3>
                <p className="text-xs text-muted-foreground">Based on sales trends and stock levels</p>
              </div>
            </div>
            {isMlDriven ? (
              <Badge variant="secondary" className="bg-success/10 text-success gap-1">
                <Cpu className="h-3 w-3" /> ML Engine
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-warning/10 text-warning gap-1">
                <Brain className="h-3 w-3" /> Heuristic
              </Badge>
            )}
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
            </div>
          ) : dashboardRecommendations.length === 0 ? (
            <Card className="shadow-card border-0">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                Add products to get AI-powered discount recommendations.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardRecommendations.map((rec) => (
                <RecommendationCard
                  key={rec.productId}
                  product={rec.product}
                  discount={rec.discount}
                  revenueIncrease={rec.revenueIncrease}
                  confidence={rec.confidence}
                  reason={rec.reason}
                  priority={rec.priority}
                />
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
