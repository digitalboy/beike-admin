<template>
  <div class="home" id="homepage">
    <div class="radio_container">
      <el-row type="flex" justify="center">
        <el-col :span="24" :sm="18" :md="12" :lg="8" :xl="6">
          <div v-for="(group, index) in radioGroups" :key="group.id">
            <div class="group-container">
              <div class="group-wrapper">
                <h3 class="group-title">{{ group.title }}</h3>
                <el-radio-group v-model="selectedOptions[index]">
                  <el-radio class="slide-in" v-for="(option, optionIndex) in group.options"
                    :key="optionIndex" :label="option.label">
                    {{ option.text }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-button type="primary" @click="sendDataAndRedirect">开始编辑</el-button>
    </div>
    <div style="padding-top: 20px;">
      <el-button type="success" @click="theoriesRedirect">编辑教学理论</el-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios';
import { ElRow, ElCol, ElRadioGroup, ElRadio, ElButton } from 'element-plus';
import { useRouter } from 'vue-router';

export default defineComponent({
    name: "HomeComponent",
    components: {
        ElRow,
        ElCol,
        ElRadioGroup,
        ElRadio,
        ElButton,
    },
    setup() {
        const router = useRouter();
        const selectedOptions = ref(["", "", ""]);
        const radioGroups = ref([]);

        onMounted(async () => {
            try {
                const response = await axios.get(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/gettableindex"
                );
                console.log(response);
                radioGroups.value = response.data;
            } catch (error) {
                console.error("Error fetching radio options:", error);
            }
        });

        const sendDataAndRedirect = async () => {
            if (selectedOptions.value.some((option) => option === "")) {
                alert("请确保每组单选按钮都已选择！");
                return;
            }

            try {
                const response = await axios.post(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/startedit",
                    { selectedOptions: selectedOptions.value }
                );
                console.log(JSON.stringify(response.data, null, 2));
                router.push({
                    path: '/ListLesson',
                    query: { selectedOptions: selectedOptions.value.join(',') }
                });
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        };

        const theoriesRedirect = async () => {
            router.push({
                path: '/ListTheory'
            });
        };

        return {
            selectedOptions,
            radioGroups,
            sendDataAndRedirect,
            theoriesRedirect,
        };
    },
});
</script>

<style scoped>
.group-wrapper {
    position: relative;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 8px;
}

.group-title {
    position: absolute;
    top: -9px;
    left: 15px;
    font-size: 14px;
    background-color: #fff;
    padding: 0 5px;
}

.group-container {
    border: 0px solid #ccc;
    border-radius: 5px;
    padding: 1rem;
    align-items: center;
    margin-bottom: 1rem;
}

.divider-spacing {
    margin-top: 1rem;
}

@keyframes slideIn {
    0% {
        transform: translateX(-100%);
        opacity: 0;
    }

    100% {
        transform: translateX(0);
        opacity: 1;
    }
}

.slide-in {
    animation: slideIn 0.5s forwards;
}
</style>
