import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const items = [
    { title: "Denim Jacket", price: 59.99, quantity: 1 },
    { title: "Jeans", price: 89.99, quantity: 2 },
  ];

  const userId = "user_123";

  return (
    <div className="mx-auto mt-12 max-w-3xl px-4">
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Secure Checkout
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Your payment information is encrypted and processed securely by
          Stripe.
        </p>
        <CheckoutForm items={items} userId={userId} />
      </div>
    </div>
  );
}
