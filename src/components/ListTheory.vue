<template>
  <div class="centered-content">
    <el-table :data="theories" border stripe @cell-dblclick="openDialog">
      <!-- <el-table-column
        prop="theory_id"
        label="理论ID"
        width="80"
      ></el-table-column> -->
      <el-table-column prop="theory_content" label="理论内容" width="500">
        <template #default="scope">
          <span class="text-truncate-200">{{ scope.row.theory_content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者/出处" width="200"></el-table-column>
      <el-table-column prop="theory_tags" label="标签管理">
        <template #default="scope">
          <el-tag v-for="content in dynamicTags[scope.row.theory_id]" :key="content.tagname" class="mx-1" closable @close="handleClose(
              dynamicTags[scope.row.theory_id],
              content.tagname,
              scope.row.theory_id
            )
            ">
            {{ content.tagname }}
          </el-tag>
          <!-- :v-model="`taginputmodel${scope.row.theory_id}`" -->
          <el-input v-if="tagInputVisible[scope.row.theory_id]" v-model="taginputmodel[scope.row.theory_id]"
            ref="InputRef" class="ml-1 w-20" size="small" @keyup.enter="handleInputConfirm(scope.row.theory_id)" />

          <el-button v-else class="button-new-tag ml-1" size="small" @click="showTagInput(scope.row.theory_id)">
            + New Tag
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" draggable @close="closeDialog">
      <template #header>
        <el-input v-if="isSubjectIntegration" v-model="dialogTitle" placeholder="请输入融合标题" maxlength="15" type="text"
          show-word-limit></el-input>
        <template v-else>{{ dialogTitle }}</template>
      </template>
      <el-form>
        <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 1, maxRows: 30 }"></el-input>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="updateDatabase" :disabled="textarea === originalText">
            确定更新
          </el-button>
        </span>
      </template>
    </el-dialog>

    <div style="margin: 10px">
      <el-button type="primary" @click="addTheory"> 增加新理论 </el-button>
    </div>
  </div>
</template>

<style scoped>
.centered-content {
  display: flex;
  /* 设置元素为 flex 容器，使其子元素可以使用 flex 布局 */
  justify-content: center;
  /* 在主轴（水平轴）上居中 flex 容器内的所有子元素 */
  align-items: center;
  /* 在侧轴（垂直轴）上居中 flex 容器内的所有子元素 */
  flex-direction: column;
  /* 设置 flex 容器的主轴方向为垂直（列），子元素将沿垂直方向排列 */
  height: 90%;
  /* 设置元素高度为 100%，以使其占据父元素的全部高度 */
  max-width: 1500px;
  margin-left: auto;
  /* 使容器在水平方向上居中：添加自动空白到左边距 */
  margin-right: auto;
  /* 使容器在水平方向上居中：添加自动空白到右边距 */
}

.listalllesson {
  max-width: 900px;
  margin: 0;
  padding: 20px;
}

.text-truncate-200 {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 500px;
  display: block;
}
</style>

<script>
import axios from "axios";

export default {
  name: "ListTheory",
  data() {
    return {
      theories: [],
      dialogVisible: false,
      textarea: "",
      dialogTitle: "",
      dynamicTags: {},
      tagInputVisible: [],
      taginputmodel: [],
      currentTheoryid: "",
      currentTheoryColume: "",
      currentTheryContent: "",
      isSubjectIntegration: false,
      originalText: "",
    };
  },

  methods: {
    openDialog(row, column, cell, event) {
      if (column.property != "theory_tags") {
        console.log("行：", row);
        console.log("列：", column.prop);
        console.log("格：", cell);
        console.log(event.target.tagName);
        // this.selectedLesson = row;
        this.currentTheoryColume = column.property;
        this.dialogTitle = "请编辑内容";
        this.originalText = event.target.textContent;
        this.textarea = event.target.textContent;
        this.dialogVisible = true;
      }
    },

    closeDialog() {
      //console.log('保存的文本：', this.textarea);
      this.dialogVisible = false;
    },

    async addTheory() {
      this.$router.push({
        path: "/AddTheory",
        // query: { selectedOptions: this.selectedOptions.join(',') }
      });
    },

    handleClose(alltags, tag, rowindex) {
      console.log("tag", tag);
      console.log("oldalltags:", alltags);
      this.updateDatabase("deltag", rowindex, tag);
      const index = alltags.findIndex((content) => content.tagname === tag);
      console.log("删除：", index, alltags[index]);
      alltags.splice(index, 1);
      this.dynamicTags[rowindex] = alltags;
      console.log("newalltags:", alltags);
    },



    showTagInput(index) {
      console.log("index", index);
      this.tagInputVisible[index] = true;
      // this.InputRef.value?.input?.focus();
    },

    handleInputConfirm(rowindex) {
      console.log("哪个文章ID:", rowindex);
      // console.log(this.taginputmodel[index]);
      if (this.taginputmodel[rowindex]) {
        // console.log(this.taginputmodel[rowindex]);
        // console.log(this.dynamicTags[rowindex]);
        this.dynamicTags[rowindex].push({
          tagname: this.taginputmodel[rowindex],
        });
        this.updateDatabase("addtag", rowindex, this.taginputmodel[rowindex]);
      }
      this.tagInputVisible[rowindex] = "";
      this.taginputmodel[rowindex] = "";
    },

    async updateDatabase(dowhat, whichtheory, content) {
      let data = {};
      console.log("要干啥：", dowhat)
      try {
        if (dowhat === 'addtag') {
          console.log("要增加：", dowhat);
          data = {
            theoryaddtage: [
              {
                theory_id: whichtheory,
                tagname: content,
              },
            ],
          };
          console.log("add");
        } else if (dowhat === "deltag") {
          console.log("delllllll");
          data = {
            theorydeltage: [
              {
                theory_id: whichtheory,
                tagname: content,
              },
            ],
          };
        } else {
          data = {
            theoryupdate: [
              {
                theory_id: this.currentTheoryid,
                currentTheoryColume: this.currentTheoryColume,
                newContent: this.textarea, // 更新后的内容
              },
            ],

          };


        }

        console.log("DDDDDD:", data);
        // 发送 PUT 请求（或其他适合更新操作的 HTTP 方法）到后端
        // 请根据实际情况修改 URL 和其他请求参数
        const response = await axios.put(
          "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/put/updatebeikelesson",
          data
        );
        if (response.status === 200) {
          this.dialogTitle = "";
          this.textarea = "";
          this.$message.success("更新成功！");
          this.dialogVisible = false;
        } else {
          this.$message.error("更新失败，请稍后重试！");
        }
      } catch (error) {
        console.log(error);
        this.$message.error("更新失败，请稍后重试！");
      }
    },



  },

  mounted() {
    console.clear();
    console.log("start");
    axios
      // GET教学理论列表
      .get(
        "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/get/listtheory"
      )
      .then((response) => {
        this.theories = response.data;
        // this.dynamicTags = response.data.theory_tags;
        console.log(this.theories.theory_id);
        for (const theory of this.theories) {
          this.taginputmodel[theory.theory_id] = "";
          this.dynamicTags[theory.theory_id] = theory.theory_tags;
          console.log("qqq:", theory.theory_tags);
          console.log("kkk:", this.dynamicTags);
          // console.log(this.taginputmodel);
        }
      })
      .catch((error) => {
        console.log(error);
        this.$message.error("没取得数据！");
      });
  },
}
</script>







