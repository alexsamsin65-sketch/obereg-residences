import type { NextConfig } from "next";

/**
 * Конфигурация Next.js для деплоя на GitHub Pages.
 *
 * GitHub Pages отдаёт только статические файлы, поэтому включаем
 * статический экспорт (output: 'export'). Ради этого жертвуем:
 *  - server-side rendering (страницы пререндерятся на этапе сборки)
 *  - оптимизацией изображений (images.unoptimized)
 *  - API routes / middleware (их у нас и нет)
 *
 * basePath и assetPrefix нужны, т.к. Pages обслуживает сайт по пути
 * https://<user>.github.io/<repo>/, а не из корня домена.
 */
const repo = "obereg-residences";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  // basePath/assetPrefix только в проде — локально работаем из корня
  ...(isProd
    ? {
        basePath: `/${repo}`,
        assetPrefix: `/${repo}/`,
      }
    : {}),
  // Чистый trailing slash для совместимости с GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
