<template>
    <div class="centered-content">

        <el-text size="large" tag="b" class="mx-1" type="primary">双击可以编辑：{{ currentSubjectName }}-{{ currentGradeName }}-{{
            currentUnitName }}</el-text>
        <div style="margin: 20px;"></div>
        <el-table :data="lessons" border stripe>
            <!-- <el-table-column prop="lesson_id" label="课程ID" width="80"></el-table-column> -->
            <el-table-column prop="lesson_name" label="课程名称" width="250"></el-table-column>


            <el-table-column prop="eduDesContents" label="教学设计" @dblclick.stop>
                <template #default="scope">

                    <el-select v-if="scope.row.eduDesContents" @change="optionSelected(scope.row, $event)"
                        :placeholder="`共有${scope.row.eduDesContents.length}条教学设计`">

                        <el-option v-for="content in scope.row.eduDesContents" :key="content.edu_des_id"
                            :value="content.edu_des_content">
                            <span class="truncate">{{ content.edu_des_name }}</span>
                        </el-option>

                        <el-option label="添加教学设计" value="addEduDes"></el-option>
                    </el-select>

                    <el-button v-else type="primary" @click="addEduDesign(scope.row)">添加教学设计</el-button>
                </template>
            </el-table-column>

        </el-table>



        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" draggable @close="closeDialog">
            <template #header>
                <el-input v-if="isEduDes" v-model="dialogTitle" placeholder="请输入教学设计标题" maxlength="50" type="text"
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

    </div>
</template>

<script>
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ref, onMounted } from 'vue';
import { ElMessage } from "element-plus";
import { useRoute } from 'vue-router';

export default {
    name: "ListEduDesign",
    setup() {
        const loading = ref(false);
        const lessons = ref([]);
        const lessonsId = ref('');
        const dialogVisible = ref(false);
        const textarea = ref('');
        const dialogTitle = ref('');
        const isEduDes = ref(false);
        const selectedLesson = ref(null);
        const selectedColumnProperty = ref('');
        const originalText = ref('');
        const currentEduDesId = ref('');
        const currentEduDesName = ref('');

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
            if (column.property === 'eduDesContents') {
                console.log("行：", row.lesson_id)
                console.log("列：", column.label)
                console.log("格：", cell)
                selectedLesson.value = row.lesson_id;
                selectedColumnProperty.value = column.property;
                return; // Do not respond to double-click events in the 'eduDesContents' column
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
            isEduDes.value = false;
            dialogVisible.value = false;
        };



        const optionSelected = (row, value) => {
            // Your optionSelected function logic here
            if (value === 'addEduDes') {
                addEduDesign(row);
            } else {
                //console.log(row.lesson_id);
                selectedLesson.value = row; // 将整个 row 对象赋值给 selectedLesson.value
                isEduDes.value = true; // 设置为课程设计状态
                // 找到与选中 value 对应的对象
                const selectedContent = row.eduDesContents.find(content => content.edu_des_content === value);
                // 获取 edu_des_name 属性
                dialogTitle.value = selectedContent.edu_des_name;
                currentEduDesId.value = selectedContent.edu_des_id;
                currentEduDesName.value = selectedContent.edu_des_name;
                textarea.value = value;
                dialogVisible.value = true;
            }
        };


        const addEduDesign = (row) => {
            // Your addEduDesign function logic here
            console.log('Adding subject integration for row:', row);
            selectedLesson.value = row;
            isEduDes.value = true;
            dialogVisible.value = true;
        };

        const stop = (event) => {
            event.stopPropagation();
        };

        const updateDatabase = async () => {
            let method = 'put'; // 默认使用 PUT 方法
            let data = {};
            try {
                if (isEduDes.value === true) {
                    console.log("当前课程ID", selectedLesson.value.lesson_id);
                    console.log("sheji ID:", currentEduDesId.value)
                    if (currentEduDesId.value) {
                        whichApiUrl.value = apiConfig.eduDesUpdateUrl; //更新课程设计
                        data = {
                            edu_des_id: currentEduDesId.value, // 当前选中的融合的 ID
                            lesson_id: selectedLesson.value.lesson_id,
                            edu_des_name: dialogTitle.value,
                            edu_des_content: textarea.value,
                        }
                    } else {
                        console.log("tianjia ID:")
                        whichApiUrl.value = apiConfig.eduDesAddUrl; //添加课程设计
                        method = 'post';
                        data = {
                            lesson_id: selectedLesson.value.lesson_id,
                            edu_des_name: dialogTitle.value,
                            edu_des_content: textarea.value,
                        }
                    }
                }

                console.log("更新了啥：", data);
                const response = await axios({
                    method: method,
                    url: whichApiUrl.value,
                    data: data
                });
                if (response.status === 200) {
                    lessonsId.value = "";
                    currentEduDesId.value = "";
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
                    await fetchEduDesContents();
                    ElMessage.success('数据已刷新');
                } else {
                    ElMessage.error('刷新数据失败，请稍后重试');
                }
            } catch (error) {
                console.log(error);
                ElMessage.error('刷新数据失败，请稍后重试');
            } finally {
                loading.value = false;
            }
        };



        onMounted(async () => {
            ElMessage.warning("正在获取课程数据，稍等");
            console.clear();
            currentUnitid.value = route.query.unit_id;
            currentUnitName.value = route.query.unit_name;
            currentGradeId.value = route.query.grade_id;
            currentGradeName.value = route.query.grade_name;
            currentSubjectId.value = route.query.subject_id;
            currentSubjectName.value = route.query.subject_name;

            console.log("拿到了单元ID：", currentUnitid.value);
            loading.value = true;

            try {
                const response = await axios.get(
                    apiConfig.lessonListUrl, {
                    params: { unit_id: currentUnitid.value },
                });

                if (response.status === 200) {
                    lessons.value = response.data;
                    await fetchEduDesContents();
                    ElMessage.success("取得数据：成功！");
                } else {
                    ElMessage.error("取得数据失败，请稍后重试！");
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("取得数据失败，请稍后重试！");
            } finally {
                loading.value = false;
            }
        });



        async function getEduDesignData(lessonId) {
            try {
                const response = await axios.get(apiConfig.eduDesListURl, { params: { lesson_id: lessonId } });

                if (response.status === 200 && response.data && response.data.length > 0) {
                    return response.data;
                } else {
                    console.log(`No education design data found for lessonId: ${lessonId}`);
                    return [];
                }
            } catch (error) {
                console.log(error);
                ElMessage.error("获取课程设计数据失败，请稍后重试！");
                return [];
            }
        }

        async function fetchEduDesContents() {
            for (const lesson of lessons.value) {
                const eduDesData = await getEduDesignData(lesson.lesson_id);
                if (eduDesData.length > 0) {
                    lesson.eduDesContents = eduDesData;
                    console.log("课程设计查找:", lesson.eduDesContents);
                }
            }
        }



        return {
            lessons,
            dialogVisible,
            textarea,
            dialogTitle,
            isEduDes,
            selectedLesson,
            selectedColumnProperty,
            originalText,
            currentEduDesId,
            currentEduDesName,
            openDialog,
            closeDialog,
            optionSelected,
            addEduDesign,
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
    max-width: 1000px;
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