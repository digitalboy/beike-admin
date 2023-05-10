import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";

export default function useFetchLessons() {
  const lessonList = ref([]);

  const fetchLessons = async (unit_id) => {
    try {
      const response = await axios.get(
        `${apiConfig.lessonListUrl}?unit_id=${unit_id}`
      );
      lessonList.value = response.data;
    } catch (error) {
      console.error("Error fetching lesson data:", error);
    }
  };

  return {
    lessonList,
    fetchLessons,
  };
}
