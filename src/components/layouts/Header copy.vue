<template>
    <nb-view :style="{backgroundColor:'transparent'}">
        <nb-header iosBarStyle="light-content" :style="{backgroundColor:'transparent', border:'none', borderShadow:'none', elevation:0, width:'100%'}">
            <nb-left>
                <nb-button transparent :on-press="() => {navigation.goBack()}">
                    <!-- <nb-icon name="back" /> -->
                    <image :source="require('../../../assets/images/icons/arrow-back.png')" class="navigate-back" />
                </nb-button>
            </nb-left>
            <nb-body class="center">
                <nb-title class="navigate-header-text">{{ headerTitle }}</nb-title>
            </nb-body>
        </nb-header>
    </nb-view>
</template>
<script>
export default {
    props:{
        navigation: {
            type: Object,
            required :true
        }, 
        headerTitle: {
            type: String,
            required: false
        }
    }
}
</script>
<style>
    .navigate-back{
        width:17;
        resizeMode:contain;
    }
    .header{
        background-color: transparent;
    }
    .navigate-header-text{
        font-size: 16;
        color: #364151;
        font-family: Montserrat_Bold

;
    }
</style>