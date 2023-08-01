import { useLanguage } from "./languageStore";
import { useMail } from "./mailStore";
import { useModal } from "./modalStore";
import { useMessage } from "./msgStore";
import { useSsevent } from "./sseventStore";
import { useAuth } from "./auth";
import { useGame } from "./game";
// import { cloneDeep } from "lodash";
import { useDeposit } from "./depositStore";
import { useAnnouncement } from "./announcementStore";
import { useMinigame } from "./minigameStore";
import { useSounds } from "./soundsStore";

export const useStore = () => {
  return {
    useLanguage,
    useMail,
    useModal,
    useMessage,
    useSsevent,
    useAuth,
    useGame,
    useDeposit,
    useAnnouncement,
    useMinigame,
    useSounds,
  };
};

// export const resetPinia = (state) => {
//   const initState = cloneDeep(state);
//   return initState;
// };
