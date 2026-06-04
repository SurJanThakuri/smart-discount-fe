import { motion } from "framer-motion";
import { Upload, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { saleSchema, type SaleFormData } from "@/forms/schemas";
import { useAllSales, useCreateSale } from "@/hooks/useSales";
import { useAllProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";

const container: any = {
  hidden: {}, show: { transition: { staggerChildren: 0.06 } },
};
const item: any = {
  hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Sales() {
  const { data: sales, isLoading: salesLoading } = useAllSales();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { mutate: createSale, isPending: createLoading } = useCreateSale();

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  // Transform sales data for chart (last 7 days)
  const salesHistory =
    sales?.slice(-7).map((sale, idx) => ({
      date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx],
      revenue: sale.amount,
    })) ?? [];

  const handleCreateSale = (data: SaleFormData) => {
    createSale(
      {
        productId: data.productId,
        qty: data.qty,
        amount: data.amount,
        date: data.date,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      },
    );
  };

  return (
    <DashboardLayout title="Sales Management">
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entry Form */}
        <motion.div variants={item}>
        <Card className="shadow-sm border-border/50 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Record Sale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              onSubmit={form.handleSubmit(handleCreateSale)}
              className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="product">Product</Label>
                <Select
                  value={form.watch("productId")}
                  onValueChange={(value) => form.setValue("productId", value)}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {productsLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : (
                      products?.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.productId && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.productId.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-2">
                  <Label htmlFor="qty">Quantity</Label>
                  <Input
                    id="qty"
                    type="number"
                    placeholder="0"
                    className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-colors"
                    {...form.register("qty", { valueAsNumber: true })}
                  />
                  {form.formState.errors.qty && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.qty.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0"
                    className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-colors"
                    {...form.register("amount", { valueAsNumber: true })}
                  />
                  {form.formState.errors.amount && (
                    <p className="text-xs text-destructive">
                      {form.formState.errors.amount.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="saleDate">Date</Label>
                  <Input
                    id="saleDate"
                    type="date"
                    className="bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-colors"
                    {...form.register("date")}
                  />
                  {form.formState.errors.date && (
                    <p className="text-sm text-destructive">
                      {form.formState.errors.date.message}
                    </p>
                  )}
              </div>
              <Button
                type="submit"
                className="w-full gradient-primary border-0 text-primary-foreground shadow-sm hover:shadow-md transition-shadow"
                disabled={createLoading}>
                <Plus className="h-4 w-4 mr-1.5" />{" "}
                {createLoading ? "Recording..." : "Record Sale"}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" disabled>
                <Upload className="h-4 w-4 mr-1.5" /> Upload CSV
              </Button>
            </form>
          </CardContent>
        </Card>
        </motion.div>

        {/* Sales Chart */}
        <motion.div variants={item}>
        <Card className="shadow-sm border-border/50 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Sales History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <Skeleton className="h-96 rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={salesHistory}>
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "0.5rem",
                      border: "none",
                      boxShadow: "var(--shadow-md)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#salesGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
}
