<template>
    <div ref="customDiv">
        <div @click="toggle">
            <slot name="header" />
        </div>

        <div v-if="showPopup" @click.stop>
            <slot name="content" />
        </div>
    </div>
</template>

<script>
import { onMounted, onUnmounted, ref } from 'vue'

const showPopup = ref(false)
const customDiv = ref(null)

const toggle = () => {
    showPopup.value = !showPopup.value
}

const handleClickOutside = (event) => {
    if (customDiv.value && !customDiv.value.contains(event.target)) {
        showPopup.value = false
    }
}
