// filename: /composables/useAddDisintAndEduDes.js
import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ElMessage } from "element-plus";

export async function addDisIntContent(payload) {
  try {
    const response = await axios.post(apiConfig.disIntAddUrl, payload);
    if (response.status === 200) {
      ElMessage.success("学科融合内容添加成功！");
      return true;
    } else {
      // Handle non-success status
      ElMessage.error("添加学科融合内容失败！");
      return false;
    }
  } catch (error) {
    console.error("Error adding dis_int_content:", error);
    ElMessage.error("添加学科融合内容失败！");
    return false;
  }
}

export async function addEduDesContent(payload) {
  try {
    const response = await axios.post(apiConfig.eduDesAddUrl, payload);
    if (response.status === 200) {
      ElMessage.success("教学设计内容添加成功！");
      return true;
    } else {
      // Handle non-success status
      ElMessage.error("添加教学设计内容失败！");
      return false;
    }
  } catch (error) {
    console.error("Error adding edu_des_content:", error);
    ElMessage.error("添加教学设计内容失败！");
    return false;
  }
}
