<template>
    <div class="w-48 rounded-md overflow-hidden shadow bg-white"
         style="border: 1px solid #DCDFE6;">
        <div class="h-8 flex justify-start relative align-middle">
            <input class="w-full bg-transparent px-2 py-4 outline-none border-none focus:outline-none text-sm font-mono font-bold"
                   :placeholder="placeholder"
                   :value="model"
                   @click="onOpen"
                   @blur="onClose"
                   @keydown.prevent>
            <img :src="sort"
                 class="w-6 bg-transparent outline-none border-none">
        </div>
        <ul :class="{ invisible: !collapse }"
            class="absolute w-48 h-fit rounded mt-1 py-2 ring-1 ring-black/5 bg-white z-50 shadow-sm ">
            <li v-for="(option,index) in options"
                :key="index"
                class="px-4 py-2 text-sm font-mono font-bold"
                :style="{ backgroundColor: isSelectd(index) ? '#FEF3C7' : '#FFFFFF',color: isSelectd(index) ? '#8D532C' : '#606266'}"
                @click="onSelect(option,index)">{{ option }}</li>
        </ul>
    </div>
</template>
<script setup>
import { ref } from "vue";
import sort from "../assets/comp-icon/sort-solid.svg";
// v-model
const model = defineModel();

// props
const props = defineProps({
    options: {
        type: Array,
        default: () => [],
    },
    placeholder: {
        type: String,
        default: "Select an option",
    },
});

// emits
const emits = defineEmits(["changed"]);

// represents the state of the options dropdown
const collapse = ref(false);
const selectedIndex = ref(3);

// open selector on click
function onOpen() {
    collapse.value = !collapse.value;
}

// choose an option
function onSelect(selected, index) {
    selectedIndex.value = index;
    emits("changed", selected);
}

// close selector on blur
function onClose() {
    setTimeout(() => {
        collapse.value = false;
    }, 150);
}

function isSelectd(index) {
    return selectedIndex.value === index;
}
</script>
<style src="tailwindcss/tailwind.css" scoped></style>