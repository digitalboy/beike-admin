<template>
    <div>
        <input type="file" @change="handleFileUpload" accept=".json" />
        <el-table :data="assistants">
            <el-table-column prop="title" label="标题" width="200px"></el-table-column>
            <el-table-column prop="modules" label="内容">
                <template v-slot="{ row }">
                    <div v-html="formatModules(row, 'modules', row.modules)"></div>
                </template>
            </el-table-column>
            <el-table-column label="添加" width="100px">123</el-table-column>
        </el-table>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const assistants = ref([]);

        const handleFileUpload = (event) => {
            const file = event.target.files[0];
            const reader = new FileReader();

            reader.onload = (e) => {
                const data = JSON.parse(e.target.result);

                assistants.value = data
                    .map(item => {
                        let assistant;
                        try {
                            assistant = JSON.parse(item.assistant);
                            return { title: assistant.title, modules: JSON.stringify(assistant.modules) };
                        } catch (error) {
                            console.error('Failed to parse assistant:', item.assistant);
                            return null;
                        }
                    })
                    .filter(item => item !== null);  // 过滤掉解析失败的行
            };

            reader.readAsText(file);
        };

        const formatModules = (row, column, cellValue) => {
            const modules = JSON.parse(cellValue);

            // 这是一个递归函数，它将一个模块对象转化为一个字符串。
            const formatModule = (module, indent = '') => {
                let result = `${indent}${module.id}. `;
                if (module.title) {
                    result += `${module.title}<br>`;
                }
                if (module.desc) {
                    result += `${indent}${module.desc}<br>`;
                }

                if (module.sub) {
                    for (const subModule of module.sub) {
                        // 对于每个子模块，我们增加两个空格的缩进。
                        result += formatModule(subModule, indent + '&nbsp;&nbsp;');
                    }
                }

                return result;
            };

            let result = '';
            for (const module of modules) {
                result += formatModule(module);
            }

            return result;
        };



        return {
            assistants,
            handleFileUpload,
            formatModules,
        };
    }
};
</script>
