<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="'Order #'+orderDetail.invoice_prefix+orderDetail.id" />
        <nb-content padder>
            <nb-view class="order-address">
                <nb-view class="address-left">
                    <nb-view class="address-icon-background">
                        <image :source="require('../../../../../assets/images/icons/dish.png')" class="address-icon" />
                    </nb-view>
                    <nb-view class="address-line"></nb-view>
                </nb-view>
                <nb-view  class="address-body">
                    <nb-text class="address-title">{{orderDetail.kitchen_name}}</nb-text>
                    <nb-text class="address-detail">{{orderDetail.kitchen_address_1}}, {{orderDetail.kitchen_address_2}}, {{orderDetail.kitchen_city}}</nb-text>
                
                </nb-view>
                 <touchable-opacity class="customer-call-button" :on-press="() => dialPhone(orderDetail.kitchen_phone)">
                    <image :source="require('../../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                </touchable-opacity>
            </nb-view>
            <nb-view class="order-address">
                <nb-view class="address-left">
                    <nb-view class="address-icon-background">
                        <image :source="require('../../../../../assets/images/icons/pin.png')" class="address-icon" />
                    </nb-view>
                </nb-view>
                <nb-view  class="address-body"  >
                    <nb-text class="address-title">Your Location</nb-text>
                    <nb-text class="address-detail">{{orderDetail.shipping_address_1}}, {{orderDetail.shipping_address_2}}, {{orderDetail.shipping_city}}</nb-text>
                </nb-view>
            </nb-view>
            <nb-view class="separator"></nb-view>
            <nb-view class="order-track">
                <nb-view class="delivery-status">
                    <nb-view class="delivery-status-background">
                        <image :source="require('../../../../../assets/images/icons/calendar.png')" class="delivery-status-icon" />
                    </nb-view>
                    <nb-text  class="delivery-status-message">Order {{orderDetail.status}} on {{ orderDetail.statusDate | moment("d-MM-YYYY h:mm:ss a") }}</nb-text>
                </nb-view>
                <touchable-opacity :on-press="()=>{navigation.navigate('OrderTrack',{orderId:orderId})}" class="track-order-button">
                    <nb-text class="track-order-text">Track</nb-text>
                </touchable-opacity>
            </nb-view>

            <touchable-opacity v-if="orderDetail.statusId==4" :on-press="()=>{ !orderDetail.review_rating ? navigation.navigate('Review',{orderId:orderId,kitchenId:orderDetail.kitchen_id,orderTitle:orderTitle}) : '' }" class="rate-now">
                <nb-text v-if="orderDetail.review_rating" class="rating-head">Thank you for your review.</nb-text>
                <nb-text v-else class="rating-head">You haven't rated the order. Review Now</nb-text>
                <star-rating :style="{marginTop:15}"
                    :maxStars=5
                    :rating=orderDetail.review_rating
                    :starSize=33
                    :disabled=true
                    halfStarColor="#fcbe00"
                    fullStarColor="#fcbe00"
                    emptyStarColor="#dfdfdf"
                    :selectedStar="(rating)=>onStarRatingPress(rating)"
                    :starStyle="{marginRight:15}"
                    :containerStyle="{justifyContent:'center', marginBottom:25}"
                />
            </touchable-opacity>
            <!-- <nb-view class="order-actions">
                <touchable-opacity :on-press="()=>{navigation.navigate('OrderTrack',{orderId:orderId})}" class="track-order-button">
                    <nb-text class="track-order-text">Track Order</nb-text>
                </touchable-opacity>
                <touchable-opacity :on-press="()=>{navigation.navigate('Review',{orderId:orderId,kitchenId:orderDetail.kitchen_id,orderTitle:orderTitle})}" class="rate-order-button" >
                    <nb-text  class="track-order-text" >Rate Order</nb-text>
                </touchable-opacity>
            </nb-view> -->
            <!-- <nb-list >
                <nb-list-item noBorder class="summary-item">
                    <nb-left>
                        <nb-view class="track-order-button" v-if="orderDetail.delivery_type==1">
                            <nb-text  class="track-order-text" >Take Away</nb-text>
                        </nb-view>
                        <touchable-opacity  v-else :on-press="()=>{navigation.navigate('OrderTrack',{orderId:orderId})}" class="track-order-button" >
                            <nb-text  class="track-order-text" >Track Order</nb-text>
                        </touchable-opacity></nb-left>
                        <nb-right class="list-item-right-margin">
                            <touchable-opacity :on-press="()=>{navigation.navigate('Review',{orderId:orderId,kitchenId:orderDetail.kitchen_id,orderTitle:orderTitle})}" class="rate-order-button" >
                            
                            <nb-text  class="track-order-text" >Rate Order</nb-text>
                        </touchable-opacity>
                    </nb-right>
                </nb-list-item>
            </nb-list> -->
            <nb-view class="order-items">
                <nb-text class="order-items-head">Menu Details</nb-text>
                <nb-list v-for="menu in orderFood" :key="menu.id" >
                    <nb-list-item noBorder class="order-item">
                        <nb-left>
                            <nb-text class="order-item-head">{{menu.name}}  {{menu.quantity}}  x  {{parseFloat(menu.price).toFixed(2)}}</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="order-item-price">₹{{parseFloat(menu.total).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                </nb-list>
            </nb-view>
            
            <nb-view class="separator"></nb-view>
            <nb-view class="order-summary">
                <nb-text class="summary-head">Bill Details</nb-text>
                <nb-list >
                    <nb-list-item noBorder class="summary-item">
                        <nb-left>
                            <nb-text class="summary-item-head">Item Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-price">₹{{parseFloat(orderDetail.total).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="summary-item" v-if="orderDetail.coupon_discount>0">
                        <nb-left>
                            <nb-text class="summary-item-head">Coupon Discount</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-price">₹{{parseFloat(orderDetail.coupon_discount).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="summary-item" v-if="orderDetail.delivery_charge>0">
                        <nb-left>
                            <nb-text class="summary-item-head">Delivery Charge</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-price">₹{{parseFloat(orderDetail.delivery_charge).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                    <nb-list-item noBorder class="summary-item">
                        <nb-left>
                            <nb-text class="summary-item-head">Total</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-price">₹{{parseFloat(orderDetail.order_total).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>

                    <nb-view class="separator"></nb-view>
                    <nb-list-item noBorder class="summary-item">
                        <nb-left>
                            <nb-text class="summary-item-total">Paid Via {{orderDetail.payment_type}}</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-total">₹{{parseFloat(orderDetail.order_total).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                </nb-list>
            </nb-view>
        </nb-content>
        <touchable-opacity  :on-press="()=>{navigation.navigate('KithenDetail',{kitchenId:orderDetail.kitchen_id})}" class="footer-button">
            <nb-text class="footer-button-text">Kitchen</nb-text>
            <image class="footer-button-icon" :source="require('../../../../../assets/images/icons/chevron-right.png')" />
        </touchable-opacity>
    </nb-container>
</template>

<script>
import {Linking,Platform} from "react-native"
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            orderId :this.navigation.state.params.orderId,
            orderDetail :'',
            orderFood :'',
            isLoading: false
        }
    },
    beforeMount() {
        this.isLoading = true
        this.orderId = this.navigation.state.params.orderId;
        const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
        var status = true;
        this.api.create({
            method: 'POST',
            url: this.api.routes.orderDetail,
            data :{order_id:this.orderId},
            headers: { 'Content-Type': 'application/json',
                'Authorization':AuthStr},  
        })
        .then(response => { 
            console.log(response.data)
            this.orderDetail = response.data.order_details;
            this.orderFood = response.data.foods;
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data);
        }) 
        return status
    },
    methods: {
        dialPhone(number){
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        },
    }
}
</script>

<style>
    .order-address{
        flex-direction: row;
    }
    .address-left{ 
        flex:1;
        /* align-items: center; */
    }
    .address-icon-background{
        background-color: #fcbe00;
        height: 26;
        width: 26;
        justify-content: center;
        align-items: center;
        border-radius: 30;
    }
    .address-icon{
        height: 17;
        width: 17;
        resize-mode: contain;
    }
    .address-line{
        height: 36;
        border-style: dashed;
        border-left-color: #ffe8a2;
        border-left-width: 1;
        margin-left: 13;
    }
    .address-body{
        flex:8;
    }
    .address-title{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #000000;
    }
    .address-detail{
        font-size: 13;
        color: #585858;
    }

    .separator{
        border-bottom-width: 1;
        border-bottom-color: #f1f1f1;
        margin-vertical: 10;
    }
    .delivery-status{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .delivery-status-background{
        width: 26;
        height: 26;
        background-color: #f1f1f1;
        border-radius: 30;
        justify-content: center;
        align-items: center;
        margin-right: 13;
    }
    .delivery-status-icon{
        height: 15;
        width: 15;
        resize-mode:contain;
    }
    .delivery-status-message{
        font-size: 12; 
        flex: 1;
        color: #484848;
    }

    /* Summary */
    .summary-head{
        font-size: 16;
        color: #333333;
        font-family: Montserrat_SemiBold;
    }
    .summary-item{
        margin-left:0; 
        padding-bottom: 5;
        padding-top:10;
        margin-bottom: -3;
    }
    .summary-item-head, .summary-item-price{
        font-size: 12;
        color: #000000;
        font-family: Montserrat_Medium;
    }
    .summary-item-total{
        font-family: Montserrat_SemiBold;
        font-size: 16;
        padding-top: 0;
        margin-top: -8;
        padding-bottom: 5;
        color: #333333;
    }

    .list-item-right-margin{
        margin-right: -15;
    }

    /* Order Items */

    .order-items-head{
        font-size: 16;
        color: #333333;
        font-family: Montserrat_SemiBold;
   
    }
    .order-item{
        margin-left:0; 
        padding-bottom: 5;
        padding-top:5;
        margin-bottom: -3;
    }
    .order-item-head{
        font-size: 12;
        color: #000000;
        font-family: Montserrat_Medium;
    }
    .order-item-price{
        font-size: 14;
        color: #000000;
        font-family: Montserrat_Medium;
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
    .order-track{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20;
    }
    .order-actions{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20;
    }
    .track-order-button{
        background-color: #fcbe00;
        padding-vertical: 5;
        border-radius: 8;
        padding-horizontal: 15;
        margin-left: 10;
    }
    .rating-head{
        font-size: 12;
        font-family: Montserrat_SemiBold;
        color: #585858;
        align-self: center;
        text-align: center;
        margin-bottom: 15;
        margin-top: 5;
    }
    .rate-order-button{
        background-color: #fcbe00;
        border-radius: 20;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        height: 26;
    }
    .summary-item{
        margin-left:0; 
        padding-bottom: 5;
        padding-top:5;
        margin-bottom: 0;
    }
    .track-order-text {
         font-size: 12;
        color: #fff;
        font-family: Montserrat_SemiBold;

    }
    .customer-call-icon{
        width: 31;
        height: 28;
        resize-mode:contain;
    }
</style>