"use client";

import { useState } from "react";

export default function AddExpenseForm() {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await fetch("/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        amount: Number(amount),
        category,
      }),
    });

    alert("Expense Added ✅");
    location.reload();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
      <input
        placeholder="Title"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Amount"
        type="number"
        className="border p-2 w-full"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        placeholder="Category"
        className="border p-2 w-full"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <button className="bg-blue-500 text-white px-4 py-2 rounded w-full">
        Add Expense
      </button>
    </form>
  );
}