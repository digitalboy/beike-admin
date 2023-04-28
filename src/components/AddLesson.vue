<template>
    <div class="lesson-container">
        <div class="lesson-header">
            <el-space wrap size="50">
                <div class="input-group">
                    <el-text class="label">年级</el-text>
                    <el-input v-model="gradeinput" class="lesson-input" :placeholder="selectedOptions[1]" disabled style="width: 100px"/>
                </div>
                <div class="input-group">
                    <el-text class="label">科目</el-text>
                    <el-input v-model="subjectinput" class="lesson-input" :placeholder="selectedOptions[0]" disabled style="width: 100px" />
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
            </el-space>
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
        <div class="submit-button">
            <el-button type="primary" @click="submitLesson">{{ submitButtonText }}</el-button>
        </div>

    </div>
</template>

<style scoped>
.lesson-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
}

.lesson-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
            subjectinput: ""
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
                "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/getunit"
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
                suggestion: this.suggestionText
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