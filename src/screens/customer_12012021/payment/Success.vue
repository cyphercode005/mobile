<template>
    <nb-container>
        <nb-view class="success">
            <image :source="require('../../../../assets/images/success.png')" class="success-image" />
            <nb-text class="success-message">Payment successfull</nb-text>
             <touchable-opacity class="success-button"  :on-press="()=>{trackOrder()}">
                <nb-text class="success-button-text">Track Your Order</nb-text>
            </touchable-opacity>
        </nb-view>
        
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
            this.navigation.dispatch(StackActions.replace({routeName:'OrderDetail', params: {orderId: OrderId} }))
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
    .success-button
    {
        border-width: 1;
        border-color: #eeeeee;
        border-radius: 3;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color:green;
        padding-vertical:4;
        padding-horizontal: 10;
        margin:2.5;

    }
        .success-button-text
    {
         font-size: 12;
        font-family: Montserrat_Medium;
        color: #fff;;

    }
</style>