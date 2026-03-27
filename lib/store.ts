"use client"

import { create } from 'zustand'

export interface Expense {
  id: string
  amount: number
  category: string
  date: string
  notes: string
  type: 'expense' | 'income'
}

export interface Budget {
  category: string
  limit: number
  spent: number
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AppState {
  user: User | null
  expenses: Expense[]
  budgets: Budget[]
  isAuthenticated: boolean
  isDarkMode: boolean
  
  // Auth actions
  login: (user: User) => void
  logout: () => void
  updateUser: (user: Partial<User>) => void
  
  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  // Budget actions
  setBudget: (budget: Budget) => void
  updateBudget: (category: string, budget: Partial<Budget>) => void
  
  // Theme
  toggleDarkMode: () => void
}

// Sample data (amounts in Indian Rupees ₹)
const sampleExpenses: Expense[] = [
  { id: '1', amount: 25000, category: 'Housing', date: '2026-03-01', notes: 'Monthly rent', type: 'expense' },
  { id: '2', amount: 3500, category: 'Food', date: '2026-03-05', notes: 'Grocery shopping', type: 'expense' },
  { id: '3', amount: 2000, category: 'Transportation', date: '2026-03-08', notes: 'Petrol refill', type: 'expense' },
  { id: '4', amount: 85000, category: 'Salary', date: '2026-03-01', notes: 'Monthly salary', type: 'income' },
  { id: '5', amount: 4500, category: 'Entertainment', date: '2026-03-10', notes: 'Movie tickets', type: 'expense' },
  { id: '6', amount: 1500, category: 'Utilities', date: '2026-03-12', notes: 'Internet bill', type: 'expense' },
  { id: '7', amount: 5500, category: 'Shopping', date: '2026-03-14', notes: 'New shoes', type: 'expense' },
  { id: '8', amount: 15000, category: 'Freelance', date: '2026-03-15', notes: 'Side project payment', type: 'income' },
  { id: '9', amount: 1800, category: 'Food', date: '2026-03-16', notes: 'Restaurant dinner', type: 'expense' },
  { id: '10', amount: 2500, category: 'Health', date: '2026-03-18', notes: 'Gym membership', type: 'expense' },
  { id: '11', amount: 800, category: 'Entertainment', date: '2026-03-20', notes: 'Streaming subscriptions', type: 'expense' },
  { id: '12', amount: 1500, category: 'Transportation', date: '2026-03-22', notes: 'Ola/Uber rides', type: 'expense' },
]

const sampleBudgets: Budget[] = [
  { category: 'Food', limit: 15000, spent: 5300 },
  { category: 'Transportation', limit: 8000, spent: 3500 },
  { category: 'Entertainment', limit: 10000, spent: 5300 },
  { category: 'Shopping', limit: 12000, spent: 5500 },
  { category: 'Utilities', limit: 5000, spent: 1500 },
  { category: 'Health', limit: 5000, spent: 2500 },
]

// Default user for demo purposes
const defaultUser: User = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  avatar: undefined,
}

export const useAppStore = create<AppState>((set) => ({
  user: defaultUser,
  expenses: sampleExpenses,
  budgets: sampleBudgets,
  isAuthenticated: true,
  isDarkMode: false,
  
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
  updateUser: (userData) => set((state) => ({
    user: state.user ? { ...state.user, ...userData } : null
  })),
  
  addExpense: (expense) => set((state) => ({
    expenses: [...state.expenses, { ...expense, id: Date.now().toString() }]
  })),
  updateExpense: (id, expense) => set((state) => ({
    expenses: state.expenses.map((e) => e.id === id ? { ...e, ...expense } : e)
  })),
  deleteExpense: (id) => set((state) => ({
    expenses: state.expenses.filter((e) => e.id !== id)
  })),
  
  setBudget: (budget) => set((state) => ({
    budgets: [...state.budgets.filter(b => b.category !== budget.category), budget]
  })),
  updateBudget: (category, budget) => set((state) => ({
    budgets: state.budgets.map((b) => b.category === category ? { ...b, ...budget } : b)
  })),
  
  toggleDarkMode: () => set((state) => {
    const newDarkMode = !state.isDarkMode
    // Apply dark mode class to document
    if (typeof document !== 'undefined') {
      if (newDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    return { isDarkMode: newDarkMode }
  }),
}))
