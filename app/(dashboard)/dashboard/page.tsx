"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MonthlyExpenseChart } from "@/components/charts/monthly-expense-chart";
import { CategoryPieChart } from "@/components/charts/category-pie-chart";
import { RecentTransactions } from "@/components/recent-transactions";

export default function DashboardPage() {
  const [expenses, setExpenses] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetch("/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data));
  }, []);

  // Calculate stats
  const stats = useMemo(() => {
    const totalIncome = 0; // not used yet

    const totalExpenses = expenses.reduce(
      (sum: number, e: any) => sum + (e.amount || 0),
      0
    );

    const balance = totalIncome - totalExpenses;
    const savings = 0;

    return {
      totalIncome,
      totalExpenses,
      balance,
      savings,
    };
  }, [expenses]);

  const statCards = [
    {
      title: "Total Balance",
      value: stats.balance,
      change: "+0%",
      changeType: "positive" as const,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Income",
      value: stats.totalIncome,
      change: "+0%",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Total Expenses",
      value: stats.totalExpenses,
      change: "+0%",
      changeType: "negative" as const,
      icon: TrendingDown,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Savings Rate",
      value: stats.savings,
      isSavings: true,
      change: "+0%",
      changeType: "positive" as const,
      icon: DollarSign,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here&apos;s your expense overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">
                    {stat.isSavings
                      ? `${stat.value}%`
                      : `₹${stat.value.toLocaleString("en-IN")}`}
                  </p>

                  <div
                    className={cn(
                      "flex items-center gap-1 text-xs",
                      stat.changeType === "positive"
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    {stat.changeType === "positive" ? (
                      <ArrowUpRight size={14} />
                    ) : (
                      <ArrowDownRight size={14} />
                    )}
                    {stat.change}
                  </div>
                </div>

                <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                  <stat.icon className={stat.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
            <CardDescription>Last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <MonthlyExpenseChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>This month</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryPieChart />
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentTransactions />
        </CardContent>
      </Card>
    </div>
  );
}