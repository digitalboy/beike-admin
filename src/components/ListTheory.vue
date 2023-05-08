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
          <el-button @click="closeDialog">取 消</el-button>
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
  margin: 0 auto
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
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter} from 'vue-router';

export default {
  name: "ListTheory",
  setup() {
    const theories = ref([]);
    const dialogVisible = ref(false);
    const textarea = ref("");
    const dialogTitle = ref("");

    const dynamicTags = reactive({});
    const tagInputVisible = reactive([]);
    const taginputmodel = reactive([]);
    
    const currentTheoryid = ref("");
    const currentTheoryColume = ref("");
    const currentTheoryContent = ref("");
    const isSubjectIntegration = ref(false);
    const originalText = ref("");
    const router = useRouter();    

    async function updateDatabase(dowhat, whichtheory, content) {
      let data = {};
      console.log("要干啥：", dowhat);
      try {
        if (dowhat === "addtag") {
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
                theory_id: currentTheoryid,
                currentTheoryColume: currentTheoryColume,
                newContent: textarea, // 更新后的内容
              },
            ],
          };
        }

        // 发送数据到服务器
        const response = await axios.post("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/put/updatebeikelesson", data);
        console.log("服务器响应：", response);
        if (response.status === 200) {
          ElMessage.success("更新成功！");
          dialogVisible.value = false;
          await fetchData(); // 刷新表格数据
        } else {
          ElMessage.error("更新失败，请稍后重试！");
        }

      } catch (error) {
        console.log("发生错误：", error);
      }
    }


    async function addTheory() {
      router.push({
        path: "/AddTheory",
        // query: { selectedOptions: this.selectedOptions.join(',') }
      });
    }

    function handleClose(alltags, tag, rowindex) {
      console.log("tag", tag);
      console.log("oldalltags:", alltags);
      updateDatabase("deltag", rowindex, tag);
      const index = alltags.findIndex((content) => content.tagname === tag);
      console.log("删除：", index, alltags[index]);
      ElMessage.success("成功删除了一个标签");
      alltags.splice(index, 1);
      dynamicTags[rowindex] = alltags;
      // console.log("newalltags:", alltags);
    }

    function showTagInput(index) {
      console.log("index", index);
      tagInputVisible[index] = true;
      // this.InputRef.value?.input?.focus();
    }

    function handleInputConfirm(rowindex) {
      console.log("哪个文章ID:", rowindex);
      if (taginputmodel[rowindex]) {
        dynamicTags[rowindex].push({
          tagname: taginputmodel[rowindex],
        });
        updateDatabase("addtag", rowindex, taginputmodel[rowindex]);
        ElMessage.success("成功添加了一个标签");
      }
      tagInputVisible[rowindex] = "";
      taginputmodel[rowindex] = "";
    }

    function openDialog(row, column, cell, event) {
      if (column.property != "theory_tags") {
        console.log("行：", row);
        console.log("列：", column.prop);
        console.log("格：", cell);
        console.log(event.target.tagName);

        currentTheoryColume.value = column.property;
        dialogTitle.value = "请编辑内容";
        originalText.value = event.target.textContent;
        textarea.value = event.target.textContent;
        dialogVisible.value = true;
      }
    }

    function closeDialog() {
      dialogVisible.value = false;
    }

    onMounted(async () => {
      console.clear();
      console.log("start");
      axios
      await fetchData();
    });

    async function fetchData() {
      try {
        const response = await axios.get(
          "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/get/listtheory"
        );
        ElMessage.success("得到了最新数据！");
        theories.value = response.data;
        for (const theory of theories.value) {
          taginputmodel[theory.theory_id] = "";
          dynamicTags[theory.theory_id] = theory.theory_tags;
        }
      } catch (error) {
        console.log(error);
        ElMessage.error("没有取得数据！");
      }
    }



    return {
      theories,
      dialogVisible,
      textarea,
      dialogTitle,
      dynamicTags,
      tagInputVisible,
      taginputmodel,
      currentTheoryid,
      currentTheoryColume,
      currentTheoryContent,
      isSubjectIntegration,
      originalText,
      updateDatabase,
      addTheory,
      handleClose,
      showTagInput,
      handleInputConfirm,
      openDialog,
      closeDialog,
    };
  },
};
</script>








