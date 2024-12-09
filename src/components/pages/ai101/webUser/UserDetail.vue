<template>
  <div class="list-all">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item to="list">User List</el-breadcrumb-item>
      <el-breadcrumb-item :to="`userCreateList?uid=${$route.query.uid}`">{{ $route.query.uid }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.id }}</el-breadcrumb-item>
    </el-breadcrumb>
    <page-editor :modelData.sync="data" :render="renderData" :getDetil="getDetil" ref="listPage">
      <template slot="uploadImages">
        <div class="uploadImage">
          <el-image v-for="url in data.uploadImages" :key="url" :src="url" fit="contain"></el-image>
        </div>
      </template>
      <template slot="prompts">
        <div class="prompts">
          <div class="prompts-card" v-for="prompt in data.prompts" :key="prompt.tempPromptId">
            <div class="text">
              <span class="text-title">Prompts:</span>{{ prompt.text }}
            </div>
            <div class="text">
              <span class="text-title">Negative Prompt:</span>{{ prompt.negativePrompt }}
            </div>
            <div class="signs">
              <div class="text">
                <span class="text-title">Style:</span>{{ prompt.style }}
              </div>
              <div class="text">
                <span class="text-title">Seed:</span>{{ prompt.seed }}
              </div>
              <div class="text">
                <span class="text-title">Status:</span>{{ prompt.status === 2 ? "success":"faild" }}
              </div>
              <div class="text">
                <span class="text-title">SubStyle:</span>{{ prompt.subStyle }}
              </div>
            </div>
            <div class="imgs">
              <img v-for="url in prompt.images" :key="url" :src="url" >
            </div>
          </div>
        </div>
      </template>
    </page-editor>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {},
      pageName: "",
      searchRander: [],
      renderData: [
        {
          key: "Uid",
          type: "custom",
          modelName: "uid",
          custom(row) {
            return row.uid
          },
        },
        {
          key: "Upload Images",
          type: "slot",
          slotName: "uploadImages",
        },
        {
          key: "Gender",
          type: "custom",
          custom(row) {
            return row.gender
          },
        },
        {
          key: "Prompts",
          type: "slot",
          slotName: "prompts",
        }
      ]
    };
  },
  methods: {
    getDetil() {
      return new Promise(resolve => {
        let id = this.$route.query.id
        this.$request(`/ai101/webpack/detail/${id}`, {}, res => {
          resolve(res.data.data)
        }, 'get', false, false)
      })
    }
  }
};
</script>

<style scoped lang="less">
.list-all /deep/ .func-btns {
  display: none;
}

.list-all /deep/ .all {
  min-width: 0;
}

.list-all {
  overflow: auto;
}

.el-breadcrumb {
  margin: 10px;
}

.list-all {
  font-family: Avenir;
  -webkit-font-smoothing: antialiased;
  /deep/ .uploadImage {
    gap: 10px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    grid-auto-rows: 150px;

    .el-image {
      background-color: rgba(0, 0, 0, 0.1);
      padding: 10px;
    }
  }

  /deep/ .prompts-card {
    box-shadow: 0 0 0 1px rgba(0, 0, 0, .1);
    border-radius: 8px;
    padding: 20px;
    background-color: #fff;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 30px;
    .text{ 
      color: rgba(0,0,0,0.5);
      font-size: 300;
      .text-title{ 
        font-weight: 800; margin-right: 5px;
        color: #2c3e50;
      }
    }
    .signs{
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      .text{ flex: 1;white-space: nowrap;}
    }
    .imgs{
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      img { width: 150px;height: 150px; } 
    }
  }
  /deep/ .btns{ display: none; }
}
</style>