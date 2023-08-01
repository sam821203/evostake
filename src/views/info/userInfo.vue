<template>
  <div class="userInfo">
    <div class="header">
      <img
        src="@/assets/images/memberCenter/material_user_icon2.png"
        alt=""
        class="head-icon"
      />
    </div>
    <ul class="list-wrap">
      <li class="list-item">
        <div class="label-wrap">
          <img
            src="@/assets/images/memberCenter/material_id.png"
            alt=""
            class="label-icon"
          />
          <p>{{ $t("stored.account") }}</p>
        </div>
        <p>{{ userInfo?.account }}</p>
      </li>
      <li class="list-item">
        <div class="label-wrap">
          <img
            src="@/assets/images/memberCenter/material_name.png"
            alt=""
            class="label-icon"
          />
          <p>{{ $t("register.name") }}</p>
        </div>
        <div class="edit-wrap">
          <div class="nameEdit" v-if="editInput">
            <input type="text" name="" id="" v-model.trim="name" autofocus />
          </div>
          <p v-else>{{ userInfo?.real_name }}</p>
          <img
            src="@/assets/images/memberCenter/material_nickname.png"
            alt=""
            :class="['edit', { editing: editInput }]"
            @click="edit"
            v-if="!editInput"
          />
          <div class="editCheck" v-if="editInput" @click="editCheck(name)">
            ✔
          </div>
        </div>
      </li>

      <li class="list-item">
        <div class="label-wrap">
          <img
            src="@/assets/images/memberCenter/material_phone.png"
            alt=""
            class="label-icon"
          />
          <p>{{ $t("register.phone") }}</p>
        </div>
        <p>{{ userInfo?.phone }}</p>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "@/store/index";
import { storeToRefs } from "pinia";
import { editRealNameApi } from "@/api/user";
const { useMessage } = useStore();
const { openMsg } = useMessage();
// import { onMounted } from "vue";

const { useAuth } = useStore();
const auth = useAuth();
// const { getUserInfo } = auth;
const { userInfo } = storeToRefs(auth);
const authStore = useAuth();
const { getUserInfo } = authStore;
const editInput = ref(false);
const name = ref(userInfo.value.real_name);

const edit = () => {
  editInput.value = !editInput.value;
  name.value = userInfo.value.real_name;
};

const editCheck = async (name) => {
  console.log(name.length);
  if (
    name
      .toString()
      .match(/^[a-zA-Z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s-]{2,60}$/)
  ) {
    editInput.value = !editInput.value;
    const res = await editRealNameApi({ real_name: name });
    if (res.data.code === 0) {
      getUserInfo();
    }
    console.log(res);
  } else {
    getUserInfo();
    openMsg({
      content: "Error, only 2-60 English.",
    })
      .then(() => {
        editInput.value = !editInput.value;
      })
      .catch(() => {
        editInput.value = !editInput.value;
      });
    console.log(name);
    console.log(userInfo.value.real_name);
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  padding-top: 5%;
  .head-icon {
    width: 100px;
    object-fit: contain;
  }
}
.list-wrap {
  width: 100%;
  padding: 20px;
  .list-item {
    display: flex;
    align-items: center;
    margin-bottom: 40px;
    .label-wrap {
      width: 50%;
      display: flex;
      align-items: center;
      p {
        color: $secondary;
      }
      .label-icon {
        width: 40px;
        height: 40px;
        object-fit: contain;
        margin-right: 10px;
      }
    }
    .edit-wrap {
      display: flex;
      align-items: center;
      width: 40%;
      justify-content: space-between;
      border-bottom: 1px solid;
      padding-bottom: 1px;
      p {
        width: 90%;
        word-wrap: break-word;
      }
      .edit {
        width: 15%;
      }
      .editing {
        margin: 0;
      }
      .nameEdit {
        width: 80%;
        input {
          outline: none;
          width: 100%;
        }
      }
      .editCheck {
        filter: invert(1);
        color: burlywood;
      }
    }

    p {
      color: $primary;
    }
  }
}
</style>
