import type { Product, Sale } from "@/types/index";

const DEFAULT_PROFIT_MARGIN = 0.3;

interface FeatureVector {
  sales_velocity_7d: number;
  sales_velocity_30d: number;
  days_since_last_sale: number;
  profit_margin: number;
  day_of_week: number;
  month: number;
  quarter: number;
  is_weekend: number;
  current_stock: number;
}

function daysBetween(date1: Date, date2: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((date1.getTime() - date2.getTime()) / msPerDay);
}

function getDayOfWeek(date: Date): number {
  return date.getDay();
}

function getMonth(date: Date): number {
  return date.getMonth() + 1;
}

function getQuarter(date: Date): number {
  return Math.ceil(getMonth(date) / 3);
}

function isWeekend(date: Date): number {
  const day = date.getDay();
  return day === 0 || day === 6 ? 1 : 0;
}

function computeSalesVelocity(
  sales: Sale[],
  productId: string,
  days: number,
): number {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  const recentSales = sales.filter(
    (s) =>
      s.productId === productId && new Date(s.date).getTime() >= cutoff.getTime(),
  );

  const totalQty = recentSales.reduce((sum, s) => sum + s.qty, 0);
  return Math.round((totalQty / days) * 100) / 100;
}

export function buildFeatureVectors(
  products: Product[],
  sales: Sale[],
): { product_id: string; features: FeatureVector }[] {
  const now = new Date();

  return products.map((product) => {
    const productSales = sales.filter((s) => s.productId === product.id);
    const sortedSales = [...productSales].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const lastSale = sortedSales[0];

    const daysSinceLastSale = lastSale
      ? Math.max(0, daysBetween(now, new Date(lastSale.date)))
      : 30;

    return {
      product_id: product.id,
      features: {
        sales_velocity_7d: computeSalesVelocity(sales, product.id, 7),
        sales_velocity_30d: computeSalesVelocity(sales, product.id, 30),
        days_since_last_sale: daysSinceLastSale,
        profit_margin: DEFAULT_PROFIT_MARGIN,
        day_of_week: getDayOfWeek(now),
        month: getMonth(now),
        quarter: getQuarter(now),
        is_weekend: isWeekend(now),
        current_stock: Number(product.stockQty),
      },
    };
  });
}
