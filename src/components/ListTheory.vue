<template>
  <div class="centered-content">
    <el-table :data="theories" border stripe @cell-dblclick="openDialog">
      <el-table-column prop="theory_content" label="理论内容" width="500">
        <template #default="scope">
          <span class="text-truncate-200">{{ scope.row.theory_content }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="author" label="作者/出处" width="200">
        <template #default="scope">
          <span class="text-truncate-200">{{ scope.row.author }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tags" label="标签管理">
        <template #default="scope">

          <el-tag v-for="content in dynamicTags[scope.row.theory_id]" :key="content.tagname" class="mx-1" closable @close="handleClose(dynamicTags[scope.row.theory_id],
            content.tagname,
            scope.row.theory_id,
            scope.row
          )
            ">
            {{ content.tagname }}
          </el-tag>


          <el-input v-if="tagInputVisible[scope.row.theory_id]" v-model="tagInputModel[scope.row.theory_id]"
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
        <!-- <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 1, maxRows: 30 }"></el-input> -->
        <QuillBetterTableEditor toolbar="full" v-model:content="textarea" theme="snow" contentType="html" />
      </el-form>

      <template v-slot:footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取 消</el-button>
          <el-button type="primary" @click="updateDatabase(currentTheory.id)" :disabled="textarea === originalText">
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


<script>
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ref, reactive, onMounted } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';
import QuillBetterTableEditor from '@/components/QuillBetterTableEditor.vue'

export default {
  name: "ListTheory",
  components: {
    QuillBetterTableEditor,
  },
  setup() {
    const theories = ref([]);
    const dialogVisible = ref(false);
    const textarea = ref("");
    const dialogTitle = ref("");

    const dynamicTags = reactive({});
    const tagInputVisible = reactive([]);
    const tagInputModel = reactive([]);
    const currentTheory = reactive({
      id: "",
      column: "",
      content: "",
      author: ""
    });
    const isSubjectIntegration = ref(false);
    const originalText = ref("");
    const router = useRouter();

    // const currentTheoryid = ref("");
    // const currentTheoryColume = ref("");

    async function updateDatabase(theoryId, rowData = null) {
      const data = {
        theory_id: theoryId,
        theory_content: rowData ? rowData.theory_content : currentTheory.content,
        author: rowData ? rowData.author : currentTheory.author,
        tags: dynamicTags[theoryId].map(tag => ({ tagname: tag.tagname })),
      };

      // 根据 currentTheory.column 更新对应的值
      if (currentTheory.column === 'theory_content') {
        data.theory_content = textarea.value;

      } else if (currentTheory.column === 'author') {
        data.author = textarea.value;
      }


      console.log("发送了啥：", JSON.stringify(data, null, 2));

      try {
        // 发送数据到服务器       
        const response = await axios.put(apiConfig.theoryUpdateUrl, data);
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
      });
    }

    function handleClose(alltags, tag, rowIndex, rowData) {
      const index = alltags.findIndex((content) => content.tagname === tag);
      console.log("删除：", index, alltags[index]);
      ElMessage.success("成功删除了一个标签");
      alltags.splice(index, 1);

      dynamicTags[rowIndex] = alltags;

      currentTheory.content = rowData.theory_content;
      currentTheory.author = rowData.author;
      currentTheory.column = ''; // 清除 currentTheory.column 的值

      updateDatabase(rowIndex, rowData);
    }

    function showTagInput(index) {
      console.log("index", index);
      tagInputVisible[index] = true;
    }

    function handleInputConfirm(rowIndex) {
      if (tagInputModel[rowIndex]) {
        dynamicTags[rowIndex].push({
          tagname: tagInputModel[rowIndex],
        });
        const rowData = theories.value.find(theory => theory.theory_id === rowIndex);
        currentTheory.content = rowData.theory_content;
        currentTheory.author = rowData.author;
        currentTheory.column = ''; // 清除 currentTheory.column 的值
        updateDatabase(rowIndex);
        ElMessage.success("成功添加了一个标签");
      }
      tagInputVisible[rowIndex] = false;
      tagInputModel[rowIndex] = "";
    }


    function openDialog(row, column, cell, event) {
      if (column.property != "tags") {
        console.log("行：", row);
        console.log("列：", column.property);
        console.log("格：", cell);
        console.log(event.target.tagName);

        currentTheory.id = row.theory_id;
        currentTheory.column = column.property;
        currentTheory.content = row.theory_content;
        currentTheory.author = row.author;


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
      ElMessage.warning("正在获取数据……")
    });

    async function fetchData() {
      try {
        const response = await axios.get(
          apiConfig.theoryListByTagUrl
        );
        ElMessage.success("得到了最新数据！");
        theories.value = response.data.reverse();//倒序
        for (const theory of theories.value) {
          tagInputModel[theory.theory_id] = "";
          dynamicTags[theory.theory_id] = theory.tags;
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
      tagInputModel,
      currentTheory,
      isSubjectIntegration,
      originalText,
      // currentTheoryid,
      // currentTheoryColume,
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




<style scoped>
.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 90%;
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






