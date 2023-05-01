
<script>
import axios from "axios";
import { ref, reactive, onMounted } from "vue";

export default {
  name: "ListTheory",
  setup() {
    const theories = ref([]);
    const dialogVisible = ref(false);
    const textarea = ref("");
    const dialogTitle = ref("");
    const dynamicTags = reactive({});
    const tagInputVisible = reactive([]);
    const taginputmodel = reactive([]);
    const currentTheoryid = ref("");
    const currentTheoryColume = ref("");
    const currentTheryContent = ref("");
    const isSubjectIntegration = ref(false);
    const originalText = ref("");

    async function updateDatabase(dowhat, whichtheory, content) {
let data = {};
      console.log("要干啥：", dowhat)
      try {
        if (dowhat === 'addtag') {
          console.log("要增加：", dowhat);
          data = {
            theoryaddtage: [
              {
                theory_id: whichtheory,
                tagname: content,
              },
            ],
          };
          console.log("add");
        } else if (dowhat === "deltag") {
          console.log("delllllll");
          data = {
            theorydeltage: [
              {
                theory_id: whichtheory,
                tagname: content,
              },
            ],
          };
        } else {
          data = {
            theoryupdate: [
              {
                theory_id: this.currentTheoryid,
                currentTheoryColume: this.currentTheoryColume,
                newContent: this.textarea, // 更新后的内容
              },
            ],

          };
    }

    async function addTheory() {
          this.$router.push({
        path: "/AddTheory",
        // query: { selectedOptions: this.selectedOptions.join(',') }
      });
    }

    function handleClose(alltags, tag, rowindex) {
            console.log("哪个文章ID:", rowindex);
      // console.log(this.taginputmodel[index]);
      if (this.taginputmodel[rowindex]) {
        // console.log(this.taginputmodel[rowindex]);
        // console.log(this.dynamicTags[rowindex]);
        this.dynamicTags[rowindex].push({
          tagname: this.taginputmodel[rowindex],
        });
        this.updateDatabase("addtag", rowindex, this.taginputmodel[rowindex]);
      }
      this.tagInputVisible[rowindex] = "";
      this.taginputmodel[rowindex] = "";
    }

    function showTagInput(index) {
          console.log("index", index);
      this.tagInputVisible[index] = true;
      // this.InputRef.value?.input?.focus();
    }

    function handleInputConfirm(rowindex) {
          console.log("哪个文章ID:", rowindex);
      // console.log(this.taginputmodel[index]);
      if (this.taginputmodel[rowindex]) {
        // console.log(this.taginputmodel[rowindex]);
        // console.log(this.dynamicTags[rowindex]);
        this.dynamicTags[rowindex].push({
          tagname: this.taginputmodel[rowindex],
        });
        this.updateDatabase("addtag", rowindex, this.taginputmodel[rowindex]);
      }
      this.tagInputVisible[rowindex] = "";
      this.taginputmodel[rowindex] = "";
    }

    openDialog(row, column, cell, event) {
      if (column.property != "theory_tags") {
        console.log("行：", row);
        console.log("列：", column.prop);
        console.log("格：", cell);
        console.log(event.target.tagName);
        // this.selectedLesson = row;
        this.currentTheoryColume = column.property;
        this.dialogTitle = "请编辑内容";
        this.originalText = event.target.textContent;
        this.textarea = event.target.textContent;
        this.dialogVisible = true;
      }
    }

    closeDialog() {
      //console.log('保存的文本：', this.textarea);
      this.dialogVisible = false;
    },

    onMounted(async () => {
      console.clear();
    console.log("start");
    axios
      // GET教学理论列表
      .get(
        "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/get/listtheory"
      )
      .then((response) => {
        this.theories = response.data;
        // this.dynamicTags = response.data.theory_tags;
        console.log(this.theories.theory_id);
        for (const theory of this.theories) {
          this.taginputmodel[theory.theory_id] = "";
          this.dynamicTags[theory.theory_id] = theory.theory_tags;
          console.log("qqq:", theory.theory_tags);
          console.log("kkk:", this.dynamicTags);
          // console.log(this.taginputmodel);
        }
      })
      .catch((error) => {
        console.log(error);
        this.$message.error("没取得数据！");
      });
    });

    return {
      theories,
      dialogVisible,
      textarea,
      dialogTitle,
      dynamicTags,
      tagInputVisible,
      taginputmodel,
      currentTheoryid,
      currentTheoryColume,
      currentTheryContent,
      isSubjectIntegration,
      originalText,
      updateDatabase,
      addTheory,
      handleClose,
      showTagInput,
      handleInputConfirm,
      openDialog,
      closeDialog,
    };
  },
};
</script>
