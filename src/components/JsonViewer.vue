
<template>
  <div class="json-viewer-container">
    <div class="json-viewer">
      <template v-if="isObject(data)">
        <div
          v-for="(value, key) in data"
          :key="key"
          class="json-item"
        >
          <div class="json-key">{{ key }}:</div>
          <div class="json-value">
            <json-viewer v-if="isObject(value) || Array.isArray(value)" :data="value" />
            <span v-else>{{ String(value) }}</span>
          </div>
        </div>
      </template>

      <template v-else-if="Array.isArray(data)">
        <div
          v-for="(item, index) in data"
          :key="index"
          class="json-array-item"
        >
          <div class="json-array-index">项目 {{ index + 1 }}:</div>
          <json-viewer :data="item" />
        </div>
      </template>

      <template v-else>
        <div class="json-primitive">{{ String(data) }}</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JsonViewer',
  props: {
    data: {
      required: true,
    },
  },
  methods: {
    isObject(value) {
      return value && typeof value === 'object' && !Array.isArray(value);
    },
  },
};
</script>

<style scoped>
.json-viewer-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  background-color: #fff;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  max-width: 100%;
  overflow-x: auto;
}

.json-viewer {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.json-item {
  margin-bottom: 12px;
}

.json-key {
  font-weight: 600;
  color: #444;
}

.json-value {
  padding-left: 12px;
  margin-top: 4px;
}

.json-array-item {
  margin-bottom: 12px;
  padding-left: 12px;
  border-left: 2px solid #eee;
}

.json-array-index {
  font-weight: 600;
  color: #666;
  margin-bottom: 6px;
}

.json-primitive {
  padding: 6px 12px;
  background-color: #f4f4f4;
  border-radius: 6px;
  border: 1px solid #ccc;
  display: inline-block;
}
</style>

