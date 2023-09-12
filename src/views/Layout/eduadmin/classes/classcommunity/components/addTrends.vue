<script lang="ts" setup>
import { ref, reactive } from 'vue'

import { quillEditor } from 'vue3-quill'
const emit = defineEmits(['onSubmit'])

const dialogVisible = ref(false)

const state = reactive({
  title: '',
  content: '',
  editorOption: {
    placeholder: '在此输入动态'
  }
})

const onSubmit = () => {
  if (state.title === '') {
    ElMessage.error('动态标题不能为空')
    return
  }
  if (state.content === '') {
    ElMessage.error('动态内容不能为空')
    return
  }
  emit('onSubmit', {
    title: state.title,
    content: state.content
  })
}

// 向外暴露的方法
const show = () => {
  dialogVisible.value = true
}
const hide = () => {
  dialogVisible.value = false
}
const onSuccess = () => {
  dialogVisible.value = false
  state.content = ''
  state.title = ''
}
defineExpose<{
  show: () => void
  hide: () => void
  onSuccess: () => void
}>({
  show,
  hide,
  onSuccess
})
</script>

<template>
  <el-dialog v-model="dialogVisible" title="添加动态" width="800">
    <el-form>
      <el-form-item label="标题" required>
        <el-input v-model="state.title" placeholder="请输入动态标题" />
      </el-form-item>
      <el-form-item label="内容" required>
        <div>
          <quill-editor
            v-model:value="state.content"
            :options="state.editorOption"
          />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog_footer">
        <el-button size="large" color="#2eba78" @click="onSubmit">
          <span style="color: white">确定</span>
        </el-button>
        <el-button size="large" @click="dialogVisible = false">
          取消
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.ql-container,
.ql-editor {
  min-height: 300px;
}

.dialog_footer {
  text-align: center;

  .el-button {
    width: 130px;
    margin: 0 20px;
  }
}
</style>
