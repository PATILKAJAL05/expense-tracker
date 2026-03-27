"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAppStore } from "@/lib/store"
import { Download, FileText, TrendingUp, TrendingDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts"

const COLORS = [
  "oklch(0.55 0.2 260)",
  "oklch(0.65 0.2 145)",
  "oklch(0.55 0.22 25)",
  "oklch(0.75 0.15 85)",
  "oklch(0.6 0.18 280)",
  "oklch(0.5 0.15 200)",
]

export default function ReportsPage() {
  const { expenses } = useAppStore()

  const monthlyData = useMemo(() => {
    const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"]
    return months.map((month, index) => {
      const monthExpenses = expenses.filter((e) => {
        const expenseMonth = new Date(e.date).getMonth()
        const targetMonth = (9 + index) % 12 // Oct = 9, Nov = 10, etc.
        return expenseMonth === targetMonth && e.type === "expense"
      })
      const total = monthExpenses.reduce((sum, e) => sum + e.amount, 0)
      // Add some sample data for visualization (in Rupees)
      const sampleData = [45000, 52000, 58000, 48000, 55000, 48600]
      return {
        month,
        amount: total || sampleData[index],
      }
    })
  }, [expenses])

  const categoryData = useMemo(() => {
    const categoryTotals: Record<string, number> = {}
    
    expenses
      .filter((e) => e.type === "expense")
      .forEach((expense) => {
        categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
      })

    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }, [expenses])

  const insights = useMemo(() => {
    const totalExpenses = expenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0)

    const totalIncome = expenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0)

    const highestCategory = categoryData[0]
    
    const currentMonth = monthlyData[monthlyData.length - 1]?.amount || 0
    const previousMonth = monthlyData[monthlyData.length - 2]?.amount || 0
    const monthlyChange = previousMonth > 0 
      ? ((currentMonth - previousMonth) / previousMonth) * 100 
      : 0

    const savingsRate = totalIncome > 0 
      ? ((totalIncome - totalExpenses) / totalIncome) * 100 
      : 0

    return {
      highestCategory,
      monthlyChange,
      savingsRate,
      totalExpenses,
      totalIncome,
    }
  }, [expenses, categoryData, monthlyData])

  const handleDownload = (format: "pdf" | "csv") => {
    // Simulate download
    const data = expenses.map((e) => ({
      date: e.date,
      category: e.category,
      type: e.type,
      amount: e.amount,
      notes: e.notes,
    }))

    if (format === "csv") {
      const csv = [
        ["Date", "Category", "Type", "Amount", "Notes"].join(","),
        ...data.map((row) => Object.values(row).join(",")),
      ].join("\n")

      const blob = new Blob([csv], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `expense-report-${new Date().toISOString().split("T")[0]}.csv`
      a.click()
    } else {
      alert("PDF export would be implemented with a library like jsPDF in production")
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">
            Financial reports and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleDownload("csv")} className="gap-2">
            <Download className="size-4" />
            Export CSV
          </Button>
          <Button onClick={() => handleDownload("pdf")} className="gap-2">
            <FileText className="size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Highest Spending</p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {insights.highestCategory?.name || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  ₹{insights.highestCategory?.value.toLocaleString("en-IN") || "0.00"}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-xl">
                <AlertCircle className="size-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Change</p>
                <p className={cn(
                  "text-xl font-bold mt-1",
                  insights.monthlyChange < 0 ? "text-success" : "text-destructive"
                )}>
                  {insights.monthlyChange > 0 ? "+" : ""}{insights.monthlyChange.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">vs last month</p>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                insights.monthlyChange < 0 ? "bg-success/10" : "bg-destructive/10"
              )}>
                {insights.monthlyChange < 0 ? (
                  <TrendingDown className="size-5 text-success" />
                ) : (
                  <TrendingUp className="size-5 text-destructive" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className={cn(
                  "text-xl font-bold mt-1",
                  insights.savingsRate > 20 ? "text-success" : "text-warning"
                )}>
                  {insights.savingsRate.toFixed(1)}%
                </p>
                <p className="text-sm text-muted-foreground mt-1">of total income</p>
              </div>
              <div className={cn(
                "p-3 rounded-xl",
                insights.savingsRate > 20 ? "bg-success/10" : "bg-warning/10"
              )}>
                <TrendingUp className={cn(
                  "size-5",
                  insights.savingsRate > 20 ? "text-success" : "text-warning"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {categoryData.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">active this period</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expenses</CardTitle>
            <CardDescription>Comparison of expenses over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "oklch(0.5 0.02 260)", fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(1 0 0)",
                      border: "1px solid oklch(0.92 0.01 260)",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Expenses"]}
                  />
                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {monthlyData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={index === monthlyData.length - 1 ? "oklch(0.55 0.2 260)" : "oklch(0.55 0.2 260 / 0.3)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Distribution of expenses across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="h-[200px] w-full max-w-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "oklch(1 0 0)",
                        border: "1px solid oklch(0.92 0.01 260)",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                      formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Amount"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Legend */}
              <div className="flex-1 space-y-2">
                {categoryData.slice(0, 6).map((entry, index) => {
                  const percentage = (entry.value / insights.totalExpenses) * 100
                  return (
                    <div key={entry.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="size-3 rounded-full shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="text-sm text-foreground">{entry.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">
                          ₹{entry.value.toLocaleString("en-IN")}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(0)}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Category Table */}
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
          <CardDescription>Detailed view of spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category, index) => {
              const percentage = insights.totalExpenses > 0
                ? (category.value / insights.totalExpenses) * 100
                : 0
              return (
                <div key={category.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="size-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="font-medium text-foreground">{category.name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {percentage.toFixed(1)}%
                      </span>
                      <span className="font-semibold text-foreground">
                        ₹{category.value.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
