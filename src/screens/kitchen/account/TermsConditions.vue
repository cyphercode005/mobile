<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="Terms and Conditions" />
        <nb-content padder>
            <image class="logo" :source="require('../../../assets/images/kitchen/logo.png')"/>
            <nb-text class="description">{{aboutUs}}</nb-text>
        </nb-content>
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },

    data() {
        return {
            
        }
    },
}
</script>

<style>
    .logo{
        height: 110;
        width: 100%;
        resize-mode: contain;
        margin-top: 10;
        margin-bottom: 50;
    }
    .description{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #364151;
        line-height: 16;
    }
</style>