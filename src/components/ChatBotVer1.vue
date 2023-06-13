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
                            <div v-for="(lesson, index) in lessonList" :key="index">
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
                                <el-button class="add-button" size="small" round type="primary"
                                    @click="showAddContents(lesson.lesson_id, 'disInt')">新增</el-button>
                            </h3>
                            <el-checkbox-group :model-value="selectedDisIntContents[lesson.lesson_id]"
                                @change="(value) => onDisIntChange(value, lesson.lesson_id)" class="checkbox-grid">
                                <!-- 在这里遍历与课文相关的学科融合内容 -->
                                <div v-for="(disIntContent, index) in disIntContents.filter(content => content.lesson_id === lesson.lesson_id)"
                                    :key="index">
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
                                <el-button class="add-button" size="small" round type="primary"
                                    @click="showAddContents(lesson.lesson_id, 'eduDes')">新增</el-button>
                                <el-button class="add-button" size="small" round type="primary"
                                    @click="readEduDes = true">从json批量新增</el-button>
                            </h3>
                            <el-checkbox-group v-model="selectedEduDesContents[lesson.lesson_id]"
                                @change="(value) => onEduDesChange(value, lesson.lesson_id)" class="checkbox-grid">
                                <!-- 在这里遍历与课文相关的教学设计内容 -->
                                <div v-for="(eduDesContent, index) in eduDesContents.filter(content => content.lesson_id === lesson.lesson_id)"
                                    :key="index">
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
                        <div class="tag-container">
                            <el-button v-for="(oneTagContent, index) in allTagsList" :key="index" type="success"
                                :label="oneTagContent.tag_id" class="tag-button" round
                                @click="openTheoriesDialog(oneTagContent.tagname)" style="width: 100px;">
                                {{ oneTagContent.tagname }}
                            </el-button>

                        </div>
                    </div>
                </div>

                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">已选理论（可多选）</h3>
                        <!-- 这里放选中的理论 -->
                        <div class="selected-theory" v-for="(theory, index) in selectedTheories" :key="index">
                            {{ theory.author }}
                        </div>
                    </div>
                </div>

                <div><el-button type="danger" @click="createChatbotData()">创建机器人</el-button></div>

            </el-col>
        </el-row>
    </div>

    <el-dialog v-model="dialogVisible" title="请编辑内容" width="70%" draggable="true">
        <el-input v-model="dialogTitle" :placeholder="currentItem.title" maxlength="100" type="text"
            show-word-limit></el-input>
        <div style="margin: 20px;" />

        <!-- <QuillEditor toolbar="full" v-model:content="editContent" theme="snow" :content="currentItem.content"
            contentType="html" /> -->

        <QuillBetterTableEditor toolbar="full" v-model:content="editContent" theme="snow" :content="currentItem.content"
            contentType="html" />

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

    <el-dialog title="理论列表" v-model="theoryDialogVisible" :before-close="handleClose">
        <el-list>
            <el-list-item v-for="(theory, index) in theoriesList" :key="index" @click="selectTheory(theory)">
                <div style="display: flex; align-items: center;">
                    <div style="flex-shrink: 0;"><strong>{{ theory.author }}</strong></div>:
                    <div class="text-truncate" style="flex-grow: 1;">{{ theory.theory_content }}</div>
                </div>
                <div style="margin: 10px;"></div>
            </el-list-item>
        </el-list>
    </el-dialog>

    <el-dialog v-model="readEduDes" title="上传JSON文件" width="70%" draggable="true">
        <ReadEduDesJson />
    </el-dialog>
</template>



<script>
import useFetchData from '@/composables/useFetchData';
import useFetchLessons from '@/composables/useFetchLessons';
import useFetchDisIntContents from '@/composables/useFetchDisIntContents';
import useFetchEdudesContents from '@/composables/useFectchEduDesContents';
import useFetchTagsList from "@/composables/useFetchTagsOrTheoryList";

import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ElMessage } from "element-plus";
import { addDisIntContent, addEduDesContent } from '@/composables/useAddDisintAndEduDes.js';
import { defineComponent, ref, watchEffect, reactive } from 'vue';
import QuillBetterTableEditor from '@/components/QuillBetterTableEditor.vue'

import useCreateChatbot from "@/composables/useCreateChatbot";

import ReadEduDesJson from '@/components/ReadEduDesJson.vue';


export default defineComponent({
    name: 'ChatBotVer1',
    components: {
        QuillBetterTableEditor,
        ReadEduDesJson,
    },
    setup() {
        const selectedDisIntContents = reactive({});
        const selectedEduDesContents = reactive({});

        const selectedLessons = ref([]);
        const savedOptions = JSON.parse(localStorage.getItem("selectedOptions")) || ['', '', ''];
        const selectedOptions = ref(savedOptions);
        const selectedTheories = ref([]);

        const { radioGroups, fetchSubjects, fetchGrades, fetchUnits } = useFetchData();
        const { lessonList, fetchLessons } = useFetchLessons();
        const { disIntContents, fetchDisIntContents } = useFetchDisIntContents();
        const { eduDesContents, fetchEduDesContents } = useFetchEdudesContents();
        const { allTagsList, fetchAllTags, theoriesList, fetchTheoriesByTag } = useFetchTagsList();

        const { createBotStatus, createChatbot } = useCreateChatbot();

        const dialogVisible = ref(false);
        const theoryDialogVisible = ref(false);
        const readEduDes = ref(false);
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
        fetchAllTags();

        console.log(allTagsList);

        const showAddContents = (lesson_id, group = '') => {
            addMode.value = true;
            currentItem.lesson_id = lesson_id;
            currentItem.group = group;
            console.log("123", lessonList);
            console.log("qqq", lesson_id);
            const foundRecord = lessonList.value.find(item => item.lesson_id === lesson_id);

            dialogTitle.value = foundRecord.lesson_name + '教学设计之';
            editContent.value = '';
            dialogVisible.value = true;
        };

        const openTheoriesDialog = async (tagname) => {
            await fetchTheoriesByTag(tagname);
            console.log("qianduan:", theoriesList)
            theoryDialogVisible.value = true;
        };

        const selectTheory = (theory) => {
            // 检查具有相同 ID 的理论是否已存在
            const hasDuplicate = selectedTheories.value.some(item => item.theory_id === theory.theory_id);

            // 如果没有重复的理论，将新理论添加到数组中
            if (!hasDuplicate) {
                selectedTheories.value.push(theory);
            }
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
                edu_des_content: editContent.value,
            };
            const success = await addEduDesContent(payload);
            if (success) {
                dialogVisible.value = false;
                await fetchEduDesContents(selectedLessons.value);
            }
        };

        const onDisIntChange = (value, lessonid) => {
            selectedDisIntContents[lessonid] = value;
            console.log("Selected DisInt Contents:", selectedDisIntContents);
        };

        const onEduDesChange = (value, lessonid) => {
            selectedEduDesContents[lessonid] = value;
            console.log("Selected EduDES Contents:", selectedEduDesContents);
        };


        const buildChatbotData = (lesson_children, theory_ids) => {
            return {
                chatbot_name: getCurrentDateTimeString(),
                role_msg: "你是一名很优秀的语文老师，请根据材料回答问题，如果遇到不知道答案的情况，就说：我不知道。",
                lesson_children,
                theory_ids,
            };
        }
        const createChatbotData = () => {
            console.log("Selected DisInt Contents:", selectedDisIntContents);
            console.log("Selected EduDes Contents:", selectedEduDesContents);
            const lesson_children = selectedLessons.value.map(lesson_id => {
                const lesson = lessonList.value.find(l => l.lesson_id === lesson_id);

                const selectedDisIntContentsForLesson = selectedDisIntContents[lesson.lesson_id];
                const dis_int_content_ids = selectedDisIntContentsForLesson
                    ? disIntContents.value
                        .filter(content => content.lesson_id === lesson.lesson_id && selectedDisIntContentsForLesson.includes(content.dis_int_content_id))
                        .map(content => content.dis_int_content_id)
                    : [];

                const selectedEduDesContentsForLesson = selectedEduDesContents[lesson.lesson_id];
                const edu_des_ids = selectedEduDesContentsForLesson
                    ? eduDesContents.value
                        .filter(content => content.lesson_id === lesson.lesson_id && selectedEduDesContentsForLesson.includes(content.edu_des_id))
                        .map(content => content.edu_des_id)
                    : [];

                const lesson_child = {
                    lesson_id: lesson.lesson_id,
                    edu_des_ids, // 添加选中的教学设计
                    dis_int_content_ids, // 添加选中的学科融合
                };

                return lesson_child;
            });

            const theory_ids = selectedTheories.value.map(theory => theory.theory_id);

            const chatbotData = buildChatbotData(lesson_children, theory_ids);
            console.log(JSON.stringify(chatbotData, null, 2));
            createChatbot(chatbotData);
        };




        function getCurrentDateTimeString() {
            const now = new Date();
            // const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            return `${month}_${day}_${hours}_${minutes}_${seconds}`;
        }


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
            theoryDialogVisible,
            currentItem,
            addMode,
            allTagsList,
            theoriesList,
            showDialog,
            // randomDelay,
            updateDatabase,
            fetchDisIntContents,
            fetchEduDesContents,
            fetchAllTags,
            submitAddDisIntForm,
            submitAddEduDesForm,
            showAddContents,
            selectedTheories,
            openTheoriesDialog,
            selectTheory,
            createChatbotData,
            createBotStatus,
            onDisIntChange,
            onEduDesChange,
            readEduDes
        };
    },
});
</script>




<style scoped>
.tag-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 10px;
    justify-items: center;
    align-items: center;
}

.tag-button {
    margin: 2x;
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
    top: -12px;
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
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.text-truncate {
    display: inline-block;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>