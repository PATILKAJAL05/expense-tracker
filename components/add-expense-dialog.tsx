"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { useAppStore } from "@/lib/store"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

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

const incomeCategories = [
  "Salary",
  "Freelance",
  "Investment",
  "Gift",
  "Refund",
  "Other",
]

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editExpense?: {
    id: string
    amount: number
    category: string
    date: string
    notes: string
    type: 'expense' | 'income'
  }
}

export function AddExpenseDialog({ open, onOpenChange, editExpense }: AddExpenseDialogProps) {
  const { addExpense, updateExpense } = useAppStore()
  const [type, setType] = useState<'expense' | 'income'>(editExpense?.type || 'expense')
  const [amount, setAmount] = useState(editExpense?.amount?.toString() || "")
  const [category, setCategory] = useState(editExpense?.category || "")
  const [date, setDate] = useState(editExpense?.date || new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState(editExpense?.notes || "")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const expenseData = {
      amount: parseFloat(amount),
      category,
      date,
      notes,
      type,
    }

    if (editExpense) {
      updateExpense(editExpense.id, expenseData)
    } else {
      addExpense(expenseData)
    }

    // Reset form
    setAmount("")
    setCategory("")
    setDate(new Date().toISOString().split('T')[0])
    setNotes("")
    setType('expense')
    onOpenChange(false)
  }

  const currentCategories = type === 'expense' ? categories : incomeCategories

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editExpense ? "Edit Transaction" : "Add Transaction"}</DialogTitle>
          <DialogDescription>
            {editExpense ? "Update your transaction details." : "Add a new expense or income."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={type} onValueChange={(v) => setType(v as 'expense' | 'income')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="expense" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
                Expense
              </TabsTrigger>
              <TabsTrigger value="income" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground">
                Income
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <label htmlFor="amount" className="text-sm font-medium text-foreground">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ₹
              </span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-7"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              Category
            </label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {currentCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium text-foreground">
              Date
            </label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <Textarea
              id="notes"
              placeholder="Add a note..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editExpense ? "Update" : "Add"} {type === 'expense' ? 'Expense' : 'Income'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
