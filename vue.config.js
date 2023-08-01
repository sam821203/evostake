const { defineConfig } = require("@vue/cli-service");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const pkg = require("./package.json");

const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);
const IS_DEV = ["development", "dev", "test"].includes(process.env.NODE_ENV);
process.env.VUE_APP_VERSION = pkg.version;

module.exports = defineConfig({
  publicPath: "./",
  transpileDependencies: true,
  productionSourceMap: IS_DEV,
  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "~@/assets/style/index.scss";',
      },
    },
  },
  pwa: {
    name: "Evostake",
    short_name: "Evostake",
    themeColor: "#000000",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "#000000",
    start_url: ".",
    background_color: "#000000",
    display: "standalone",
    iconPaths: {
      faviconSVG: null,
      favicon32: "img/icons/favicon-32x32.png",
      favicon16: "img/icons/favicon-16x16.png",
      appleTouchIcon: "img/icons/LUCKY888_PWA_Icon_512x512.png",
      maskIcon: null,
      msTileImage: null,
    },
    manifestOptions: {
      icons: [
        {
          src: "./img/icons/LUCKY888_PWA_Icon_72x72.png",
          sizes: "16x16",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_72x72.png",
          sizes: "32x32",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_72x72.png",
          sizes: "44x44",
          type: "image/png",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_72x72.png",
          sizes: "72x72",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_96x96.png",
          sizes: "96x96",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_120x120.png",
          sizes: "120x120",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_180x180.png",
          sizes: "180x180",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "./img/icons/LUCKY888_PWA_Icon_192x192.png",
          sizes: "256x256",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "img/icons/LUCKY888_PWA_Icon_192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any maskable",
        },
        {
          src: "img/icons/LUCKY888_PWA_Icon_512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
    workboxPluginMode: "GenerateSW", // GenerateSW
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /.*/,
          handler: "NetworkFirst",
          options: {
            cacheName: "Evostake",
            expiration: {
              maxAgeSeconds: 0,
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
      skipWaiting: true,
    },
  },
  configureWebpack: (config) => {
    const plugins = [];
    // config.plugins.push(new BundleAnalyzerPlugin())
    plugins.push(
      new CompressionWebpackPlugin({
        filename: "[file].gz[query]",
        algorithm: "gzip",
        include: /\.(js|css|html|svg|json)(\?.*)?$/i,
        minRatio: 0.8,
      })
    );
    const TerserPluginIndex = config.optimization.minimizer.findIndex(
      (n) => n.__pluginName === "terser"
    );
    if (IS_PROD) {
      config.optimization.minimizer[TerserPluginIndex] = new TerserPlugin({
        terserOptions: {
          warnings: false,
          format: {
            comments: false,
          },
          compress: {
            drop_debugger: true, // 註解console
            drop_console: true,
            pure_funcs: ["console.log"], // 移除console
          },
        },
        extractComments: false, // 是否將註解提取到單獨文件中
        parallel: true, // 是否併行打包
      });
      config.plugins = [...config.plugins, ...plugins];
    }
  },
  chainWebpack: (config) => {
    config.when(IS_DEV, (config) => config.devtool("cheap-source-map"));
    config.when(IS_PROD, (config) => {
      config.performance.set("hints", false);
      config.module
        .rule("images")
        .use("image-webpack-loader")
        .loader("image-webpack-loader")
        .options({
          mozjpeg: { progressive: true, quality: 65 },
          optipng: { enabled: false },
          pngquant: { quality: [0.65, 0.9], speed: 4 },
          gifsicle: { interlaced: false },
        })
        .end();
      config.optimization.splitChunks({
        chunks: "all",
        cacheGroups: {
          lib: {
            name: "lib-chunk",
            test: /[\\/]node_modules[\\/]/,
            minSize: 131072,
            maxSize: 524288,
            priority: 10,
            chunks: "initial",
          },
          vue: {
            name: "vue",
            test: /[\\/]node_modules[\\/](vue(.*)|core-js)[\\/]/,
            chunks: "initial",
            priority: 20,
          },
        },
      });
    });
  },
});
