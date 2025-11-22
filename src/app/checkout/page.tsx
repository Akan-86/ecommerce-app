import CheckoutForm from "@/components/checkout/CheckoutForm";

export default function CheckoutPage() {
  const items = [
    { title: "Denim Jacket", price: 59.99, quantity: 1 },
    { title: "Jeans", price: 89.99, quantity: 2 },
  ];

  const userId = "user_123";

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Checkout</h1>
      <CheckoutForm items={items} userId={userId} />
    </div>
  );
}
