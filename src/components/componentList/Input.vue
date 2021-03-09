<template>
     <input 
        :type=" password ? 'password' : email ? 'email' : 'text'"
        v-bind:value="data" 
        v-on:input="$emit('input',$event.target.value)"
        class="border rounded-lg border-gray-400 text-gray-800 p-2 mr-2" /> 
</template>

<script>
export default {
    name: "Input",
    props : {
        data: String,
        text: Boolean,
        email: Boolean,
        password: Boolean,
    }
}
</script>