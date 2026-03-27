"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  Utensils,
  Car,
  Home,
  Lightbulb,
  Film,
  Heart,
  GraduationCap,
  Plane,
  MoreHorizontal,
  DollarSign,
  Briefcase,
  TrendingUp,
  Gift,
  RotateCcw,
} from "lucide-react"

const categoryIcons: Record<string, React.ElementType> = {
  Food: Utensils,
  Transportation: Car,
  Housing: Home,
  Utilities: Lightbulb,
  Entertainment: Film,
  Shopping: ShoppingBag,
  Health: Heart,
  Education: GraduationCap,
  Travel: Plane,
  Other: MoreHorizontal,
  Salary: DollarSign,
  Freelance: Briefcase,
  Investment: TrendingUp,
  Gift: Gift,
  Refund: RotateCcw,
}

const categoryColors: Record<string, string> = {
  Food: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Transportation: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Housing: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Utilities: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Entertainment: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  Shopping: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  Health: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Education: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Travel: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  Other: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
  Salary: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  Freelance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Investment: "bg-lime-100 text-lime-700 dark:bg-lime-900/30 dark:text-lime-400",
  Gift: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  Refund: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
}

interface RecentTransactionsProps {
  limit?: number
}

export function RecentTransactions({ limit = 5 }: RecentTransactionsProps) {
  const { expenses } = useAppStore()

  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit)
  }, [expenses, limit])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      {recentExpenses.map((expense) => {
        const Icon = categoryIcons[expense.category] || MoreHorizontal
        const colorClass = categoryColors[expense.category] || categoryColors.Other

        return (
          <div
            key={expense.id}
            className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={cn("p-2.5 rounded-xl", colorClass)}>
                <Icon className="size-5" />
              </div>
              <div>
                <p className="font-medium text-foreground">{expense.notes || expense.category}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="secondary" className="text-xs">
                    {expense.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(expense.date)}
                  </span>
                </div>
              </div>
            </div>
            <div
              className={cn(
                "text-lg font-semibold",
                expense.type === "income" ? "text-success" : "text-foreground"
              )}
            >
              {expense.type === "income" ? "+" : "-"}₹{expense.amount.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </div>
          </div>
        )
      })}

      {recentExpenses.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No transactions yet. Add your first expense!
        </div>
      )}
    </div>
  )
}
