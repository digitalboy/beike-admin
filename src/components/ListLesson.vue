<template>
    <div class="centered-content">

        <el-text size="large" tag="b" class="mx-1" type="primary">双击可以编辑：{{ currentSubjectName }}-{{ currentGradeName }}-{{ currentUnitName }}</el-text>
       <div style="margin: 20px;"></div>
        <el-table :data="lessons" border stripe @cell-dblclick="openDialog">
            <!-- <el-table-column prop="lesson_id" label="课程ID" width="80"></el-table-column> -->
            <el-table-column prop="lesson_name" label="课程名称" width="120"></el-table-column>
            <el-table-column prop="author" label="作者" width="120"></el-table-column>
            <el-table-column prop="lesson_text" label="课文文本" width="120">
                <template #default="scope">
                    <span class="text-truncate-200">{{ scope.row.lesson_text }}</span>
                </template>
            </el-table-column>
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

            <el-table-column prop="teach_adv" label="教学建议" width="220">
                <template #default="scope">
                    <span class="text-truncate-200">{{ scope.row.teach_adv }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="dis_int_contents" label="学科融合" @dblclick.stop>
                <template #default="scope">

                    <el-select v-if="scope.row.dis_int_contents"
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
            <el-button type="primary"  @click="addLesson">
                增加一课-{{ currentGradeName}}
            </el-button>
        </div>

    </div>
</template>


<script>
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from 'vue-router';

export default {
    name: "ListLesson",
    setup() {
        const loading = ref(false);
        const lessons = ref([]);
        const lessonsId = ref('');
        const dialogVisible = ref(false);
        const textarea = ref('');
        const dialogTitle = ref('');
        const isSubjectIntegration = ref(false);
        const selectedLesson = ref(null);
        const selectedColumnProperty = ref('');
        const originalText = ref('');
        const currentDisintcontentid = ref('');
        const currentDisintname = ref('');
        const router = useRouter();
        const route = useRoute(); // 导入 useRoute 并添加此行
        const whichApiUrl = ref('');
        
        const currentUnitid = ref('');
        const currentUnitName = ref('');
        const currentGradeId = ref('');
        const currentGradeName = ref('');
        const currentSubjectId = ref('');
        const currentSubjectName = ref('');

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
            textarea.value = "";
            dialogTitle.value = "";
            isSubjectIntegration.value = false;
            dialogVisible.value = false;
        };

        const addLesson = async () => {
            console.log("给参数：", currentUnitid.value)
            router.push({
                path: '/AddLesson',
                query: { 
                    unit_id: currentUnitid.value,
                    unit_name: currentUnitName.value,                 
                    grade_id: currentGradeId.value,
                    grade_name: currentGradeName.value,
                    subject_id: currentSubjectId.value,
                    subject_name: currentSubjectName.value
                }
            });
        };

        const optionSelected = (row, value) => {
            // Your optionSelected function logic here
            if (value === 'add_subject_integration') {
                addSubjectIntegration(row);
            } else {
                //console.log(row.lesson_id);
                selectedLesson.value = row; // 将整个 row 对象赋值给 selectedLesson.value
                isSubjectIntegration.value = true; // 设置为学科融合状态
                // 找到与选中 value 对应的对象
                const selectedContent = row.dis_int_contents.find(content => content.dis_int_content === value);
                // 获取 dis_int_name 属性
                dialogTitle.value = selectedContent.dis_int_name;
                currentDisintcontentid.value = selectedContent.dis_int_content_id;
                currentDisintname.value = selectedContent.dis_int_name;
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
            ElMessage.warning("正在更新数据，稍等");
            let method = 'put'; // 默认使用 PUT 方法
            // Your updateDatabase function logic here
            let data = {};
            try {

                if (isSubjectIntegration.value === false) {
                    data = {
                        lesson_id: selectedLesson.value.lesson_id,
                        lesson_name: selectedLesson.value.lesson_name,
                        lesson_code: selectedLesson.value.lesson_code,
                        memo: selectedLesson.value.memo,
                        unit_id: selectedLesson.value.unit_id,
                        teach_objectives: selectedLesson.value.teach_objectives,
                        lesson_text: selectedLesson.value.lesson_text,
                        lesson_focus: selectedLesson.value.lesson_focus,
                        lesson_diff: selectedLesson.value.lesson_diff,
                        lesson_ana: selectedLesson.value.lesson_ana,
                        teach_adv: selectedLesson.value.teach_adv,
                        author: selectedLesson.value.author
                    }
                    whichApiUrl.value = apiConfig.lessonUpdateUrl; // 更新课程的URL          
                    // 更新所选属性的值
                    data[selectedColumnProperty.value] = textarea.value;
                }
                else if (isSubjectIntegration.value === true) {
                    console.log("当前融合ID", currentDisintcontentid.value);
                    console.log("当前课程ID", selectedLesson.value.lesson_id);
                    if (currentDisintcontentid.value) {
                        whichApiUrl.value = apiConfig.disIntUpdateUrl; //更新学科融合
                        data = {
                            dis_int_content_id: currentDisintcontentid.value, // 当前选中的融合的 ID
                            lesson_id: selectedLesson.value.lesson_id,
                            dis_int_name: dialogTitle.value,
                            dis_int_content: textarea.value,

                        }
                    } else {
                        whichApiUrl.value = apiConfig.disIntAddUrl; //添加学科融合
                        data = {
                            lesson_id: selectedLesson.value.lesson_id,
                            dis_int_name: dialogTitle.value,
                            dis_int_content: textarea.value,
                            
                            // "lesson_id": "2",
                            // "dis_int_name": "测试录入学科融合-修改",
                            // "dis_int_content": "测试录入学科融合-修改"
                        }
                        method = 'post'; // 使用 POST 方法添加学科融合
                    }

                }

                console.log("更新了啥：", data);
                console.log("URLLLL：", whichApiUrl.value);
                // 发送 PUT 请求（或其他适合更新操作的 HTTP 方法）到后端
                // 请根据实际情况修改 URL 和其他请求参数
                const response = await axios({
                    method: method,
                    url: whichApiUrl.value,
                    data: data
                });
                if (response.status === 200) {
                    lessonsId.value = "";
                    currentDisintcontentid.value = "";
                    dialogTitle.value = "";
                    textarea.value = "";
                    ElMessage.success("更新成功！");
                    dialogVisible.value = false;
                    await refreshData(); // 刷新数据
                } else {
                    ElMessage.error("更新失败，请稍后重试！");
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("远程的电脑休息了！");
            }
        };

        const refreshData = async () => {
            loading.value = true;
            try {
                const response = await axios.get(apiConfig.lessonListUrl, {
                    params: { unit_id: currentUnitid.value },
                });
                if (response.status === 200) {
                    lessons.value = response.data;
                    await fetchDisIntContents();
                    ElMessage.success('数据已刷新');
                } else {
                    ElMessage.error('刷新数据失败，请稍后重试');
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('刷新数据失败，请稍后重试');
            }
            loading.value = false;
        };


        onMounted(async () => {
            ElMessage.warning("正在获取数据，稍等");
            console.clear();
            currentUnitid.value = route.query.unit_id; // 更改为 route.query.unit_id
            currentUnitName.value = route.query.unit_name;
            currentGradeId.value = route.query.grade_id,
            currentGradeName.value = route.query.grade_name;
            currentSubjectId.value = route.query.subject_id;
            currentSubjectName.value = route.query.subject_name;

            console.log("拿到了单元ID：", currentUnitid.value);
            loading.value = true; // 显示加载指示器
            axios.get(
                // console.log(getunit_id.value),
                apiConfig.lessonListUrl,
                { params: { unit_id: currentUnitid.value } } // 将 unit_id 作为参数传递给请求
            )
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
                console.log("学科融合的课程ID", lesson.lesson_id)
                try {
                    const response = await axios.get(
                        apiConfig.disIntListUrl,
                        { params: { lesson_id: lesson.lesson_id } });

                    if (response.status === 200 && response.data && response.data.length > 0) {
                        console.log("学科融合:", response.data)
                        console.log("response.data:", response.data);
                        const lessonData = response.data.filter(data => data.lesson_id === lesson.lesson_id);
                        console.log("lessonData:", lessonData);
                        if (lessonData) {
                            // console.log("学科融合chazhao:", response.data)
                            lesson.dis_int_contents = lessonData;
                            console.log("学科融合chazhao:", lesson.dis_int_contents)
                        }
                    } else {
                        console.log(``);
                    }
                } catch (error) {
                    console.log(error);
                    // console.log(`获取 lesson_id 为 ${lesson.lesson_id} 的学科融合数据失败`);
                    ElMessage.error("取得学科融合数据失败，请稍后重试！");
                }
            }
        }


        return {
            lessons,
            dialogVisible,
            textarea,
            dialogTitle,
            isSubjectIntegration,
            selectedLesson,
            selectedColumnProperty,
            originalText,
            currentdisintcontentid: currentDisintcontentid,
            currentdisintname: currentDisintname,
            openDialog,
            closeDialog,
            addLesson,
            optionSelected,
            addSubjectIntegration,
            stop,
            updateDatabase,

            currentUnitName,
            currentGradeId,
            currentGradeName,
            currentSubjectId,
            currentSubjectName,
        };
    },
};
</script>

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

