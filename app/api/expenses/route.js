import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("expenseDB");

  const data = await db.collection("expenses").find({}).toArray();

  return Response.json(data);
}
// POST (ADD THIS)
export async function POST(req) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("expenseDB");

  await db.collection("expenses").insertOne({
    title: body.title,
    amount: body.amount,
    category: body.category,
    date: new Date(),
  });

  return Response.json({ message: "Expense added" });
}