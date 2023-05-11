import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

export default function useFetchLessons() {
  const lessonList = ref([]);

  const fetchLessons = async (unit_id) => {
    ElMessage.success("正在获取课程数据！");
    try {
      const response = await axios.get(
        `${apiConfig.lessonListUrl}?unit_id=${unit_id}`
      );
      lessonList.value = response.data;
    } catch (error) {
      console.error("Error fetching lesson data:", error);
      ElMessage.error("获取课程错误！");
    }
  };

  return {
    lessonList,
    fetchLessons,
  };
}
