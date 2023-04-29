<template>
    <div class="lesson-container">
        
        <div class="lesson-header" style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
            
                <div class="input-group">
                    <el-text class="label">年级</el-text>
                    <el-input v-model="gradeinput" class="lesson-input" :placeholder="selectedOptions[1]" disabled
                        />
                </div>
                <div class="input-group">
                    <el-text class="label">科目</el-text>
                    <el-input v-model="subjectinput" class="lesson-input" :placeholder="selectedOptions[0]" disabled
                        />
                </div>
                <div class="input-group">
                    <el-text class="label">单元</el-text>
                    <el-select v-model="selectedUnit" placeholder="选择单元">
                        <el-option v-for="unit in units" :key="unit.unit_id" :label="unit.unit_name"
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
                        
                        <el-input v-model="dis_int_nameinput1" placeholder="学科融合的标题" style="padding-bottom: 10px" maxlength="15"/>
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
                    <el-input v-model="dis_int_nameinput2" placeholder="学科融合的标题"  style="padding-bottom: 10px" maxlength="15"/>
                    <el-input v-model="dis_int_contenttextarea2" :autosize="{ minRows: 9, maxRows: 10 }" type="textarea"
                        placeholder="Please input" />
                </el-card>
                <el-card class="box-card">
                    <template #header>
                        <div class="card-header">
                            <span>添加学科融合</span>
                        </div>
                    </template>
                    <el-input v-model="dis_int_nameinput3" placeholder="学科融合的标题"  style="padding-bottom: 10px" maxlength="15"/>
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
import axios from "axios";

export default {
    name: "AddLesson",
    data() {
        return {
            input: "",
            selectedOptions: [],
            units: [],
            selectedUnit: null,
            lessonText: "",
            analysisText: "",
            targetText: "",
            suggestionText: "",
            lessontitleinput: "",
            authorinput: "",
            gradeinput: "",
            subjectinput: "",
            dis_int_nameinput1:"",
            dis_int_nameinput2: "",
            dis_int_nameinput3: "",
            dis_int_contenttextarea1:"",
            dis_int_contenttextarea2: "",
            dis_int_contenttextarea3: "",
            dis_int_contents:[],
            
            // spaceSize: "20"
        };
    },
    mounted() {
        // 获取选项字符串并分割为一个数组
        const optionsString = this.$route.query.selectedOptions;
        this.selectedOptions = optionsString.split(',');


        // 打印选择的选项
        console.log(this.selectedOptions[0]);

    },
    async created() {
        try {
            const response = await axios.get(
                "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/getunit" //拿到单元表格
            );
            this.units = response.data;
        } catch (error) {
            console.error("Error fetching units:", error);
        }
    },
    methods: {
        async submitLesson() {
            // 检查课程标题、作者和单元是否存在
            if (!this.lessontitleinput || !this.authorinput || !this.selectedUnit) {
                this.$message.error("课程标题、作者和单元不能为空");
                return;
            }

             // 构建学科融合数据
            const dis_int_contents = [
                {
                    dis_int_name: this.dis_int_nameinput1,
                    dis_int_content: this.dis_int_contenttextarea1
                },
                {
                    dis_int_name: this.dis_int_nameinput2,
                    dis_int_content: this.dis_int_contenttextarea2
                },
                {
                    dis_int_name: this.dis_int_nameinput3,
                    dis_int_content: this.dis_int_contenttextarea3
                }
            ];

            // 构建要发送的数据对象
            const lessonData = {
                grade: this.gradeinput,
                subject: this.subjectinput,
                unit_id: this.selectedUnit,
                title: this.lessontitleinput,
                author: this.authorinput,
                content: this.lessonText,
                analysis: this.analysisText,
                target: this.targetText,
                suggestion: this.suggestionText,
                dis_int_contents: dis_int_contents
            };

            try {
                const response = await axios.post(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/addlesson",
                    lessonData
                );
                console.log(response)

                // 检查响应状态是否成功
                if (response.data.success) {
                    this.$message.success("课程已成功提交");
                    // 重置表单数据
                    this.resetForm();
                } else {
                    this.$message.error("提交失败，请重试");
                }
            } catch (error) {
                console.error("提交课程数据时出错:", error);
                this.$message.error("提交失败，请重试");
            }
        },
        resetForm() {
            this.selectedUnit = null;
            this.lessonText = "";
            this.analysisText = "";
            this.targetText = "";
            this.suggestionText = "";
            this.lessontitleinput = "";
            this.authorinput = "";
        }
    },
    computed: {
        submitButtonText() {
            const unit = this.units.find(u => u.unit_id === this.selectedUnit);
            const unitName = unit ? unit.unit_name : '';
            return `提交${this.subjectinput} ${this.gradeinput} ${unitName} ${this.lessontitleinput}`;
        }
    }

}


</script>