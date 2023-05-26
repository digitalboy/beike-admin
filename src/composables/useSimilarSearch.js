//
import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

export default function useSimilarSearch() {
  const searchResults = ref([]);

  const similarSearch = async (query, k) => {
    ElMessage.success("正在获取相似搜索数据！");
    try {
      const response = await axios.post(apiConfig.similaSearchUrl, {
        query: query,
        k: k,
      });
      searchResults.value = response.data;
    } catch (error) {
      console.error("Error fetching similar search data:", error);
      ElMessage.error("获取相似搜索数据错误！");
    }
  };

  return {
    searchResults,
    similarSearch,
  };
}
