<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="'Order #'+orderDetails.invoicePrefix+orderDetails.id" :style="{backgroundColor:'#f4f4f4'}"/>
        <nb-content padder v-if="getOrderDetails">
            <nb-view class="order-customer">
                <nb-view class="customer-name-location">
                    <nb-text class="customer-name">{{orderDetails.customer_name}}</nb-text>
                    <nb-view class="customer-location">
                        <image :source="require('../../../../assets/images/icons/location-filled.png')" class="customer-location-icon" />
                        <!-- <nb-text class="customer-location-text">{{$store.state.selectedLocation.address}}</nb-text> -->
                         <nb-text class="customer-location-text">{{orderDetails.address}}</nb-text> 
                    </nb-view>
                </nb-view>
                <touchable-opacity class="customer-call-button" :on-press="()=>dialPhone(orderDetails.customer_phone)">
                    <image :source="require('../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                </touchable-opacity>
            </nb-view>
            <nb-view class="separator"></nb-view>
            <nb-view class="status-date">
                <nb-view :class="(orderDetails.statusId == 1 ? 'status-new' :orderDetails.statusId == 2 ? 'status-packing' :orderDetails.statusId == 3 ? 'status-transit':'status-delivered')">
                    <nb-text class="status-text">{{orderDetails.status}}</nb-text>
                </nb-view>
                <nb-text class="order-number">#{{orderDetails.invoicePrefix+orderDetails.id}}</nb-text>
                <nb-text class="order-time">{{orderDetails.orderTime}}</nb-text>
                <nb-text class="order-date">{{orderDetails.orderDate}}</nb-text>
            </nb-view>
            <nb-view class="delivery-option"> 
                <nb-text class="delivery-option-title">Delivery Option </nb-text>
                
                <nb-text class="delivery-option-name" v-if="orderDetails.delivery_type == 0">Take Away</nb-text>
                <nb-text class="delivery-option-name" v-if="orderDetails.delivery_type == 1">Delivery</nb-text>
                <nb-text class="delivery-option-name" v-if="orderDetails.delivery_type == 2">Delivery Partner</nb-text>
            </nb-view>
            <nb-view  v-for="food in orderFood" :key="food.id">
                 <nb-view  class="order-list-item">
                    <nb-text class="order-item">{{food.name}}</nb-text>
                    <nb-text class="order-item-quantity">{{food.quantity}} X {{ parseFloat(food.price).toFixed(2) }} </nb-text>
                    <nb-text class="order-item-total">{{parseFloat(food.total).toFixed(2)}}</nb-text>
                </nb-view>
                <nb-text class="order-notes">{{food.notes}}</nb-text>
            </nb-view>
            <!-- <nb-text class="order-price">₹{{parseFloat(orderDetails.total).toFixed(2)}}</nb-text> -->
            <nb-view class="separator-2"></nb-view>
            <nb-view class="order-total">
                <nb-text class="order-total-title">Bill total</nb-text>
                <nb-text class="order-total-amount">₹{{parseFloat(orderDetails.order_total).toFixed(2)}}</nb-text>
            </nb-view>
            <nb-view class="separator-2"></nb-view>
            <nb-view class="order-summary">
                <nb-view class="summary-item">
                    <nb-text class="summary-item-title">Item Total</nb-text>
                    <nb-text class="summary-item-desc">{{orderFood.length}} items</nb-text>
                    <nb-text class="summary-item-amount">₹{{parseFloat(orderDetails.total).toFixed(2)}}</nb-text>
                </nb-view>
                <nb-view class="summary-item" v-if="orderDetails.delivery_charge !=0">
                    <nb-text class="summary-item-title">Delivery Charge</nb-text>
                    <nb-text class="summary-item-amount">₹{{ parseFloat(orderDetails.delivery_charge).toFixed(2)}}</nb-text>
                </nb-view>
                <nb-view class="summary-item" v-if="orderDetails.coupon_discount !=0">
                    <nb-text class="summary-item-title">Discount</nb-text>
                    <nb-text class="summary-item-amount">₹{{parseFloat(orderDetails.coupon_discount).toFixed(2)}}</nb-text>
                </nb-view>
            </nb-view>
            <nb-text  v-if="orderDetails.coupon_description !=''" class="summary-item-title">Discount Description: {{orderDetails.coupon_description}}</nb-text>
            <nb-view class="separator-2"></nb-view>
            <nb-view v-if="orderDetails.statusId == 5 && (review && review.rating)" class="order-rating"  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                <nb-text class="rating-head">CUSTOMER RATING</nb-text>
                <star-rating 
                    :style="{}"
                    :maxStars=5
                    :rating=parseFloat(review.rating).toFixed(1)
                    :starSize=30
                    halfStarColor="#fcbe00"
                    fullStarColor="#fcbe00"
                    emptyStarColor="#dfdfdf"
                    :starStyle="{marginRight:15}"
                    :containerStyle="{justifyContent:'center', marginBottom:15}"
                />
                <nb-text class="order-review">{{review.description}}</nb-text>
            </nb-view>
            <nb-view v-if="orderDetails.delivery_type==2" class="delivery-location">
                <MapView 
                    :initialRegion="{
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                        latitudeDelta: 0.00235,
                        longitudeDelta: 0.00102,
                    }"
                    :style="{width:'100%', height:150}">  
                    <Marker 
                        :coordinate=origin 
                        title="Kitchen"> 
                        <image :source="require('../../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>
                    <Marker 
                        :coordinate=destination
                        title="Customer">  
                        <image :source="require('../../../../assets/images/icons/customer-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>

                    <MapViewDirections
                        :origin=origin
                        :destination=destination
                        apikey=AIzaSyDv4tbjxizDdu5cz9alkaGdWZydkkf55BQ
                        :strokeWidth=5
                        strokeColor="grey"
                        optimizeWaypoints=true
                        :onStart="(params) => {
                            console.log(params);
                        }"
                        :onReady="result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                            distance=result.distance +' km';
                            duration=result.duration +' min';
                        }"
                    />
                </MapView>
            </nb-view>

            <nb-view  v-if="orderDetails.delivery_type==2" class="delivery-boy"  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.3,shadowRadius: 1.2}">
                <image :source="require('../../../../assets/images/kitchen/delivery-boy.png')" class="delivery-boy-image"/>
                <nb-view class="delivery-boy-body">
                    <nb-text class="delivery-agent-head">Delivery Agent</nb-text>
                    <nb-text class="delivery-agent-name">{{orderDetails.delivery_partner_name}}</nb-text>
                    <nb-text class="delivery-agent-contact">{{orderDetails.delivery_partner_phone}}</nb-text>
                </nb-view>
                <!-- :on-press="()=>dialPhone(orderDetails.delivery_partner_phone)" -->
                <touchable-opacity class="customer-call-button" :on-press="()=>dialPhone(orderDetails.delivery_partner_phone)">
                    <image :source="require('../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                </touchable-opacity>
            </nb-view>

            <nb-view class="order-dispute-section" v-if="orderDetails.cancellationStatus" padder>
                <nb-text class="dispute-head">You have cancelled your order</nb-text>
                <nb-view class="dispute-item">
                    <nb-text class="dispute-label">Cancellation Reason</nb-text>
                    <nb-text class="dispute-description">{{orderDetails.cancelReason.comment}}</nb-text>
                </nb-view>
                <nb-text class="dispute-date">Cancelled on: {{ orderDetails.cancelReason.created_at | moment("MMMM Do YYYY") }}</nb-text>
            </nb-view>
            <nb-view class="order-dispute-section" v-if="orderDetails.rejectStatus" padder>
                <nb-text class="dispute-head">Your order has been rejected</nb-text>
                <nb-view class="dispute-item">
                    <nb-text class="dispute-label">Reject Reason</nb-text>
                    <nb-text class="dispute-description">{{orderDetails.rejectReason.comment}}</nb-text>
                </nb-view>
                <nb-text class="dispute-date">Rejected on: {{ orderDetails.rejectReason.created_at | moment("MMMM Do YYYY") }}</nb-text>
            </nb-view>
        </nb-content>
        <nb-view v-if="orderDetails.statusId<5"  class="footer-button">
            <touchable-opacity v-if="orderDetails.statusId<2" class="outofstock-button" :on-press="()=> updateOrderStatus(7)">
                <nb-text  class="outofstock-button-text">Out of Stock</nb-text>
            </touchable-opacity>
             <!-- <touchable-opacity  v-if="orderDetails.statusId == 2"  class="packing-button" :on-press="()=>{}">
                <nb-text class="packing-button-text">Packing</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="packing-button-icon" />
            </touchable-opacity> -->

            <touchable-opacity v-if="orderDetails.statusId==1"  :class="(orderDetails.statusId == 1 ? 'packing-button' : orderDetails.statusId == 3 ? 'parcel-ready-button' :'parcel-ready-button')" :on-press="()=> updateOrderStatus(2)">
                <nb-text class="footer-button-text" >{{orderStatus.filter(item=>item.id===orderDetails.statusId+1)[0].name}}</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="footer-button-icon" />
            </touchable-opacity>
            <touchable-opacity v-if="orderDetails.statusId==3 && orderDetails.delivery_type!=2"  :class="(orderDetails.statusId == 1 ? 'packing-button' : orderDetails.statusId == 3 ? 'parcel-ready-button' :'parcel-ready-button')" :on-press="()=> updateOrderStatus(4)">
                <nb-text class="footer-button-text" >{{orderStatus.filter(item=>item.id===orderDetails.statusId+1)[0].name}}</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="footer-button-icon" />
            </touchable-opacity>
            <touchable-opacity v-if="orderDetails.statusId==4 && orderDetails.delivery_type!=2"  :class="(orderDetails.statusId == 1 ? 'packing-button' : orderDetails.statusId == 3 ? 'parcel-ready-button' :'parcel-ready-button')" :on-press="()=> updateOrderStatus(5)">
                <nb-text class="footer-button-text">{{orderStatus.filter(item=>item.id===orderDetails.statusId+1)[0].name}}</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="footer-button-icon" />
            </touchable-opacity>
        </nb-view>
    </nb-container>
</template>

<script>
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import {StackActions, navigationActions} from 'react-navigation'
import { Toast } from 'native-base'
import {Linking,Platform} from "react-native"

export default {
    props: {
        navigation: { Object }
    }, 
    components: {
        MapView,Marker, MapViewDirections
    },
    data() {
        return {
            googleApiKey:'',
            orderId :this.navigation.state.params.orderId,
            orderTitle:'',
            orderDetails :'',
            deliveryDetails: '',
            orderFood :'',
            review:'',
            updateStatus:'', 
            orderStatus:[],    
            destination: {
                     latitude:this.$store.state.selectedLocation.coords.latitude,
                    longitude:  this.$store.state.selectedLocation.coords.longitude,
            },
            origin:{ 
                   latitude:this.$store.state.selectedLocation.coords.latitude,
                    longitude:  this.$store.state.selectedLocation.coords.longitude,
                
            },
            isLoading:false
        }
    },
    methods: {
            dialPhone(number){
                let phoneNumber = '';
                if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
                else {phoneNumber = `telprompt:${number}`; }
                Linking.openURL(phoneNumber);
            },

            updateOrderStatus(orderStatusId){
                this.isLoading=true
                var status = true;
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.updateOrderStatus,
                    data :{order_id:this.orderId,order_status_id:orderStatusId},
                    headers: { 'Content-Type': 'application/json' },    
                })
                .then(response => { 
                    this.isLoading=false
                    this.updateStatus = response.data.status;
                    if(this.updateStatus == true){
                        //  this.navigation.navigate('KitchenHome');
                         this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenHome' }))
                    }
                    else{
                        Toast.show({
                        text: "Something went wrong",
                        duration: 3000
                        });  
                    }         
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error);
                    console.log(error.response.data);  
                }) 
        return status
        },   
    },
    computed:{
        getOrderDetails(){
            var status = true;
            this.isLoading=true
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.orderDetail,
                data :{order_id:this.orderId},
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => {
                this.isLoading=false
                console.log(response.data)
                console.log(response.data.review)   
                this.orderDetails = response.data.order_details;
                this.orderTitle =response.data.order_details.title;
                this.orderFood = response.data.foods;
                this.review = response.data.review;
                this.orderStatus=response.data.orderStatus

                this.destination={
                    latitude:parseFloat(response.data.order_details.shipping_latitude) , longitude:parseFloat(response.data.order_details.shipping_longitude)
                }
                this.origin={ 
                    latitude: parseFloat(response.data.order_details.kitchen_latitude),
                    longitude: parseFloat(response.data.order_details.kitchen_longitude),
                }

            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);  
            }) 
            return status
        },
    },
    beforeMount() {
        this.googleApiKey = this.appConfig.googleApiKey
    },
}
</script>

<style>
    .order-customer{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .customer-name-location{
        flex: 1;
    }
    .customer-name{
        font-family: Montserrat_Bold;
        font-size: 14;
        color: #000000;
        margin-bottom: 6;
    }
    .customer-location{
        flex-direction: row;
        align-items: center;
    }
    .customer-location-icon{
        width: 11;
        height: 15;
        resize-mode: contain;
        margin-right: 8;
    }
    .customer-location-text{
        color: #949494;
        flex: 1;
        font-size: 11;
    }
    .customer-call-icon{
        width: 31;
        height: 28;
        resize-mode:contain;
    }

    .separator{
        margin-top: 10;
        border-bottom-color: #e5e2e2;
        border-bottom-width: 1;
        margin-bottom: 10;
    }
    .separator-2{
        margin-top: 10;
        border-bottom-color: #cccccc;
        border-bottom-width: 1;
        margin-bottom: 10;
    }
    .delivery-option{
        flex-direction: row;
        align-items: center;
        margin-bottom: 10;
    }
    .delivery-option-title{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #949494;
    }
    .delivery-option-name{
        font-family: Montserrat_SemiBold;
        font-size: 16;
        color: #000000;
    }   
    .status-date{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15;
    }
    .status-new{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #04b74c;
        border-radius: 3;
    }
    .status-packing{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #b74c04;
        border-radius: 3;
    }
    .status-transit{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #fcbe00;
        border-radius: 3;
    }
    .status-delivered{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #c0c0c0;
        border-radius: 3;
    }
    .status-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-number{
        color: #949494;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-time{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-date{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-list-item{
        flex-direction: row;
        justify-content: space-between;
    }
    .order-item{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
        flex: 0.5;
    }
    .order-item-quantity{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
        flex: 0.3;
    }
    .order-item-total{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
        flex: 0.2;
        text-align: right;
    }
    .order-notes{
        color: #949494;
        font-size: 10;
        margin-bottom: 5;
    }
    .order-price{
        color: #000000;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-total{
        margin-bottom: 5;
        flex-direction: row;
        justify-content: space-between;
    }
    .order-total-title{
        flex: 3;
        text-align: right;
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #000000;
    }
    .order-total-amount{
        flex: 1;
        text-align: right;
        font-family: Montserrat_SemiBold;
        font-size: 12;
        color: #000000;
    }
    .order-summary{
        margin-bottom: 15;
    }
    .summary-item{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 3;
    }
    .summary-item-title{
        color: #707070;
        font-size: 12;
        flex: 3;
    }
    .summary-item-desc{
        color: #707070;
        font-size: 12;
        flex: 1;
    }
    .summary-item-amount{
        flex: 1;
        text-align: right;
        color: #949494;
        font-size: 12;
    }


    .outofstock-button{
        flex: 1;
        background-color: #FFFFFF;
        justify-content: center;
        align-items: center;
    }
    .outofstock-button-text{
        color: #ff1919;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .packing-button{
        flex: 1;
        background-color: #b74c04;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        padding-horizontal: 15;
    }
    .parcel-ready-button{
        flex: 1;
        background-color: #04b74c;
        justify-content: flex-end;
        align-items: center;
        flex-direction: row;
        padding-horizontal: 15;
    }
    .packing-button-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .packing-button-icon{
        width: 8.5;
        height: 14.1;
        resize-mode: contain;
    }
    .delivery-location{
        margin-top: 20;
    }
    .delivery-boy{
        flex-direction: row;
        justify-content: space-evenly;
        align-items: center;
        padding: 10;
        border-radius: 10;
        elevation: 3;
        background-color: #FFFFFF;
    }
    .delivery-boy-image{
        height: 36;
        width: 36;
        resize-mode: contain;
    }
    .delivery-boy-body{
        align-items: flex-start;
    }
    .delivery-agent-head{
        font-family: Montserrat_Medium;
        font-size: 9;
        color: #565656;
    }
    .delivery-agent-name{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #24272c;
    }
    .delivery-agent-contact{
        font-size: 14;
    }

    /* Rating */

    .order-rating{
        margin-top: 20;
        border-radius: 15;
        padding: 15;
        elevation: 3;
        background-color: #FFFFFF;
    }
    .rating-head{
        font-family: Montserrat_SemiBold;
        font-size: 12;
        color: #24272c;
        margin-bottom: 10;
    }
    .order-review{
        font-size: 12;
        color: #000000;
    }
    
    /* Footer Button  */

    .footer-button{
        flex-direction: row;
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

    /* Order Dispute */

    .order-dispute-section{
        background-color: #FFFFFF;
        elevation: 3;
        border-radius: 8;
        margin-top: 10;
    }
    .dispute-head{
        font-size: 14;
        color: #333333;
        font-family: Montserrat_Medium;
        margin-bottom: 10;
    }
    .dispute-item{
        margin-vertical: 5;
    }
    .dispute-label{
        font-size: 11;
        color: #707070;
        margin-bottom: 2;
    }
    .dispute-description{
        font-size: 13;
        color: #333333;
        font-family: Montserrat_Regular;
    }
    .dispute-date{
        font-size: 10;
        color: #707070;
        font-family: Montserrat_Regular;
        align-self: flex-end;
    }

</style>