import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["en", "tr"], // 🌍 Desteklenen diller
  defaultLocale: "en", // 🌐 Varsayılan dil
  localeDetection: true, // 🌐 Tarayıcı diline göre yönlendirme
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|icons|images|fonts|api).*)"],
};
