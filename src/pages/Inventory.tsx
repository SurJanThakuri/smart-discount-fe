import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Edit, Trash2, Filter, AlertTriangle, RefreshCw, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSchema } from "@/forms/schemas";
import {
  useAllProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { useAllCategories, useCreateCategory, useDeleteCategory } from "@/hooks/useCategories";
import { useAllSales } from "@/hooks/useSales";
import { useDiscountPredictions } from "@/hooks/useDiscounts";
import type { CreateProductRequest, UpdateProductRequest } from "@/types/index";

const container: any = {
  hidden: {}, show: { transition: { staggerChildren: 0.05 } },
};
const item: any = {
  hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
};

const statusColors: Record<string, string> = {
  "In Stock": "bg-success/10 text-success",
  "Low Stock": "bg-warning/10 text-warning",
  Critical: "bg-destructive/10 text-destructive",
};

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");

  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useAllProducts(search);
  const { data: categories, isLoading: categoriesLoading } = useAllCategories();
  const { data: sales } = useAllSales();
  const { mutate: createProduct, isPending: createLoading } = useCreateProduct();
  const { mutate: updateProduct, isPending: updateLoading } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: createCategory } = useCreateCategory();
  const { mutate: deleteCategory } = useDeleteCategory();

  const { recommendations: discountRecs } = useDiscountPredictions({
    products: products ?? [],
    sales: sales ?? [],
    enabled: !!products && !!sales,
  });

  const discountMap = new Map(discountRecs.map((r) => [r.productId, r]));

  const form = useForm<CreateProductRequest>({ resolver: zodResolver(productSchema) });
  const editForm = useForm<UpdateProductRequest>({ resolver: zodResolver(productSchema) });

  const productList = products ?? [];
  const categoryList = categories ?? [];

  const filtered = productList.filter(
    (p) => categoryFilter === "all" || p.categoryId === categoryFilter,
  );

  const getStockColor = (stock: number) => {
    if (stock <= 0) return "Out of Stock";
    if (stock < 5) return "Critical";
    if (stock < 10) return "Low Stock";
    return "In Stock";
  };

  const handleCreateProduct = (data: CreateProductRequest) => {
    createProduct(data, {
      onSuccess: () => { form.reset(); setDialogOpen(false); },
    });
  };

  const handleEditProduct = (productId: string) => {
    const product = productList.find((p) => p.id === productId);
    if (!product) return;
    setEditingProduct(productId);
    editForm.reset({
      name: product.name,
      categoryId: product.categoryId,
      price: product.price,
      stockQty: product.stockQty,
    });
    setEditDialogOpen(true);
  };

  const handleUpdateProduct = (data: UpdateProductRequest) => {
    if (!editingProduct) return;
    updateProduct(
      { productId: editingProduct, data },
      { onSuccess: () => { setEditDialogOpen(false); setEditingProduct(null); editForm.reset(); } },
    );
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId);
    }
  };

  const handleCreateCategory = () => {
    if (!categoryName.trim()) return;
    createCategory(
      { name: categoryName.trim() },
      { onSuccess: () => { setCategoryName(""); setCategoryDialogOpen(false); } },
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Delete this category? Products in this category may become uncategorized.")) {
      deleteCategory(categoryId);
    }
  };

  if (productsError) {
    return (
      <DashboardLayout title="Inventory">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load inventory</h3>
          <p className="text-sm text-muted-foreground">Could not connect to the server.</p>
          <Button variant="outline" onClick={() => refetchProducts()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Inventory">
      <motion.div variants={container} initial="hidden" animate="show">
        <Card className="shadow-sm border-border/50">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle className="text-base font-semibold">Products</CardTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 h-9 w-48 bg-secondary/50 border-0 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-background transition-colors"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-36 h-9 bg-secondary border-0">
                    <Filter className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryList.map((c) => (
                      <div key={c.id} className="flex items-center">
                        <SelectItem value={c.id} className="flex-1">{c.name}</SelectItem>
                      </div>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-9">
                      <Plus className="h-3.5 w-3.5 mr-1" /> Category
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Category name"
                          value={categoryName}
                          onChange={(e) => setCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
                        />
                        <Button onClick={handleCreateCategory}>Add</Button>
                      </div>
                      {categoryList.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground mb-2">Existing categories:</p>
                          {categoryList.map((c) => (
                            <div key={c.id} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                              <span className="text-sm">{c.name}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-destructive"
                                onClick={() => handleDeleteCategory(c.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gradient-primary border-0 text-primary-foreground shadow-sm hover:shadow-md transition-shadow">
                      <Plus className="h-4 w-4 mr-1" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleCreateProduct)} className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="productName">Product Name</Label>
                        <Input id="productName" placeholder="Enter product name" {...form.register("name")} />
                        {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select value={form.watch("categoryId")} onValueChange={(v) => form.setValue("categoryId", v)}>
                            <SelectTrigger className="bg-secondary border-0">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categoryList.map((c) => (
                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {form.formState.errors.categoryId && <p className="text-sm text-destructive">{form.formState.errors.categoryId.message}</p>}
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input id="price" type="number" step="0.01" placeholder="0" {...form.register("price", { valueAsNumber: true })} />
                          {form.formState.errors.price && <p className="text-sm text-destructive">{form.formState.errors.price.message}</p>}
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="stock">Stock Quantity</Label>
                        <Input id="stock" type="number" placeholder="0" {...form.register("stockQty", { valueAsNumber: true })} />
                        {form.formState.errors.stockQty && <p className="text-sm text-destructive">{form.formState.errors.stockQty.message}</p>}
                      </div>
                      <DialogFooter>
                        <Button type="submit" className="gradient-primary border-0 text-primary-foreground" disabled={createLoading}>
                          {createLoading ? "Creating..." : "Save Product"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-xl border border-border/50 bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">Discount</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productsLoading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                        {[...Array(7)].map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((product) => (
                      <TableRow key={product.id} className="border-b transition-colors hover:bg-muted/50">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {categoryList.find((c) => c.id === product.categoryId)?.name || "N/A"}
                        </TableCell>
                        <TableCell className="text-right">₹{Number(product.price).toFixed(2)}</TableCell>
                        <TableCell className="text-right">{product.stockQty}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={statusColors[getStockColor(Number(product.stockQty))]}>
                            {getStockColor(Number(product.stockQty))}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const rec = discountMap.get(product.id);
                            if (!rec) return <span className="text-xs text-muted-foreground">—</span>;
                            return (
                              <Badge variant="secondary" className="bg-success/10 text-success gap-1 text-xs border-0">
                                <Sparkles className="h-3 w-3" />
                                {rec.discount}%
                              </Badge>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditProduct(product.id)}>
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        {search || categoryFilter !== "all"
                          ? "No products match your filters"
                          : "No products yet. Click 'Add Product' to get started."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <form onSubmit={editForm.handleSubmit(handleUpdateProduct)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editName">Product Name</Label>
              <Input id="editName" placeholder="Enter product name" {...editForm.register("name")} />
              {editForm.formState.errors.name && <p className="text-sm text-destructive">{editForm.formState.errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editCategory">Category</Label>
                <Select value={editForm.watch("categoryId")} onValueChange={(v) => editForm.setValue("categoryId", v)}>
                  <SelectTrigger className="bg-secondary border-0">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryList.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPrice">Price (₹)</Label>
                <Input id="editPrice" type="number" step="0.01" placeholder="0" {...editForm.register("price", { valueAsNumber: true })} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editStock">Stock Quantity</Label>
              <Input id="editStock" type="number" placeholder="0" {...editForm.register("stockQty", { valueAsNumber: true })} />
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
