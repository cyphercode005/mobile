<template>
    <view :style="{width:'100%'}">
        <nb-item floatingLabel :error="error" class="input-item">
            <slot />  
        </nb-item>
        <nb-text v-if="error" :style="{color:'red',fontSize:11}">{{msg}}</nb-text>
    </view>
</template>

<script>
export default {
    props:[
        'error', 'msg'
    ]
}
</script>

<style>
    .input-item {
        margin-top: 10;
        margin-bottom: 5;
        /* flex-direction: column; */
        height: 38;
        /* align-items: flex-start; */
    }
</style>

