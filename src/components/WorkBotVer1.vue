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
                        <el-col :span="8">
                            <h3 class="select-title">课文原文</h3>
                            <el-input type="textarea" placeholder="请输入内容" v-model="strippedLessonText"
                                :autosize="{ minRows: 7, maxRows: 9 }">
                            </el-input>
                        </el-col>

                        <el-col :span="8">
                            <h3 class="select-title">教学目标</h3>
                            <el-input type="textarea" placeholder="请输入内容" v-model="strippedTeachObje"
                                :autosize="{ minRows: 7, maxRows: 9 }">
                            </el-input>
                        </el-col>

                        <el-col :span="8">
                            <h3 class="select-title">理论搜索</h3>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-input type="text" v-model="similarQueryContent">
                                        <template #prepend>理论名称：</template>
                                        <template #append> <el-button :icon="Search" @click="simiSearch" /> </template>
                                    </el-input>
                                </el-col>
                            </el-row>
                            <div style="margin-bottom: 20px;"></div>
                            <el-input type="textarea" placeholder="理论内容" v-model="theryContent" readonly
                                :autosize="{ minRows: 4, maxRows: 5 }">
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
                <button @click="askOpenAI">ASK</button>
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
import { defineComponent, ref, watchEffect, reactive, computed} from 'vue';
import apiConfig from "@/apicongfig/api.js";
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
            return tempDiv.textContent || tempDiv.innerText || "";
        };

        const theryContent = ref("");
        const { searchResults, similarSearch } = useSimilarSearch();
        const similarQueryContent = ref("布鲁姆");
        const simiSearch = () => {
            similarSearch(similarQueryContent.value, 3); // 这里的3是k的值，你可以根据需要更改            
            // console.log("123131", similarQueryContent.value)
            console.log(JSON.stringify(searchResults, null, 2))
        };

        watchEffect(() => {
            if (searchResults.value) {
                let contents = searchResults.value.map(item => item.page_content);
                // console.log(JSON.stringify(contents, null, 2));
                // console.log(contents[0]);
                theryContent.value = contents[0]
            }
        });



        const strippedLessonText = computed(() => stripHtmlTags(selectedLesson.value.lesson_text));
        const strippedTeachObje = computed(() => stripHtmlTags(selectedLesson.value.teach_objectives));

        const systemPrompt = "你是一名语文老师的助理，你的名字叫做“备课小宝”，你将为老师提供帮助，包括：基于各种理论的教学设计，丰富的课堂互动等内容。"

        const objectTask = computed(() => {
            return `请你为${selectedLesson.value.lesson_name}课编写教学设计。我会为你一步步的提供一下资料：
            1. 课文原文 
            2. 教学目标 
            3.教学设计参考的教学理论 
            4.参考格式和框架。
            没有拿到4种资料前你不要急于编写，你说：请继续给我资料。`
        });


        const aiAnswer = ref('');
        const askOpenAI = async () => {
            console.log(strippedLessonText.value)
            try {
                const response = await axios.post(apiConfig.openAIUrl, {
                    "model": 'gpt-3.5-turbo',
                    "messages": [
                        { "role": 'system', content: systemPrompt },
                        { "role": 'user', content: '' },
                        { "role": 'assistant', content: '老师您好，我是备课小宝，我可以帮助您。' },
                        { "role": 'user', content: objectTask.value },
                        { "role": 'assistant', content: '好的，请给我课文的原文。' },
                        { "role": 'user', content: `这是课文原文：${strippedLessonText.value}` },
                        { "role": 'assistant', content: '课文原文已经收到，还有教学目标，参考理论和格式的参考，现在给我教学目标。' },
                        { "role": 'user', content: `这是教学目标：${strippedTeachObje.value}` },
                        { "role": 'assistant', content: '收到教学目标，请给我教学理论。我是教学助理，负责编写教学设计，当然需要理论支持。' },
                        {
                            "role": 'user', content: `给你教学理论：${theryContent.value}，我已经给你了
                                                    1.课文原文，
                                                    2. 教学目标
                                                    3. 教学理论
                                                    4. 参考格式（还没给你，我马上给你）。
                                                    没有拿到参考格式前，不要写教学设计。` },
                    ],
                    "temperature": 1,
                    // "stream": true
                }, {
                    "headers": {
                        'Authorization': 'Bearer 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',
                        'Content-Type': 'application/json'
                    }

                });


                console.log(response.data);
                aiAnswer.value = response.data['choices'][0]['message']['content'];
                console.log(aiAnswer.value);
            } catch (error) {
                console.log(error);
            }
        }



        // const eventSource = ref(null);
        // const askOpenAI = async () => {
        //     // 发送POST请求
        //     const response = await axios.post(apiConfig.openAIUrl, {
        //         "model": 'gpt-3.5-turbo',
        //         "messages": [
        //             { "role": 'system', content: systemPrompt },
        //             { "role": 'user', content: '' },
        //             { "role": 'assistant', content: '老师您好，我是备课小宝，我可以帮助您。' },
        //             { "role": 'user', content: objectTask.value },
        //             { "role": 'assistant', content: '好的，请给我课文的原文。' },
        //             { "role": 'user', content: `这是课文原文：${strippedLessonText.value}` },
        //             { "role": 'assistant', content: '课文原文已经收到，还有教学目标，参考理论和格式的参考，现在给我教学目标。' },
        //             { "role": 'user', content: `这是教学目标：${strippedTeachObje.value}` },
        //             { "role": 'assistant', content: '收到教学目标，请给我教学理论。我是教学助理，负责编写教学设计，当然需要理论支持。' },
        //             {
        //                 "role": 'user', content: `给你教学理论：${theryContent.value}，我已经给你了
        //                         1.课文原文，
        //                         2. 教学目标
        //                         3. 教学理论
        //                         4. 参考格式（还没给你，我马上给你）。
        //                         没有拿到参考格式前，不要写教学设计。` },
        //         ],
        //         "temperature": 1,
        //         "stream": true
        //     }, {
        //         "headers": {
        //             'Authorization': 'Bearer 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',
        //             'Content-Type': 'application/json'
        //         }
        //     });

        //     // 获取SSE URL
        //     console.log(response.headers);
        //     const eventSource = new EventSource(apiConfig.openAIUrl);

        //    eventSource.onmessage = (event) => {
        //         const data = JSON.parse(event.data);
        //         if (data.choices && data.choices[0] && data.choices[0].delta && data.choices[0].delta.content) {
        //             aiAnswer.value += data.choices[0].delta.content; // 追加接收到的数据
        //         }
        //         console.log('SSE message received:', data);
        //     };


        // };

        // const stopSSE = () => {
        //     if (eventSource.value) {
        //         eventSource.value.close();
        //         eventSource.value = null;
        //     }
        // };

        // onUnmounted(() => {
        //     stopSSE();
        // });





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
            similarQueryContent,
            simiSearch,
            theryContent,
            Check,
            Delete,
            Edit,
            Message,
            Search,
            Star,
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
