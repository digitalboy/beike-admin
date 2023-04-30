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
import axios from "axios";

export default {
    name: "HomeComponent",
    data() {
        return {
            selectedOptions: ["", "", ""],
            radioGroups: [],
        };
    },
    async mounted() {
        try {
            const response = await axios.get(
                "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/gettableindex"
            );
            console.log(response);
            this.radioGroups = response.data;
        } catch (error) {
            console.error("Error fetching radio options:", error);
        }
    },
    methods: {
        async sendDataAndRedirect() {
            // 验证是否有未选择的选项
            if (this.selectedOptions.some((option) => option === "")) {
                alert("请确保每组单选按钮都已选择！");
                return;
            }

            // 发送选择的内容到后台
            try {
                const response = await axios.post(
                    "https://www.fastmock.site/mock/049d5f213afce41edfa6e5176afccd3c/adminlogin/startedit",
                    { selectedOptions: this.selectedOptions }
                );
                console.log(JSON.stringify(response.data, null, 2));
                // 页面跳转
                this.$router.push({
                    path: '/ListLesson',
                    query: { selectedOptions: this.selectedOptions.join(',') }
                });
            } catch (error) {
                console.error("Error submitting data:", error);
            }
        },
        async theoriesRedirect() {
            this.$router.push({
                path: '/ListTheory'             
            });

        },
    },
};
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
