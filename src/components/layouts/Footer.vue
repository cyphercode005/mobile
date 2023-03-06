<template>
    <nb-footer :style="{height:50}">
        <nb-footer-tab>
            <nb-button :active="navigation.state.routeName == 'Home'" :on-press="()=>handleNavigate('Home')">
                <image :source="require('../../../assets/images/icons/navigation/home.png')" :class="navigation.state.routeName == 'Home' ? 'footer-icon-active' : 'footer-icon'"/>
                <nb-text>Home</nb-text>
            </nb-button>

            <nb-button :active="navigation.state.routeName == 'OrderList'" :on-press="()=>handleNavigate('OrderList')">
                <image :source="require('../../../assets/images/icons/navigation/order.png')" :class="navigation.state.routeName == 'OrderList' ? 'footer-icon-active' : 'footer-icon'" />
                <nb-text>Orders</nb-text>
            </nb-button>

            <nb-button vertical badge :active="navigation.state.routeName == 'Checkout'" :on-press="()=>handleNavigate('Checkout')">
                <nb-badge :style="{height:17, width:17, paddingLeft:0, paddingRight:0, backgroundColor:'#fcbe00'}" v-if="$store.state.cart.cartCount">
                    <nb-text :style="{color:'#FFFFFF', fontSize:9}">{{ $store.state.cart.cartCount }}</nb-text>
                </nb-badge>
                <image :source="require('../../../assets/images/icons/navigation/cart.png')" :class="navigation.state.routeName == 'Checkout' ? 'footer-icon-active' : 'footer-icon'" :style="{marginTop:$store.state.cart.cartCount ? -18 : 0}"/>
                <nb-text>Cart</nb-text>
            </nb-button>

            <nb-button :active="navigation.state.routeName == 'Profile'" :on-press="()=>handleNavigate('Profile')">
                <image :source="require('../../../assets/images/icons/navigation/account.png')" :class="navigation.state.routeName == 'Profile' ? 'footer-icon-active' : 'footer-icon'"/>
                <nb-text>Account</nb-text>
            </nb-button>
        </nb-footer-tab>
    </nb-footer>
</template>

<script>
export default {
    props:{
        navigation: { Object }
    },
    methods: {
        handleNavigate(screen){
            this.navigation.navigate(screen)
        }
    },
}
</script>

<style>
    .footer-icon{
        height:17.5;
        width: 17.5;
        resize-mode: contain;
        margin-bottom: 3.5;
        tint-color: #25282b;
    }
    .footer-icon-active{
        height:17.5;
        width: 17.5;
        resize-mode: contain;
        margin-bottom: 3.5;
        tint-color: #fcbe00;
    }
</style>