<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle=orderTitle />
        <nb-view class="header" padder>
            <nb-view class="header-kitchen">
                <nb-text class="header-title">Kitchen</nb-text>
                <nb-text class="header-name">{{order.kitchen_name}}</nb-text>
            </nb-view>
            <nb-view class="header-time">
                <nb-text class="header-title">Estimated Time</nb-text>
                <nb-text class="header-name">{{ parseInt(duration)}} min</nb-text>
            </nb-view>
        </nb-view>
        <nb-content padder>
             <nb-view v-for="(orderStatus,index) in statusArray"  :key="orderStatus.status.id" :class="orderStatus.current==1?'status-active':orderStatus.history==1?'status-first':'status'">
                 <nb-view class="status-first-left" v-if="orderStatus.current==1&&index==0">
                    <nb-view class="track-second-line-active"></nb-view>
                    <image :source="require('../../../../../assets/images/icons/track-active.png')" class="status-first-active-icon" />
                    <nb-view class="track-line"></nb-view>
                </nb-view>
     
                <nb-view class="status-active-left" v-else-if="orderStatus.current==1&&index!=0">
                    <nb-view class="track-second-line-active"></nb-view>
                    <image :source="require('../../../../../assets/images/icons/track-active.png')" class="status-first-active-icon" />
                    <nb-view class="track-line" v-if="orderStatus.current==1 &&index!=statusArray.length-1"></nb-view>
                </nb-view>
                 <nb-view class="status-first-left" v-else-if="orderStatus.history==1&&index==0">
                    <nb-view class="status-first-icon-active"></nb-view>
                    <nb-view class="track-line-active"></nb-view>
                </nb-view>
                <nb-view class="status-left" v-else-if="orderStatus.history==1">
                    <nb-view class="status-first-icon-active"></nb-view>
                    <nb-view class="track-line-active"></nb-view>
                </nb-view>
                <nb-view class="status-left" v-else-if="index!=statusArray.length-1">
                    <nb-view class="track-line"></nb-view>
                    <nb-view class="status-icon"></nb-view>
                    <nb-view class="track-line"></nb-view>
                </nb-view>
                <nb-view class="status-left" v-else-if="index==statusArray.length-1">
                    <nb-view class="track-line-last"></nb-view>
                    <nb-view class="status-icon"></nb-view>
                </nb-view>
                <nb-view class="status-active-body"  v-if="orderStatus.current==1">
                    <nb-text class="order-active-status">{{orderStatus.status.name}}</nb-text>
                    <nb-text class="order-active-item">{{orderStatus.comment}}</nb-text>
                </nb-view>
                <nb-view class="status-active-right" v-if="orderStatus.current==1">
                    <image :source="require('../../../../../assets/images/menu/chicken-biriyani.png')" class="status-active-image" />
                </nb-view>
                <nb-view class="status-first-inactive"  v-else-if="orderStatus.history==1">
                    <nb-view class="status-first-body">
                        <nb-text class="order-status">{{orderStatus.status.name}}</nb-text>
                        <nb-text class="order-item">{{orderStatus.comment}}</nb-text>
                    </nb-view>
                    <nb-view class="status-first-right">
                        <image :source="require('../../../../../assets/images/menu/chicken-biriyani.png')" class="status-image" />
                    </nb-view>
                </nb-view>
                <nb-view class="status-inactive" v-else>
                    <nb-view class="status-body">
                        <nb-text class="order-status">{{orderStatus.status.name}}</nb-text>
                        <nb-text class="order-item">{{orderStatus.comment}}</nb-text>
                    </nb-view>
                    <nb-view class="status-right">
                        <image :source="require('../../../../../assets/images/menu/chicken-biriyani.png')" class="status-image" />
                    </nb-view>
                </nb-view>
            </nb-view>
                       <nb-view class="status-map">
                <MapView 
                    :initialRegion="{
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }"
                    :style="{width:'100%', height:150, borderBottomLeftRadius:6, borderBottomRightRadius:6}">  
                    <Marker :coordinate=origin 
                        :image="require('../../../../../assets/images/icons/kitchen-icon.png')"
                        title="Kitchen"/> 
                    <Marker 
                        :image="require('../../../../../assets/images/icons/customer-icon.png')"
                        :coordinate=destination title="Customer"/>  
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
          
            <nb-view class="delivery-boy">
                <image :source="require('../../../../../assets/images/kitchen/delivery-boy.png')" class="delivery-boy-image"/>
                <nb-view class="delivery-boy-body">
                    <nb-text class="delivery-agent-head">Delivery Agent</nb-text>
                    <nb-text class="delivery-agent-name">{{deliveryInfo.delivery_partner_name}}</nb-text>
                    <nb-text class="delivery-agent-contact">{{deliveryInfo.delivery_partner_phone}}</nb-text>
                </nb-view>
                <touchable-opacity class="customer-call-button" :on-press="() => dialPhone(deliveryInfo.delivery_partner_phone)">
                    <image :source="require('../../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                </touchable-opacity>
            </nb-view>

              
        </nb-content>
        <touchable-opacity :on-press="()=>{}" class="report-delivery-button">
            <nb-text class="report-delivery-button-text">Report Delivery</nb-text>
        </touchable-opacity>
    </nb-container>
</template>

<script>
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Animated, Easing } from "react-native"
import {Linking,Platform} from "react-native"
import moment from 'moment'

export default {
    props: {
        navigation : { Object },
    },
    components: {
        MapView,Marker, MapViewDirections
    },
    data() {
        return {
            googleApiKey:'',
            orderId :this.navigation.state.params.orderId,
            order :'', 
            orderStatus:'',
            orderHistory:'',
            statusArray:'',
            orderTitle:'',
            deliveryInfo:'',
            distance:'',
            duration:'',      
            destination: {
                latitude:this.$store.state.selectedLocation.coords.latitude,
                longitude:  this.$store.state.selectedLocation.coords.longitude,
            },
            origin:{ 
                latitude: 11.8985895,
                longitude: 75.4619337,
            },
            isLoading: false
        }
    },
        beforeMount(){
        this.googleApiKey = this.appConfig.googleApiKey
        this.orderId=this.navigation.state.params.orderId;
        this.isLoading = true
        if(this.$store.state.user.loggedIn) {
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            this.api.create({
                method: 'POST',
                url: this.api.routes.orderStatus,
                headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                data: {
                    order_id: this.orderId,
                }, 
            })
            .then(response => { 
                console.log(response.data);
                this.order=response.data.order;
                this.deliveryInfo=response.data.delivery;
                this.orderTitle = response.data.order.title;
                this.orderStatus=response.data.orderStatus;
                this.orderHistory=response.data.orderHistory;
                this.statusArray=response.data.statusArray;
                this.destination={
                    latitude:parseFloat(response.data.coordinates.customer_latitude),
                    longitude:parseFloat(response.data.coordinates.customer_longitude)
                }
                this.origin={ 
                    latitude: parseFloat(response.data.coordinates.kitchen_latitude),
                    longitude: parseFloat(response.data.coordinates.kitchen_longitude),
                }
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response);
            }); 
        }
        /* setInterval(() => {
            this.currentTime = new Date()
        }, 30000) */
        return true;
    },
    methods: {
        dialPhone(number){
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        },
        //  fitAllMarkers() {
        //     MapView.fitToCoordinates(MARKERS, {
        //     edgePadding: DEFAULT_PADDING,
        //     animated: true,
        //     });
        // },

   
}
}
</script>

<style>

    /* Header  */

    .header{
        flex-direction: row;
        justify-content: space-between;
    }
    .header-kitchen{
        align-items: flex-start;
    }
    .header-title{
        font-family: Montserrat_Medium;
        font-size: 11;
        color: #24272c;
    }
    .header-name{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #24272c;
    }
    .header-time{
        align-items: flex-end;
    }

    /* Status */

    .status-first-active{
        border-radius: 6;
        flex-direction: row;
        background-color: #FFFFFF;
        elevation: 3;
        padding: 10;
        padding-bottom: 0;
    }
    .status-first-active-left{
        margin-right: 10;
        width: 25;
        align-items: center;
    }
    .status-first-active-icon{
        width: 23;
        height: 23;
        resize-mode: contain;
    }
    .status-first-active-body{
        flex: 1;
    }
    .order-active-status{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #24272c;
        margin-bottom: 3;
    }
    .order-awaiting-confirmation{
        font-size: 10;
        color: #fcbe00;
        margin-bottom: 4;
    }
  
    .status-first-active-right{
        /* flex:2; */
    }
    .status-active-image{
        width: 75;
        height: 75;
        resize-mode: contain;
        border-width: 1;
        border-radius: 6;
        margin-bottom: 10;
    }
    .track-line{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: 1;
        z-index: 9999;
        border-color: #d8d8d8;
    }
    .track-line-active{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: 1;
        z-index: 9999;
        border-color: #50ce56;
    }

    /* Status Inactive */

    .status-first{
        flex-direction: row;
        padding:10;
        padding-right: 0;
    }
    .status-first-left{
        margin-right: 10;
        margin-top:18;
        width: 25;
        align-items: center;
    }
    .status-first-icon{
        width: 5;
        height: 5;
        border-radius: 30;
        resize-mode: contain;
        tint-color: #d8d8d8;
        background-color: #d8d8d8;
    }
    .status-first-icon-active{
        width: 5;
        height: 5;
        border-radius: 30;
        resize-mode: contain;
        tint-color: #50ce56;
        background-color: #50ce56;
    }
    .status-first-inactive{
        flex-direction: row;
        flex: 1;
        padding:10;
        border-radius: 6;
        background-color: #FFFFFF;
        elevation: 3;
        justify-content: space-between;
    }
    .status-first-body{
        flex: 1;
    }
    .order-status{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #24272c;
        margin-bottom: 3;
    }
    .order-awaiting-confirmation{
        font-size: 10;
        color: #fcbe00;
        margin-bottom: 4;
    }
    .order-item{
        font-size: 10;
        color: #24272c;
    }
    .status-first-right{
        /* flex:2; */
    }
    .status-image{
        width: 48;
        height: 48;
        resize-mode: contain;
    }
    
    /* Status Second Inactive */

    .status{
        flex-direction: row;
        padding:10;
        padding-top: 15;
        padding-right: 0;
    }
    .status-left{
        margin-right: 10;
        margin-top: -30;
        width: 25;
        align-items: center;
    }
    .status-icon{
        width: 5;
        height: 5;
        border-radius: 30;
        resize-mode: contain;
        tint-color: #d8d8d8;
        background-color: #d8d8d8;
    }
      .status-icon-active{
        width: 5;
        height: 5;
        border-radius: 30;
        resize-mode: contain;
         tint-color: #50ce56;
        background-color: #50ce56;
    }
    .status-inactive{
        flex-direction: row;
        flex: 1;
        padding:10;
        border-radius: 6;
        background-color: #FFFFFF;
        elevation: 3;
        justify-content: space-between;
    }
    .status-body{
        flex: 1;
    }
    .order-status{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #24272c;
        margin-bottom: 3;
    }
    .order-awaiting-confirmation{
        font-size: 10;
        color: #fcbe00;
        margin-bottom: 4;
    }
    .order-item{
        font-size: 10;
        color: #24272c;
    }
    .status-right{
        /* flex:2; */
    }
    .status-image{
        width: 48;
        height: 48;
        resize-mode: contain;
    }
    .track-line{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: 1;
        z-index: 9999;
        border-color: #d8d8d8;
    }
     .track-line-last{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: .5;
        z-index: 9999;
        border-color: #d8d8d8;
    }
     .track-line-last-active{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: .5;
        z-index: 9999;
        border-color: #50ce56;
    }
     .customer-call-icon{
        width: 31;
        height: 28;
        resize-mode:contain;
    }
    /* Second Status Active */

    .status-active{
        border-radius: 6;
        flex-direction: row;
        background-color: #FFFFFF;
        elevation: 3;
        padding: 10;
        padding-bottom: 0;
    }
    .status-active-left{
        margin-right: 10;
        width: 25;
        margin-top: -25;
        align-items: center;
    }
    .status-active-icon{
        width: 23;
        height: 23;
        resize-mode: contain;
    }
    .status-active-body{
        flex: 1;
       
    }
    .order-active-status{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #24272c;
        margin-bottom: 3;
    }
    .order-awaiting-confirmation{
        font-size: 10;
        color: #fcbe00;
        margin-bottom: 4;
    }
    .order-active-item{
        font-size: 12;
        color: #24272c;
    }
    .status-active-right{
        /* flex:2; */
    }
    .status-active-image{
        width: 75;
        height: 75;
        resize-mode: contain;
        border-width: 1;
        border-radius: 6;
        margin-bottom: 10;
    }
    .track-second-line{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: .5;
        z-index: 9999;
        border-color: #d8d8d8;
        margin-top: -10;
    }
    .track-second-line-active{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: .5;
        z-index: 9999;
        border-color: #50ce56;
        margin-top: -10;
    }

    /* Button */

    .report-delivery-button{
        background-color: #fbfbfb;
        height: 48;
        padding-horizontal: 15;
        align-items: center;
        justify-content: center;
    }
    .report-delivery-button-text{
        font-size: 16;
        font-family: Montserrat_SemiBold;
        color: #000000;
    }

      /* Delivery */

    .delivery-location{
        margin-left:5;
        margin-right:5;
        margin-top: 20;
         border-radius: 6;
          elevation: 3;
          flex-direction: row;
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
</style>