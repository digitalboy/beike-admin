<template>
  <div class="centered-content">
    <el-table :data="theories" border stripe @cell-dblclick="openDialog">
      <el-table-column
        prop="theory_id"
        label="理论ID"
        width="80"
      ></el-table-column>
      <el-table-column prop="theory_content" label="理论内容" width="200">
        <template #default="scope">
          <span class="text-truncate-200">{{ scope.row.theory_content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者" width="120"></el-table-column>
      <el-table-column prop="theory_tags" label="标签管理">
        <template #default="scope">
          <el-tag
            v-for="content in scope.row.theory_tags"
            :key="content.tagname"
            class="mx-1"
            closable
            @close="handleClose(scope.row.theory_tags, content.tagname)"
          >
            {{ content.tagname }}
          </el-tag>
          <!-- :v-model="`taginputmodel${scope.row.theory_id}`" -->
          <el-input
            v-if="tagInputVisible[scope.row.theory_id]"
            v-model="taginputmodel[scope.row.theory_id]"
            ref="InputRef"
            class="ml-1 w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />

          <el-button
            v-else
            class="button-new-tag ml-1"
            size="small"
            @click="showTagInput(scope.row.theory_id)"
          >
            + New Tag
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      :title="dialogTitle"
      v-model="dialogVisible"
      width="70%"
      draggable
      @close="closeDialog"
    >
      <template #header>
        <el-input
          v-if="isSubjectIntegration"
          v-model="dialogTitle"
          placeholder="请输入融合标题"
          maxlength="15"
          type="text"
          show-word-limit
        ></el-input>
        <template v-else>{{ dialogTitle }}</template>
      </template>
      <el-form>
        <el-input
          v-model="textarea"
          type="textarea"
          :autosize="{ minRows: 1, maxRows: 30 }"
        ></el-input>
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="updateDatabase"
            :disabled="textarea === originalText"
          >
            确定更新</el-button
          >
        </span>
      </template>
    </el-dialog>

    <div style="margin: 10px">
      <el-button type="primary" @click="addTheory"> 增加理论 </el-button>
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
  height: 100%;
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
  max-width: 200px;
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
      dynamicTags: [],
      tagInputVisible: [],
      taginputmodel: {},
      // taginputmodel[3]: "",
    };
  },
  
  methods: {
    openDialog(row, column, cell, event) {
      console.log("行：", row);
      console.log("列：", column.label);
      console.log("格：", cell);
      console.log(event.target.tagName);
      // this.selectedLesson = row;
      // this.selectedColumnProperty = column.property;
      this.dialogTitle = "请编辑内容";
      this.textarea = event.target.textContent;
      this.dialogVisible = true;
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

    handleClose(alltags, tag) {
      console.log("tag", tag);
      console.log("111:", alltags);
      this.dynamicTags = alltags;
      // Remove the "tag" from "alltags"
      // Remove the tag from alltags
      const index = alltags.findIndex((tag) => tag.tagname === tag);
      alltags.splice(index, 1);

      // Refresh dynamicTags
      this.dynamicTags = alltags;
      console.log("222:", alltags);
    },
    showTagInput(index) {
      console.log("index", index);
      this.tagInputVisible[index] = true;
      // this.InputRef.value?.input?.focus();
    },

    handleInputConfirm() {},

    async updateDatabase() {
      let data = {};
      try {
        data = {
          // lesson_id: this.selectedLesson.lesson_id,
          // dis_int_content_id: this.currentdisintcontentid, // 当前选中的融合的 ID
          // dis_int_name: this.currentdisintname,
          // newContent: this.textarea // 更新后的内容
        };

        console.log(data);
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
    axios
      // GET教学理论列表
      .get(
        "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/get/listtheory"
      )
      .then((response) => {
        this.theories = response.data;
        this.dynamicTags = response.data.theory_tags;
        console.log(this.theories.theory_id);
        for (const theory of this.theories) {          
          this.taginputmodel[theory.theory_id] = "";
          console.log(this.taginputmodel);
        }
      })
      .catch((error) => {
        console.log(error);
        this.$message.error("没取得！");
      });
  },
};
</script>
