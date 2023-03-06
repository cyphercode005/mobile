<template>
    <nb-container>
        <header :navigation="navigation" />
        <nb-view class="success">
            <image :source="require('../../../../assets/images/success.png')" class="success-image" />
            <nb-text class="success-message">Payment successfull</nb-text>
        </nb-view>
        <touchable-opacity  :on-press="()=>trackOrder()" class="footer-button">
            <nb-text class="footer-button-text">Track Your Order</nb-text>
            <image class="footer-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
        </touchable-opacity>
        <!-- <touchable-opacity class="success-button"  :on-press="()=>{trackOrder()}">
            <nb-text class="success-button-text">Track Your Order</nb-text>
        </touchable-opacity> -->
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            
        }
    },
    
    methods:{
        trackOrder(){
            var orderId=this.navigation.state.params.orderId
            this.navigation.dispatch(StackActions.replace({routeName:'OrderDetail', params: {orderId: orderId} }))
        }
    }

}
</script>

<style>
    .success{
        flex: 1;
        justify-content: center;
        align-content: center;
        align-items: center;
    }
    .success-image{
        width: 100%;
        height: 373;
        resize-mode: contain;
        margin-bottom: 35;
    }
    .success-message{
        font-family: Montserrat_Medium;
        font-size: 16;
        color: #a5a5a5;
    }
    /* Footer Button  */

    .footer-button{
        background-color: #364151;
        padding-horizontal: 15;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
        height: 48;
    }
    .footer-button-text{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #FFFFFF;
    }
    .footer-button-icon{
        width: 8.5;
        height: 14.1;
        margin-left: 12;
    }
</style>