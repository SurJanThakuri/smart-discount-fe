import { Upload, Plus } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

const salesHistory = [
  { date: "Jan", revenue: 42000 }, { date: "Feb", revenue: 38000 },
  { date: "Mar", revenue: 51000 }, { date: "Apr", revenue: 46000 },
  { date: "May", revenue: 62000 }, { date: "Jun", revenue: 71000 },
];

export default function Sales() {
  return (
    <DashboardLayout title="Sales Management">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entry Form */}
        <Card className="shadow-card border-0 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Record Sale</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label>Product</Label>
              <Select>
                <SelectTrigger className="bg-secondary border-0">
                  <SelectValue placeholder="Select product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rice">Basmati Rice (5kg)</SelectItem>
                  <SelectItem value="oil">Cooking Oil (1L)</SelectItem>
                  <SelectItem value="tea">Green Tea Pack</SelectItem>
                  <SelectItem value="flour">Wheat Flour (2kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="0" className="bg-secondary border-0" />
              </div>
              <div className="grid gap-2">
                <Label>Amount (₹)</Label>
                <Input type="number" placeholder="0" className="bg-secondary border-0" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input type="date" className="bg-secondary border-0" />
            </div>
            <Button className="w-full gradient-primary border-0 text-primary-foreground">
              <Plus className="h-4 w-4 mr-1.5" /> Record Sale
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-1.5" /> Upload CSV
            </Button>
          </CardContent>
        </Card>

        {/* Sales Chart */}
        <Card className="shadow-card border-0 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Sales History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
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
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
