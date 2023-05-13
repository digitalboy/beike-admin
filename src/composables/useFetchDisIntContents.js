import { ref } from "vue";
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

// 修改 useFetchDisIntContents 函数
export default function useFetchDisIntContents() {
    ElMessage.warning("正在获取学科融合数据")
    const disIntContents = ref([]);

    const fetchDisIntContents = async (lessonIds) => {
        // 过滤掉 undefined 值
        const filteredLessonIds = lessonIds.filter(id => id !== undefined);

        if (filteredLessonIds.length === 0) {
            disIntContents.value = [];
            return;
        }

        try {
            const requests = filteredLessonIds.map(async (lessonId) => {
                const url = `${apiConfig.disIntListUrl}?lesson_id=${lessonId}`;
                const response = await axios.get(url);
                return response.data;
            });
            ElMessage.success("获取学科融合数据成功");
            const results = await Promise.all(requests);
            disIntContents.value = results.flat();
            console.log(results);
            console.log(disIntContents.value);
        } catch (error) {
            console.error("An error occurred while fetching disIntContents:", error);
            disIntContents.value = [];
        }
    };

    return {
        fetchDisIntContents,
        disIntContents,
    };
}
