<script lang="ts" setup>
import { ref, reactive, onMounted } from 'vue'
import { loginApis } from '@/api'
import type { FormInstance, FormRules } from 'element-plus'
import type { ILoginQuery } from '@/utils/type'

const ruleFormRef = ref<FormInstance>()
const loginForm = reactive<ILoginQuery>({
  username: 'admin',
  password: 'admin',
  captcha: ''
})

const rules = reactive<FormRules<ILoginQuery>>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 5, message: '用户名长度为 3 至 5 位', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 1, max: 15, message: '密码长度为 6 至 15 位', trigger: 'blur' }
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' }
  ]
})
// 验证码图片路径
const calidataImgUrl = ref('')
const loading = ref(true)
// 获取验证码
const getValidateImg = async () => {
  loading.value = true
  let res = await loginApis.getValidationApi()
  calidataImgUrl.value = `data: image/jpeg;base64,${btoa(
    new Uint8Array(res as any).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      ''
    )
  )}`
  loading.value = false
}
// 登录
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid) => {
    if (valid) {
      await loginApis.loginApi(loginForm)
    }
  })
}
onMounted(getValidateImg)
</script>

<template>
  <div class="login_page">
    <el-card class="login_container p_c">
      <div class="login_title_container">
        <h2 class="login_title">学校管理后台登录</h2>
      </div>
      <el-form
        ref="ruleFormRef"
        :model="loginForm"
        :rules="rules"
        class="login_form"
        size="large"
      >
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            show-password
            placeholder="请输入密码"
            @keydown.enter="submitForm(ruleFormRef)"
          />
        </el-form-item>
        <el-form-item prop="captcha">
          <div class="validatabox">
            <el-input
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              @keydown.enter="submitForm(ruleFormRef)"
            />
            <div
              class="validateimgbox"
              v-loading="loading"
              @click="getValidateImg"
            >
              <img
                v-if="calidataImgUrl"
                :src="calidataImgUrl"
                class="validateimg"
              />
              <div v-else class="temp"></div>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="login_btnbox">
            <el-button
              type="success"
              style="width: 100%"
              round
              @click="submitForm(ruleFormRef)"
            >
              登录
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.login_page {
  width: 100%;
  height: 100%;
  background-image: url('../../assets/bg.jpg');
  background-size: 100% 100%;

  .login_container {
    width: 420px;
    box-sizing: border-box;
    padding: 10px 30px;

    .login_title_container {
      text-align: center;
      color: #009d09;

      .login_title {
        font-size: 22px;
        font-weight: 500;
      }
    }

    .login_form {
      margin-top: 40px;

      .login_btnbox {
        margin-top: 40px;
        width: 100%;
      }

      .validatabox {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .el-input {
          flex: 1;
          margin-right: 10px;
        }

        .validateimgbox {
          width: 80px;
          height: 36px;
          cursor: pointer;

          .validateimg {
            width: 100%;
            height: 100%;
          }

          .temp {
            width: 100%;
            height: 100%;
            background-color: #ccc;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
.login_container {
  .el-input__wrapper {
    background-color: #eeeeee;
    border-radius: 20px;
  }
}
</style>
@/api/index22
