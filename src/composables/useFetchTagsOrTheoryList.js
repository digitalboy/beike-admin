//filepath and name: /src/composables/useFetchAlltags.js
import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

export default function useFetchTagsOrTheoryList() {
  const allTagsList = ref([]);

  const theoriesList = ref([]);

  const fetchAllTags = async () => {
    ElMessage.warning("正在获取所有标签！");
    try {
      const response = await axios.get(apiConfig.allTagsListUrl);
      allTagsList.value = response.data;
    } catch (error) {
      console.error("Error fetching tags data:", error);
      ElMessage.error("标签获取错误！");
    }
  };

  const fetchTheoriesByTag = async (tagname) => {
    ElMessage.warning("正在获取理论列表！");
    try {
      const response = await axios.get(apiConfig.theoryListByTagUrl, {
        params: {
          tagname: tagname,
        },
      });
      theoriesList.value = response.data;
      console.log("理论：",theoriesList.value);
    
    } catch (error) {
      console.error("Error fetching theories data by tagname:", error);
      ElMessage.error("理论获取错误！");
    }
  };

  return {
    allTagsList,
    fetchAllTags,
    theoriesList,
    fetchTheoriesByTag,
  };
}
