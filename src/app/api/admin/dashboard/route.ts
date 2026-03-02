import { NextResponse } from "next/server";
import { db, auth } from "@/lib/firebaseAdmin";

export async function GET(request: Request) {
  try {
    // 🔐 Verify Admin
    const authorization = request.headers.get("authorization");

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authorization.split("Bearer ")[1];
    const decodedToken = await auth.verifyIdToken(token);

    if (!decodedToken.admin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const snapshot = await db.collection("orders").get();

    let totalRevenue = 0;
    let totalOrders = snapshot.size;
    let pendingOrders = 0;
    let deliveredOrders = 0;
    let todayRevenue = 0;
    let totalProfit = 0;
    let totalStripeFees = 0;

    const todayKey = new Date().toISOString().split("T")[0];
    const monthlyMap: Record<string, number> = {};
    const last7DaysMap: Record<string, number> = {};
    const customerSet = new Set<string>();

    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split("T")[0];
      last7DaysMap[key] = 0;
    }

    snapshot.forEach((doc) => {
      const data: any = doc.data();

      if (data.customerEmail) {
        customerSet.add(data.customerEmail);
      }

      if (data.status === "pending" || data.status === "processing") {
        pendingOrders++;
      }

      if (data.status === "delivered") {
        totalRevenue += data.totalAmount || 0;
        totalStripeFees += data.stripeFee || 0;
        deliveredOrders++;

        if (data.items) {
          data.items.forEach((item: any) => {
            totalProfit += (item.price - (item.cost || 0)) * item.quantity;
          });
        }
      }

      if (data.createdAt) {
        const date = new Date(data.createdAt.seconds * 1000);
        const orderDate = date.toISOString().split("T")[0];
        const monthKey = `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`;

        if (data.status === "delivered") {
          if (orderDate === todayKey) {
            todayRevenue += data.totalAmount || 0;
          }

          monthlyMap[monthKey] =
            (monthlyMap[monthKey] || 0) + (data.totalAmount || 0);

          if (last7DaysMap[orderDate] !== undefined) {
            last7DaysMap[orderDate] += data.totalAmount || 0;
          }
        }
      }
    });

    const conversionRate = totalOrders
      ? Number(((deliveredOrders / totalOrders) * 100).toFixed(2))
      : 0;

    const monthlyRevenue = Object.entries(monthlyMap)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6);

    const last7DaysRevenue = Object.entries(last7DaysMap).map(
      ([date, total]) => ({ date, total })
    );

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      todayRevenue,
      totalProfit,
      totalStripeFees,
      uniqueCustomers: customerSet.size,
      conversionRate,
      monthlyRevenue,
      last7DaysRevenue,
    });
  } catch (error) {
    console.error("Admin dashboard analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
