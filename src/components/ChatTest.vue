<template>
    <div>
        <textarea v-model="textboxContent"></textarea>
        <button @click="streamData">ASK</button>
    </div>
</template>

<script>

import apiConfig from "@/apicongfig/api.js";
import { ref } from 'vue';
import { fetchEventSource } from '@almars/fetch-event-source';

export default {
    name: 'ChatTest',
    setup() {
        const textboxContent = ref('');
        let eventSource;

        const streamData = async () => {
            eventSource = fetchEventSource(apiConfig.openAIUrl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer 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',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "model": 'gpt-3.5-turbo',
                    "messages": [
                        { "role": 'system', content: '你是一个教师助理。' },
                        { "role": 'user', content: '你好' },
                    ],
                    "temperature": 1,
                    "stream": true
                }),
                onmessage: (event) => {
                    const data = JSON.parse(event.data);
                    const content = data.choices[0].delta.content;
                    textboxContent.value += content;
                },
                onerror: (event) => {
                    console.error("EventSource failed:", event);
                }
            });
        }

        streamData();

        return {
            eventSource,
            textboxContent
        }
    }}
</script>