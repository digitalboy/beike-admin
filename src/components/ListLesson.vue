<template>
    <div class="centered-content">
        <el-table :data="lessons" border stripe @cell-dblclick="openDialog">
            <el-table-column prop="lesson_id" label="课程ID" width="80"></el-table-column>
            <el-table-column prop="lesson_name" label="课程名称" width="120"></el-table-column>
            <el-table-column prop="author" label="作者" width="120"></el-table-column>
            <el-table-column prop="teach_objectives" label="教学目标">
                <template #default="scope">
                    <span class="text-truncate-200">{{ scope.row.teach_objectives }}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column prop="lesson_focus" label="教学重点" width="180"></el-table-column>
            <el-table-column prop="lesson_diff" label="教学难点" width="220"></el-table-column> -->
            <el-table-column prop="lesson_ana" label="教材解析" width="220">
                <template #default="scope">
                    <span class="text-truncate-200">{{ scope.row.lesson_ana }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="teach_adv" label="教学建议" width="220"></el-table-column>

            <el-table-column prop="dis_int_contents" label="学科融合" @dblclick.stop>
                <template #default="scope">
                    <el-select v-if="scope.row.dis_int_contents && scope.row.dis_int_contents.length > 0"
                        @change="optionSelected(scope.row, $event)"
                        :placeholder="`共有${scope.row.dis_int_contents.length}条融合知识`">

                        <el-option v-for="content in scope.row.dis_int_contents" :key="content.dis_int_content_id"
                            :value="content.dis_int_content">
                            <span class="truncate">{{ content.dis_int_name }}</span>
                        </el-option>

                        <el-option label="添加学科融合" value="add_subject_integration"></el-option>
                    </el-select>
                    <el-button v-else type="primary" @click="addSubjectIntegration(scope.row)">添加学科融合</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" draggable @close="closeDialog">
            <template #header>
                <el-input v-if="isSubjectIntegration" v-model="dialogTitle" placeholder="请输入融合标题" maxlength="50" type="text"
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
                        确定更新</el-button>
                </span>
            </template>
        </el-dialog>

        <div style="margin: 10PX;">
            <el-button type="primary" v-if="selectedOptions.length > 0" @click="addLesson">
                增加一课{{ selectedOptions.values }}
            </el-button>
        </div>



    </div>
</template>

<style scoped>
.truncate {
    display: inline-block;
    max-width: 250px;
    /* 设置你想要的最大宽度 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}


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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from "element-plus";
import { useRouter } from 'vue-router';

export default {
    name: "ListLesson",
    setup() {
        const lessons = ref([]);
        const lessons_id = ref('');
        const dialogVisible = ref(false);
        const textarea = ref('');
        const dialogTitle = ref('');
        const selectedOptions = ref([]);
        const isSubjectIntegration = ref(false);
        const selectedLesson = ref(null);
        const selectedColumnProperty = ref('');
        const originalText = ref('');
        const currentdisintcontentid = ref('');
        const currentdisintname = ref('');
        // const dis_int_contents = ref([]);
        const querySelectedOptions = ref(''); // 添加新的响应式引用
        const router = useRouter();


        const openDialog = (row, column, cell, event) => {
            // Your openDialog function logic here
            if (column.property === 'dis_int_contents') {
                console.log("行：", row.lesson_id)
                console.log("列：", column.label)
                console.log("格：", cell)
                selectedLesson.value = row.lesson_id;
                selectedColumnProperty.value = column.property;

                return; // Do not respond to double-click events in the 'dis_int_contents' column
            }
            // console.log("行：", row.lesson_name)
            // console.log("列：", column.label)
            // console.log("格：", cell)
            // console.log(event.target.tagName)
            selectedLesson.value = row;
            selectedColumnProperty.value = column.property;
            dialogTitle.value = row.lesson_name + column.label;
            textarea.value = event.target.textContent;
            originalText.value = event.target.textContent;
            dialogVisible.value = true;
        };

        const closeDialog = () => {
            // Your closeDialog function logic here
            //console.log('保存的文本：', this.textarea);
            textarea.value="";
            dialogTitle.value="";
            isSubjectIntegration.value = false;
            dialogVisible.value = false;
        };

        const addLesson = async () => {
            // Your addLesson function logic here
            router.push({
                path: '/AddLesson',
                query: { selectedOptions: selectedOptions.value.join(',') }
            });
        };

        const optionSelected = (row, value) => {
            // Your optionSelected function logic here
            if (value === 'add_subject_integration') {
                addSubjectIntegration(row);
            } else {
                //console.log(row.lesson_id);
                isSubjectIntegration.value = true; // 设置为学科融合状态
                // 找到与选中 value 对应的对象
                const selectedContent = row.dis_int_contents.find(content => content.dis_int_content === value);
                // 获取 dis_int_name 属性
                dialogTitle.value = selectedContent.dis_int_name;
                currentdisintcontentid.value = selectedContent.dis_int_content_id;
                currentdisintname.value = selectedContent.dis_int_name;
                textarea.value = value;
                dialogVisible.value = true;
            }
        };

        const addSubjectIntegration = (row) => {
            // Your addSubjectIntegration function logic here
            console.log('Adding subject integration for row:', row);
            selectedLesson.value = row;
            isSubjectIntegration.value = true;
            dialogVisible.value = true;
        };

        const stop = (event) => {
            event.stopPropagation();
        };

        const updateDatabase = async () => {
            // Your updateDatabase function logic here
            let data = {};
            try {
                if (isSubjectIntegration.value === false) {
                    // 构建要发送给后端的数据对象
                    data = {
                        lesson_id: selectedLesson.value.lesson_id, // 当前选中的课程的 ID
                        whichcolum: selectedColumnProperty.value, // 更新后的标题
                        newContent: textarea.value // 更新后的内容
                    }
                }
                else if (isSubjectIntegration.value === true) {
                    data = {
                        lesson_id: selectedLesson.value.lesson_id,
                        dis_int_content_id: currentdisintcontentid.value, // 当前选中的融合的 ID
                        dis_int_name: currentdisintname.value,
                        newContent: textarea.value // 更新后的内容
                    }
                }

                console.log(data);
                // 发送 PUT 请求（或其他适合更新操作的 HTTP 方法）到后端
                // 请根据实际情况修改 URL 和其他请求参数
                const response = await axios.put("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/put/updatebeikelesson", data);
                if (response.status === 200) {
                    lessons_id.value = "";
                    currentdisintcontentid.value = "";
                    dialogTitle.value = "";
                    textarea.value = "";
                    ElMessage.success("更新成功！");
                    dialogVisible.value = false;
                } else {
                    ElMessage.error("更新失败，请稍后重试！");
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("更新失败，请稍后重试！");
            }
        };

        onMounted(async () => {
            console.clear();
            console.log("开始工作！")
            selectedOptions.value = querySelectedOptions.value.split(','); // 使用响应式引用            
            // 打印选择的选项
            console.log(selectedOptions.value[0]);
            axios
                .get("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/bgportlistlesson")
                .then(async (response) => {
                    lessons.value = response.data;
                    // 获取学科融合数据
                    await fetchDisIntContents();
                    ElMessage.success("取得数据：成功！");
                })
                .catch((error) => {
                    console.log(error);
                    ElMessage.error("取得数据失败，请稍后重试！");
                });
        });

        async function fetchDisIntContents() {
            for (const lesson of lessons.value) {
                try {
                    const response = await axios.get("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/dis_int_contents", {
                        params: { lesson_id: lesson.lesson_id }
                    });

                    if (response.status === 200 && response.data && response.data.length > 0) {
                        // 将 dis_int_contents 存储在课程对象中
                        const lessonData = response.data.find(data => data.lesson_id === lesson.lesson_id);
                        if (lessonData) {
                            lesson.dis_int_contents = lessonData.dis_int_contents;
                        }
                    } else {
                        console.log(`获取 lesson_id 为 ${lesson.lesson_id} 的学科融合数据失败`);
                    }
                } catch (error) {
                    console.log(error);
                    console.log(`获取 lesson_id 为 ${lesson.lesson_id} 的学科融合数据失败`);
                    ElMessage.error("取得学科融合数据失败，请稍后重试！");
                }
            }
        }

        return {
            lessons,
            dialogVisible,
            textarea,
            dialogTitle,
            selectedOptions,
            isSubjectIntegration,
            selectedLesson,
            selectedColumnProperty,
            originalText,
            currentdisintcontentid,
            currentdisintname,
            openDialog,
            closeDialog,
            addLesson,
            optionSelected,
            addSubjectIntegration,
            stop,
            updateDatabase
        };
    },
};
</script>


