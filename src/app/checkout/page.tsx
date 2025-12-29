import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const items = [
    { title: "Denim Jacket", price: 59.99, quantity: 1 },
    { title: "Jeans", price: 89.99, quantity: 2 },
  ];

  const userId = "user_123";

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold text-gray-900">
          Secure checkout
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Payments are encrypted and processed securely by Stripe.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Checkout form */}
        <div className="lg:col-span-2 rounded-xl border bg-white p-8 shadow-sm">
          <CheckoutForm items={items} userId={userId} />

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-500">
            <span>🔒</span>
            <span>SSL secure payment · No card data stored</span>
          </div>
        </div>

        {/* Order summary */}
        <aside className="rounded-xl border bg-gray-50 p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">
            Order summary
          </h2>

          <div className="space-y-3 text-sm text-gray-700">
            {items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 border-t pt-4 flex justify-between text-sm font-semibold text-gray-900">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>

          <div className="mt-6 rounded-lg bg-white p-4 text-xs text-gray-500">
            <p>✔ Free returns within 14 days</p>
            <p>✔ Fast & secure checkout</p>
            <p className="mt-2 text-gray-400">Powered by Stripe</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
