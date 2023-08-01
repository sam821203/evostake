<template>
  <div class="add-card">
    <div class="item">
      <div class="title select-bank">銀行名稱</div>
      <div class="selector">
        <div class="default" @click="showContent" v-if="!showOptions">
          <div v-if="bankName" class="bankName">{{ bankName }}</div>
          <div v-else class="selector-placeholder">請選擇銀行名稱</div>
          <img src="@/assets/images/modal/list_open1.png" class="list-open" />
        </div>
        <div class="options" v-else>
          <div class="search">
            <input
              type="text"
              class="search-input"
              placeholder="搜尋銀行名稱"
            />
            <img
              src="@/assets/images/modal/search.png"
              class="search-icon"
              @click="search"
            />
          </div>
          <div class="option" @click="selectBank('ANZ')">ANZ</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
          <div class="option" @click="selectBank('Amanah')">Amanah</div>
        </div>
      </div>
    </div>
    <div class="item bank-brach">
      <div class="title">開戶支行</div>
      <input class="input-wrap" type="text" placeholder="請輸入銀行支行名稱" />
    </div>
    <div class="item bank-province">
      <div class="title">銀行省份</div>
      <input class="input-wrap" type="text" placeholder="請輸入銀行省份" />
    </div>
    <div class="item bank-city">
      <div class="title">支行所屬城市</div>
      <input class="input-wrap" type="text" placeholder="請輸入城市名稱" />
    </div>
    <div class="item account-name">
      <div class="title">銀行戶名</div>
      <input class="input-wrap" type="text" placeholder="請輸入戶名" />
    </div>
    <div class="item card-number">
      <div class="title">銀行卡卡號</div>
      <input class="input-wrap" type="number" placeholder="請輸入卡號" />
    </div>
    <div class="item id">
      <div class="title">身分證號</div>
      <input class="input-wrap" type="text" placeholder="請輸入持有人身分證" />
    </div>
    <div class="confirm">確認</div>
  </div>
</template>

<script setup>
import { ref } from "vue";
const bankName = ref("");
const showOptions = ref(false);
const showContent = () => {
  showOptions.value = !showOptions.value;
};
const selectBank = (value) => {
  bankName.value = value;
  showOptions.value = !showOptions.value;
};
const search = () => {
  console.log("search bank");
};
</script>

<style lang="scss" scoped>
.add-card {
  color: $primary;
  padding: 5%;
  .item {
    margin-bottom: 5%;

    .title {
      margin-bottom: 1%;
    }
    .selector {
      .default {
        width: 100%;
        height: 3rem;
        margin: 0 auto;
        line-height: 3rem;
        border: 2px solid rgb(54, 100, 131);
        border-radius: 5px;
        color: rgb(42, 76, 112);
        position: relative;
        .bankName {
          color: #fff;
          padding-left: 3%;
        }
        .selector-placeholder {
          padding-left: 3%;
        }

        .list-open {
          position: absolute;
          right: 2%;
          top: 30%;
          width: 8%;
        }
      }
      .options {
        width: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-top: 1%;
        border: 2px solid rgb(54, 100, 131);
        border-radius: 5px;
        max-height: 10rem;
        overflow-y: scroll;
        position: relative;
        .search {
          width: 98%;
          display: flex;
          margin: 0 auto;
          border: 2px solid rgb(54, 100, 131);
          border-radius: 5px;
          justify-content: space-between;
          position: sticky;
          top: 0;
          .search-input {
            width: 90%;
            line-height: 2.5rem;
            color: rgb(46, 72, 112);
            background-color: #000;
            &::-webkit-input-placeholder {
              color: rgb(46, 72, 112);
            }
          }
          .search-icon {
            width: 12%;
            padding: 2%;
          }
        }
        .option {
          width: 95%;
          height: 2rem;
          line-height: 2rem;
          margin: 0 auto;
        }
      }
    }
    .input-wrap {
      width: 100%;
      border: 2px solid rgb(54, 100, 131);
      border-radius: 5px;
      background-color: #000;
      height: 3rem;
      line-height: 3rem;
      margin-top: 1%;
      border-radius: 5px;
      color: #fff;
      &::-webkit-input-placeholder {
        color: rgb(46, 72, 112);
      }
    }
  }
  .confirm {
    width: 50%;
    height: 2rem;
    background-color: rgb(230, 127, 43);
    margin: 0 auto;
    text-align: center;
    line-height: 2rem;
    border-radius: 50px;
    margin-top: 5%;
    color: #fff;
    font-weight: 600;
  }
  input {
    padding-left: 3%;
  }
}
</style>
