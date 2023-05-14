<template>
    <div>
        <el-row type="flex" justify="center">
            <el-col :span="24" :sm="24" :md="18" :lg="16" :xl="24">
                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">基础数据（必选）</h3>
                        <div class="select-container">
                            <div class="select-wrapper">
                                <h3 class="select-title">学科</h3>
                                <el-select v-model="selectedOptions[0]" placeholder="请选择学科">
                                    <el-option v-for="(option, optionIndex) in radioGroups[0].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </div>
                            <div class="select-wrapper">
                                <h3 class="select-title">年级</h3>
                                <el-select v-model="selectedOptions[1]" placeholder="请选择年级">
                                    <el-option v-for="(option, optionIndex) in radioGroups[1].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </div>
                            <div class="select-wrapper">
                                <h3 class="select-title">单元</h3>
                                <el-select v-model="selectedOptions[2]" placeholder="请选择单元">
                                    <el-option v-for="(option, optionIndex) in radioGroups[2].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">课文（可多选）</h3>
                        <!-- 这里放课文的标题 -->
                        <el-checkbox-group v-model="selectedLessons" class="checkbox-grid">
                            <div v-for="(lesson, index) in lessonList" :key="index" class="slide-in"
                                :style="{ '--delay': randomDelay() + 'ms' }">
                                <el-checkbox :label="lesson.lesson_id">
                                    {{ lesson.lesson_name }}
                                </el-checkbox>
                            </div>
                        </el-checkbox-group>
                    </div>
                </div>

                <!-- 在这里遍历课文列表 -->
                <div v-for="(lesson, index) in lessonList" :key="index">
                    <div class="group-container" v-if="selectedLessons.includes(lesson.lesson_id)">
                        <div class="group-wrapper">
                            <h3 class="group-title">{{ lesson.lesson_name }}的学科融合（可多选）
                                <el-button class="add-button" type="text"
                                    @click="showAddContents(lesson.lesson_id, 'disInt')">新增</el-button>
                            </h3>
                            <el-checkbox-group v-model="selectedDisIntContents[lesson.lesson_id]" class="checkbox-grid">
                                <!-- 在这里遍历与课文相关的学科融合内容 -->
                                <div v-for="(disIntContent, index) in disIntContents.filter(content => content.lesson_id === lesson.lesson_id)"
                                    :key="index" class="slide-in" :style="{ '--delay': randomDelay() + 'ms' }">
                                    <el-tooltip :content="disIntContent.dis_int_name" placement="top">
                                        <el-checkbox :label="disIntContent.dis_int_content_id"
                                            @dblclick="() => showDialog(disIntContent.dis_int_content_id, disIntContent.dis_int_name, disIntContent.dis_int_content, 'disInt', disIntContent.lesson_id)">
                                            <span class="text-truncate-200">{{ disIntContent.dis_int_name }}</span>
                                        </el-checkbox>
                                    </el-tooltip>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>

                    <div class="group-container" v-if="selectedLessons.includes(lesson.lesson_id)">
                        <div class="group-wrapper">
                            <h3 class="group-title">{{ lesson.lesson_name }}的教学设计（可多选）
                                <el-button type="text" @click="showAddContents(lesson.lesson_id, 'eduDes')">新增</el-button>
                            </h3>
                            <el-checkbox-group v-model="selectedEduDesContents[lesson.lesson_id]" class="checkbox-grid">
                                <!-- 在这里遍历与课文相关的教学设计内容 -->
                                <div v-for="(eduDesContent, index) in eduDesContents.filter(content => content.lesson_id === lesson.lesson_id)"
                                    :key="index" class="slide-in" :style="{ '--delay': randomDelay() + 'ms' }">
                                    <el-tooltip :content="eduDesContent.edu_des_name" placement="top">
                                        <el-checkbox :label="eduDesContent.edu_des_id"
                                            @dblclick="() => showDialog(eduDesContent.edu_des_id, eduDesContent.edu_des_name, eduDesContent.edu_des_content, 'eduDes', eduDesContent.lesson_id)">
                                            <span class="text-truncate-200">{{ eduDesContent.edu_des_name }}</span>
                                        </el-checkbox>
                                    </el-tooltip>
                                </div>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>



                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">理论标签（可多选）</h3>
                        <el-button type="success">Success</el-button><el-button type="success">Success</el-button><el-button
                            type="success">Success</el-button>
                    </div>
                </div>

                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">已选理论（可多选）</h3>
                        <el-button type="success">Success</el-button><el-button type="success">Success</el-button><el-button
                            type="success">Success</el-button>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>

    <el-dialog v-model="dialogVisible" title="请编辑内容" width="70%" draggable="true">

        <el-input v-model="dialogTitle" :placeholder="currentItem.title" maxlength="100" type="text"
            show-word-limit></el-input>
        <div style="margin: 20px;" />

        <!-- <QuillEditor toolbar="full" v-model:content="editContent" theme="snow" :content="currentItem.content"
            contentType="html" /> -->

        <QuillBetterTableEditor toolbar="full" v-model:content="editContent" theme="snow" :content="currentItem.content"  contentType="html"/>

        <div style="margin: 20px;" />
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateDatabase" :disabled="editContent === currentItem.content"
                v-if="!addMode">
                确定更新
            </el-button>
            <el-button type="primary" @click="submitAddDisIntForm" v-if="addMode && currentItem.group === 'disInt'">
                添加学科融合内容
            </el-button>
            <el-button type="primary" @click="submitAddEduDesForm" v-if="addMode && currentItem.group === 'eduDes'">
                添加教学设计内容
            </el-button>


        </span>

    </el-dialog>
</template>



<script>
import useFetchData from '@/composables/useFetchData';
import useFetchLessons from '@/composables/useFetchLessons';
import useFetchDisIntContents from '@/composables/useFetchDisIntContents';
import useFetchEdudesContents from '@/composables/useFectchEduDesContents';
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ElMessage } from "element-plus";
import { addDisIntContent, addEduDesContent } from '@/composables/useAddDisintAndEduDes.js';
import { defineComponent, ref, watchEffect, reactive } from 'vue';
import { randomDelay } from '@/composables/animationUtils.js';
import QuillBetterTableEditor from '@/components/QuillBetterTableEditor.vue'


export default defineComponent({
    name: 'ChatBotVer1',
    components: {
        QuillBetterTableEditor,
    },
    setup() {
        const selectedDisIntContents = reactive({});
        const selectedEduDesContents = reactive({});
        const selectedLessons = ref([]);
        const savedOptions = JSON.parse(localStorage.getItem("selectedOptions")) || ['', '', ''];
        const selectedOptions = ref(savedOptions);

        const { radioGroups, fetchSubjects, fetchGrades, fetchUnits } = useFetchData();
        const { lessonList, fetchLessons } = useFetchLessons();
        const { disIntContents, fetchDisIntContents } = useFetchDisIntContents();
        const { eduDesContents, fetchEduDesContents } = useFetchEdudesContents();


        const dialogVisible = ref(false);
        const dialogTitle = ref('');
        const editContent = ref('');
        const currentItem = reactive({ id: '', title: '', content: '', group: '' });

        const addMode = ref(false);




        const updateGradesAndSubjects = async () => {
            if (selectedOptions.value[0] !== '' && selectedOptions.value[1] !== '') {
                selectedOptions.value[2] = '';
                selectedLessons.value = [];
                lessonList.value = [];
                selectedDisIntContents.value = [];
                disIntContents.value = [];
                selectedEduDesContents.value = [];
                eduDesContents.value = [];
                await fetchUnits(selectedOptions.value[0], selectedOptions.value[1]);
            }
        };


        const updateLessons = async () => {
            if (selectedOptions.value[2] !== '') {
                selectedLessons.value = [];
                lessonList.value = [];
                selectedDisIntContents.value = [];
                disIntContents.value = [];
                selectedEduDesContents.value = [];
                eduDesContents.value = [];
                await fetchLessons(selectedOptions.value[2]);
            }
        };

        const updateDisIntContents = async () => {
            await fetchDisIntContents(selectedLessons.value);
        };

        const updateEduDesContents = async () => {
            await fetchEduDesContents(selectedLessons.value);
        };

        watchEffect(async () => {
            await updateGradesAndSubjects();
        });

        watchEffect(async () => {
            await updateLessons();
        });

        watchEffect(async () => {
            await updateDisIntContents();
        });

        watchEffect(async () => {
            await updateEduDesContents();
        });

        watchEffect(() => {
            localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions.value));
        });


        fetchSubjects();
        fetchGrades();

        const showAddContents = (lesson_id, group = '') => {
            addMode.value = true;
            currentItem.lesson_id = lesson_id;
            currentItem.group = group;
            console.log("123", group);
            dialogTitle.value = '';
            editContent.value = '';
            dialogVisible.value = true;
        };


        const showDialog = (id, title, content, group, lesson_id) => {
            console.log("Edit content:", content);
            dialogTitle.value = title;
            currentItem.id = id;
            currentItem.title = title;
            currentItem.content = content;
            currentItem.group = group;
            currentItem.lesson_id = lesson_id;
            editContent.value = content;
            dialogVisible.value = true;
            addMode.value = false;
        };

        const updateDatabase = async () => {
            ElMessage.warning("正在更新数据……");
            let apiURL = "";
            let data = {};

            switch (currentItem.group) {
                case "disInt":
                    apiURL = apiConfig.disIntUpdateUrl;
                    data = {
                        dis_int_content_id: currentItem.id,
                        lesson_id: currentItem.lesson_id,
                        dis_int_name: dialogTitle.value,
                        dis_int_content: editContent.value,

                    };
                    break;
                case "eduDes":
                    apiURL = apiConfig.eduDesUpdateUrl;
                    data = {
                        edu_des_id: currentItem.id,
                        lesson_id: currentItem.lesson_id,
                        edu_des_name: dialogTitle.value,
                        edu_des_content: editContent.value,

                    };
                    break;
                default:
                    console.error("Unknown group:", currentItem.group);
                    return;
            }



            try {
                const response = await axios.put(apiURL, data);
                // Handle success
                console.log(response);
                if (currentItem.group === "disInt") {
                    await fetchDisIntContents(selectedLessons.value);
                } else if (currentItem.group === "eduDes") {
                    await fetchEduDesContents(selectedLessons.value);
                }
                dialogVisible.value = false;
                ElMessage.success("更新成功。");
            } catch (error) {
                // Handle error
                console.error(error);
                ElMessage.error("更新数据错误！");
            }
        };


        const submitAddDisIntForm = async () => {
            const payload = {
                lesson_id: currentItem.lesson_id,
                dis_int_name: dialogTitle.value,
                dis_int_content: editContent.value,
            };
            const success = await addDisIntContent(payload);
            if (success) {
                dialogVisible.value = false;
                await fetchDisIntContents(selectedLessons.value);
            }
        };

        const submitAddEduDesForm = async () => {
            const payload = {
                lesson_id: currentItem.lesson_id,
                edu_des_name: dialogTitle.value,
                edu_des_content: dialogTitle.value,
            };
            const success = await addEduDesContent(payload);
            if (success) {
                dialogVisible.value = false;
                await fetchEduDesContents(selectedLessons.value);
            }
        };

        return {
            selectedOptions,
            radioGroups,
            lessonList,
            selectedLessons,
            disIntContents,
            eduDesContents,
            selectedDisIntContents,
            selectedEduDesContents,
            dialogTitle,
            editContent,
            dialogVisible,
            currentItem,
            addMode,
            showDialog,
            randomDelay,
            updateDatabase,
            fetchDisIntContents,
            fetchEduDesContents,
            submitAddDisIntForm,
            submitAddEduDesForm,
            showAddContents
        };
    },
});
</script>




<style scoped>
.add-button {
    padding: 0;
}

.checkbox-grid div {
    display: inline-grid;
    width: 100%;
}


.checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    grid-gap: 10px;
}

.select-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.select-wrapper {
    width: 45%;
}

.select-title {
    margin-bottom: 0.5rem;
    font-size: 14px;
}

.group-wrapper {
    position: relative;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
}

.group-title {
    position: absolute;
    top: -9px;
    left: 15px;
    font-size: 14px;
    background-color: #fff;
    padding: 0 5px;
}

.group-container {
    border: 0px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.text-truncate-200 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    display: block;
}

@import '@/styles/slideInAnimation.css';
</style>