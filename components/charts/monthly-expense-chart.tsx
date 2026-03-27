"use client"

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { month: "Oct", expenses: 45000, income: 80000 },
  { month: "Nov", expenses: 52000, income: 85000 },
  { month: "Dec", expenses: 58000, income: 90000 },
  { month: "Jan", expenses: 48000, income: 85000 },
  { month: "Feb", expenses: 55000, income: 95000 },
  { month: "Mar", expenses: 48600, income: 100000 },
]

export function MonthlyExpenseChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.65 0.2 145)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="oklch(0.55 0.22 25)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
            formatter={(value: number, name: string) => [
              `₹${value.toLocaleString("en-IN")}`,
              name.charAt(0).toUpperCase() + name.slice(1),
            ]}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="oklch(0.65 0.2 145)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorIncome)"
          />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="oklch(0.55 0.22 25)"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorExpenses)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
