<template>
    <div class="centered-content">
        <el-table :data="theory" border stripe @cell-dblclick="openDialog">
            <el-table-column prop="theory_id" label="理论ID" width="80"></el-table-column>
            <el-table-column prop="theory_content" label="理论内容" width="120">
                <template #default="scope">
                    <span class="text-truncate-200">{{ scope.row.theory_content }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="author" label="作者" width="120"></el-table-column>
            <el-table-column prop="author" label="标签管理">

            </el-table-column>
        </el-table>

        <el-dialog :title="dialogTitle" v-model="dialogVisible" width="70%" draggable @close="closeDialog">
            <template #header>
                <el-input v-if="isSubjectIntegration" v-model="dialogTitle" placeholder="请输入融合标题" maxlength="15" type="text"
                    show-word-limit></el-input>
                <template v-else>{{ dialogTitle }}</template>
            </template>
            <el-form>
                <el-input v-model="textarea" type="textarea" :autosize="{ minRows: 1, maxRows: 30 }"></el-input>
            </el-form>

            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="updateDatabase" :disabled="textarea === originalText">
                        确定更新</el-button>
                </span>
            </template>
        </el-dialog>

        <div style="margin: 10PX;">
            <el-button type="primary" v-if="selectedOptions.length > 0" @click="addLesson">
                增加一课{{ selectedOptions }}
            </el-button>
        </div>

    </div>
</template>

<style scoped>
.centered-content {
    display: flex;
    /* 设置元素为 flex 容器，使其子元素可以使用 flex 布局 */
    justify-content: center;
    /* 在主轴（水平轴）上居中 flex 容器内的所有子元素 */
    align-items: center;
    /* 在侧轴（垂直轴）上居中 flex 容器内的所有子元素 */
    flex-direction: column;
    /* 设置 flex 容器的主轴方向为垂直（列），子元素将沿垂直方向排列 */
    height: 100%;
    /* 设置元素高度为 100%，以使其占据父元素的全部高度 */
    max-width: 1500px;
    margin-left: auto;
    /* 使容器在水平方向上居中：添加自动空白到左边距 */
    margin-right: auto;
    /* 使容器在水平方向上居中：添加自动空白到右边距 */
}

.listalllesson {
    max-width: 900px;
    margin: 0;
    padding: 20px;
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
            selectedLesson: null,
            selectedColumnProperty: '',
            originalText: '',
            currentdisintcontentid: "",
            currentdisintname: ""
        };
    },

    methods: {
        openDialog(row, column, cell, event) {
            if (column.property === 'dis_int_contents') {
                console.log("行：", row.lesson_id)
                console.log("列：", column.label)
                console.log("格：", cell)
                this.selectedLesson = row.lesson_id;
                this.selectedColumnProperty = column.property;

                return; // Do not respond to double-click events in the 'dis_int_contents' column
            }
            // console.log("行：", row.lesson_name)
            // console.log("列：", column.label)
            // console.log("格：", cell)
            // console.log(event.target.tagName)
            this.selectedLesson = row;
            this.selectedColumnProperty = column.property;
            this.dialogTitle = row.lesson_name + column.label;
            this.textarea = event.target.textContent;
            this.originalText = event.target.textContent;
            this.dialogVisible = true;
        },

        closeDialog() {
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
            this.less
            if (value === 'add_subject_integration') {
                this.addSubjectIntegration(row);
            } else {
                //console.log(row.lesson_id);
                this.isSubjectIntegration = true; // 设置为学科融合状态
                // 找到与选中 value 对应的对象
                const selectedContent = row.dis_int_contents.find(content => content.dis_int_content === value);
                // 获取 dis_int_name 属性
                this.dialogTitle = selectedContent.dis_int_name;
                this.currentdisintcontentid = selectedContent.dis_int_content_id;
                this.currentdisintname = selectedContent.dis_int_name;
                this.textarea = value;
                this.dialogVisible = true;
            }
        },

        addSubjectIntegration(row) {
            console.log('Adding subject integration for row:', row);
            this.selectedLesson = row;
            this.isSubjectIntegration = true;
            this.dialogVisible = true;
        },
        stop(event) {
            event.stopPropagation();
        },
        async updateDatabase() {
            let data = {};
            try {
                if (this.isSubjectIntegration === false) {
                    // 构建要发送给后端的数据对象
                    data = {
                        lesson_id: this.selectedLesson.lesson_id, // 当前选中的课程的 ID
                        whichcolum: this.selectedColumnProperty, // 更新后的标题
                        newContent: this.textarea // 更新后的内容
                    }
                }
                else if (this.isSubjectIntegration === true) {
                    data = {
                        lesson_id: this.selectedLesson.lesson_id,
                        dis_int_content_id: this.currentdisintcontentid, // 当前选中的融合的 ID
                        dis_int_name: this.currentdisintname,
                        newContent: this.textarea // 更新后的内容
                    }
                }

                console.log(data);
                // 发送 PUT 请求（或其他适合更新操作的 HTTP 方法）到后端
                // 请根据实际情况修改 URL 和其他请求参数
                const response = await axios.put("https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/put/updatebeikelesson", data);
                if (response.status === 200) {
                    this.lessons_id = "";
                    this.currentdisintcontentid = "";
                    this.dialogTitle = "";
                    this.textarea = "";
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


