<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="'Order #'+order.invoicePrefix+order.id" />
        <nb-view class="header" padder>
            <nb-view class="header-kitchen">
                <nb-text class="header-title">Kitchen</nb-text>
                <nb-text class="header-name">{{order.kitchen_name}}</nb-text>
            </nb-view>
            <nb-view class="header-time">
                <nb-text class="header-title">Estimated Time</nb-text>
                <nb-text class="header-name">{{ parseFloat(duration).toFixed(2) }} min</nb-text>
            </nb-view>
        </nb-view>
        <nb-content padder>
            <nb-view v-for="(orderStatus,index) in statusArray"  :key="orderStatus.status.id" :class="orderStatus.current==1&&statusArray.length-1==index?'status-last-active':orderStatus.current==1?'status-active':orderStatus.history==1?'status-first':'status'" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.3,shadowRadius: 1.2}">
                 <nb-view class="status-first-left" v-if="orderStatus.current==1&&index==0">
                    <!-- <nb-view class="track-second-line-active"></nb-view> -->
                    <image :source="require('../../../../../assets/images/icons/track-active.png')" class="status-first-active-icon" />
                    <nb-view class="track-line"></nb-view>
                </nb-view>
                <nb-view class="status-active-left" v-else-if="orderStatus.current==1 && index!=0">
                    <nb-view class="track-second-line-active" :style="{tintColor: orderStatus.status.id==6 ? '#fb1e1e' : ''}"></nb-view>
                    <image :source="require('../../../../../assets/images/icons/track-active.png')" class="status-first-active-icon" :style="{tintColor: orderStatus.status.id==6 ? '#fb1e1e' : ''}" />
                    <nb-view class="track-line" v-if="orderStatus.current==1 &&index!=statusArray.length-1"></nb-view>
                </nb-view>
                <nb-view class="status-first-left" v-else-if="orderStatus.history==1 && index==0">
                    <nb-view class="status-first-icon-active"></nb-view>
                    <nb-view class="track-line-active"></nb-view>
                </nb-view>
                <nb-view class="status-left" v-else-if="orderStatus.history==1">
                    <nb-view class="track-line-active"></nb-view>
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
                <nb-view class="status-active-body" v-if="orderStatus.current==1&&index==statusArray.length-1">
                    <nb-text class="order-status">{{orderStatus.statusName}}</nb-text>
                    <nb-view>
                        <nb-text class="delivery-agent-head" v-if="order.delivery_type!=0">Delivery Agent</nb-text>
                        <nb-view class="delivery-boy" v-if="order.delivery_type!=0">
                            <image :source="require('../../../../../assets/images/icons/delivery.png')" class="delivery-boy-image"/>
                            <nb-view class="delivery-boy-body">
                                <nb-text class="delivery-agent-name">{{ deliveryInfo.delivery_partner_name }}</nb-text>
                                <nb-text class="delivery-agent-contact">{{ deliveryInfo.delivery_partner_phone }}</nb-text>
                            </nb-view>
                            <touchable-opacity class="customer-call-button" :on-press="() => dialPhone(deliveryInfo.delivery_partner_phone)">
                                <image :source="require('../../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                            </touchable-opacity>
                        </nb-view>
                        <nb-view class="status-map" :style="{marginTop:order.delivery_type!=0 ? undefined : 5}">
                            <MapView 
                                :initialRegion="{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }"
                                ref="mapDirection"
                                :style="{width:'100%', height:150, borderBottomLeftRadius:6, borderBottomRightRadius:6}">  
                                <Marker :coordinate=origin 
                                    title="Kitchen" identifier="origin">
                                    <image :source="require('../../../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                                </Marker>

                                <Marker 
                                    :coordinate=destination title="Customer"
                                    identifier="destination">
                                    <image :source="require('../../../../../assets/images/icons/customer-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
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
                                <!-- $refs.mapDirection.fitToCoordinates([origin,destination], {edgePadding: 
                                            {   top: 50,
                                                right: 50,
                                                bottom: 50,
                                                left: 50}}); -->
                            </MapView>
                        </nb-view>
                    </nb-view>
                </nb-view>
                <nb-view class="status-active-body" v-else-if="orderStatus.current==1 && orderStatus.status.id==4">
                    <nb-text class="order-status">{{orderStatus.statusName}}</nb-text>
                    <nb-view>
                        <nb-text class="delivery-agent-head" v-if="order.delivery_type!=0">Delivery Agent</nb-text >
                        <nb-view class="delivery-boy" v-if="order.delivery_type!=0">
                            <image :source="require('../../../../../assets/images/icons/delivery.png')" class="delivery-boy-image"/>
                            <nb-view class="delivery-boy-body">
                                <nb-text class="delivery-agent-name">{{ deliveryInfo.delivery_partner_name }}</nb-text>
                                <nb-text class="delivery-agent-contact">{{ deliveryInfo.delivery_partner_phone }}</nb-text>
                            </nb-view>
                            <touchable-opacity class="customer-call-button" :on-press="() => dialPhone(deliveryInfo.delivery_partner_phone)">
                                <image :source="require('../../../../../assets/images/icons/call.png')" class="customer-call-icon" />
                            </touchable-opacity>
                        </nb-view>
                        <nb-view class="status-map" :style="{marginTop:order.delivery_type!=0 ? undefined : 5}">
                            <MapView 
                                :initialRegion="{
                                    latitude: destination.latitude,
                                    longitude: destination.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }"
                                ref="mapDirection"
                                
                                :style="{width:'100%', height:150, borderBottomLeftRadius:6, borderBottomRightRadius:6}">  
                                <Marker :coordinate=origin 
                                    title="Kitchen" identifier="origin"> 
                                    <image :source="require('../../../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                                </Marker>
                                <Marker 
                                    :coordinate=destination title="Customer"
                                    identifier="destination">  
                                    <image :source="require('../../../../../assets/images/icons/customer-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
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
                    </nb-view>
                    <!-- <nb-text class="order-active-item" v-else>{{orderStatus.comment}}</nb-text> -->
                </nb-view>
                <nb-view class="status-active-body"  v-else-if="orderStatus.current==1&&orderStatus.status.id!=4">
                    <nb-text class="order-active-status">{{orderStatus.statusName}}</nb-text>
                    <nb-text class="order-active-item">{{orderStatus.comment}}</nb-text>
                </nb-view>
                <nb-view class="status-active-right" v-if="(orderStatus.current==1&&orderStatus.status.id!=4&&index!=statusArray.length-1) || (orderStatus.current==1 && orderStatus.status.id==4 && order.delivery_type==0)">
                    <image :source="statusImages[orderStatus.status.id].icon" class="status-active-image" />
                </nb-view>
                <nb-view class="status-first-inactive"  v-else-if="orderStatus.history==1 && orderStatus.current!=1">
                    <nb-view class="status-first-body">
                        <nb-text class="order-status">{{orderStatus.statusName}}</nb-text>
                        <nb-text class="order-item">{{orderStatus.comment}}</nb-text>
                    </nb-view>
                    <nb-view class="status-first-right">
                        <image :source="statusImages[orderStatus.status.id].icon" class="status-image" />
                    </nb-view>
                </nb-view>
                <nb-view class="status-inactive" v-else-if="orderStatus.current!=1">
                    <nb-view class="status-body">
                        <nb-text class="order-status">{{orderStatus.statusName}}</nb-text>
                        <nb-text class="order-item">{{orderStatus.comment}}</nb-text>
                    </nb-view>
                    <nb-view class="status-right">
                        <image :source="statusImages[orderStatus.status.id].icon" class="status-image" />
                    </nb-view>
                </nb-view>
   
            </nb-view>

            <!-- <nb-view class="status-map">
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
            </nb-view> -->
        </nb-content>
        <touchable-opacity :on-press="()=>{ $refs.reportKitchen.open() }" class="report-delivery-button" >
            <nb-text class="report-delivery-button-text">Report Delivery</nb-text>
        </touchable-opacity>
        <RBSheet
            ref="reportKitchen"
            height="350"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5,
                }
            }"
        >
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Report Delivery</nb-text>
            </nb-view>
            <nb-content padder>
                <nb-text class="cancel-label">Reason to report</nb-text>
                <nb-view class="picker-container" :style="{zIndex:3000}" v-if="appConfig.platform=='ios'">
                    <DropDownPicker
                        :items="reportReasons"
                        :containerStyle="{height: 48}"
                        :style="{backgroundColor: '#fafafa'}"
                        :itemStyle="{
                            justifyContent: 'flex-start'
                        }"
                        :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                        :dropDownStyle="{backgroundColor: '#fafafa'}"
                        :onChangeItem="(reason)=>{
                            reportReason = reason.value.name
                            reportReasonId = reason.value.id
                        }"
                    />
                </nb-view>
                <DropDownPicker v-else
                    :items="reportReasons"
                    :containerStyle="{height: 40, marginBottom:15}"
                    :style="{backgroundColor: '#fafafa'}"
                    :itemStyle="{
                        justifyContent: 'flex-start', height:30
                    }"
                    :selectedLabelStyle="{fontSize:12, color:'#8c8c8c', fontFamily:'Montserrat_Regular', height:15}"
                    :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                    :dropDownStyle="{backgroundColor: '#fafafa'}"
                    :onChangeItem="(reason)=>{
                        reportReason = reason.value.name
                        reportReasonId = reason.value.id
                    }"
                />
                <nb-text v-if="errors.reportReason" :style="{color:'red',marginBottom:5, marginTop: -10, fontSize:12}">{{errors.reportReason}}</nb-text>
                <nb-text class="comment-label">Remark</nb-text>
                <nb-textarea :on-change-text="(text)=>{reportRemarks=text}" :defaultValue="reportRemarks" :rowSpan="3" placeholder="Remarks" class="comment-input"/>
                <nb-text v-if="errors.reportRemarks" :style="{color:'red',marginBottom:5, fontSize:12}">{{errors.reportRemarks}}</nb-text>
            </nb-content> 
            <nb-view class="modal-footer">
                <touchable-opacity class="modal-goback-button" :on-press="()=>{$refs.reportKitchen.close()}">
                    <nb-text class="modal-goback-button-text">Go Back</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-cancel-button" :on-press="()=>{reportKitchen()}">
                    <nb-text class="modal-cancel-button-text">Report</nb-text>
                </touchable-opacity>
            </nb-view>
        </RBSheet>
    </nb-container>
</template>

<script>
import MapView,{Marker} from 'react-native-maps'
import MapViewDirections from 'react-native-maps-directions'
import { Animated, Easing } from "react-native"
import {Linking,Platform} from "react-native"
import moment from 'moment'
import { Toast } from 'native-base'
import DropDownPicker from 'react-native-dropdown-picker'

export default {
    props: {
        navigation : { Object },
    },
    components: {
        MapView,Marker, MapViewDirections,DropDownPicker
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
            duration:25,
            destination: {
                latitude:this.$store.state.selectedLocation.coords.latitude,
                longitude:  this.$store.state.selectedLocation.coords.longitude,
            },
            origin:{ 
                latitude: 11.8985895,
                longitude: 75.4619337,
            },
            isLoading: false,

            reportReasons:[],
            reportReason:'',
            reportReasonId: '',
            reportRemarks: '',
             errors: {
                reportReason: '',
                reportRemarks: '',
                // orderDisputeReason: '',
                // orderDispureRemarks: ''
            },
            statusImages: {
                1: {
                    icon: require('../../../../../assets/images/icons/track/placed.png')
                },
                2: {
                    icon: require('../../../../../assets/images/icons/track/confirmed.png')
                },
                3: {
                    icon: require('../../../../../assets/images/icons/track/packing.png')
                },
                4: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
                5: {
                    icon: require('../../../../../assets/images/icons/track/completed.png')
                },
                6: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
                7: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
                8: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
                9: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
                10: {
                    icon: require('../../../../../assets/images/icons/track/ready.png')
                },
            },
            boxShadow : {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 1.2
            }
        }
    },
    mounted(){
        /* this.$refs.mapDirection.fitToCoordinates([this.origin,this.destination],{ edgePadding: 
            {top: 50,
                right: 50,
                bottom: 50,
                left: 50}
        }) */
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
                console.log(error.response.data);
            }); 
        }
        this.getReportReasons()
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

        getReportReasons(){
            console.log('getReportReasons')
            if(this.$store.state.user.loggedIn) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                console.log('getReportReasons')
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.getReportReasons,
                    headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                })
                .then(response => { 
                    console.log(response.data)
                    response.data.reasons.map((reasonRow) => {
                        this.reportReasons.push({label:reasonRow.name, value:{ id:reasonRow.id, name: reasonRow.name }})
                    })
                })
                .catch(error => {
                    Toast.show({
                        text: response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                }); 
            } 
        },
        reportKitchen(){
            if(!this.reportReasonId){
                this.errors.reportReason = 'Please select a report reason'
            } else {
                this.errors.reportReason = ''
            }
            if(!this.reportRemarks){
                this.errors.reportRemarks = 'Remarks field is required'
            } else {
                this.errors.reportRemarks = ''
            }

            if(!this.errors.reportRemarks && !this.errors.reportReason){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.reportDelivery,
                    data:{
                        kitchen_id:this.order.kitchenId,
                        order_id: this.order.id,
                        reason:this.reportReason,
                        reason_id:this.reportReasonId,
                        remarks:this.reportRemarks
                    },
                    headers: {'Authorization': AuthStr, 'Content-Type': 'application/json' },
                })
                .then(response => { 
                    console.log(response.data);
                    this.reportReason = ''
                    this.reportReasonId = ''
                    this.reportRemarks = ''
                    this.$refs.reportKitchen.close()
                    Toast.show({
                        text: response.data.success,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                })
                .catch(error => {
                    Toast.show({
                        text: error.response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                    console.log(error.response.data);
                }) 
            }
        },
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
        justify-content: space-between;
        align-items: center;
        border-radius: 10;
        background-color: #FFFFFF;
        margin-bottom: 15;
    }
    .delivery-boy-image{
        height: 36;
        width: 36;
        border-radius: 30;
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
    .status-last-active{
        border-radius: 6;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        flex-direction: row;
        background-color: #FFFFFF;
        elevation: 3;
        padding: 10;
        padding-bottom: 0;
    }
    .status-map{
        border-bottom-left-radius: 6;
        border-bottom-right-radius: 6;
        elevation:3;
        margin-bottom: 20;
    }
    .status-canceled-icon{
        tint-color: #50ce56;
    }
    .status-canceled{
        tint-color: #50ce56;
    }

    /* Report Modal */

    .modal-header{
        margin-bottom: 5;
        margin-top: 20;
        padding-horizontal: 13;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .modal-header-title{
        font-size: 16;
        margin-bottom: 2;
        color: #414141;
        font-family: Montserrat_Medium;
    }
    .picker-container{
        margin-bottom: 10;
    }
    .cancel-label{
        font-size: 12;
        color: #000000;
        margin-bottom: 5;
        font-family: Montserrat_Medium;
    }
    .comment-label{
        font-size: 12;
        margin-bottom: 8;
    }
    .comment-input {
        border-width: .8;
        border-color: #d1d1d1;
        border-radius: 4;
        padding: 4;
    }

    /* Footer Button */

    .modal-footer{
        height: 48;
        flex-direction: row;
        justify-content: space-evenly;
        border-top-width: 1;
        border-top-color: #e2e2e2;
    }
    .modal-goback-button{
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .modal-goback-button-text{
        font-size: 14;
        color: #fcbe00;
        font-family: Montserrat_Medium;
    }
    .modal-cancel-button{
        background-color: #fcbe00;
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .modal-cancel-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .modal-goback-button-icon{
        width: 10;
        height: 18.2;
        tint-color: #FFFFFF;
        resize-mode: contain;
    }
    .modal-cancel-button-icon{
        width: 10;
        height: 18.2;
        tint-color: #FFFFFF;
        resize-mode: contain;
    }
</style>