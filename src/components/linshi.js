

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const lessons = ref([]);
    const dialogVisible = ref(false);
    const textarea = ref('');
    const dialogTitle = ref('');
    const selectedOptions = ref([]);
    const isSubjectIntegration = ref(false);
    const selectedLesson = ref(null);
    const selectedColumnProperty = ref('');
    const originalText = ref('');
    const currentdisintcontentid = ref('');
    const currentdisintname = ref('');

    const openDialog = (row, column, cell, event) => {
      // Your openDialog function logic here
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
    };

    const closeDialog = () => {
      // Your closeDialog function logic here
       //console.log('保存的文本：', this.textarea);
            this.isSubjectIntegration = false;
            this.dialogVisible = false;
    };

    const addLesson = async () => {
      // Your addLesson function logic here
      this.$router.push({
                path: '/AddLesson',
                query: { selectedOptions: this.selectedOptions.join(',') }
            });
    };

    const optionSelected = (row, value) => {
      // Your optionSelected function logic here
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
    };

    const addSubjectIntegration = (row) => {
      // Your addSubjectIntegration function logic here
      console.log('Adding subject integration for row:', row);
            this.selectedLesson = row;
            this.isSubjectIntegration = true;
            this.dialogVisible = true;
    };

    const stop = (event) => {
      event.stopPropagation();
    };

    const updateDatabase = async () => {
      // Your updateDatabase function logic here
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
    };

    onMounted(async () => {
      // Your mounted logic here
      // 获取选项字符串并分割为一个数组
        const optionsString = router.query.selectedOptions;
        selectedOptions = optionsString.split(',');
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
    });

    return {
      lessons,
      dialogVisible,
      textarea,
      dialogTitle,
      selectedOptions,
      isSubjectIntegration,
      selectedLesson,
      selectedColumnProperty,
      originalText,
      currentdisintcontentid,
      currentdisintname,
      openDialog,
      closeDialog,
      addLesson,
      optionSelected,
      addSubjectIntegration,
      stop,
      updateDatabase
    };
  },
};
</script>
