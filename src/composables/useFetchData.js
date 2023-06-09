import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

export default function useFetchData() {
  ElMessage.success("正在获取基础数据！");
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
  ]);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get(apiConfig.subjectListUrl);
      radioGroups.value[0].options = response.data.map((subject) => ({
        label: subject.subject_id,
        text: subject.subject_name,
      }));
      console.log("取得学科：", response.data);
      ElMessage.success("获取学科成功！");
    } catch (error) {
      console.error("Error fetching subjects:", error);
      ElMessage.error("获取学科失败！");
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await axios.get(apiConfig.gradeListUrl);
      radioGroups.value[1].options = response.data.map((grade) => ({
        label: grade.grade_id,
        text: grade.grade_name,
      }));
      ElMessage.success("获取年级成功！");
      console.log("取得年级：", response.data);
    } catch (error) {
      console.error("Error fetching grades:", error);
      ElMessage.error("获取年级失败！");
    }
  };

  const fetchUnits = async (subjectId, gradeId) => {
    ElMessage.success("正在获取单元数据");
    try {
      const response = await axios.get(apiConfig.unitListUrl, {
        params: {
          pub_id: 1,
          subject_id: subjectId,
          grade_id: gradeId,
        },
      });
      ElMessage.success("获取单元成功！");
      radioGroups.value[2].options = response.data.map((unit) => ({
        label: unit.unit_id,
        text: unit.unit_name,
      }));
    } catch (error) {
      console.error("Error fetching units:", error);
      ElMessage.error("获取单元失败！");
    }
  };

  return {
    radioGroups,
    fetchSubjects,
    fetchGrades,
    fetchUnits,
  };
}
