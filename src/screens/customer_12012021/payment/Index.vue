<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="Payment Option" />
        <!-- <nb-content> -->
        <web-view :style="{width:'100%'}" :source="{uri:paymentUrl}" 
            :ref="(webview) => console.log(webview)"
            :onMessage="(data) => console.log(data)"
            injectedJavaScript="const meta = document.createElement('meta'); meta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'); meta.setAttribute('name', 'viewport'); document.getElementsByTagName('head')[0].appendChild(meta);"
            :onNavigationStateChange="handleWebViewNavigationStateChange"/>
        <!-- </nb-content> -->
    </nb-container>
</template>

<script>

import { StackActions, NavigationActions } from 'react-navigation'
// import cashFree from '@/plugins/cashfree/index.js'
import { WebView } from 'react-native-webview'
export default {
    props: {
        navigation : { Object }
    },
    components: {
        WebView
    },
    data() {
        return {
            paymentUrl: this.api.paymentUrl+this.navigation.state.params.orderId,
            orderId: this.navigation.state.params.orderId
        }
    },
    methods:{
        handleWebViewNavigationStateChange(newNavState){
            console.log(newNavState)
            // const url = newNavState.url
            // const orderId = this.navigation.state.params.orderId
            

            if(newNavState.url.includes('paymentFailure/'+this.orderId) && !newNavState.loading && newNavState.title=="The Chef - Payment Failed"){
                this.navigation.goBack()
            }
            if(newNavState.url.includes('paymentSuccess/'+this.orderId) && !newNavState.loading && newNavState.title=="The Chef - Payment Success"){
                // console.log(newNavState)
                this.$store.commit('checkout/unsetCoupon');
                this.$store.commit('checkout/unsetDeliveryType');
                this.$store.commit('cart/unsetKitchen');
                this.$store.commit('cart/unsetCart');
                this.$store.commit('checkout/unsetCheckout');

                var routeCount = (this.navigation.dangerouslyGetParent().state.routes).length
                this.navigation.dispatch(StackActions.pop({n:routeCount-1}));
                this.navigation.navigate('Success', {orderId: this.orderId})
            }
            /* if(newNavState.url.includes('webview_abort.html') && !newNavState.loading && newNavState.title=="Process error"){
                // console.log(newNavState)    
                this.navigation.dispatch(StackActions.replace({routeName: 'Payment', params: {status: 'failure', orderId: orderId}}))
            } */
        }
    }
}
</script>

<style>
    .payment-icon{
        width: 22.5;
        height: 22.5;
        resize-mode: contain;
        margin-right: 5;
    }
    .payment-name{
        font-family: Montserrat_Bold;
        font-size: 12;
        color: #242c37;
    }
    .payment-description{
        font-size: 10;
        color: #76848b;
    }
    .payment-list-item{
        border-bottom-width: 0.5;
        border-bottom-color: #f1f1f1;
        margin-right: 15;
    }
        /* Button */

    .footer{
        height: 47;
        flex-direction: row;
        border-top-width: 2;
        border-top-color: #e4e1e1;
    }
    .cart-price{
        padding-horizontal: 15;
        flex:0.8;
        justify-content: center;
    }
    .quantity{
        font-size: 12;
        color: #959595;
    }
    .price{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #554444;
    }
    .proceed-button{
        background-color: #fcbe00;
        border-top-left-radius: 20;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .proceed-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .proceed-button-icon{
        width: 8.5;
        height: 14.1;
    }

</style>