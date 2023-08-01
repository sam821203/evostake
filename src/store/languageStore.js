import { defineStore } from "pinia";
import { setLang, getLang } from "@/utils/cookie";
import pinia from "@/store/pinia";
import { useMessage } from "@/store/msgStore";

const msg = useMessage(pinia);
const { openMsg } = msg;

export const useLanguage = defineStore("language", {
  state: () => ({
    allLanguage: [
      {
        lang: "language.ZHTW",
        name: "zhtw",
        id: "繁體中文",
        img: require("@/assets/images/language/flag_zhtw.png"),
      },
      {
        lang: "language.CH",
        name: "ch",
        id: "簡體中文",
        img: require("@/assets/images/language/flag_ch.png"),
      },
      // {
      //   lang: 'Indonesia',
      //   name: 'Indonesia',
      //   id: 2,
      //   img: require('@/assets/images/language/flag_Indonesia.png')
      // },
      // {
      //   lang: 'Malaysia',
      //   name: 'Malaysia',
      //   id: 3,
      //   img: require('@/assets/images/language/flag_Malaysia.png')
      // },
      {
        lang: "language.Philippines",
        name: "phil",
        id: "Pilipino",
        img: require("@/assets/images/language/flag_phil.png"),
      },
      // {
      //   lang: 'Thailand',
      //   name: 'Thailand',
      //   id: 5,
      //   img: require('@/assets/images/language/flag_Thailand.png')
      // },
      {
        lang: "language.en",
        name: "en",
        id: "English",
        img: require("@/assets/images/language/flag_en.png"),
      },
      // {
      //   lang: "language.Vietnam",
      //   name: "vn",
      //   id: 7,
      //   img: require("@/assets/images/language/flag_vn.png"),
      // },
    ],
    curLang: {
      lang: "language.ZHTW",
      name: "en",
      id: 0,
      img: require("@/assets/images/language/flag_zhtw.png"),
    },
    // 未開放語系
    // disabledLang: [
    //   { img: 'UK', lang: 'language.UK' },
    //   { img: 'Vietnam', lang: 'language.Vietnam' },
    //   { img: "Thailand", lang: "language.Thailand" },
    //   { img: "Indonesia", lang: "language.Indonesia" },
    //   { img: 'Philippines', lang: 'language.Philippines' },
    //   { img: "Malaysia", lang: "language.Malaysia" },
    // ],
  }),
  actions: {
    changeLang(item) {
      this.curLang = item;
      setLang(item.name);
    },
    getCurLang() {
      if (this.curLang.name === "undefined" || !getLang()) {
        setLang("br");
      } else {
        this.curLang.name = getLang("language");
      }

      this.allLanguage.forEach((item) => {
        if (this.curLang.name === item.name) {
          this.curLang = item;
        }
      });
    },
    notOpenLang() {
      openMsg({
        content: "language.notOpen",
      });
    },
  },
});
