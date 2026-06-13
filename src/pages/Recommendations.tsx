import { motion } from "framer-motion";
import { Brain, Sparkles, TrendingUp, Zap, AlertTriangle, RefreshCw, Cpu } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAllProducts } from "@/hooks/useProducts";
import { useAllSales } from "@/hooks/useSales";
import { useDiscountPredictions } from "@/hooks/useDiscounts";

const container: any = {
  hidden: {}, show: { transition: { staggerChildren: 0.06 } },
};
const item: any = {
  hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
};

const priorityConfig: Record<string, { label: string; className: string }> = {
  high: { label: "High Priority", className: "bg-destructive/10 text-destructive" },
  medium: { label: "Medium Priority", className: "bg-warning/10 text-warning" },
  low: { label: "Low Priority", className: "bg-info/10 text-info" },
};

export default function Recommendations() {
  const { data: products, isLoading: productsLoading, isError: productsError, refetch: refetchProducts } = useAllProducts();
  const { data: sales, isLoading: salesLoading, isError: salesError, refetch: refetchSales } = useAllSales();

  const productsList = products ?? [];
  const salesList = sales ?? [];

  const { recommendations, isLoading: mlLoading, isMlDriven } = useDiscountPredictions({
    products: productsList,
    sales: salesList,
    enabled: !!products && !!sales,
  });

  const isLoading = productsLoading || salesLoading || mlLoading;
  const isError = productsError || salesError;

  const handleApply = (rec: { product: string; discount: number }) => {
    toast.success(`Applied ${rec.discount}% discount to "${rec.product}"`);
  };

  if (isError) {
    return (
      <DashboardLayout title="AI Recommendations">
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h3 className="text-lg font-semibold">Failed to load recommendations</h3>
          <p className="text-sm text-muted-foreground">Could not connect to the server.</p>
          <Button variant="outline" onClick={() => { refetchProducts(); refetchSales(); }}>
            <RefreshCw className="h-4 w-4 mr-2" /> Retry
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="AI Recommendations">
      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item}>
          <Card className="shadow-sm border-border/50 gradient-hero mb-6">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-primary-foreground">AI-Powered Insights</h3>
                  <p className="text-sm text-primary-foreground/80">
                    {recommendations.length} recommendations generated based on your sales patterns and stock levels.
                  </p>
                </div>
              </div>
              {isMlDriven ? (
                <Badge variant="secondary" className="bg-success/10 text-success gap-1 border-0">
                  <Cpu className="h-3 w-3" /> ML Engine
                </Badge>
              ) : null}
            </CardContent>
          </Card>
        </motion.div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-lg" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <motion.div key={rec.productId} variants={item}>
                <Card className="shadow-sm border-border/50 hover:shadow-md transition-all hover:-translate-y-1">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{rec.product}</h4>
                          <Badge variant="secondary" className={priorityConfig[rec.priority]?.className ?? ""}>
                            {priorityConfig[rec.priority]?.label ?? rec.priority}
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
                            <TrendingUp className="h-4 w-4" /> {rec.salesLift.toFixed(1)}x
                          </p>
                          <p className="text-[10px] text-muted-foreground">Sales Lift</p>
                        </div>
                        <div className="text-center w-20">
                          <p className="text-sm font-semibold text-foreground mb-1">{rec.confidence}%</p>
                          <Progress value={rec.confidence} className="h-1.5" />
                          <p className="text-[10px] text-muted-foreground mt-0.5">Confidence</p>
                        </div>
                        <Button
                          size="sm"
                          className="gradient-primary border-0 text-primary-foreground hover:opacity-90"
                          onClick={() => handleApply(rec)}
                        >
                          <Zap className="h-3.5 w-3.5 mr-1" /> Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div variants={item}>
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6 text-center text-muted-foreground text-sm">
                Add products and record sales to get AI-powered discount recommendations.
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
