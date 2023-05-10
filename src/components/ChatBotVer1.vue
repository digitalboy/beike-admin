<template>
    <div class="home" id="homepage">
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
                            <el-checkbox v-for="(lesson, index) in lessonList" :key="index" :label="lesson.lesson_id"
                                class="slide-in" :style="{ '--delay': randomDelay() + 'ms' }">
                                {{ lesson.lesson_name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>

                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">学科融合（可多选）</h3>
                        
                        <el-checkbox-group v-model="selectedDisIntContents" class="checkbox-grid">
                            <el-checkbox v-for="(disIntContent, index) in disIntContents" :key="index"
                                :label="disIntContent.dis_int_content_id" class="slide-in"
                                :style="{ '--delay': randomDelay() + 'ms' }"
                                @change="() => showDialog(disIntContent.dis_int_name, disIntContent.dis_int_content)">
                                {{ disIntContent.dis_int_name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>

                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">教学设计（可多选）</h3>
                        
                        <el-checkbox-group v-model="selectedEduDesContents" class="checkbox-grid">
                            <el-checkbox v-for="(eduDesContent, index) in eduDesContents" :key="index" class="slide-in"
                                :style="{ '--delay': randomDelay() + 'ms' }" :label="eduDesContent.edu_des_id">
                                {{ eduDesContent.edu_des_name }}
                            </el-checkbox>
                        </el-checkbox-group>
                    </div>
                </div>

                <div class="group-container">
                    <div class="group-wrapper">
                        <h3 class="group-title">理论标签（可多选）</h3>                        
                       <el-button type="success">Success</el-button><el-button type="success">Success</el-button><el-button type="success">Success</el-button>
                    </div>
                </div>

                <div class="group-container">
                        <div class="group-wrapper">
                            <h3 class="group-title">已选理论（可多选）</h3>                        
                           <el-button type="success">Success</el-button><el-button type="success">Success</el-button><el-button type="success">Success</el-button>
                        </div>
                    </div>
            </el-col>
        </el-row>
    </div>

    <el-dialog v-model="dialogVisible" :title="currentItem.title" width="50%">
        <p>{{ currentItem.content }}</p>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="updateDatabase" :disabled="textarea === originalText">
                    确定更新
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>



<script>
import useFetchData from '@/composables/useFetchData';
import useFetchLessons from '@/composables/useFetchLessons';
import useFetchDisIntContents from '@/composables/useFetchDisIntContents';
import useFetchEdudesContents from '@/composables/useFectchEduDesContents';
import { defineComponent, ref, watchEffect, reactive } from 'vue';
import { randomDelay } from '@/composables/animationUtils.js';

export default defineComponent({
    name: 'ChatBotVer1',
    setup() {
        const selectedDisIntContents = ref([]);
        const selectedEduDesContents = ref([]);
        const selectedLessons = ref([]);
        const selectedOptions = ref(['', '', '']);
        const { radioGroups, fetchSubjects, fetchGrades, fetchUnits } = useFetchData();
        const { lessonList, fetchLessons } = useFetchLessons();
        const { disIntContents, fetchDisIntContents } = useFetchDisIntContents();
        const { eduDesContents, fetchEduDesContents } = useFetchEdudesContents();

        const dialogVisible = ref(false);
        const currentItem = reactive({ title: '', content: '' });

        const updateGradesAndSubjects = async () => {
            if (selectedOptions.value[0] !== '' && selectedOptions.value[1] !== '') {
                await fetchUnits(selectedOptions.value[0], selectedOptions.value[1]);
            }
        };

        const updateLessons = async () => {
            if (selectedOptions.value[2] !== '') {
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

        fetchSubjects();
        fetchGrades();

        const showDialog = (title, content) => {
            currentItem.title = title;
            currentItem.content = content;
            dialogVisible.value = true;
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
            dialogVisible,
            currentItem,
            showDialog,
            randomDelay
        };
    },
});
</script>




<style scoped>
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

@import '@/styles/slideInAnimation.css'
</style>
