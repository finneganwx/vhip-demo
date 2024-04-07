<script setup>
import { onMounted, ref } from "vue";
import {
    VhipAsst,
    VhipBuilder,
    VhipPrinter,
} from "vhip-easybuild-api/dist/vhip-easybuild-api";
import TailwindSelect from "../components/TailwindSelect.vue";
import TailwindInput from "../components/TailwindInput.vue";

const btnList = ref([
    {
        text: "浏览器打印",
        type: "primary",
        bgColor: "bg-violet-700",
        click: onBrowserPrintBtnClick,
    },
    {
        text: "客户端打印",
        type: "warning",
        bgColor: "bg-orange-600",
        click: onClientPrintBtnClick,
    },
    {
        text: "导出为PDF",
        type: "success",
        bgColor: "bg-sky-600",
        click: onExportToPdf,
    },
    {
        text: "预览",
        type: "success",
        bgColor: "bg-lime-600",
        click: onPreview,
    },
    {
        text: "清空",
        type: "danger",
        bgColor: "bg-red-800",
        click: onClear,
    },
    {
        text: "旋转",
        type: "warning",
        bgColor: "bg-zinc-600",
        click: onRotate,
    },
]);

const batchNum = ref(1);
const scale = ref(100);
const paperTypes = ref([
    ...Array.from({ length: 5 }, (_, i) => {
        return "A" + (i + 1);
    }),
    ...Array.from({ length: 5 }, (_, i) => {
        return "B" + (i + 1);
    }),
]);
const paperType = ref("A4");
const html = ref("");

let hpt = ref({});
const previewDialog = ref(null);

onMounted(() => {
    VhipBuilder.initProviders(undefined, true);
    VhipBuilder.buildElemsByUlist("defaultModule", "#default-elements-box");
    hpt = VhipBuilder.createCoreObj({ settingContainer: "#setting-box" });
    VhipBuilder.design(hpt, "#canvas-box", true);
});

// 浏览器打印（可批量）
function onBrowserPrintBtnClick() {
    // 将batchNum.vaue转换为number
    VhipPrinter.browserPrint(hpt, {}, Number(batchNum.value));
}

// 客户端打印（可批量）
function onClientPrintBtnClick() {
    VhipPrinter.clientPrint(hpt, {}, batchNum.value);
}

function onExportToPdf() {
    VhipPrinter.exportToPDF(hpt, {});
}

function onPreview() {
    html.value = VhipAsst.getPrintHTMLStr(hpt, {});
    previewDialog.value.showModal();
}

function onClear() {
    VhipPrinter.clearCanvas(hpt);
}

function onRotate() {
    VhipPrinter.rotatePaper(hpt);
}

function onScale(direction) {
    if (direction < 0) {
        scale.value -= 20;
    } else if (direction > 0) {
        scale.value += 20;
    } else {
        scale.value = 100;
    }
    VhipPrinter.scaleContent(hpt, scale.value / 100);
}

function onPaperTypeChange(value) {
    paperType.value = value;
    VhipPrinter.setPaperType(hpt, paperType.value);
}
</script>

<template>
    <div>
        <!-- 按钮 -->
        <div class="flex justify-start gap-3">
            <TailwindInput v-model="batchNum"
                           width="10rem"
                           type="number">
                <template #prefix>
                    <span class="text-gray-500 text-sm"> 批量打印 </span>
                </template>
                <template #postfix>
                    <span class="text-gray-500 text-sm"> 份 </span>
                </template>
            </TailwindInput>
            <button class="rounded text-white text-xs font-mono font-bold px-4 py-2"
                    v-for="(item,index) in btnList"
                    :key="index"
                    :class="item.bgColor || 'bg-sky-500'"
                    @click="item.click">
                {{ item.text }}
            </button>
            <TailwindSelect v-model="paperType"
                            :options="paperTypes"
                            @changed="onPaperTypeChange"></TailwindSelect>
            <div class="flex border border-sky-600 rounded">
                <button class="px-3"
                        @click="onScale(-1)"> - </button>
                <button class="px-3 border-x border-sky-600 text-sm "
                        @dblclick="onScale(0)"> {{ scale + '%' }} </button>
                <button class="px-3"
                        @click="onScale(1)"> + </button>
            </div>
        </div>

        <!-- 主体 -->
        <div class="flex gap-4 mt-4 shrink-0">
            <div class="w-[18rem] flex flex-col gap-5">
                <div class="h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">打印设计组件 - Unorder List Build</h1>
                    <div id="default-elements-box"
                         class="elems-box"></div>
                </div>

                <div class="h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">打印设计组件 - HTML Build</h1>
                </div>

                <div class="h-fit rounded border border-violet-300 shadow-md">
                    <h1 class="text-base font-semibold my-2 mx-4">我的元素 - Custom Elements</h1>
                    <div id="my-elems-box"
                         class="elems-box"></div>
                </div>
            </div>
            <div class=" w-9/12 mt-4 p-4 h-full overflow-x-auto">
                <div id="canvas-box"></div>
            </div>
            <div class="w-[24rem] h-fit rounded border border-violet-300 shadow-md ml-auto">
                <h1 class="text-xl font-semibold my-2 mx-4">配置选项</h1>
                <div id="setting-box"></div>
            </div>
        </div>

        <!-- 预览 -->
        <dialog ref="previewDialog"
                class="border rounded-md">
            <div class="flex justify-between items-center py-2 px-1">
                <span class="ml-4 font-bold">预览</span>
                <button class=" px-2 w-10 hover:bg-red-600 hover:text-white hover:rounded-sm"
                        @click="previewDialog.close()"> x </button>
            </div>
            <div style="height: 85vh;background-color: white;overflow: auto;">
                <div v-html="html"
                     style="border: 10px whitesmoke solid;">
                </div>
            </div>
        </dialog>
    </div>
</template>
<style src="../assets/print-elements/elements-list.scss" scoped lang="scss"></style>
<style src="../assets/print-elements/setting-panel.scss" scoped lang="scss"></style>