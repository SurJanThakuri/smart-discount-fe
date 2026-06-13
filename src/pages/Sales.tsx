import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, Pencil, Trash2 } from "lucide-react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useAllSales, useCreateSale, useUpdateSale, useDeleteSale } from "@/hooks/useSales";
import { useAllProducts } from "@/hooks/useProducts";
import { useDiscountPredictions } from "@/hooks/useDiscounts";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import type { Sale } from "@/types/index";

const container: any = {
  hidden: {}, show: { transition: { staggerChildren: 0.06 } },
};
const item: any = {
  hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

export default function Sales() {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const { data: sales, isLoading: salesLoading } = useAllSales();
  const { data: products, isLoading: productsLoading } = useAllProducts();
  const { mutate: createSale, isPending: createLoading } = useCreateSale();
  const { mutate: updateSale, isPending: updateLoading } = useUpdateSale();
  const { mutate: deleteSale } = useDeleteSale();

  const { recommendations: discountRecs } = useDiscountPredictions({
    products: products ?? [],
    sales: sales ?? [],
    enabled: !!products && !!sales,
  });

  const discountMap = new Map(discountRecs.map((r) => [r.productId, r]));

  const form = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  const editForm = useForm<SaleFormData>({
    resolver: zodResolver(saleSchema),
  });

  const selectedProductId = form.watch("productId");
  const selectedDiscount = selectedProductId
    ? discountMap.get(selectedProductId)
    : undefined;

  const salesList = sales ?? [];

  // Group sales by date for the chart (last 7 days)
  const salesByDate = new Map<string, number>();
  salesList.forEach((s) => {
    const day = new Date(s.date).toISOString().slice(0, 10);
    salesByDate.set(day, (salesByDate.get(day) ?? 0) + Number(s.amount));
  });
  const sortedDays = [...salesByDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7);
  const salesHistory = sortedDays.map(([date, revenue]) => ({
    date: new Date(date).toLocaleDateString("en-IN", { weekday: "short" }),
    revenue,
  }));

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

  const openEditDialog = (sale: Sale) => {
    setEditingSale(sale);
    editForm.reset({
      productId: sale.productId,
      qty: sale.qty,
      amount: sale.amount,
      date: new Date(sale.date).toISOString().slice(0, 10),
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSale = (data: SaleFormData) => {
    if (!editingSale) return;
    updateSale(
      { saleId: editingSale.id, data },
      {
        onSuccess: () => {
          setEditDialogOpen(false);
          setEditingSale(null);
        },
      },
    );
  };

  const handleDeleteSale = (sale: Sale) => {
    if (!window.confirm(`Delete this sale of ₹${Number(sale.amount).toFixed(2)}?`)) return;
    deleteSale(sale.id);
  };

  return (
    <DashboardLayout title="Sales Management">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Entry Form */}
          <motion.div variants={item}>
          <Card className="shadow-sm border-border/50">
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
                  {selectedDiscount && (
                    <div className="rounded-lg bg-success/5 border border-success/20 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Recommended Discount</span>
                        <span className="font-bold text-success">{selectedDiscount.discount}%</span>
                      </div>
                      <Progress value={selectedDiscount.confidence} className="h-1" />
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Confidence: {selectedDiscount.confidence}%</span>
                        <span>Lift: {selectedDiscount.salesLift.toFixed(1)}x</span>
                      </div>
                    </div>
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
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">
                Sales History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {salesLoading ? (
                <Skeleton className="h-96 rounded-lg" />
              ) : salesHistory.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                  No sales data yet. Record a sale to see the chart.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={salesHistory}>
                    <defs>
                      <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip contentStyle={{ borderRadius: "0.5rem", border: "none", boxShadow: "var(--shadow-md)" }} />
                    <Area type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#salesGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          </motion.div>
        </div>

        {/* Sales List */}
        <motion.div variants={item}>
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base font-semibold">All Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-border/50 bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-secondary/50">
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Qty</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {salesLoading ? (
                      [...Array(5)].map((_, i) => (
                        <TableRow key={i}>
                          {[...Array(5)].map((_, j) => (
                            <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : salesList.length > 0 ? (
                      [...salesList].reverse().slice(0, 20).map((sale) => (
                        <TableRow key={sale.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {products?.find((p) => p.id === sale.productId)?.name ?? sale.productId.slice(0, 8)}
                          </TableCell>
                          <TableCell className="text-right">{sale.qty}</TableCell>
                          <TableCell className="text-right">₹{Number(sale.amount).toFixed(2)}</TableCell>
                          <TableCell>{new Date(sale.date).toLocaleDateString("en-IN")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(sale)}>
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteSale(sale)}>
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No sales recorded yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Edit Sale Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateSale)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Product</Label>
              <Select
                value={editForm.watch("productId")}
                onValueChange={(v) => editForm.setValue("productId", v)}>
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  {products?.map((product) => (
                    <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input type="number" {...editForm.register("qty", { valueAsNumber: true })} />
              </div>
              <div className="grid gap-2">
                <Label>Amount (₹)</Label>
                <Input type="number" step="0.01" {...editForm.register("amount", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" {...editForm.register("date")} />
            </div>
            <DialogFooter>
              <Button type="submit" className="gradient-primary border-0 text-primary-foreground" disabled={updateLoading}>
                {updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
