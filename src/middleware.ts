import createMiddleware from "next-intl/middleware";
// Proje kökünde bulunan next-intl.config.js dosyasını import ediyoruz
import nextIntlConfig from "../next-intl.config";

export default createMiddleware(nextIntlConfig);

export const config = {
  matcher: [
    "/((?!_next|_static|favicon.ico|manifest.json|robots.txt|sitemap.xml|images|icons|fonts|api).*)",
  ],
};
