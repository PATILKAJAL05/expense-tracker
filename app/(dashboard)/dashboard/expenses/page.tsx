"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppStore, type Expense } from "@/lib/store"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { cn } from "@/lib/utils"
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Pencil,
  Trash2,
  ArrowUpDown,
  Calendar,
} from "lucide-react"

const categories = [
  "All",
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
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
]

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

type SortField = "date" | "amount" | "category"
type SortOrder = "asc" | "desc"

export default function ExpensesPage() {
  const { expenses, deleteExpense } = useAppStore()
  const [addExpenseOpen, setAddExpenseOpen] = useState(false)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("All")
  const [typeFilter, setTypeFilter] = useState<"all" | "expense" | "income">("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")

  const filteredExpenses = useMemo(() => {
    return expenses
      .filter((expense) => {
        // Search filter
        const matchesSearch =
          expense.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase())

        // Category filter
        const matchesCategory =
          categoryFilter === "All" || expense.category === categoryFilter

        // Type filter
        const matchesType = typeFilter === "all" || expense.type === typeFilter

        // Date filter
        const expenseDate = new Date(expense.date)
        const matchesDateFrom = !dateFrom || expenseDate >= new Date(dateFrom)
        const matchesDateTo = !dateTo || expenseDate <= new Date(dateTo)

        return matchesSearch && matchesCategory && matchesType && matchesDateFrom && matchesDateTo
      })
      .sort((a, b) => {
        let comparison = 0
        switch (sortField) {
          case "date":
            comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
            break
          case "amount":
            comparison = a.amount - b.amount
            break
          case "category":
            comparison = a.category.localeCompare(b.category)
            break
        }
        return sortOrder === "asc" ? comparison : -comparison
      })
  }, [expenses, searchQuery, categoryFilter, typeFilter, dateFrom, dateTo, sortField, sortOrder])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("desc")
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const handleEdit = (expense: Expense) => {
    setEditExpense(expense)
    setAddExpenseOpen(true)
  }

  const handleDelete = (id: string) => {
    deleteExpense(id)
  }

  const totals = useMemo(() => {
    const income = filteredExpenses
      .filter((e) => e.type === "income")
      .reduce((sum, e) => sum + e.amount, 0)
    const expense = filteredExpenses
      .filter((e) => e.type === "expense")
      .reduce((sum, e) => sum + e.amount, 0)
    return { income, expense, net: income - expense }
  }, [filteredExpenses])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all your transactions
          </p>
        </div>
        <Button onClick={() => { setEditExpense(null); setAddExpenseOpen(true) }} className="gap-2">
          <Plus className="size-4" />
          Add Transaction
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Income</p>
            <p className="text-2xl font-bold text-success">
              +₹{totals.income.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Expenses</p>
            <p className="text-2xl font-bold text-destructive">
              -₹{totals.expense.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Net Balance</p>
            <p className={cn(
              "text-2xl font-bold",
              totals.net >= 0 ? "text-success" : "text-destructive"
            )}>
              {totals.net >= 0 ? "+" : ""}₹{totals.net.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="size-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as typeof typeFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="expense">Expenses</SelectItem>
                <SelectItem value="income">Income</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="pl-9"
                  placeholder="From"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {filteredExpenses.length} transaction{filteredExpenses.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-3"
                      onClick={() => toggleSort("date")}
                    >
                      Date
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -ml-3"
                      onClick={() => toggleSort("category")}
                    >
                      Category
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1 -mr-3"
                      onClick={() => toggleSort("amount")}
                    >
                      Amount
                      <ArrowUpDown className="size-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredExpenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {formatDate(expense.date)}
                    </TableCell>
                    <TableCell>{expense.notes || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "font-normal",
                          categoryColors[expense.category] || categoryColors.Other
                        )}
                      >
                        {expense.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={expense.type === "income" ? "default" : "destructive"}
                        className={cn(
                          "capitalize",
                          expense.type === "income"
                            ? "bg-success/10 text-success hover:bg-success/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        )}
                      >
                        {expense.type}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold",
                        expense.type === "income" ? "text-success" : "text-foreground"
                      )}
                    >
                      {expense.type === "income" ? "+" : "-"}₹{expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <MoreVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(expense)}>
                            <Pencil className="size-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(expense.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="size-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredExpenses.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No transactions found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Expense Dialog */}
      <AddExpenseDialog
        open={addExpenseOpen}
        onOpenChange={(open) => {
          setAddExpenseOpen(open)
          if (!open) setEditExpense(null)
        }}
        editExpense={editExpense || undefined}
      />
    </div>
  )
}
