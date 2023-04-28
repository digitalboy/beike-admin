<template>
    <div class="common-layout">

        <el-table :data="lessons" border stripe style="width: 100%" @cell-dblclick="openDialog" table-layout="fixed">


            <el-table-column prop="lesson_id" label="课程ID" width="100"></el-table-column>
            <el-table-column prop="lesson_name" label="课程名称"></el-table-column>
            <el-table-column prop="author" label="作者" width="150"></el-table-column>
            <el-table-column prop="lesson_focus" label="教学重点"></el-table-column>
            <el-table-column prop="lesson_diff" label="教学难点"></el-table-column>
            <el-table-column prop="lesson_ana" label="教材分析" min-width="200">
                <template #default="scope">


                    <span class="text-truncate-200">{{ scope.row.lesson_ana }}</span>

                </template>
            </el-table-column>
            <el-table-column prop="teach_adv" label="教学建议"></el-table-column>
            <el-table-column prop="dis_int" label="学科融合">
                <template #default="scope">
                    <div v-if="scope.row.dis_int_content_id">
                        <el-button v-for="(content, index) in getDisIntContents(scope.row)" :key="index" type="success"
                            size="mini">
                            {{ content.dis_int_name }}
                        </el-button>
                    </div>
                </template>
            </el-table-column>
        </el-table>



        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" @close="saveText" draggable>

            <el-form>
                <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 1, maxRows: 30 }"></el-input>
            </el-form>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveText">确 定</el-button>
                </span>
            </template>
        </el-dialog>
        <el-divider border-style="dashed" />
        <el-button type="primary" v-if="selectedOptions.length > 0" @click="addLesson">
            增加一课 {{ selectedOptions }}
        </el-button>

    </div>
</template>


<style scoped>
::v-deep .el-textarea__inner {
    line-height: 2;
}

.text-truncate-container {
    position: relative;
    max-width: 200px;
    height: 1.2em;
    overflow: hidden;
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
            selectedOptions: []
        };
    },

    methods: {
        openDialog(row, column, cell, event) {
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
            this.dialogVisible = false;
        },

        async addLesson() {
            this.$router.push({
                path: '/AddLesson',
                query: { selectedOptions: this.selectedOptions.join(',') }
            });
        },
        getDisIntContents(row) {
            let disIntContents = [];
            console.log("disIntContents", disIntContents)
            for (let key in row) {
                if (key.startsWith("dis_int_content_id")) {
                    disIntContents.push({
                        dis_int_content_id: row[key],
                        dis_int_name: row[key.replace("id", "name")],
                        dis_int_content: row[key.replace("id", "content")],
                    });
                }
            }
            return disIntContents;
        },
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
            })
            .catch((error) => {
                console.log(error);
            });
    },

};
</script>

