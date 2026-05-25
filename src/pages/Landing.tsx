import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Brain, Package, BarChart3, TrendingUp, Sparkles, Zap, Upload, LineChart,
  ArrowRight, DollarSign, Percent, Box, ShieldCheck, Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";

const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger: any = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const features = [
  { icon: Brain, title: "AI Discount Recommendations", desc: "Smart pricing suggestions powered by machine learning models trained on your data." },
  { icon: Package, title: "Inventory Management", desc: "Track stock levels, suppliers and movements in real time with smart alerts." },
  { icon: BarChart3, title: "Sales Analytics", desc: "Beautiful dashboards that turn raw transactions into actionable insights." },
  { icon: TrendingUp, title: "Revenue Insights", desc: "Understand what's driving growth and what's holding your shop back." },
  { icon: Box, title: "Smart Product Tracking", desc: "Identify slow movers, top sellers, and seasonal patterns automatically." },
  { icon: Sparkles, title: "Predictive Sales Intelligence", desc: "Forecast demand and prepare your inventory before the rush hits." },
];

const sampleRecs = [
  { product: "Basmati Rice (5kg)", discount: 15, lift: "+23%", confidence: 92, reason: "High stock, declining weekly sales" },
  { product: "Green Tea Pack", discount: 20, lift: "+31%", confidence: 78, reason: "Slow moving, approaching expiry" },
  { product: "Cooking Oil (1L)", discount: 10, lift: "+18%", confidence: 87, reason: "Competitor pricing pressure detected" },
];

const steps = [
  { icon: Upload, title: "Upload Sales Data", desc: "Connect your POS or upload a CSV. We handle the rest." },
  { icon: Brain, title: "AI Analyzes Trends", desc: "Our models surface patterns across stock, sales and seasonality." },
  { icon: Zap, title: "Apply Smart Discounts", desc: "Approve recommendations in one click and track the lift live." },
];

function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/50">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">DiscountIQ</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#ai" className="hover:text-foreground transition-colors">AI Engine</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm" className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
            <Link to="/dashboard">Launch Dashboard</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* gradient blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 -left-20 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute top-40 right-0 h-96 w-96 rounded-full bg-info/20 blur-3xl" />
      </div>

      <div className="container mx-auto px-6 pt-20 pb-24 text-center">
        <motion.div initial="hidden" animate="show" variants={stagger} className="max-w-3xl mx-auto">
          <motion.div variants={fadeUp}>
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 mb-6">
              <Sparkles className="h-3 w-3 mr-1" /> AI-powered retail intelligence
            </Badge>
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
            AI-Powered Smart Discounts<br />
            <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              for Modern Shops
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage inventory, track sales, and get intelligent discount recommendations powered by machine learning — built for small shop owners who want to grow smarter.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg" className="gradient-primary border-0 text-primary-foreground hover:opacity-90">
              <Link to="/dashboard">Get Started <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/dashboard">View Dashboard</Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* mock dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card shadow-card-lg overflow-hidden p-4 md:p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { icon: DollarSign, label: "Revenue", value: "₹2,84,500", grad: true },
                { icon: Package, label: "Products", value: "1,247" },
                { icon: Percent, label: "Active Discounts", value: "12" },
                { icon: TrendingUp, label: "Growth", value: "+12.5%" },
              ].map((s, i) => (
                <div key={i} className={`rounded-xl p-4 text-left ${s.grad ? "gradient-primary text-primary-foreground" : "bg-secondary"}`}>
                  <s.icon className={`h-4 w-4 mb-2 ${s.grad ? "" : "text-primary"}`} />
                  <p className={`text-xs ${s.grad ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{s.label}</p>
                  <p className="text-lg font-bold">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-secondary/50 p-6 h-48 flex items-end gap-2">
              {[40, 65, 50, 80, 60, 95, 75].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: 0.8 + i * 0.08, duration: 0.6 }}
                  className="flex-1 rounded-md gradient-primary"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={stagger} className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">
            Everything your shop needs in one place
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
            A complete retail toolkit, designed to feel as smart as the AI behind it.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={fadeUp}>
              <Card className="group border-border/50 bg-card/60 backdrop-blur shadow-card hover:shadow-card-lg hover:-translate-y-1 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <f.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AIShowcase() {
  return (
    <section id="ai" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="bg-primary/10 text-primary border-0 mb-4">
              <Brain className="h-3 w-3 mr-1" /> AI Engine
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Recommendations that actually understand your shop
            </h2>
            <p className="text-muted-foreground mb-6">
              Our models continuously learn from your sales trends, stock levels and seasonality — surfacing the exact discount that maximizes revenue without giving away margin.
            </p>
            <div className="space-y-3">
              {[
                "Trained on real retail sales data",
                "Confidence scores for every suggestion",
                "Explainable reasoning, not a black box",
              ].map((b) => (
                <div key={b} className="flex items-center gap-3 text-sm text-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> {b}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger} className="space-y-3"
          >
            {sampleRecs.map((r) => (
              <motion.div key={r.product} variants={fadeUp}>
                <Card className="border-border/50 shadow-card hover:shadow-card-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Brain className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">{r.product}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Sparkles className="h-3 w-3 text-primary" /> {r.reason}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-success/10 text-success border-0 shrink-0">
                        {r.lift}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="bg-secondary rounded-lg p-2 text-center">
                        <p className="text-base font-bold text-primary">{r.discount}%</p>
                        <p className="text-[10px] text-muted-foreground">Discount</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-2 text-center">
                        <p className="text-base font-bold text-success">{r.lift}</p>
                        <p className="text-[10px] text-muted-foreground">Sales Lift</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-2 text-center">
                        <p className="text-base font-bold text-foreground">{r.confidence}%</p>
                        <p className="text-[10px] text-muted-foreground">Confidence</p>
                      </div>
                    </div>
                    <Progress value={r.confidence} className="h-1.5" />
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            <p className="text-xs text-muted-foreground text-center pt-2">
              Recommended based on sales trends and inventory patterns
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function AnalyticsPreview() {
  const stats = [
    { label: "Avg revenue lift", value: "+23%", icon: TrendingUp },
    { label: "Time saved weekly", value: "8 hrs", icon: Zap },
    { label: "Recommendation accuracy", value: "92%", icon: Brain },
    { label: "Shops growing faster", value: "1.4k+", icon: Star },
  ];
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">
            See your shop's performance at a glance
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
            Live dashboards, animated insights, and metrics that matter.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp}>
              <Card className="border-border/50 shadow-card text-center">
                <CardContent className="p-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-3">
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <Card className="border-border/50 shadow-card-lg overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">Weekly sales</h3>
                  <p className="text-xs text-muted-foreground">Last 7 days</p>
                </div>
                <LineChart className="h-5 w-5 text-primary" />
              </div>
              <div className="h-48 flex items-end gap-3">
                {[55, 70, 45, 85, 60, 95, 78].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    whileInView={{ height: `${h}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.6 }}
                    className="flex-1 rounded-lg bg-gradient-to-t from-primary to-info"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-foreground">
            Up and running in three steps
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-muted-foreground">
            No complex setup. Connect your data and let the AI do the heavy lifting.
          </motion.p>
        </motion.div>

        <div className="relative grid md:grid-cols-3 gap-6">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center mb-4">
                <div className="h-20 w-20 rounded-2xl gradient-primary flex items-center justify-center shadow-card-lg">
                  <s.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background border border-border text-xs font-bold flex items-center justify-center text-foreground">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl gradient-hero p-12 md:p-16 text-center"
        >
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
              Start Optimizing Your Shop Today
            </h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">
              Join thousands of shop owners using AI to grow revenue, reduce waste, and price smarter.
            </p>
            <Button asChild size="lg" variant="secondary" className="hover:scale-105 transition-transform">
              <Link to="/dashboard">
                Launch Dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md gradient-primary flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground">DiscountIQ</span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#ai" className="hover:text-foreground transition-colors">AI Engine</a>
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </nav>
        <p>© {new Date().getFullYear()} DiscountIQ. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <main>
        <Hero />
        <Features />
        <AIShowcase />
        <AnalyticsPreview />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
