<template>
    <div class="lesson-container">

        <div class="lesson-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">

            <div class="input-group">
                <el-text class="label">年级</el-text>
                <el-input v-model="gradeinput" class="lesson-input" :placeholder="currentGradeName" disabled />
            </div>
            <div class="input-group">
                <el-text class="label">科目</el-text>
                <el-input v-model="subjectinput" class="lesson-input" :placeholder="currentSubjectName" disabled />
            </div>
            <div class="input-group">
                <el-text class="label">单元</el-text>
                <el-select v-model="selectedUnit" placeholder="选择单元">
                    <el-option v-for="unit in unitList" :key="unit.unit_id" :label="unit.unit_name"
                        :value="unit.unit_id"></el-option>
                </el-select>
            </div>
            <div class="input-group">
                <el-text class="label">课文标题</el-text>
                <el-input v-model="lessontitleinput" class="lesson-input" placeholder="请输入课文标题"
                    :formatter="(value) => `《${value}》`" :parser="(value) => value.replace(/《|》/g, '')" />

            </div>
            <div class="input-group">
                <el-text class="label">作者</el-text>
                <el-input v-model="authorinput" class="lesson-input" placeholder="请输入作者名" />
            </div>

        </div>
        <div class="lesson-content">
            <div class="input-group">

                <el-text class="label">课文正文</el-text>
                <el-input v-model="lessonText" :autosize="{ minRows: 5, maxRows: 20 }" class="lesson-textarea"
                    type="textarea" placeholder="请输入课文正文"></el-input>
            </div>
            <div class="input-group">
                <el-text class="label">教材解析</el-text>
                <el-input v-model="analysisText" :autosize="{ minRows: 5, maxRows: 20 }" class="lesson-textarea"
                    type="textarea" placeholder="请输入教材解析" />
            </div>
            <div class="input-group">
                <el-text class="label">教学目标</el-text>
                <el-input v-model="targetText" :autosize="{ minRows: 5, maxRows: 20 }" class="lesson-textarea"
                    type="textarea" placeholder="请输入教学目标" />
            </div>
            <div class="input-group">
                <el-text class="label">教学建议</el-text>
                <el-input v-model="suggestionText" :autosize="{ minRows: 5, maxRows: 20 }" class="lesson-textarea"
                    type="textarea" placeholder="请输入教学建议" />
            </div>
        </div>
        <div class="card-group">
            <el-space :size="6">
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>添加学科融合</span>
                        </div>
                    </template>
                    <div>

                        <el-input v-model="dis_int_nameinput1" placeholder="学科融合的标题" style="padding-bottom: 10px"
                            maxlength="15" />
                        <el-input v-model="dis_int_contenttextarea1" :autosize="{ minRows: 9, maxRows: 10 }" type="textarea"
                            placeholder="Please input" style="width: 100%" />
                    </div>
                </el-card>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>添加学科融合</span>
                        </div>
                    </template>
                    <el-input v-model="dis_int_nameinput2" placeholder="学科融合的标题" style="padding-bottom: 10px"
                        maxlength="15" />
                    <el-input v-model="dis_int_contenttextarea2" :autosize="{ minRows: 9, maxRows: 10 }" type="textarea"
                        placeholder="Please input" />
                </el-card>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>添加学科融合</span>
                        </div>
                    </template>
                    <el-input v-model="dis_int_nameinput3" placeholder="学科融合的标题" style="padding-bottom: 10px"
                        maxlength="15" />
                    <el-input v-model="dis_int_contenttextarea3" :autosize="{ minRows: 9, maxRows: 10 }" type="textarea"
                        placeholder="Please input" />
                </el-card>
            </el-space>
        </div>

        <div class="submit-button" style="padding-top: 20px;">
            <el-button type="primary" @click="submitLesson">{{ submitButtonText }}</el-button>
        </div>

    </div>
</template>

<style scoped>
.tag-group {
    margin-bottom: 20px;
}

.lesson-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.lesson-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1px;
    width: 100%;
    box-sizing: border-box;
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
}

.label {
    margin-bottom: 10px;
}

.lesson-input,
.lesson-textarea {
    width: 100%;
}
</style>


<script>
import apiConfig from "@/apicongfig/api.js";
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export default {
    name: 'AddLesson',
    setup() {
        const input = ref('');
        const selectedOptions = ref([]);
        const unitList = ref([]);
        const selectedUnit = ref(null);
        const lessonText = ref('');
        const analysisText = ref('');
        const targetText = ref('');
        const suggestionText = ref('');
        const lessontitleinput = ref('');
        const authorinput = ref('');
        const gradeinput = ref('');
        const subjectinput = ref('');
        const dis_int_nameinput1 = ref('');
        const dis_int_nameinput2 = ref('');
        const dis_int_nameinput3 = ref('');
        const dis_int_contenttextarea1 = ref('');
        const dis_int_contenttextarea2 = ref('');
        const dis_int_contenttextarea3 = ref('');
        const dis_int_contents = ref([]);
        const route = useRoute();

        const currentUnitid = ref('');
        const currentUnitName = ref('');
        const currentGradeId = ref('');
        const currentGradeName = ref('');
        const currentSubjectId = ref('');
        const currentSubjectName = ref('');

        onMounted(async () => {
            
            // console.log("拿到参数：",route.query);

            currentUnitid.value = route.query.unit_id; 
            currentUnitName.value = route.query.unit_name;
            currentGradeId.value = route.query.grade_id,
            currentGradeName.value = route.query.grade_name;
            currentSubjectId.value = route.query.subject_id;
            currentSubjectName.value = route.query.subject_name;
            
           
            try {
                const response = await axios.get(
                apiConfig.unitListUrl,
                    { params: { 
                        pub_id: 1,
                        subject_id: currentSubjectId.value,
                        grade_id: currentGradeId.value
                    } }
                );
                unitList.value = response.data;
                console.log("单元表：", unitList.value)
            } catch (error) {
                console.error('Error fetching units:', error);
                alert("拿不到单元数据");
            }
        });

        const submitLesson = async () => {
            // 检查课程标题、作者和单元是否存在
            if (!lessontitleinput.value || !authorinput.value || !selectedUnit.value) {
                ElMessage.error('课程标题、作者和单元不能为空');
                return;
            }

            // 构建学科融合数据
            dis_int_contents.value = [
                {
                    dis_int_name: dis_int_nameinput1.value,
                    dis_int_content: dis_int_contenttextarea1.value,
                },
                {
                    dis_int_name: dis_int_nameinput2.value,
                    dis_int_content: dis_int_contenttextarea2.value,
                },
                {
                    dis_int_name: dis_int_nameinput3.value,
                    dis_int_content: dis_int_contenttextarea3.value,
                },
            ];

            // 构建要发送的数据对象
            const lessonData = {
                
                lesson_name: lessontitleinput.value,
                lesson_code: "",
                memo:"",
                subject: subjectinput.value,
                unit_id: selectedUnit.value,
                teach_objectivest: targetText.value,
                lesson_text: lessonText.value,
                lesson_focus:"",
                lesson_diff:"",
                lesson_ana: analysisText.value,
                teach_adv: suggestionText.value,
                author: authorinput.value,          
                
                // dis_int_contents: dis_int_contents.value,
                    
            };

           try {
                const response = await axios.post(apiConfig.lessonAddUrl, lessonData);
                console.log(response);

                // 检查响应状态是否成功
                if (response.status === 200 && response.data.lesson_id) {
                    ElMessage.success('课程已成功提交');
                    // 重置表单数据
                    resetForm();
                } else {
                    ElMessage.error(
                        response.data.message || '提交失败，请重试'
                    );
                }
            } catch (error) {
                console.error('提交课程数据时出错:', error);
                ElMessage.error('提交失败，请重试');
            }

        };

        const resetForm = () => {
            selectedUnit.value = null;
            lessonText.value = '';
            analysisText.value = '';
            targetText.value = '';
            suggestionText.value = '';
            lessontitleinput.value = '';
            authorinput.value = '';
        };

        const submitButtonText = computed(() => {
            const unit = unitList.value.find((u) => u.unit_id === selectedUnit.value);
            const unitName = unit ? unit.unit_name : '';
            return `提交${subjectinput.value} ${gradeinput.value} ${unitName} ${lessontitleinput.value}`;
        });

        return {
            input,
            selectedOptions,
            unitList,
            selectedUnit,
            lessonText,
            analysisText,
            targetText,
            suggestionText,
            lessontitleinput,
            authorinput,
            gradeinput,
            subjectinput,
            dis_int_nameinput1,
            dis_int_nameinput2,
            dis_int_nameinput3,
            dis_int_contenttextarea1,
            dis_int_contenttextarea2,
            dis_int_contenttextarea3,
            dis_int_contents,
            submitLesson,
            resetForm,
            submitButtonText,

            currentUnitName,
            currentGradeId,
            currentGradeName,
            currentSubjectId,
            currentSubjectName,
        };
    },
};
</script>