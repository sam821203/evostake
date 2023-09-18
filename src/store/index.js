import { createPinia } from 'pinia'

import useLoginData from '@/store/loginDataStore'
import useTreeData from '@/store/treeDataStroe'
import useValidator from '@/store/validatorStore'
import useJumpPlayer from '@/store/jumpPlayerStore'
import useMsg from '@/store/msgStore'
import useGameTypeStore from '@/store/gameTypeStore'
import usefastgivenbonus from '@/store/fastgivenbonus'
export default () => {
  return {
    loginStore: useLoginData(),
    treeStore: useTreeData(),
    validatorStore: useValidator(),
    jumpPlayerStore: useJumpPlayer(),
    msgStore: useMsg(),
    gameTypeStore: useGameTypeStore(),
    fastgivenbonus: usefastgivenbonus()
  }
}

export const pinia = createPinia()
