export default function NewsletterSection() {
  return (
    <section className="bg-gray-100">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-2xl font-bold">Join Our Newsletter</h2>
        <p className="text-sm text-gray-600 mt-2">
          Subscribe to receive updates, special offers and new product
          announcements.
        </p>

        <form className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 rounded-xl border border-gray-300 w-full sm:w-auto flex-1 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}
