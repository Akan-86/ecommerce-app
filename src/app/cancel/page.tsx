export default function CancelPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ Payment Cancelled
      </h1>
      <p className="text-gray-700 mb-6">
        Your payment was cancelled. You can return to your cart and try again.
      </p>
      <a
        href="/cart"
        className="inline-block px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
      >
        Back to Cart
      </a>
    </main>
  );
}
