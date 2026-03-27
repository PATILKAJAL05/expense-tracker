"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  Lightbulb,
  Target,
  AlertTriangle,
  CheckCircle,
  Sparkles,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Legend,
} from "recharts"

const weeklyData = [
  { day: "Mon", expenses: 2500, income: 0 },
  { day: "Tue", expenses: 3500, income: 0 },
  { day: "Wed", expenses: 1800, income: 15000 },
  { day: "Thu", expenses: 4200, income: 0 },
  { day: "Fri", expenses: 5500, income: 0 },
  { day: "Sat", expenses: 8500, income: 0 },
  { day: "Sun", expenses: 2800, income: 0 },
]

const hourlyData = [
  { hour: "6am", count: 2 },
  { hour: "9am", count: 8 },
  { hour: "12pm", count: 15 },
  { hour: "3pm", count: 12 },
  { hour: "6pm", count: 20 },
  { hour: "9pm", count: 10 },
]

export default function AnalyticsPage() {
  const { expenses, budgets } = useAppStore()

  const analytics = useMemo(() => {
    const totalExpenses = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0)

    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0)

    // Category analysis
    const categoryTotals: Record<string, number> = {}
    expenses
      .filter((e) => e.type === "expense")
      .forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
      })

    const sortedCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])

    const topCategory = sortedCategories[0]
    const avgDailySpending = totalExpenses / 30

    // Budget alerts
    const overBudgetCategories = budgets.filter((b) => b.spent > b.limit)
    const nearBudgetCategories = budgets.filter((b) => b.spent > b.limit * 0.8 && b.spent <= b.limit)

    return {
      totalExpenses,
      totalIncome,
      savingsRate: totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0,
      topCategory: topCategory ? { name: topCategory[0], amount: topCategory[1] } : null,
      avgDailySpending,
      transactionCount: expenses.length,
      overBudgetCategories,
      nearBudgetCategories,
      categoryTotals: sortedCategories,
    }
  }, [expenses, budgets])

  const insights = useMemo(() => {
    const result = []

    // Spending pattern insight
    if (analytics.topCategory) {
      result.push({
        type: "warning",
        title: "High Category Spending",
        description: `${analytics.topCategory.name} accounts for ${((analytics.topCategory.amount / analytics.totalExpenses) * 100).toFixed(0)}% of your total expenses.`,
        icon: AlertTriangle,
      })
    }

    // Savings insight
    if (analytics.savingsRate > 20) {
      result.push({
        type: "success",
        title: "Great Savings Rate",
        description: `You're saving ${analytics.savingsRate.toFixed(0)}% of your income. Keep it up!`,
        icon: CheckCircle,
      })
    } else if (analytics.savingsRate > 0) {
      result.push({
        type: "info",
        title: "Room for Improvement",
        description: `Your savings rate is ${analytics.savingsRate.toFixed(0)}%. Try to aim for at least 20%.`,
        icon: Lightbulb,
      })
    }

    // Budget alerts
    if (analytics.overBudgetCategories.length > 0) {
      result.push({
        type: "error",
        title: "Budget Exceeded",
        description: `You've exceeded your budget in ${analytics.overBudgetCategories.length} category(ies).`,
        icon: AlertTriangle,
      })
    }

    // AI suggestion
    result.push({
      type: "ai",
      title: "AI Suggestion",
      description: "Based on your spending patterns, you could save ₹5,000/month by reducing dining out expenses.",
      icon: Sparkles,
    })

    return result
  }, [analytics])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Deep insights into your spending patterns
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Avg Daily Spending</p>
            <p className="text-2xl font-bold text-foreground">
              ₹{analytics.avgDailySpending.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.transactionCount}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Categories Used</p>
            <p className="text-2xl font-bold text-foreground">
              {analytics.categoryTotals.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Budget Alerts</p>
            <p className={cn(
              "text-2xl font-bold",
              analytics.overBudgetCategories.length > 0 ? "text-destructive" : "text-success"
            )}>
              {analytics.overBudgetCategories.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="size-5 text-warning" />
            Smart Insights
          </CardTitle>
          <CardDescription>AI-powered analysis of your finances</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className={cn(
                  "p-4 rounded-xl border",
                  insight.type === "success" && "bg-success/5 border-success/20",
                  insight.type === "warning" && "bg-warning/5 border-warning/20",
                  insight.type === "error" && "bg-destructive/5 border-destructive/20",
                  insight.type === "info" && "bg-primary/5 border-primary/20",
                  insight.type === "ai" && "bg-chart-5/5 border-chart-5/20"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    insight.type === "success" && "bg-success/10",
                    insight.type === "warning" && "bg-warning/10",
                    insight.type === "error" && "bg-destructive/10",
                    insight.type === "info" && "bg-primary/10",
                    insight.type === "ai" && "bg-chart-5/10"
                  )}>
                    <insight.icon className={cn(
                      "size-4",
                      insight.type === "success" && "text-success",
                      insight.type === "warning" && "text-warning",
                      insight.type === "error" && "text-destructive",
                      insight.type === "info" && "text-primary",
                      insight.type === "ai" && "text-chart-5"
                    )} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{insight.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Spending Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending Pattern</CardTitle>
            <CardDescription>Your spending throughout the week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorWeekly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.55 0.2 260)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.55 0.2 260)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.92 0.01 260)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Expenses"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stroke="oklch(0.55 0.2 260)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorWeekly)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Transaction Frequency */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction Frequency</CardTitle>
            <CardDescription>When you spend the most</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="hour"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.92 0.01 260)",
                      borderRadius: "8px",
                    }}
                    formatter={(value: number) => [value, "Transactions"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="oklch(0.65 0.2 145)"
                    strokeWidth={2}
                    dot={{ fill: "oklch(0.65 0.2 145)", strokeWidth: 0, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Spending Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Trends</CardTitle>
          <CardDescription>Month-over-month comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.categoryTotals.slice(0, 6).map(([category, amount], index) => {
              // Simulate trend data
              const trend = Math.random() > 0.5 ? "up" : "down"
              const trendPercent = (Math.random() * 30).toFixed(1)
              const percentage = (amount / analytics.totalExpenses) * 100

              return (
                <div key={category} className="flex items-center gap-4">
                  <div className="w-32 font-medium text-foreground truncate">{category}</div>
                  <div className="flex-1">
                    <div className="h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="w-28 text-right font-medium text-foreground">
                    ₹{amount.toLocaleString("en-IN")}
                  </div>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "w-20 justify-center",
                      trend === "up"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                    )}
                  >
                    {trend === "up" ? (
                      <TrendingUp className="size-3 mr-1" />
                    ) : (
                      <TrendingDown className="size-3 mr-1" />
                    )}
                    {trendPercent}%
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
