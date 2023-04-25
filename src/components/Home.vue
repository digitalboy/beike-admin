<!-- filename:Home.vue -->
<template>
    <div class="home">
        <h1>Welcome to Home Page</h1>
        <el-radio-group v-model="selectedOption">
            <el-radio label="option1">Option 1</el-radio>
            <el-radio label="option2">Option 2</el-radio>
            <el-radio label="option3">Option 3</el-radio>
        </el-radio-group>
    </div>
</template>




<script>
export default {
    name: 'HomeComponent',
    data() {
        return {
            selectedOption: ''
        }
    }
}
</script>

<style scoped></style>
