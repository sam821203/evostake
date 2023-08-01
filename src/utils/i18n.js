import { createI18n } from "vue-i18n";
import zhtw from "@/locale/zhtw";
import ch from "@/locale/ch";
import en from "@/locale/en";
import phil from "@/locale/phil";
import br from "@/locale/br";
// import { getLang } from "@/utils/cookie";

export default createI18n({
  legacy: false,
  // locale: getLang("language") || "zhtw", // 设置地区,
  locale: "en", // 设置地区,
  globalInjection: true, // 全域
  fallbackLocale: "zhtw",
  fallbackWarn: false, // 關閉退回本地警告
  missingWarn: false, // 關閉警告
  messages: {
    zhtw,
    ch,
    en,
    phil,
    br,
  }, // 设置地区信息
});
