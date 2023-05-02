<template>
    <div class="centered-content">
        <div>
            <el-input v-model="theoryname" maxlength="15" placeholder="Please input" show-word-limit type="text" />
        </div>
        <div style="margin: 20px 0" />
        <div>
            <el-input v-model="theorycontent" maxlength="30" placeholder="Please input" show-word-limit type="textarea" />
        </div>
    </div>
</template>

<style scoped>
.centered-content {
  display: flex;
  /* 设置元素为 flex 容器，使其子元素可以使用 flex 布局 */
  justify-content: center;
  /* 在主轴（水平轴）上居中 flex 容器内的所有子元素 */
  align-items: center;
  /* 在侧轴（垂直轴）上居中 flex 容器内的所有子元素 */
  flex-direction: column;
  /* 设置 flex 容器的主轴方向为垂直（列），子元素将沿垂直方向排列 */
  height: 90%;
  /* 设置元素高度为 100%，以使其占据父元素的全部高度 */
  max-width: 1500px;
  margin: 0 auto
}

</style>

<script>
import axios from "axios";
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";
// import { useRouter } from 'vue-router';

export default {
    name: "AddTheory",
    setup() {
        const theoryname = ref("");
        const theorycontent = ref("");

        onMounted(async () => {
            console.clear();
            console.log("start");
            axios
            await fetchData();
        });

        async function fetchData() {
            try {
                const response = await axios.get(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/v1/get/listtheory"
                );
                console.log(response.data)
                ElMessage.success("得到了最新数据！");
            } catch (error) {
                console.log(error);
                ElMessage.error("没有取得数据！");
            }
        }

        return {
            theoryname,
            theorycontent,
        }
    },
}

</script>