<template>
    <div class="centered-content">
        <el-text size="large" tag="b" class="mx-1" type="primary">添加理论</el-text>
        <div style="margin: 20px" />
        <div class="input-group">
            <el-text class="label">作者（如果没有可以留空）</el-text>
            <el-input v-model="theoryAuthor" maxlength="50" placeholder="Please input" show-word-limit type="text" />
        </div>
        <div style="margin: 20px 0" />
        <div class="input-group">
            <el-text class="label">内容</el-text>
            <el-input v-model="theoryContent" maxlength="2000" :rows="10" placeholder="Please input" show-word-limit
                type="textarea" />
        </div>
        <div class="tag-card">
             <el-text class="label">请根据实际内容调整标签</el-text>
            <el-card class="box-card">
                <div>
                    <el-tag v-for="tag in dynamicTags" :key="tag" class="mx-1" closable :disable-transitions="false"
                        @close="handleClose(tag)">
                        {{ tag }}
                    </el-tag>
                    <el-input v-if="inputTagVisible" ref="InputTagRef" v-model="inputTagValueModel" class="ml-1 w-20"
                        size="small" @keyup.enter="handleInputConfirm" @blur="handleInputConfirm" />
                    <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput">
                        + New Tag
                    </el-button>
                </div>
            </el-card>
        </div>
        <div>
            <div class="submit-button" style="padding-top: 20px;">
                <el-button type="primary" @click="addNewTheory">新增新理论</el-button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.tag-card {
    width: 80%;
}

.centered-content {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 90%;
    max-width: 1500px;
    margin: 0 auto
}

.input-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    width: 80%;
}

.label {
    margin-bottom: 10px;
}
</style>

<script>
import apiConfig from "@/apicongfig/api.js";
import axios from "@/apicongfig/tokencheck.js";
import { ref, onMounted, nextTick } from "vue";
import { ElMessage, ElTag, ElInput } from "element-plus";

export default {
    name: "AddTheory",
    components: {
        ElInput,
        ElTag
    },
    setup() {
        const theoryContent = ref("");
        const theoryAuthor = ref("");
        const inputTagValueModel = ref('')
        const dynamicTags = ref(['教育理论', '知识理论', '教学理论', '心理学', '认知科学', '课堂技巧','教师素养'])
        const inputTagVisible = ref(false)
        const InputTagRef = ref(null)

        const addNewTheory = async () => {
            if (!theoryContent.value || !dynamicTags.value) {
                ElMessage.error('内容和标签不能为空');
                return;
            }
            try {
                let theoryData = {
                    theory_content: theoryContent.value,
                    author: theoryAuthor.value,
                    tags: dynamicTags.value.map(tag => ({ tagname: tag })),                    
                };
                console.log(theoryData);
                const response = await axios.post(apiConfig.theoryAddUrl, theoryData);
                console.log(response);

                if (response.status === 200 && response.data.theory_id) {
                    ElMessage.success('理论已成功提交');
                    resetForm();
                } else {
                    ElMessage.error(
                        response.data.message || '提交失败，请重试'
                    );
                }
            } catch (error) {
                console.error('提交出错:', error);
                ElMessage.error('提交失败，请重试');
            }
        };

        const resetForm = () => {
            theoryAuthor.value = "";
            theoryContent.value = "";
        };

        const handleClose = (tag) => {
            dynamicTags.value.splice(dynamicTags.value.indexOf(tag), 1)
        };

        const showInput = () => {
            inputTagVisible.value = true;
            nextTick(() => {
                InputTagRef.value.input.focus();
            });
        };

        const handleInputConfirm = () => {
            if (inputTagValueModel.value) {
                dynamicTags.value.push(inputTagValueModel.value);
            }
            inputTagVisible.value = false;
            inputTagValueModel.value = '';
        };

        onMounted(async () => {
            console.clear();
            console.log("start");
        });

        return {
            theoryContent,
            addNewTheory,
            resetForm,
            theoryAuthor,
            handleClose,
            showInput,
            handleInputConfirm,
            inputTagVisible,
            inputTagValueModel,
            dynamicTags,
            InputTagRef
        };
    },
};
</script>