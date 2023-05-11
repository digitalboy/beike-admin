import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

// 修改 useFetchEduDesContents 函数
export default function useFetchEduDesContents() {
  const eduDesContents = ref([]);

  const fetchEduDesContents = async (lessonIds) => {
    // 过滤掉 undefined 值
    const filteredLessonIds = lessonIds.filter((id) => id !== undefined);

    if (filteredLessonIds.length === 0) {
      eduDesContents.value = [];
      return;
    }

    try {
      const requests = filteredLessonIds.map(async (lessonId) => {
        const url = `${apiConfig.eduDesListURl}?lesson_id=${lessonId}`;
        const response = await axios.get(url);
        return response.data;
      });

      const results = await Promise.all(requests);
      eduDesContents.value = results.flat();
      ElMessage.success("获取学科融合成功");
    } catch (error) {
      console.error("An error occurred while fetching eduDesContents:", error);
      eduDesContents.value = [];
      ElMessage.error("获取学科融合失败");
      return;    
    }
  };

  return {
    fetchEduDesContents,
    eduDesContents,
  };
}
