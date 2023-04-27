<template>
    <!-- <el-table :data="lessons" border stripe style="width: 100%" @cell-dblclick="openDialog"> -->
    <el-table :data="lessons" border stripe style="width: 100%" @cell-dblclick="openDialog">

        <el-table-column label="课程ID" width="80">
            <!-- <template #default="scope">
                        {{ scope.row.lesson_id }}
                    </template> -->
        </el-table-column>
        <el-table-column prop="lesson_name" label="课程名称" width="150"></el-table-column>
        <el-table-column prop="author" label="作者" width="150"></el-table-column>
        <el-table-column prop="lesson_focus" label="教学重点" width="200"></el-table-column>
        <el-table-column prop="lesson_diff" label="教学难点" width="200"></el-table-column>
        <el-table-column prop="lesson_ana" label="教学分析" width="250"></el-table-column>
        <el-table-column prop="teach_adv" label="教学建议" width="150"></el-table-column>
        <el-table-column label="操作" width="100">
            <!-- 操作按钮内容 -->
        </el-table-column>
    </el-table>

    <el-dialog title="编辑文本" v-model="dialogVisible" width="50%" @close="saveText">

        <el-form>
            <el-form-item label="编辑文本">
                <el-input v-model="editableText"></el-input>
            </el-form-item>
        </el-form>
        <template v-slot:footer>
            <span class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveText">确 定</el-button>
            </span>
        </template>
    </el-dialog>
</template>


<style scoped></style>


<script>
import axios from "axios";


export default {
    data() {
        return {
            lessons: [],
            dialogVisible: false,
            editableText: ''
        };
    },

    methods: {
        openDialog(row, column, cell, event) {
            console.log(event.target.innerText)            
            console.log(event.target.tagName)            
            this.editableText = event.target.innerText;            
            this.dialogVisible = true;
            
        },

        saveText() {
            console.log('保存的文本：', this.editableText);
            this.dialogVisible = false;
        }

    },

    mounted() {
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

