<template>
    <button @click="$emit('login-user')" class="bg-blue-400 hover:bg-blue-600 text-white p-2 mt-5 rounded-full w-full">
        {{ title }}
    </button>
</template>

<script>
export default {
    name: 'Button',
    props: {
        title: String,
    }
}
</script>