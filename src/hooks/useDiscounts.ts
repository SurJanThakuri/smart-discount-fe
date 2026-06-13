import { useQuery } from "@tanstack/react-query";
import { predictDiscounts } from "@/api/discounts";
import { buildFeatureVectors } from "@/utils/featureEngineer";
import type {
  DiscountPrediction,
  DiscountRecommendation,
  Product,
  Sale,
} from "@/types/index";

interface UseDiscountsParams {
  products: Product[];
  sales: Sale[];
  enabled?: boolean;
}

function predictionToRecommendation(
  pred: DiscountPrediction,
  product: Product | undefined,
): DiscountRecommendation {
  const discountPct = Math.round(pred.recommended_discount * 100);
  const confidencePct = Math.round(pred.confidence * 100);

  let priority: "high" | "medium" | "low" = "medium";
  let reason = "Stock level optimization needed";

  if (pred.slow_risk_probability > 0.5 && Number(product?.stockQty ?? 0) > 20) {
    priority = "high";
    reason = "High stock, declining sales trend";
  } else if (pred.slow_risk_probability > 0.3) {
    priority = "high";
    reason = "Slow-moving product, price reduction recommended";
  } else if (pred.revenue_impact > 10) {
    priority = "medium";
    reason = "Good discount opportunity with positive revenue impact";
  }

  return {
    productId: pred.product_id,
    product: product?.name ?? "Unknown Product",
    discount: discountPct,
    revenueIncrease: `+${pred.revenue_impact.toFixed(0)}%`,
    confidence: Math.min(confidencePct, 99),
    reason,
    priority,
    salesLift: pred.predicted_sales_lift,
    slowRisk: pred.slow_risk_probability,
  };
}

function clientSideFallback(
  product: Product,
  sales: Sale[],
): DiscountRecommendation {
  const productSales = sales.filter((s) => s.productId === product.id);
  const salesCount = productSales.length;
  const stockQty = Number(product.stockQty);
  const isLowStock = stockQty < 10;
  const hasLowSalesVelocity = salesCount < 3;

  const discount = hasLowSalesVelocity ? 20 : isLowStock ? 15 : 10;
  const confidence = Math.min(
    95,
    Math.max(65, 90 - salesCount * 5 + (hasLowSalesVelocity ? 10 : 0)),
  );

  let priority: "high" | "medium" | "low" = "medium";
  let reason = "Stock level optimization needed";

  if (stockQty > 20 && hasLowSalesVelocity) {
    priority = "high";
    reason = "High stock, declining sales trend";
  } else if (hasLowSalesVelocity) {
    priority = "high";
    reason = "Slow-moving product, price reduction recommended";
  }

  return {
    productId: product.id,
    product: product.name,
    discount,
    revenueIncrease: `+${(discount * 1.5).toFixed(0)}%`,
    confidence,
    reason,
    priority,
    salesLift: 1 + discount / 100,
    slowRisk: hasLowSalesVelocity ? 0.6 : 0.1,
  };
}

function computeDiscountsLocally(
  products: Product[],
  sales: Sale[],
): DiscountRecommendation[] {
  return products.map((product) => clientSideFallback(product, sales));
}

export function useDiscountPredictions({
  products,
  sales,
  enabled = true,
}: UseDiscountsParams) {
  const hasProducts = products.length > 0;
  const productIds = products.map((p) => p.id).sort().join(",");
  const featureVectors = hasProducts ? buildFeatureVectors(products, sales) : [];

  const mlQuery = useQuery({
    queryKey: ["discounts", "predictions", productIds],
    queryFn: () => predictDiscounts(featureVectors),
    enabled: enabled && hasProducts,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const isMlReady = mlQuery.data && !mlQuery.isError;
  const isMlLoading = mlQuery.isLoading || mlQuery.isFetching;

  if (isMlReady) {
    const recommendations = mlQuery.data.map((pred) =>
      predictionToRecommendation(
        pred,
        products.find((p) => p.id === pred.product_id),
      ),
    );

    return {
      recommendations,
      isLoading: false,
      isError: false,
      isMlDriven: true,
      refetch: mlQuery.refetch,
    };
  }

  const localRecommendations = hasProducts
    ? computeDiscountsLocally(products, sales)
    : [];

  return {
    recommendations: localRecommendations,
    isLoading: isMlLoading && hasProducts,
    isError: mlQuery.isError && !mlQuery.isFetching,
    isMlDriven: false,
    refetch: mlQuery.refetch,
  };
}
