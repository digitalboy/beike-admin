<template>
    <div>

        <div class="ql-table-icon ql-video" @click="insertTable">
            <img :src="tableIcon" alt="Insert table" />
        </div>
        <div ref="editor" class="editor"></div>

    </div>
</template>




<script>
import Quill from 'quill'
import QuillBetterTable from 'quill-better-table'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.core'
import 'quill-better-table/dist/quill-better-table.css'
import tableIcon from '@/assets/table-icon.svg';
import ImageUploader from "quill-image-uploader";
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import ImageCompress from 'quill-image-compress'

Quill.register({
    'modules/better-table': QuillBetterTable,
    "modules/imageUploader": ImageUploader,
    'modules/imageCompress': ImageCompress
}, true)

const toolbarOptions = [
    ['bold', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'header': [3, 4, false] }],
    [{ 'color': [] }],          // dropdown with defaults
    ['clean'],                                         // remove formatting
    ['link', 'image', 'video']                        // link and image, video
];

export default {
    name: 'QuillBetterTableEditor',
    props: {
        content: {
            type: String,
            default: ''
        }
    },
    mounted() {
        this.quill = new Quill(this.$refs.editor, {
            theme: 'snow',
            modules: {
                toolbar: toolbarOptions,
                table: false,
                'better-table': {
                    operationMenu: {
                        items: {
                            unmergeCells: {
                                text: 'Another unmerge cells name'
                            }
                        }
                    }
                },

                imageCompress: {
                    quality: 0.7, // default
                    maxWidth: 500, // default
                    maxHeight: 500, // default
                    imageType: 'image/jpeg, image/png', // default
                    debug: true, // default
                },

                imageUploader: {
                    
                    upload: file => {
                        return new Promise((resolve, reject) => {
                            const formData = new FormData();
                            formData.append("image", file);
                            console.log("uploads img");
                            fetch(`${process.env.VUE_APP_API_BASE_URL}/uploadimg`, { // 修改这里
                                method: "POST",
                                mode: "cors",
                                body: formData
                            })
                                .then(response => response.json())
                                .then(result => {
                                    console.log("path:", result.path)
                                    resolve(`${result.path}`); // 修改这里
                                })
                                .catch(error => {
                                    reject("Upload failed");
                                    console.error("Error:",error);
                                });
                        });
                    }
                },
                keyboard: {
                    bindings: QuillBetterTable.keyboardBindings
                }
            }
        })
        this.quill.root.innerHTML = this.content;
        this.quill.on('text-change', () => {
            this.$emit('update:content', this.quill.root.innerHTML);
        });
    },
    watch: {
        content(newContent) {
            if (this.quill.root.innerHTML !== newContent) {
                this.quill.root.innerHTML = newContent;
            }
        }
    },
    methods: {
        insertTable() {
            const tableModule = this.quill.getModule('better-table')
            tableModule.insertTable(3, 3)
        }
    },
    data() {
        return {
            tableIcon: tableIcon
        };
    }
}
</script>


<style scoped>
.ql-editor {
    line-height: 2 !important;
}


.ql-table-icon {
    position: relative;
    right: -780px;
    /* 根据需要调整位置 */
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    /* 根据需要调整大小 */
    height: 20px;
    cursor: pointer;
}
</style>
