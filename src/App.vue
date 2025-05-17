<template>
  <div style="padding: 16px;">
    <!-- 配置按钮 -->
    <van-button size="small" type="default" @click="showConfig = true" style="margin-bottom: 12px;">
      配置
    </van-button>

    <!-- 配置对话框 -->
    <van-dialog
      v-model="showConfig"
      title="设置 API Key"
      show-cancel-button
      @confirm="saveApiKey"
    >
      <van-field
        v-model="tempApiKey"
        label="API Key"
        placeholder="请输入 API Key"
        type="textarea"
        rows="2"
      />
    </van-dialog>

    <!-- 搜索输入框，无按钮 -->
        <!-- 搜索框 -->
    <van-search
      v-model="prompt"
      placeholder="请输入你的问题"
      @search="sendRequest"
      @clear="parsedJson = null"
      style="width: 100%;"
    />

    <div v-if="parsedJson" class="json-viewer-container">
    <!-- JSON展示 -->
      <json-viewer :data="parsedJson" />
    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import axios from 'axios';
import JsonViewer from './components/JsonViewer.vue';

export default {
  components: {
    JsonViewer,
  },
  data() {
    return {
      prompt: '',
      showConfig: false,
      apiKey: localStorage.getItem('api_key') || '',
      tempApiKey: '',
      parsedJson: null,
      activeNames: ['content'],
    };
  },
  methods: {
    async sendRequest() {
      if (!this.prompt.trim()) {
        Toast.fail('请输入问题');
        return;
      }

      if (!this.apiKey) {
        Toast.fail('请先配置 API Key');
        return;
      }

      try {
        const res = await axios.post(
          '/api/llm/v1/chat/completions',
          {
            //model: 'DeepSeek-R1-Distill-Qwen-7B',
            model: 'DeepSeek-R1-Distill-Qwen-32B',
            //model: 'DeepSeek-R1-Distill-Llama-70B',
            //model: 'DeepSeek-R1-671B',
            messages: [
              { role: 'system', content:'你是一个精通各种电影的专家，我会描述一个电影场景，你要根据记忆联网查询最有可能的电影，要电影真实存在,并返回电影名称、导演、主演、上映年份和剧情简介，使用 JSON 字符串格式返回，不要 markdown。' },
              { role: 'user', content: '请根据以下电影场景描述，判断最符合的电影，并返回JSON格式的电影信息:' + this.prompt.trim()},
            ],
            stream: false,
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const reply = res.data.choices?.[0]?.message?.content || '{" 提示": "无回复内容" }';
        console.log(reply)
        const json = extractJson(reply);
        this.parsedJson = json ? json : '{" 提示": "内容无法解析" }';
      } catch (e) {
        this.parsedJson = { 错误: e.message };
      }
    },
    saveApiKey() {
      this.apiKey = this.tempApiKey.trim();
      localStorage.setItem('api_key', this.apiKey);
      Toast.success('API Key 已保存');
    },
  },
  mounted() {
    this.tempApiKey = this.apiKey;
  },
};

function extractJson(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch (e) {
      console.error('JSON 解析失败:', e);
      return null;
    }
  }
  return null;
}
</script>
<style scoped>
.json-viewer-container {
  padding: 16px;
  width: 100%;
  box-sizing: border-box;
  margin-top: 12px;
  overflow-x: auto;
}

/* JsonViewer内部样式保持之前给的 */
</style>
