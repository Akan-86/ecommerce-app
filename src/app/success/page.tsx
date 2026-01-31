export default function SuccessPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        ✅ Payment Successful
      </h1>
      <p className="text-gray-700 mb-6">
        Thank you for your purchase! Your order has been placed successfully.
      </p>
      <a
        href="/"
        className="inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Back to Home
      </a>
    </main>
  );
}
