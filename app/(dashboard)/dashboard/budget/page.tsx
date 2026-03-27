"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Plus,
  AlertTriangle,
  CheckCircle,
  Target,
  TrendingUp,
  Pencil,
} from "lucide-react"

const categories = [
  "Food",
  "Transportation",
  "Housing",
  "Utilities",
  "Entertainment",
  "Shopping",
  "Health",
  "Education",
  "Travel",
  "Other",
]

export default function BudgetPage() {
  const { budgets, setBudget, expenses } = useAppStore()
  const [addBudgetOpen, setAddBudgetOpen] = useState(false)
  const [editingBudget, setEditingBudget] = useState<{ category: string; limit: number } | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [newLimit, setNewLimit] = useState("")

  // Calculate actual spending for each budget category
  const budgetsWithSpending = budgets.map((budget) => {
    const spent = expenses
      .filter((e) => e.type === "expense" && e.category === budget.category)
      .reduce((sum, e) => sum + e.amount, 0)
    return { ...budget, spent }
  })

  const totalBudget = budgetsWithSpending.reduce((sum, b) => sum + b.limit, 0)
  const totalSpent = budgetsWithSpending.reduce((sum, b) => sum + b.spent, 0)
  const overBudgetCount = budgetsWithSpending.filter((b) => b.spent > b.limit).length
  const onTrackCount = budgetsWithSpending.filter((b) => b.spent <= b.limit).length

  const handleSaveBudget = () => {
    if (editingBudget) {
      setBudget({ 
        category: editingBudget.category, 
        limit: parseFloat(newLimit), 
        spent: 0 
      })
    } else if (newCategory && newLimit) {
      setBudget({ 
        category: newCategory, 
        limit: parseFloat(newLimit), 
        spent: 0 
      })
    }
    setAddBudgetOpen(false)
    setEditingBudget(null)
    setNewCategory("")
    setNewLimit("")
  }

  const handleEditBudget = (budget: { category: string; limit: number }) => {
    setEditingBudget(budget)
    setNewCategory(budget.category)
    setNewLimit(budget.limit.toString())
    setAddBudgetOpen(true)
  }

  const getStatusColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return "text-destructive"
    if (percentage >= 80) return "text-warning"
    return "text-success"
  }

  const getProgressColor = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100
    if (percentage >= 100) return "bg-destructive"
    if (percentage >= 80) return "bg-warning"
    return "bg-success"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Budget Planning</h1>
          <p className="text-muted-foreground mt-1">
            Set and track your spending limits
          </p>
        </div>
        <Button onClick={() => setAddBudgetOpen(true)} className="gap-2">
          <Plus className="size-4" />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{totalBudget.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl">
                <Target className="size-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="p-3 bg-chart-5/10 rounded-xl">
                <TrendingUp className="size-5 text-chart-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-success mt-1">
                  {onTrackCount}
                </p>
              </div>
              <div className="p-3 bg-success/10 rounded-xl">
                <CheckCircle className="size-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Over Budget</p>
                <p className="text-2xl font-bold text-destructive mt-1">
                  {overBudgetCount}
                </p>
              </div>
              <div className="p-3 bg-destructive/10 rounded-xl">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Budget Usage</CardTitle>
          <CardDescription>
            {((totalSpent / totalBudget) * 100).toFixed(1)}% of your total budget used
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                ₹{totalSpent.toLocaleString("en-IN")} / ₹{totalBudget.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="h-4 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  getProgressColor(totalSpent, totalBudget)
                )}
                style={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              ₹{Math.max(totalBudget - totalSpent, 0).toLocaleString("en-IN")} remaining
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {budgetsWithSpending.map((budget) => {
          const percentage = (budget.spent / budget.limit) * 100
          const isOverBudget = budget.spent > budget.limit
          const isNearLimit = percentage >= 80 && percentage < 100

          return (
            <Card key={budget.category} className="relative overflow-hidden">
              {isOverBudget && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-destructive" />
              )}
              {isNearLimit && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-warning" />
              )}
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{budget.category}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isOverBudget && (
                      <Badge variant="destructive" className="text-xs">
                        Over Budget
                      </Badge>
                    )}
                    {isNearLimit && (
                      <Badge variant="secondary" className="bg-warning/10 text-warning text-xs">
                        Near Limit
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8"
                      onClick={() => handleEditBudget(budget)}
                    >
                      <Pencil className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-baseline justify-between">
                    <span className={cn("text-2xl font-bold", getStatusColor(budget.spent, budget.limit))}>
                      ₹{budget.spent.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      of ₹{budget.limit.toLocaleString("en-IN")}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          getProgressColor(budget.spent, budget.limit)
                        )}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{percentage.toFixed(0)}% used</span>
                      <span>
                        {isOverBudget
                          ? `₹${(budget.spent - budget.limit).toLocaleString("en-IN")} over`
                          : `₹${(budget.limit - budget.spent).toLocaleString("en-IN")} left`}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {/* Add New Budget Card */}
        <Card
          className="border-dashed cursor-pointer hover:bg-secondary/50 transition-colors"
          onClick={() => setAddBudgetOpen(true)}
        >
          <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] text-muted-foreground">
            <Plus className="size-8 mb-2" />
            <p className="font-medium">Add New Budget</p>
          </CardContent>
        </Card>
      </div>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-success mt-0.5 shrink-0" />
              <span>Try to keep your spending under 80% of your budget to build a safety margin.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-success mt-0.5 shrink-0" />
              <span>Review and adjust your budgets monthly based on your actual spending patterns.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="size-4 text-success mt-0.5 shrink-0" />
              <span>Aim to save at least 20% of your income by setting realistic category limits.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Add/Edit Budget Dialog */}
      <Dialog open={addBudgetOpen} onOpenChange={setAddBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingBudget ? "Edit Budget" : "Add New Budget"}</DialogTitle>
            <DialogDescription>
              {editingBudget
                ? "Update your budget limit for this category."
                : "Set a monthly spending limit for a category."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Category</label>
              {editingBudget ? (
                <Input value={editingBudget.category} disabled />
              ) : (
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => !budgets.find((b) => b.category === cat))
                      .map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Monthly Limit</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="pl-7"
                  value={newLimit}
                  onChange={(e) => setNewLimit(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAddBudgetOpen(false)
              setEditingBudget(null)
              setNewCategory("")
              setNewLimit("")
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveBudget}>
              {editingBudget ? "Update" : "Add"} Budget
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
