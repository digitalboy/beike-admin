<template>
  <div class="home" id="homepage">
    <div class="radio_container">
      <el-row type="flex" justify="center">
        <el-col :span="24" :sm="18" :md="12" :lg="8" :xl="6">
          <div v-for="(group, index) in radioGroups" :key="group.id">
            <div class="group-container">
              <div class="group-wrapper">
                <h3 class="group-title">{{ group.title }}</h3>
                <el-radio-group v-model="selectedOptions[index]">
                  <el-radio class="slide-in" v-for="(option, optionIndex) in group.options" :key="optionIndex"
                    :label="option.label">
                    {{ option.text }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button type="primary" @click="sendDataAndRedirect">开始编辑</el-button>
    </div>
    <div style="padding-top: 20px;">
      <el-button type="success" @click="theoriesRedirect">编辑教学理论</el-button>
    </div>
  </div>
</template>

<script>
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";

import { defineComponent, ref, watchEffect } from "vue";
// import { ElRow, ElCol, ElRadioGroup, ElRadio, ElButton } from "element-plus";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "HomeComponent",
  // components: {
  //   ElRow,
  //   ElCol,
  //   ElRadioGroup,
  //   ElRadio,
  //   ElButton,
  // },
  setup() {
    const apiUrl = apiConfig;
    const router = useRouter();
    const selectedOptions = ref(["", "", ""]);
    const radioGroups = ref([
      {
        id: "subjects",
        title: "学科",
        options: [],
      },
      {
        id: "grades",
        title: "年级",
        options: [],
      },
      {
        id: "units",
        title: "单元",
        options: [],
      },
      {
        id: "content",
        title: "编辑内容",
        options: [
          { key:"cont1",label:"lessontext",text:"课文相关"},
          { key: "cont2", label: "lessondesing", text:"教学设计"},
          { key: "cont3", label: "lessonppt", text:"PPT大纲"},
        ],
      },
    ]);

    const fetchSubjects = async () => {
      try {
        const response = await axios.get(apiUrl.subjectListUrl);
        radioGroups.value[0].options = response.data.map((subject) => ({
          label: subject.subject_id,
          text: subject.subject_name,
        }));
        console.log("取得学科：",response.data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    const fetchGrades = async () => {
      try {
        const response = await axios.get(apiUrl.gradeListUrl);
        radioGroups.value[1].options = response.data.map((grade) => ({
          label: grade.grade_id,
          text: grade.grade_name,
        }));
        console.log("取得年级：", response.data);
      } catch (error) {
        console.error("Error fetching grades:", error);
      }
    };

    const fetchUnits = async () => {
      console.log("学科改变：",selectedOptions.value[0]);
      try {
        const response = await axios.get(apiUrl.unitListUrl, {
          params: {
            pub_id:1,
            subject_id: selectedOptions.value[0],
            grade_id: selectedOptions.value[1],
          },
        });
        console.log(response.data)
        radioGroups.value[2].options = response.data.map((unit) => ({
          label: unit.unit_id,
          text: unit.unit_name,
        }));
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    };

    const updateGradesAndSubjects = async () => {
      if (selectedOptions.value[0] !== "" && selectedOptions.value[1] !== "") {
        await fetchUnits();
      }     
    };

    watchEffect(async () => {
      await updateGradesAndSubjects();
    });


    fetchSubjects();
    fetchGrades();

    const sendDataAndRedirect = async () => {
      if (!selectedOptions.value.every((option) => option !== "")) {
        alert("请确保每组单选按钮都已选择！");
        return;
      }

      // 获取所选单元的 label 属性
      const selectedUnitLabel = radioGroups.value[2].options.find(
        (option) => option.label === selectedOptions.value[2]
      ).label;

      try {       
        // console.log(JSON.stringify(response.data, null, 2));
       console.log("选中的单元 ID：", selectedUnitLabel);
        router.push({
          path: '/ListLesson',
          query: { unit_id: selectedUnitLabel },          
        });
      } catch (error) {
        console.error("Error submitting data:", error);
      }
    };

    const theoriesRedirect = async () => {
      router.push({
        path: '/ListTheory'
      });
    };

    return {
      selectedOptions,
      radioGroups,
      sendDataAndRedirect,
      theoriesRedirect,
    };
  },
});
</script>

<style scoped>
.group-wrapper {
  position: relative;
  border: 1px solid #ccc;
  padding: 20px;
  border-radius: 8px;
}

.group-title {
  position: absolute;
  top: -9px;
  left: 15px;
  font-size: 14px;
  background-color: #fff;
  padding: 0 5px;
}

.group-container {
  border: 0px solid #ccc;
  border-radius: 5px;
  padding: 1rem;
  align-items: center;
  margin-bottom: 1rem;
}

.divider-spacing {
  margin-top: 1rem;
}

@keyframes slideIn {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.slide-in {
  animation: slideIn 0.5s forwards;
}
</style>
