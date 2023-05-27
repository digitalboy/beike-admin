<template>
    <div>
        <textarea v-model="textboxContent"></textarea>
        <button @click="streamData">ASK</button>
    </div>
</template>

<script>
import { ref } from 'vue';

export default {
    name: 'ChatTest',
    setup() {
        const textboxContent = ref('');
        
        const streamData = async () => {
            const response = await fetch('http://localhost:3000/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "messages": [
                        { "role": 'system', content: '你是一个教师助理。' },
                        { "role": 'user', content: '你好啊！' },
                    ],
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');

            reader.read().then(function processText({ done, value }) {
                if (done) {
                    console.log('Stream finished.');
                    return;
                }

                const result = decoder.decode(value);
                const data = JSON.parse(result);
                const content = data.choices[0].delta.content;
                textboxContent.value += content;

                return reader.read().then(processText);
            });
        }

        return {
            textboxContent,
            streamData
        }
    }
}
</script>
