<template>
    <button class="bg-gray-600 text-white p-2 mt-5 rounded-full w-full">
        {{ title }}
    </button>
</template>

<script>
export default {
    name: 'ButtonLoading',
    props: {
        title: String,
    }
}
</script>