import clientPromise from "@/lib/mongodb";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("expenseDB");

  await db.collection("test").insertOne({
    name: "Kajal",
    time: new Date()
  });

  return Response.json({ message: "Data stored in DB" });
}