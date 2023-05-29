<template>
    <el-row type="flex" justify="center">
        <el-col :span="24" :sm="24" :md="18" :lg="16" :xl="24">

            <div class="group-container">
                <div class="group-wrapper">
                    <h3 class="group-title">基础数据（必选）</h3>
                    <div>


                        <el-row :gutter="20">
                            <el-col :span="6">
                                <h3 class="select-title">学科</h3>
                                <el-select v-model="selectedOptions[0]" placeholder="请选择学科">
                                    <el-option v-for="(option, optionIndex) in radioGroups[0].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <h3 class="select-title">年级</h3>
                                <el-select v-model="selectedOptions[1]" placeholder="请选择年级">
                                    <el-option v-for="(option, optionIndex) in radioGroups[1].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <h3 class="select-title">单元</h3>
                                <el-select v-model="selectedOptions[2]" placeholder="请选择单元">
                                    <el-option v-for="(option, optionIndex) in radioGroups[2].options" :key="optionIndex"
                                        :label="option.text" :value="option.label"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <h3 class="select-title">课文</h3>
                                <el-select v-model="selectedLesson" placeholder="请选择课文">
                                    <el-option v-for="(lesson, index) in lessonList" :key="index"
                                        :label="lesson.lesson_name" :value="lesson">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </el-row>

                    </div>
                </div>
            </div>

            <div class="group-container">
                <div class="group-wrapper">
                    <h3 class="group-title">课文内容,理论和框架</h3>
                    <el-row :gutter="20">
                        <el-col :span="6">
                            <h3 class="select-title">课文原文</h3>
                            <el-input type="textarea" placeholder="请输入内容" v-model="strippedLessonText"
                                :autosize="{ minRows: 8, maxRows: 9 }">
                            </el-input>
                        </el-col>

                        <el-col :span="6">
                            <h3 class="select-title">教学目标</h3>
                            <el-input type="textarea" placeholder="请输入内容" v-model="strippedTeachObje"
                                :autosize="{ minRows: 8, maxRows: 9 }">
                            </el-input>
                        </el-col>

                        <el-col :span="6">
                            <h3 class="select-title">理论搜索</h3>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-input type="text" v-model="similarQueryTheory">
                                        <template #append> <el-button :icon="Search"
                                                @click="simiSearch(similarQueryTheory, 'theory')" /></template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <div style="margin-bottom: 10px;"></div>
                            <el-input type="textarea" placeholder="理论内容" v-model="theryContent" readonly
                                :autosize="{ minRows: 5, maxRows: 6 }">
                            </el-input>
                        </el-col>

                        <el-col :span="6">
                            <h3 class="select-title">框架搜索</h3>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-input type="text" v-model="similarQueryEduDesFrame">
                                        <template #append> <el-button :icon="Search"
                                                @click="simiSearch(similarQueryEduDesFrame, 'eduDesFrame')" /> </template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <div style="margin-bottom: 10px;"></div>
                            <el-input type="textarea" placeholder="框架内容" v-model="eduDesFrameContent" readonly
                                :autosize="{ minRows: 5, maxRows: 6 }">
                            </el-input>
                        </el-col>

                    </el-row>
                </div>
            </div>

            <div class="group-container">
                <div class="group-wrapper">
                    <h3 class="group-title">提示语</h3>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-text type="primary">角色设定</el-text>
                            <el-input type="textarea" placeholder="Please input" v-model="systemPrompt" rows="4" />
                        </el-col>

                        <el-col :span="12">
                            <el-text type="primary">任务设定</el-text>
                            <el-input type="textarea" placeholder="Please input" v-model="objectTask" rows="4" />
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div class="group-container">
                <div class="group-wrapper">
                    <h3 class="group-title">提示语</h3>
                    <!-- 这里显示提示语 -->
                    <el-row>
                        <el-col :span="24">
                            <el-text type="primary">输出结果</el-text>
                            <el-input type="textarea" placeholder="Please input" v-model="aiAnswer" />
                        </el-col>
                    </el-row>
                </div>
            </div>

            <div>
                <el-button @click="askOpenAI">ASK</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import useFetchData from '@/composables/useFetchData';
import useFetchLessons from '@/composables/useFetchLessons';
import useFetchDisIntContents from '@/composables/useFetchDisIntContents';
import useFetchEdudesContents from '@/composables/useFectchEduDesContents';
import useSimilarSearch from "@/composables/useSimilarSearch.js";
import { defineComponent, ref, watchEffect, reactive, computed } from 'vue';
// import apiConfig from "@/apicongfig/api.js";
import axios from '@/apicongfig/tokencheck.js';

import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star,
} from '@element-plus/icons-vue'


export default defineComponent({
    name: 'WorkBotVer1',
    setup() {
        const selectedEduDesContents = reactive({});
        const selectedLessons = ref([]);
        const selectedLesson = ref({});
        const savedOptions = JSON.parse(localStorage.getItem("selectedOptions")) || ['', '', ''];
        const selectedOptions = ref(savedOptions);

        const { radioGroups, fetchSubjects, fetchGrades, fetchUnits } = useFetchData();
        const { lessonList, fetchLessons } = useFetchLessons();
        const { disIntContents, fetchDisIntContents } = useFetchDisIntContents();
        const { eduDesContents, fetchEduDesContents } = useFetchEdudesContents();

        const updateGradesAndSubjects = async () => {
            if (selectedOptions.value[0] !== '' && selectedOptions.value[1] !== '') {
                selectedOptions.value[2] = '';
                selectedLessons.value = [];
                lessonList.value = [];

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

                disIntContents.value = [];
                selectedEduDesContents.value = [];
                eduDesContents.value = [];

                const lessonsData = await fetchLessons(selectedOptions.value[2]);

                if (lessonsData) {
                    lessonsData.forEach(lesson => {
                        lesson.lesson_text = stripHtmlTags(lesson.lesson_text);
                        lesson.teach_objectives = stripHtmlTags(lesson.teach_objectives);
                    });

                    lessonList.value = lessonsData;
                }

            }
        };


        watchEffect(async () => {
            await updateGradesAndSubjects();
        });

        watchEffect(async () => {
            await updateLessons();
        });

        watchEffect(() => {
            localStorage.setItem("selectedOptions", JSON.stringify(selectedOptions.value));
        });

        fetchSubjects();
        fetchGrades();


        const stripHtmlTags = (str) => {
            const tempDiv = document.createElement("div");
            tempDiv.innerHTML = str;

            let count = 1;
            for (let li of tempDiv.getElementsByTagName("li")) {
                li.textContent = count + '. ' + li.textContent;
                count++;
            }

            return tempDiv.textContent || tempDiv.innerText || "";
        };


        const theryContent = ref("");
        const similarQueryTheory = ref("布鲁姆");

        const eduDesFrameContent = ref("")
        const similarQueryEduDesFrame = ref("语文教学设计一级框架")

        const { searchResults, similarSearch } = useSimilarSearch();
        const { searchResults: searchResultsTheory, similarSearch: similarSearchTheory } = useSimilarSearch();
        const { searchResults: searchResultsEduDesFrame, similarSearch: similarSearchEduDesFrame } = useSimilarSearch();

        const simiSearch = (content, targetRef) => {
            console.log(content)
            if (targetRef === 'theory') {
                similarSearchTheory(content, 3);
            } else if (targetRef === 'eduDesFrame') {
                similarSearchEduDesFrame(content, 3);
            }
            console.log(JSON.stringify(searchResultsTheory.value, null, 2))
            console.log(JSON.stringify(searchResultsEduDesFrame.value, null, 2))
        };

        watchEffect(() => {
            if (searchResultsTheory.value) {
                let contents = searchResultsTheory.value.map(item => item.page_content);
                theryContent.value = contents[0]
            }
        });

        watchEffect(() => {
            if (searchResultsEduDesFrame.value) {
                let contents = searchResultsEduDesFrame.value.map(item => item.page_content);
                eduDesFrameContent.value = contents[0]
            }
        });




        const strippedLessonText = computed(() => stripHtmlTags(selectedLesson.value.lesson_text));
        const strippedTeachObje = computed(() => stripHtmlTags(selectedLesson.value.teach_objectives));
        const systemPrompt = "你是一名语文老师的助理，你的名字叫做“备课小宝”，你将为老师提供帮助，包括：基于各种理论的教学设计，丰富的课堂互动等内容。"

        const objectTask = computed(() => {
            return `请你为${selectedLesson.value.lesson_name}课编写教学设计。我会为你一步步的提供一下资料：
            1. 课文原文 
            2. 教学目标 
            3. 教学设计的基本框架            
            没有拿到3种资料前你不要急于编写，你说：请继续给我资料。`
        });


        const aiAnswer = ref('');

        const askOpenAI = async () => {
            console.log("danlellllllll")
            const response = await fetch('http://localhost:3000/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "messages": [
                        { "role": 'system', content: systemPrompt },
                        { "role": 'user', content: '' },
                        { "role": 'assistant', content: '老师您好，我是备课小宝，我可以帮助您。' },
                        { "role": 'user', content: objectTask.value },
                        { "role": 'assistant', content: '好的，请给我课文的原文。' },
                        { "role": 'user', content: `这是课文原文：${strippedLessonText.value}` },
                        { "role": 'assistant', content: '课文原文已经收到，还有教学目标和教学设计的基本框架，请继续给我资料:教学目标' },
                        { "role": 'user', content: `这是教学目标：${strippedTeachObje.value}` },
                        { "role": 'assistant', content: '我已经收到课文原文、教学目标。我是教学助理，负责编写教学设计，请继续给我资料:教学设计的基本框架。我会基于你给我的框架编写教学设计的。'},
                        {
                            "role": 'user', content: `这里教学设计的基本框架：${eduDesFrameContent.value}，我已经给你了
                                                                    1. 课文原文
                                                                    2. 教学目标                                                                   
                                                                    3. 教学设计的基本框架。请你开始编写教学设计，注意格式的结构化（请输出Json格式）。如果你认为需要更多的资料请告诉我，我会提供。` },
                        
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log('Stream finished.');
                    return;
                }

                const result = decoder.decode(value);
                const startIndex = result.indexOf("{");
                const endIndex = result.lastIndexOf("}");
                const eventData = result.slice(startIndex, endIndex + 1);
                const data = JSON.parse(eventData);  // 解析事件数据
                const content = data.choices[0].delta.content;
                aiAnswer.value += content;

                return reader.read().then(processText);
            });

        }



        return {
            selectedOptions,
            radioGroups,
            lessonList,
            selectedLessons,
            disIntContents,
            eduDesContents,
            selectedEduDesContents,
            fetchDisIntContents,
            fetchEduDesContents,
            selectedLesson,
            strippedLessonText,
            strippedTeachObje,
            systemPrompt,
            objectTask,
            askOpenAI,
            aiAnswer,
            searchResults,
            similarSearch,
            similarQueryTheory,
            theryContent,
            similarQueryEduDesFrame,
            eduDesFrameContent,
            simiSearch,
            Check,
            Delete,
            Edit,
            Message,
            Search,
            Star,
            axios
            // stopSSE,
        };
    },
});
</script>




<style scoped lang="scss">
.group-wrapper {
    position: relative;
    border: 1px solid #a8a8a8;
    padding: 20px;
    border-radius: 5px;
    // display: flex;
    // justify-content: space-between;
    // gap: 20px;
}

.group-title {
    position: absolute;
    top: -9px;
    left: 15px;
    font-size: 14px;
    background-color: #fff;
    padding: 0 5px;
}

.select-title {
    font-size: 14px;
}

.group-container {
    border-radius: 5px;
    padding: 1rem;
    align-items: center;
    // margin-bottom: 1rem;
}
</style>
