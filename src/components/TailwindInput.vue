<template>
    <div class="rounded-md overflow-hidden bg-white"
         style="border: 1px solid #BDBDBD;"
         :style="{ width: width }">
        <div class="h-8 flex justify-start align-middle">
            <div class="my-auto mx-2 text-nowrap">
                <slot name="prefix">
                </slot>
            </div>
            <input v-if="type === 'number'"
                   class="w-full bg-transparent px-2 py-4 outline-none border-none focus:outline-none text-sm font-mono font-bold"
                   :placeholder="placeholder"
                   v-model.number="model">
            <input v-else
                   class="w-full bg-transparent px-2 py-4 outline-none border-none focus:outline-none text-sm font-mono font-bold"
                   :placeholder="placeholder"
                   v-model="model">
            <div class="my-auto mr-2">
                <slot name="postfix">
                </slot>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, defineProps, defineModel } from "vue";

const model = defineModel();

const props = defineProps({
    width: {
        type: String,
        default: "fit-content",
    },
    type: {
        type: String,
        default: "default",
        validator: (value) => {
            return ["text", "number", "default"].includes(value);
        },
    },
    placeholder: {
        type: String,
        default: "请输入...",
    },
});
</script>
<style src="tailwindcss/tailwind.css" scoped></style>