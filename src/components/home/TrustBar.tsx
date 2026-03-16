import { Truck, ShieldCheck, RefreshCw, Headphones } from "lucide-react";

export default function TrustBar() {
  const items = [
    {
      icon: Truck,
      title: "Free Shipping",
      desc: "On orders over $50",
    },
    {
      icon: ShieldCheck,
      title: "Secure Payment",
      desc: "100% protected checkout",
    },
    {
      icon: RefreshCw,
      title: "30 Day Returns",
      desc: "Hassle-free returns",
    },
    {
      icon: Headphones,
      title: "24/7 Support",
      desc: "Always here to help",
    },
  ];

  return (
    <section className="border-y bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item, i) => {
          const Icon = item.icon;

          return (
            <div
              key={i}
              className="flex items-center gap-3 text-sm text-gray-700"
            >
              <Icon className="h-6 w-6 text-black" />

              <div>
                <p className="font-semibold text-black">{item.title}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
