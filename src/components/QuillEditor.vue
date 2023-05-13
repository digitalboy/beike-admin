<template>
    <div ref="editor"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import Quill from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";

export default {
    props: {
        content: {
            type: String,
            default: "",
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const editor = ref(null);
        const quill = ref(null);

        onMounted(() => {
            initEditor();
        });

        const initEditor = () => {
            console.log("Props content:", props.content);
            quill.value = new Quill(editor.value, {
                theme: "snow",
                modules: {
                    toolbar: [
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote", "code-block"],
                        [{ header: 1 }, { header: 2 }],
                        [{ list: "ordered" }, { list: "bullet" }],
                        [{ script: "sub" }, { script: "super" }],
                        [{ indent: "-1" }, { indent: "+1" }],
                        [{ direction: "rtl" }],
                        [{ size: ["small", false, "large", "huge"] }],
                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                        [{ font: [] }],
                        [{ color: [] }, { background: [] }],
                        [{ align: [] }],
                        ["clean"],
                    ],
                },
            });

            quill.value.on("text-change", () => {
                const content = quill.value.root.innerHTML;
                emit("update:modelValue", content);
            });

            quill.value.root.innerHTML = props.content;
        };

        return {
            editor,
            quill,
            initEditor,
        };
    },
};
</script>
