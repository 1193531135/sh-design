<template>
  <div class="list-all">
    <el-dialog :visible.sync="dialogVisible" width="90%" top="32px" @closed="dialogClose">
      <div class="card-item">
        <div class="detail-image">
          <img class="card-error" v-show="dialogData.reportData?.length > 0" src="../../../../assets/error.png" />
          <div class="card-image">
            <el-image :src="dialogData.image" @load="dialogImgLoad = false"></el-image>
            <img class="card-image-default" v-show="dialogImgLoad" :src="defaultImg">
            <div class="card-mask" v-if="dialogData.rejectReason">
              <i class="el-icon-warning-outline"></i>
              <p>{{ rejectOptions.filter(i => i.value === dialogData.rejectReason)[0].label }}</p>
            </div>
          </div>
          <div class="card-statys" :style="'color:' + statusMap[dialogData.publishStatus]?.color">
            <i class="cross-icon-luyin"></i>{{ statusMap[dialogData.publishStatus]?.text }}
          </div>
          <div class="card-heart">
            <img src="../../../../assets/heart-fill.png" alt="">
            <span>{{ dialogData.like - dialogData.likeBase }}{{ dialogData.likeBase ? `+${dialogData.likeBase}` : ''
              }}</span>
          </div>
        </div>
      </div>
      <div class="detail-message">
        <div class="detail-options">
          <el-button v-show="dialogData.publishStatus != 1" type="success" size="medium" @click="passData(dialogData.id)">Pass</el-button>
          <el-dropdown v-show="dialogData.publishStatus != 2" trigger="click" @command="command => rejectData(dialogData.id, command)">
            <el-button type="warning" size="medium">
              Reject <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="rej in rejectOptions" :key="rej.value" :command="rej.value">{{ rej.label
                }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="danger" size="medium" @click="deleteData(dialogData.id)">Delete</el-button>
        </div>
        <div style="font-size: 25px;font-weight: 800;">{{ dialogData.styleName }}</div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="Prompts" name="Prompts">
            <div class="dialog-textarea">
              <div class="dialog-textarea-title">User Prompts</div>
              <div class="dialog-textarea-content">
                {{ dialogData.myPrompt }}
              </div>
            </div>
            <div class="dialog-textarea">
              <div class="dialog-textarea-title">Default Prompts</div>
              <div class="dialog-textarea-content">
                {{ dialogData.stylePrompt }}
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="Negative" name="Negative">
            <div class="dialog-textarea">
              <div class="dialog-textarea-content">
                {{ dialogData.negativePrompt }}
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div style="width: 100%; height: 1px; background-color: black;"></div>
        <div class="dialog-textarea dialog-report">
          <div class="dialog-textarea-title">Report</div>
          <div class="dialog-textarea-content">
            <div v-if="dialogData.reportData?.length === 0">Nothing at here yet</div>
            <div class="report-item" v-for="item in dialogData.reportData" :key="item.id">
              <div class="report-item-title">{{ item.reportUid }}</div>
              <div class="report-item-content">
                <div class="report-item-text">
                  {{ item.content || 'No Data' }}
                </div>
                <div class="report-item-btn">
                  <button v-if="item.status === 0" @click="ignoreReport(item.id)">Ignore</button>
                  <span v-else>Ignored</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="content-main" v-loading="listLoading">
      <!-- 批量操作栏 -->
      <div class="options-con">
        <div class="options-type-con" v-show="selectedIds.length > 0">
          <el-button type="success" size="small" @click="passData()">Pass</el-button>
          <el-dropdown trigger="click" @command="command => rejectData(null, command)">
            <el-button type="warning" size="small">
              Reject <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="rej in rejectOptions" :key="rej.value" :command="rej.value">{{ rej.label
                }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" size="small" @click="toppingData()">Feature</el-button>
          <el-button type="info" size="small" @click="ignoreReportBatch()">Ignore</el-button>
          <el-button type="primary" size="small" @click="unpinData()">Unpin</el-button>
          <!-- <el-button type="danger" size="small" @click="deleteData()">Delete</el-button> -->
          <el-button type="primary" size="small">Num:{{ selectedIds.length }}</el-button>
        </div>
        <el-button icon="el-icon-refresh" circle @click="getList()"></el-button>
      </div>
      <div class="content-sroll">
        <div class="title">Gallery List</div>
        <div class="search-con">
          <el-radio-group v-model="searchData.publishStatus" size="small">
            <el-radio-button :label="-1">All</el-radio-button>
            <el-radio-button :label="0">Waiting for Review</el-radio-button>
            <el-radio-button :label="1">Published</el-radio-button>
            <el-radio-button :label="2">Reject</el-radio-button>
          </el-radio-group>
          <el-select v-model="searchData.mixSearch" multiple size="mini" clearable collapse-tags>
            <el-option v-for="item in mixSearchOptions" :key="item.value" :value="item.value"
              :label="item.label"></el-option>
          </el-select>
          <div class="style-filter">
            <div class="interval"></div>
            <el-select v-model="searchData.styleId" size="mini" clearable placeholder="Model Type">
              <el-option v-for="item in styleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="sort-select">
            <div class="interval"></div>
            <el-select v-model="searchData.startSort" size="mini" clearable placeholder="Sort By">
              <el-option v-for="item in listSort" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
          <div class="time-select">
            <div class="interval"></div>
            <div class="dates">
              <el-date-picker v-model="searchData.startTime" type="datetime" size="mini" :placeholder="'Start Date'"
                value-format="yyyy-MM-dd HH:mm:ss" :picker-options="startPickerOptions"></el-date-picker>
              <div style="width: 10px; height: 1px; background-color: black;margin:0 5px"></div>
              <el-date-picker v-model="searchData.endTime" type="datetime" size="mini" :placeholder="'End Date'"
                value-format="yyyy-MM-dd HH:mm:ss" :picker-options="endPickerOptions"></el-date-picker>
            </div>
          </div>
        </div>
        <div class="card-grid" v-show="listData.length > 0">
          <div class="card-item" v-for="itemData in listData" :key="itemData.id" ref="card">
            <!-- 操作遮罩层 -->
            <div class="card-shadow" :style="`${itemData.selected ? 'display:block' : ''}`">
              <el-checkbox v-model="itemData.selected"></el-checkbox>
              <div class="card-shadow-btns">
                <el-button size="small" @click="showData(itemData)" class="detail-button">Detail</el-button>
                <el-button v-show="itemData.publishStatus != 1" type="success" size="mini"
                  @click="passData(itemData.id)">Pass</el-button>
                <div class="reject-button" v-show="itemData.publishStatus != 2">
                  <el-button type="warning" size="mini">
                    Reject <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <select class="reject-select" @input="({ target }) => rejectData(itemData.id, target.value)">
                    <option style="display: none;"></option>
                    <option v-for="rej in rejectOptions" :key="rej.value" :value="rej.value">
                      {{ rej.label }}
                    </option>
                  </select>
                </div>
                <el-button v-show="!itemData.isTopping" type="primary" @click="toppingData(itemData.id)"
                  size="mini">Feature</el-button>
                <el-button v-show="itemData.isTopping" type="primary" @click="unpinData(itemData.id)"
                  size="mini">Unpin</el-button>
              </div>
            </div>
            <div class="card-statys" :style="'color:' + statusMap[itemData.publishStatus]?.color">
              <i class="cross-icon-luyin"></i>{{ statusMap[itemData.publishStatus]?.text }}
            </div>
            <img class="card-error" v-show="itemData.reportData.length > 0" src="../../../../assets/error.png" />
            <div class="card-image">
              <el-image v-show="!itemData.load" :src="itemData.imagesThum" @load="imageLoaded(itemData)"
                @error="imageLoaded(itemData)"></el-image>
              <img class="card-image-default" v-show="itemData.load" :src="defaultImg">
            </div>
            <div class="card-heart" @click="setHeart(itemData.id)">
              <img src="../../../../assets/heart-fill.png" alt="">
              <span>{{ itemData.like - itemData.likeBase }}{{ itemData.likeBase ? `+${itemData.likeBase}` : '' }}</span>
            </div>
          </div>
        </div>
        <div v-if="listData.length == 0" style="flex: 1;display:flex;align-items: center;justify-content: center;"> No
          Data </div>
      </div>
    </div>
    <el-pagination background layout="total,sizes,prev, pager, next,jumper" :total="total" :pager-count="5"
      :page-size.sync="pageSize" :current-page.sync="pageNum" :page-sizes="[pageSize]"></el-pagination>
  </div>
</template>
<script>
import defaultImg from '../../../../assets/defaultLoding.png'
import { Debounce } from '@/tool'
const searchDebounce = new Debounce(500)
export default {
  data() {
    return {
      // 只展示，去除所有操作
      onlyShow: false,
      defaultImg,
      // dialog的参数
      dialogVisible: false,
      dialogData: {},
      activeName: "Prompts",
      dialogImgLoad: false,
      // 数据存储相关
      listLoading: false,
      listData: [],
      // status的映射
      statusMap: {
        0: { text: " Waiting for Review", color: "#E6A23C" },
        1: { text: " Published", color: "rgb(103, 194, 58)" },
        2: { text: " Rejected", color: "rgb(216, 30, 6)" },
      },
      // 合并的查询选项
      mixSearchOptions: [
        { value: "isTaggerCheck", label: "Auto Review" },
        { value: "isTopping", label: "Featured" },
        { value: "reportFlag", label: "Reported" },
        { value: "appealFlag", label: "Appeal" },
      ],
      // reject 操作的携带参数
      rejectOptions: [
        { value: 1, label: "Sexual content" },
        { value: 2, label: "Sexual prompts" },
        { value: 3, label: "Violence or terriristic content" },
        { value: 4, label: "Contain bizarre imagery" },
        { value: 5, label: "Misrecognize person" },
      ],
      // 排序选项
      listSort: [
        { value: 1, label: "Like Down" },
        { value: 2, label: "Like Up" },
      ],
      // 分页查询相关的参数
      total: 0,
      pageNum: 1,
      pageSize: 50,
      searchData: {
        publishStatus: -1,
        isTaggerCheck: 0,
        isTopping: 0,
        styleId: null,
        reportFlag: 0,
        startTime: "",
        endTime: "",
        startSort: "",
        // 申诉
        appealFlag: 0,
        mixSearch: []
      },
      styleList: [],
      // 时间查询控件
      startPickerOptions: {
        disabledDate: (time) => {
          let state = false
          if (this.searchData.endTime) {
            state = time.getTime() > new Date(this.searchData.endTime).getTime();
          }
          return state
        }
      },
      endPickerOptions: {
        disabledDate: (time) => {
          let state = false
          if (this.searchData.startTime) {
            state = time.getTime() < new Date(this.searchData.startTime).getTime();
          }
          return state
        }
      }
    };
  },
  watch: {
    searchData: {
      handler(val) {
        // 延时触发
        searchDebounce.run(this.getList)
      },
      deep: true
    },
    pageNum() { this.getList() },
    pageSize() { this.getList() },
  },
  methods: {
    // ignoreReport 忽略举报
    ignoreReport(reportId) {
      this.$request(`/notm105/dashboard/v1/report/ignore/${reportId}`, {}, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    // ignoreReportBatch 忽略批量举报
    ignoreReportBatch() {
      this.$request(`/notm105/dashboard/v1/report/ignoreBatch`, {
        idList:this.selectedIds 
      }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    passData(id) {
      this.$request("/notm105/dashboard/v1/publish/passBatch", { idList: id ? [id] : this.selectedIds }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    rejectData(id, type) {
      // return console.log(id,type)
      this.$request("/notm105/dashboard/v1/publish/rejectBatch", { 
        idList: id ? [id] : this.selectedIds ,
        rejectReason: new Number(type)
      }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    unpinData(id) {
      this.$request("/notm105/dashboard/v1/works/top/canel", { idList: id ? [id] : this.selectedIds }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    toppingData(id) {
      this.$request("/notm105/dashboard/v1/works/top/set", { idList: id ? [id] : this.selectedIds }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    deleteData(id) {
      this.$request("/notm105/dashboard/v1/works/delBatch", { idList: id ? [id] : this.selectedIds }, res => {
        if (!res.error) {
          this.getList()
        }
      }, "post", false, false)
    },
    // set Heart
    setHeart(workId) {
      this.$prompt("Setting heart base", "", {
        inputPattern: /^[0-9]{1,}$/,
        inputErrorMessage: "Please input number",
      }).then(({ value: likeBase }) => {
        this.$request("/notm105/dashboard/v1/works/likeBase/set", { likeBase, workId }, res => {
          if (!res.error) {
            this.getList()
          }
        }, "post", false, false)
      }).catch(() => { })
    },
    // dialog 关闭回调
    dialogClose() {
      // 还原
      this.activeName = 'Prompts';
      this.dialogData = {}
      const dialog = document.querySelector('.el-dialog__wrapper')
      dialog.style.display = 'block'
      dialog.scrollTop = 0
      dialog.style.display = 'none'
    },
    // 详情点击
    showData(data) {
      this.dialogData = data
      this.dialogVisible = true
      this.dialogImgLoad = true
    },
    // 获取列表
    getList(config = {}) {
      config = {
        ...this.searchData,
        publishStatus: this.searchData.publishStatus == -1 ? null : this.searchData.publishStatus,
        startSort: this.searchData.startSort == -1 ? null : this.searchData.startSort,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        ...config,
      }
      delete config.mixSearch
      // 添加混合查询
      this.searchData.mixSearch.some(key => {
        config[key] = 1
      })
      // 时间有一个不存在就不传
      if (!config.startTime || !config.endTime) {
        config.startTime = null
        config.endTime = null
      }
      // 因为控件不能限制时分秒，时分秒要单独校验
      // 都存在才进行对比校验
      else if (new Date(this.searchData.endTime).getTime() <= new Date(this.searchData.startTime).getTime()) {
        this.$message({ message: 'End time must be greater than start time', type: 'warning' })
        return false
      }
      // // 时间加上时分秒
      // config.startTime && (config.startTime = config.startTime + ' 00:00:00')
      // config.endTime && (config.endTime = config.endTime + ' 23:59:59')
      this.onlyShow && (config.publishStatus = 1)
      this.listLoading = true
      return new Promise(resolve => {
        this.$request("/notm105/dashboard/v1/list", config, res => {
          this.listLoading = false
          if (!res.error) {
            // 初始化res.data.data.list
            let randerListData = res.data.data.list
            const img = document.createElement('img')
            randerListData.some(i => {
              i.selected = false
              // 已缓存的图片不再重复加载
              img.src = i.imagesThum
              i.load = !img.complete
              // 如果有dialog存在同步数据
              this.dialogData.id && i.id === this.dialogData.id && (this.dialogData = i)
            })
            this.listData = randerListData
            this.total = res.data.data.total
            resolve()
          }
        }, 'get', false, false)
      })
    },
    // 获取风格列表
    getStyleList() {
      return new Promise(resolve => {
        this.$request("/notm105/dashboard/v1/styleList", {}, res => {
          if (!res.error) {
            this.styleList = res.data.data
            resolve()
          }
        }, 'get', false, false)
      })
    },
    // 列表图片load回调
    imageLoaded(itemData) {
      itemData.load = false
      this.layout()
    },
    // 重新布局
    layout() {
      let els = this.$refs.card
      els && els.some((el) => {
        const rows = Math.ceil(el.clientHeight / 5) + 2
        el.style.gridRowEnd = `span ${rows}`
      })
    }
  },
  computed: {
    selectedIds() {
      return this.listData.filter(i => i.selected).map(i => i.id)
    }
  },
  created() {
    // 读取url来判断 onlyShow状态
    this.onlyShow = this.$route.path.split("/").includes("show")
    this.getStyleList()
  },
  async mounted() {
    await this.getList()
    console.log(this.$md5('admin@laien.io'))
  }
}
</script>

<style scoped lang="less">
.list-all {
  background-color: white;
  color: rgb(44, 62, 80);
  display: flex;
  flex-direction: column;
  -webkit-font-smoothing: antialiased;

  /deep/ .el-dialog__wrapper::-webkit-scrollbar {
    width: 0;
  }

  /deep/ img {
    transform: translate(0);
  }

  // public
  .card-item {
    grid-row-end: span 27;

    .card-image {
      .el-image {
        width: 100%;
        display: block;
      }

      .card-image-default {
        width: 100%;
        animation: 1s linear 1s infinite alternate scale;
      }
    }

    .card-statys {
      position: absolute;
      text-align: right;
      font-size: 100%;
      right: 0;
      top: 0;
      z-index: 3;
      padding: 7px;
      -webkit-backdrop-filter: blur(8px) brightness(.5);
      backdrop-filter: blur(8px) brightness(.5);
      border-radius: 0 0 0 16px;
      font-family: Montserrat !important;
      font-weight: 500;
    }

    .card-error {
      position: absolute;
      left: 16px;
      bottom: 16px;
      width: 25px;
      z-index: 2;
    }

    .card-heart {
      position: absolute;
      right: 0;
      bottom: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      font-size: 100%;
      color: #fff;
      -webkit-backdrop-filter: blur(8px) brightness(.5);
      backdrop-filter: blur(8px) brightness(.5);
      padding: 4px 30px 4px 16px;
      border-radius: 16px 0 16px 0;
      padding: 5px;
      border-bottom-right-radius: 0;

      img {
        width: 15px;
      }
    }
  }

  /* 自定义dates*/
  .dates {
    /* margin-right: 10px; */
    display: flex;
    align-items: center;

    &>.el-input {
      width: 175px;
    }

    &>div {
      /* margin-right: 5px; */
    }

    &>.hot-key span {
      font-size: 12px;
      color: #409eff;
    }
  }



  // dialog
  /deep/ .el-dialog {
    min-width: 820px;
    font-size: 14px;

    .el-dialog__header {
      display: none;
    }

    .el-dialog__body {
      padding: 24px 20px;
      display: grid;
      gap: 20px;
      grid-template-columns: 1fr 1fr;
    }

    .detail-image {
      position: relative;
      border-radius: 16px;
      overflow: hidden;
      .card-mask{
        background-color: rgba(0, 0, 0, 0.5);
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        // backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        color: #F56C6C;
        font-size: 20px;
        i { font-size: 40px; }
      }
    }

    .card-item {
      font-size: inherit;
      grid-row-end: none;

      .card-heart {
        img {
          width: 20px;
        }
      }
    }

    .detail-message {
      min-width: 320px;
      text-align: left;
      font-family: Montserrat;
      display: flex;
      flex-direction: column;
      gap: 15px;

      .detail-options {
        display: flex;
        gap: 10px;
        .el-button {
          width: 100px;
          font-family: inherit;
        }
      }

      .el-tab-pane {
        gap: 10px;
        display: flex;
        flex-direction: column;
      }

      .dialog-textarea {
        text-align: left;
        font-weight: 400;
        line-height: 24px;

        .dialog-textarea-title {
          font-weight: 600;
        }

        .dialog-textarea-content {
          padding: 8px 12px;
          height: 114px;
          overflow: auto;
          border: 1px solid rgb(243, 244, 246);
          border-radius: 8px;
        }
      }

      .dialog-report {
        display: flex;
        flex-direction: column;

        .dialog-textarea-content {
          height: auto;
          min-height: 180px;
          overflow: visible;
          display: flex;
          flex-direction: column;
          gap: 20px;

          .report-item {
            background-color: rgb(238, 238, 238);
            padding: 8px 16px;
            border-radius: 8px;

            .report-item-title {
              color: #7c3aed;
              font-weight: 500;
            }

            .report-item-content {
              border-top: 1px solid rgba(0, 0, 0, .12);
              padding-top: 4px;
              margin-top: 4px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              line-height: 24px;

              .report-item-btn {
                padding-left: 5px;
                text-wrap: nowrap;

                button:hover {
                  background-color: rgba(0, 0, 0, .04);
                  ;
                }

                button {
                  padding: 6px 8px;
                  border: none;
                  cursor: pointer;
                  border-radius: 8px;
                }
              }
            }
          }
        }
      }
    }
  }

  // content
  .content-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: auto;
    position: relative;

    .options-con {
      text-align: right;
      position: absolute;
      right: 30px;
      bottom: 20px;
      z-index: 300;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100px;

      .options-type-con {
        .el-button,
        .el-dropdown
        {
          width: 100%;
        }
      }

      .el-button {
        margin: 5px 0;
        box-shadow: 0 0 10px #000;
      }
    }

    .content-sroll {
      scrollbar-width: none;
      overflow: auto;
      position: relative;
      flex: 1;
      display: flex;
      flex-direction: column;

      .title {
        text-align: left;
        font-size: 50px;
        font-family: Philosopher;
        font-style: italic;
        font-weight: 700;
        padding: 20px;
      }

      .search-con {
        background-color: #fafafa;
        padding: 10px;
        display: flex;
        position: sticky;
        top: 0;
        z-index: 5;
        flex-wrap: wrap;
        gap: 5px;
        align-items: center;

        &>div {
          display: flex;
          align-items: center;
        }

        .one-checkbox /deep/ .el-checkbox-button__inner {
          border-radius: 4px;
        }

        .interval {
          height: 25px;
          width: 3px;
          background-color: rgba(0, 0, 0, 0.1);
          margin: 0 5px 0 0;
        }

        .el-select {
          min-width: 100px;

          & /deep/ input {
            width: inherit;
          }
        }

        .el-radio-group {
          display: flex;
          flex-wrap: wrap;
        }

        .el-checkbox {
          margin: 0;
        }
      }

      .card-grid {
        width: 100%;
        margin: 20px auto; // 剧中
        // // columns: 10 180px;
        // grid-auto-flow: row dense;
        display: grid;
        grid-auto-rows: 5px;
        grid-template-columns: repeat(auto-fill, 190px);
        align-items: start;
        justify-content: center;

        .card-item {
          width: 180px;
          border-radius: 16px;
          font-size: 12px;
          overflow: hidden;
          // display: flex;
          // flex-direction: column;
          position: relative;

          &:hover {
            cursor: pointer;
          }

          &:hover>.card-shadow {
            display: block;
          }

          &:hover>.card-shadow>.card-shadow-btns {
            display: flex;
          }

          .card-shadow {
            display: none;
            position: absolute;
            top: 0;
            bottom: 0;
            width: 100%;
            z-index: 2;
            background-color: rgba(0, 0, 0, 0.8);

            .card-shadow-btns {
              position: absolute;
              top: 0;
              bottom: 0;
              width: 100%;
              display: none;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              gap: 5px;

              >.el-button,
              >.el-dropdown {
                width: 80%;
                margin: 0;
              }

              .reject-button {
                width: 80%;
                position: relative;

                .el-button {
                  width: 100%;
                }

                .reject-select {
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                  opacity: 0;
                  cursor: pointer;
                }
              }

              >.el-dropdown>.el-button {
                width: 100%;
              }
            }

            .el-checkbox {
              position: absolute;
              z-index: 3;
              top: 16px;
              left: 16px;
            }
          }
        }
      }
    }
  }

  // pagin
  .el-pagination {
    padding: 10px 0;
  }
}

@media (prefers-color-scheme: dark) {
  .list-all {
    color: var(--dark-color1--);
    background-color: var(--dark-bgc3--);
    /deep/ input{ background-color: var(--dark-bgc3--); }
    .search-con {
      background-color: #4d4d4d !important;
    }

    /deep/ .el-dialog__body {
      background-color: #4d4d4d !important;
      color: var(--dark-color2--);
    }

    .content-main {
      .el-loading-mask {
        background-color: rgba(0, 0, 0, .9);
      }
    }
  }
}
</style>