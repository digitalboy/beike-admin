<template>
    <div class="common-layout">
        <el-row>
            <el-col :span="22" :offset="1">
                <el-table :data="lessons" border stripe style="width: 90%" @cell-dblclick="openDialog">

                    <el-table-column prop="lesson_id" label="课程ID" width="80" @dblclick.stop></el-table-column>
                    <el-table-column prop="lesson_name" label="课程名称" width="120"></el-table-column>
                    <el-table-column prop="author" label="作者" width="120"></el-table-column>
                    <el-table-column prop="lesson_focus" label="教学重点" width="180"></el-table-column>
                    <el-table-column prop="lesson_diff" label="教学难点" width="220"></el-table-column>
                    <el-table-column prop="lesson_ana" label="教材分析" width="220">
                        <template #default="scope">
                            <span class="text-truncate-200">{{ scope.row.lesson_ana }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="teach_adv" label="教学建议" width="220"></el-table-column>

                    <el-table-column prop="dis_int_contents" label="学科融合" @dblclick.stop>
                        <template #default="scope">
                            <el-select v-if="scope.row.dis_int_contents && scope.row.dis_int_contents.length > 0"
                                v-model="selectedOption" @change="optionSelected(scope.row, $event)">
                                <el-option v-for="content in scope.row.dis_int_contents" :key="content.dis_int_content_id"
                                    :label="content.dis_int_name" :value="content.dis_int_content">
                                </el-option>
                                <el-option label="添加学科融合" value="add_subject_integration"></el-option>
                            </el-select>
                            <el-button v-else type="primary" @click="addSubjectIntegration(scope.row)"
                                @dblclick.stop>添加学科融合</el-button>
                        </template>
                    </el-table-column>



                </el-table>

                <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" @close="saveText" draggable>
                    <template #title>
                        <el-input v-if="isSubjectIntegration" v-model="dialogTitle" placeholder="请输入标题"></el-input>
                        <template v-else>{{ dialogTitle }}</template>
                    </template>
                    <el-form>
                        <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 1, maxRows: 30 }"></el-input>
                    </el-form>

                    <template v-slot:footer>
                        <span class="dialog-footer">
                            <el-button @click="dialogVisible = false">取 消</el-button>
                            <el-button type="primary" @click="updateDatabase">确 定</el-button>
                        </span>
                    </template>
                </el-dialog>
                <div style="margin: 10PX;">
                    <el-button type="primary" v-if="selectedOptions.length > 0" @click="addLesson">
                        增加一课{{ selectedOptions }}
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.button-container {
    display: flex;
}

.text-truncate-200 {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    display: block;
}
</style>


<script>
import axios from "axios";

export default {
    data() {
        return {
            lessons: [],
            dialogVisible: false,
            textarea: '',
            dialogTitle: '',
            selectedOptions: [],
            isSubjectIntegration: false,
        };
    },

    methods: {
        openDialog(row, column, cell, event) {
            if (column.property === 'dis_int_contents' || column.property === 'lesson_id') {
                return; // Do not respond to double-click events in the 'dis_int_contents' column
            }
            console.log("行：", row.lesson_name)
            console.log("列：", column.label)
            console.log("格：", cell)
            console.log(event.target.tagName)
            this.dialogTitle = row.lesson_name + column.label;
            this.textarea = event.target.textContent;
            this.dialogVisible = true;
        },

        saveText() {
            //console.log('保存的文本：', this.textarea);
            this.isSubjectIntegration = false;
            this.dialogVisible = false;
        },

        async addLesson() {
            this.$router.push({
                path: '/AddLesson',
                query: { selectedOptions: this.selectedOptions.join(',') }
            });
        },
        optionSelected(row, value) {
            if (value === 'add_subject_integration') {
                this.addSubjectIntegration(row);
            } else {
                this.isSubjectIntegration = true; // 设置为学科融合状态
                this.dialogTitle = row.lesson_name;
                this.textarea = value;
                this.dialogVisible = true;
            }
        },
        addSubjectIntegration(row) {
            console.log('Adding subject integration for row:', row);
            // 在这里添加你的逻辑以添加学科融合
        },
        stop(event) {
            event.stopPropagation();
        },
        async updateDatabase() {
            try {
                // 构建要发送给后端的数据对象
                const data = {
                    lessonId: this.selectedLesson.lesson_id, // 当前选中的课程的 ID
                    dialogTitle: this.dialogTitle, // 更新后的标题
                    textarea: this.textarea // 更新后的内容
                };
                console.log(data);
                // 发送 PUT 请求（或其他适合更新操作的 HTTP 方法）到后端
                // 请根据实际情况修改 URL 和其他请求参数
                const response = await axios.put("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/put/updatebeikelesson", data);

                if (response.status === 200) {
                    this.$message.success("更新成功！");
                    this.dialogVisible = false;
                } else {
                    this.$message.error("更新失败，请稍后重试！");
                }
            } catch (error) {
                console.log(error);
                this.$message.error("更新失败，请稍后重试！");
            }
        }
    },

    mounted() {
        // 获取选项字符串并分割为一个数组
        const optionsString = this.$route.query.selectedOptions;
        this.selectedOptions = optionsString.split(',');
        // 打印选择的选项
        console.log(this.selectedOptions[0]);

        axios
            .get("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/bgportlistlesson")
            .then((response) => {
                this.lessons = response.data;
                this.dis_int_contents = response.data.dis_int_contents;
                console.log(response.data.dis_int_contents)
            })
            .catch((error) => {
                console.log(error);
            });
    },

};
</script>

