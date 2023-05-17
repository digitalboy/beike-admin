import axios from "@/apicongfig/tokencheck.js";
import apiConfig from "@/apicongfig/api.js";
import { ref } from "vue";

export default function useCreateChatbot() {
  const createBotStatus = ref("");

  const createChatbot = async (chatbotData) => {
    try {
      const response = await axios.post(apiConfig.creatBotUrl, chatbotData);
      // Handle success
      console.log(response);
      createBotStatus.value = "success";
    } catch (error) {
      // Handle error
      console.error(error);
      createBotStatus.value = "error";
    }
  };

  return {
    createBotStatus,
    createChatbot,
  };
}
