<template>
  <ul>
    <li
      v-for="(item, index) in allQA"
      :key="item.id"
      :id="item.id"
      @click="readQA(index, item.id)"
    >
      <div :class="['item-wrap', { wrapOpen: open === index }]">
        <div :class="['item', { open: open === index }]" :id="item.id">
          <img
            src="@/assets/images/memberCenter/QA_1.png"
            alt=""
            class="icon"
          />
          <p :class="['item-title', { titleOpen: open === index }]">
            {{ $t(item.title) }}
          </p>
          <img
            src="@/assets/images/modal/list_open1.png"
            alt=""
            :class="['list-open', { iconOpen: open === index }]"
          />
        </div>
      </div>
      <div class="content" :id="item.id" v-show="showContent === index">
        <p :class="['item-content', { openContent: open === index }]">
          {{ $t(item.content) }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { ref } from "vue-demi";

const showContent = ref(-1);
const open = ref(-1);
const allQA = ref([
  {
    id: 1,
    title: "question.title1",
    content: "question.content1",
  },
  {
    id: 2,
    title: "question.title2",
    content: "question.content2",
  },
  {
    id: 3,
    title: "question.title3",
    content: "question.content3",
  },
  {
    id: 4,
    title: "question.title4",
    content: "question.content4",
  },
  {
    id: 5,
    title: "question.title5",
    content: "question.content5",
  },
  {
    id: 6,
    title: "question.title6",
    content: "question.content6",
  },
  {
    id: 7,
    title: "question.title7",
    content: "question.content7",
  },
  {
    id: 8,
    title: "question.title8",
    content: "question.content8",
  },
  {
    id: 9,
    title: "question.title9",
    content: "question.content9",
  },
  {
    id: 10,
    title: "question.title10",
    content: "question.content10",
  },
  {
    id: 11,
    title: "question.title11",
    content: "question.content11",
  },
  {
    id: 12,
    title: "question.title12",
    content: "question.content12",
  },
  {
    id: 13,
    title: "question.title13",
    content: "question.content13",
  },
  {
    id: 14,
    title: "question.title14",
    content: "question.content14",
  },
  {
    id: 15,
    title: "question.title15",
    content: "question.content15",
  },
  {
    id: 16,
    title: "question.title16",
    content: "question.content16",
  },
  {
    id: 17,
    title: "question.title17",
    content: "question.content17",
  },
  {
    id: 18,
    title: "question.title18",
    content: "question.content18",
  },
  {
    id: 19,
    title: "question.title19",
    content: "question.content19",
  },
  {
    id: 20,
    title: "question.title20",
    content: "question.content20",
  },
  {
    id: 21,
    title: "question.title21",
    content: "question.content21",
  },
  {
    id: 22,
    title: "question.title22",
    content: "question.content22",
  },
  // {
  //   id: 23,
  //   title: "question.title23",
  //   content: "question.content23",
  // },
]);

const readQA = (index) => {
  if (showContent.value === index) {
    showContent.value = -1;
    open.value = -1;
  } else {
    showContent.value = index;
    open.value = index;
  }
};
</script>

<style lang="scss" scoped>
ul {
  margin: 30% 5%;
  overflow: scroll;
  margin-top: 0;
  padding-top: 10%;

  li {
    width: 100%;
    height: auto;
    margin-bottom: 6%;
    .item-wrap {
      display: flex;
      align-items: center;
      width: 95%;
      margin: 0 auto;
      margin-bottom: 10%;
      .item {
        display: flex;
        align-items: flex-start;
        width: 100%;
        color: rgb(0, 231, 179);
        .icon {
          width: 10%;
        }
        .item-title {
          width: 80%;
          font-size: 1.1rem;
          line-height: normal;
          flex: 1;
          color: #f7e4ff;
          margin-left: 3%;
          padding-bottom: 3%;
          border-bottom: 1px solid #8c17c2;
        }
        .titleOpen {
          border: none;
        }
        .list-open {
          width: 6%;
        }
        .iconOpen {
          transform: rotate(-90deg);
          margin-top: 2%;
        }
      }
    }
    .wrapOpen {
      margin-bottom: 0;
    }

    .content {
      color: #fff;
      z-index: 1;
      border-top: none;
      opacity: 1;
      position: relative;
      top: -5px;
      width: 98%;
      margin: 0 auto;
      .item-content {
        width: 78%;
        font-size: 1rem;
        margin: 0 14%;
        line-height: normal;
      }
      .openContent {
        border-bottom: 1px solid rgb(49, 79, 118);
        padding-bottom: 3%;
      }
    }
  }
}
</style>
