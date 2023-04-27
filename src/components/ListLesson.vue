<template>
    
        <div class="common-layout">
            
                <el-table :data="lessons" border stripe style="width: 100%" @cell-dblclick="openDialog"
                    table-layout="fixed">
                    <el-table-column prop="lesson_id" label="课程ID" width="100"></el-table-column>
                    <el-table-column prop="lesson_name" label="课程名称"></el-table-column>
                    <el-table-column prop="author" label="作者" width="150"></el-table-column>
                    <el-table-column prop="lesson_focus" label="教学重点"></el-table-column>
                    <el-table-column prop="lesson_diff" label="教学难点"></el-table-column>
                    <el-table-column prop="lesson_ana" label="教材分析" min-width="200">
                        <template #default="scope">
                            <!-- <el-tooltip effect="dark" content="双击开始编辑" placement="top"> -->
                            <div class="text-truncate-container">
                                <span class="text-truncate-200">{{ scope.row.lesson_ana }}</span>
                            </div>
                            <!-- </el-tooltip> -->
                        </template>
                    </el-table-column>
                    <el-table-column prop="teach_adv" label="教学建议"></el-table-column>
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
                 <el-divider border-style="dashed"/>
                <el-button type="primary">增加一课</el-button>
            
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
            // dialogWidth: window.innerWidth <= 768 ? '90%' : '70%',
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

