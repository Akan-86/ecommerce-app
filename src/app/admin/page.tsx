"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  Users,
} from "lucide-react";

import KpiCard from "@/components/admin/KpiCard";
import LineChart from "@/components/admin/charts/LineChart";
import BarChart from "@/components/admin/charts/BarChart";

import { useToast } from "@/context/toast-context";
import { getAuth } from "firebase/auth";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading, isAdmin } = useAuth();

  const { showToast } = useToast();
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [todayOrders, setTodayOrders] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalStripeFees, setTotalStripeFees] = useState(0);
  const [totalNetRevenue, setTotalNetRevenue] = useState(0);
  const [uniqueCustomers, setUniqueCustomers] = useState(0);
  const [returningRate, setReturningRate] = useState(0);

  const [monthlyRevenue, setMonthlyRevenue] = useState<
    { month: string; total: number }[]
  >([]);

  const [last7DaysRevenue, setLast7DaysRevenue] = useState<
    { date: string; total: number }[]
  >([]);

  const [displayRevenue, setDisplayRevenue] = useState(0);
  const [displayProfit, setDisplayProfit] = useState(0);

  // 🔐 Auth Guard
  useEffect(() => {
    if (!loading) {
      if (!user) router.push("/login");
      else if (!isAdmin) router.push("/");
    }
  }, [user, loading, isAdmin, router]);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        setDashboardLoading(true);
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const token = await currentUser.getIdToken();

        const res = await fetch("/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error();

        const data = await res.json();

        setTotalRevenue(data.totalRevenue || 0);
        setTotalOrders(data.totalOrders || 0);
        setTodayOrders(data.todayRevenue || 0);
        setTotalProfit(data.totalProfit || 0);
        setTotalStripeFees(data.totalStripeFees || 0);
        setTotalNetRevenue(
          (data.totalRevenue || 0) - (data.totalStripeFees || 0)
        );
        setUniqueCustomers(data.uniqueCustomers || 0);
        setReturningRate(data.conversionRate || 0);
        setMonthlyRevenue(data.monthlyRevenue || []);
        setLast7DaysRevenue(data.last7DaysRevenue || []);
      } catch (err) {
        showToast("Failed to load dashboard analytics", "error");
      } finally {
        setDashboardLoading(false);
      }
    }

    if (user && isAdmin) {
      fetchDashboard();
    }
  }, [user, isAdmin]);

  // 💫 Animated KPI
  useEffect(() => {
    let r = 0;
    let p = 0;

    const interval = setInterval(() => {
      r += totalRevenue / 20;
      p += totalProfit / 20;

      if (r >= totalRevenue) r = totalRevenue;
      if (p >= totalProfit) p = totalProfit;

      setDisplayRevenue(Number(r.toFixed(2)));
      setDisplayProfit(Number(p.toFixed(2)));

      if (r === totalRevenue && p === totalProfit) {
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [totalRevenue, totalProfit, dashboardLoading]);

  if (loading || !user || !isAdmin) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10 fade-in">
      {/* Header */}
      <div className="flex justify-between items-center backdrop-blur-md rounded-2xl p-6 shadow-sm border bg-white/70">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Financial overview & operational insights
          </p>
        </div>
        <div className="text-sm text-gray-400">Live Secure Analytics</div>
      </div>

      {/* KPI Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Total Revenue"
          value={`€${displayRevenue.toFixed(2)}`}
          icon={<DollarSign size={18} />}
        />
        <KpiCard
          title="Total Profit"
          value={`€${displayProfit.toFixed(2)}`}
          icon={<TrendingUp size={18} />}
          variant="success"
        />
        <KpiCard
          title="Total Orders"
          value={totalOrders}
          icon={<ShoppingCart size={18} />}
        />
        <KpiCard
          title="Orders Today"
          value={todayOrders}
          icon={<Users size={18} />}
        />
        <KpiCard
          title="Net Revenue"
          value={`€${totalNetRevenue.toFixed(2)}`}
          icon={<DollarSign size={18} />}
          variant="success"
        />
        <KpiCard
          title="Stripe Fees"
          value={`€${totalStripeFees.toFixed(2)}`}
          icon={<TrendingDown size={18} />}
          variant="danger"
        />
        <KpiCard
          title="Unique Customers"
          value={uniqueCustomers}
          icon={<Users size={18} />}
        />
        <KpiCard
          title="Returning Rate"
          value={`${returningRate}%`}
          icon={<Users size={18} />}
        />
      </div>

      {/* Last 7 Days Chart */}
      <div className="surface-card p-6">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days Revenue</h2>
        <LineChart
          data={last7DaysRevenue.map((d) => ({
            label: d.date.slice(5),
            value: d.total,
          }))}
        />
      </div>

      {/* Monthly Revenue */}
      <div className="surface-card p-6">
        <h2 className="text-lg font-semibold mb-4">
          Monthly Revenue (Last 6 Months)
        </h2>
        <BarChart
          data={monthlyRevenue.map((m) => ({
            label: m.month,
            value: m.total,
          }))}
        />
      </div>
    </div>
  );
}
