import { useState } from "react";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const products = [
  { id: 1, name: "Basmati Rice (5kg)", category: "Grains", price: 320, stock: 45, status: "In Stock" },
  { id: 2, name: "Cooking Oil (1L)", category: "Oils", price: 180, stock: 12, status: "Low Stock" },
  { id: 3, name: "Green Tea Pack", category: "Beverages", price: 150, stock: 5, status: "Critical" },
  { id: 4, name: "Wheat Flour (2kg)", category: "Grains", price: 95, stock: 78, status: "In Stock" },
  { id: 5, name: "Detergent (500g)", category: "Cleaning", price: 120, stock: 34, status: "In Stock" },
  { id: 6, name: "Sugar (1kg)", category: "Essentials", price: 48, stock: 8, status: "Low Stock" },
  { id: 7, name: "Milk Powder (200g)", category: "Dairy", price: 210, stock: 22, status: "In Stock" },
  { id: 8, name: "Hand Soap (250ml)", category: "Personal Care", price: 65, stock: 3, status: "Critical" },
];

const statusColors: Record<string, string> = {
  "In Stock": "bg-success/10 text-success",
  "Low Stock": "bg-warning/10 text-warning",
  "Critical": "bg-destructive/10 text-destructive",
};

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (categoryFilter === "all" || p.category === categoryFilter)
  );

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <DashboardLayout title="Inventory">
      <Card className="shadow-card border-0">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-base font-semibold">Products</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-9 h-9 w-56 bg-secondary border-0"
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
                  {categories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gradient-primary border-0 text-primary-foreground">
                    <Plus className="h-4 w-4 mr-1" /> Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label>Product Name</Label>
                      <Input placeholder="Enter product name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Category</Label>
                        <Input placeholder="Category" />
                      </div>
                      <div className="grid gap-2">
                        <Label>Price (₹)</Label>
                        <Input type="number" placeholder="0" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label>Stock Quantity</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="gradient-primary border-0 text-primary-foreground">Save Product</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-right">₹{product.price}</TableCell>
                    <TableCell className="text-right">{product.stock}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={statusColors[product.status]}>
                        {product.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
