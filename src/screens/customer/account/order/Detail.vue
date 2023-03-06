<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" :headerTitle="'Order #'+orderDetail.invoice_prefix+orderDetail.id" />
        <nb-content padder v-model="checkPushNotification">
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
                    <nb-text  class="delivery-status-message">Order {{orderDetail.status}} at {{ orderDetail.statusDate }}</nb-text>
                </nb-view>
                <touchable-opacity :on-press="()=>{navigation.navigate('OrderTrack',{orderId:orderId})}" class="track-order-button">
                    <nb-text class="track-order-text">Track</nb-text>
                </touchable-opacity>
            </nb-view>

            <nb-view v-if="orderDetail.statusId==5" class="rate-now">
                <nb-text v-if="orderDetail.review_rating" class="rating-head">Thank you for your review.</nb-text>
                <nb-text v-else class="rating-head">You haven't rated the order. Review Now</nb-text>
                <star-rating :style="{marginTop:15}"
                    :maxStars=5
                    :rating="orderDetail.review_rating"
                    :starSize=33
                    :disabled="orderDetail.review_rating && orderDetail.statusId"
                    halfStarColor="#fcbe00"
                    fullStarColor="#fcbe00"
                    emptyStarColor="#dfdfdf"
                    :selectedStar="(rating)=>{
                        navigation.navigate('Review',{orderId:orderId,kitchenId:orderDetail.kitchen_id, rating:rating, invoicePrefix:orderDetail.invoice_prefix})
                    }"
                    :starStyle="{marginRight:15}"
                    :containerStyle="{justifyContent:'center', marginBottom:25}"
                />
            </nb-view>
             <!-- :on-press="()=>{ !orderDetail.review_rating ? navigation.navigate('Review',{orderId:orderId,kitchenId:orderDetail.kitchen_id,orderTitle:orderTitle}) : '' }" -->
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
                            <nb-text class="summary-item-total">Paid Via {{orderDetail.paymentMode}}</nb-text>
                        </nb-left>
                        <nb-right class="list-item-right-margin">
                            <nb-text class="summary-item-total">₹{{parseFloat(orderDetail.order_total).toFixed(2)}}</nb-text>
                        </nb-right>
                    </nb-list-item>
                </nb-list>
            </nb-view>
            <nb-view class="order-dispute-section" v-if="orderDetail.cancellationStatus" padder>
                <nb-text class="dispute-head">You have cancelled your order</nb-text>
                <nb-view class="dispute-item">
                    <nb-text class="dispute-label">Cancellation Reason</nb-text>
                    <nb-text class="dispute-description">{{orderDetail.cancelReason.comment}}</nb-text>
                </nb-view>
                <nb-text class="dispute-date">Cancelled on: {{ orderDetail.cancelReason.created_at | moment("MMMM Do YYYY") }}</nb-text>
            </nb-view>
            <nb-view class="order-dispute-section" v-if="orderDetail.rejectStatus" padder>
                <nb-text class="dispute-head">Your order has been rejected</nb-text>
                <nb-view class="dispute-item">
                    <nb-text class="dispute-label">Reject Reason</nb-text>
                    <nb-text class="dispute-description">{{orderDetail.rejectReason.comment}}</nb-text>
                </nb-view>
                <nb-text class="dispute-date">Rejected on: {{ orderDetail.rejectReason.created_at | moment("MMMM Do YYYY") }}</nb-text>
            </nb-view>
        </nb-content>
        <nb-view class="modal-footer">
            <touchable-opacity  :on-press="()=>orderCancel(orderDetail)" class="footer-button-cancel"  v-if="orderDetail.statusId<2">
                <nb-text class="footer-button-text">Cancel Order</nb-text>
                <!-- <image class="footer-button-icon" :source="require('../../../../../assets/images/icons/chevron-right.png')" /> -->
            </touchable-opacity>
            <touchable-opacity  :on-press="()=>{navigation.navigate('KitchenDetail',{kitchenId:orderDetail.kitchen_id})}" class="footer-button">
                <nb-text class="footer-button-text">Kitchen</nb-text>
                <image class="footer-button-icon" :source="require('../../../../../assets/images/icons/chevron-right.png')" />
            </touchable-opacity>
        </nb-view>
        <RBSheet
            ref="orderCancel"
            height="350"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5,
                }
            }"
        >
            <Spinner
                :visible="isLoading"
            />
            <!-- <touchable-opacity :on-press="()=>{ $refs.orderCancel.close()}" class="modal-close">
                <nb-view class="modal-close-icon"></nb-view>
            </touchable-opacity> -->
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Cancel this Order?</nb-text>
                <!-- <nb-text class="modal-header-date">12 Jun 20</nb-text> -->
            </nb-view>
            <nb-content padder v-model="getCancellationReasons">
                <nb-text class="cancel-label">Reason to Cancel</nb-text>
                <nb-view class="picker-container" :style="{zIndex:3000}" v-if="appConfig.platform=='ios'">
                    <DropDownPicker
                        :items="cancellationReasons"
                        :containerStyle="{height: 48}"
                        :style="{backgroundColor: '#fafafa'}"
                        :itemStyle="{
                            justifyContent: 'flex-start',
                        }"
                        :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                        :dropDownStyle="{backgroundColor: '#fafafa',zIndex: 100}"
                        :onChangeItem="(reason)=>{
                            cancellationReason = reason.value.name
                            cancellationReasonId = reason.value.id
                        }"
                    />
                </nb-view>
                <DropDownPicker v-else
                    :items="cancellationReasons"
                    :containerStyle="{height: 40, marginBottom:15}"
                    :style="{backgroundColor: '#fafafa'}"
                    :itemStyle="{
                        justifyContent: 'flex-start', height:30
                    }"
                    :selectedLabelStyle="{fontSize:12, color:'#8c8c8c', fontFamily:'Montserrat_Regular', height:15}"
                    :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                    :dropDownStyle="{backgroundColor: '#fafafa',zIndex: 100}"
                    :onChangeItem="(reason)=>{
                        cancellationReason = reason.value.name
                        cancellationReasonId = reason.value.id
                    }"
                />
                <nb-text v-if="errors.cancellationReason" :style="{color:'red',marginBottom:5, marginTop: -10, fontSize:12}">{{errors.cancellationReason}}</nb-text>
                <nb-text class="comment-label">Remark</nb-text>
                <nb-textarea :on-change-text="(text)=>{cancellationRemarks=text}" :defaultValue="cancellationRemarks" :rowSpan="3" placeholder="Remarks" class="comment-input"/>
                <nb-text v-if="errors.cancellationRemarks" :style="{color:'red',marginBottom:5, fontSize:12}">{{errors.cancellationRemarks}}</nb-text>
            </nb-content> 
            <nb-view class="modal-footer">
                <touchable-opacity class="modal-goback-button" :on-press="()=>{$refs.orderCancel.close()}">
                    <!-- <nb-text></nb-text> -->
                    <!-- <image :source="require('../../../../../assets/images/icons/chevron-left.png')" class="modal-goback-button-icon" /> -->
                    <nb-text class="modal-goback-button-text">Go Back</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-cancel-button" :on-press="()=>{cancelSubmit()}">
                    <!-- <nb-text></nb-text> -->
                    <nb-text class="modal-cancel-button-text">Cancel</nb-text>
                    <!-- <image :source="require('../../../../../assets/images/icons/chevron-right.png')" class="modal-cancel-button-icon" /> -->
                </touchable-opacity>
            </nb-view>
        </RBSheet>
    </nb-container>
</template>

<script>
import {Linking,Platform} from "react-native"
import DropDownPicker from 'react-native-dropdown-picker'
import {Toast} from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        DropDownPicker
    },
    data() {
        return {
            orderId :this.navigation.state.params.orderId,
            orderDetail :'',
            orderFood :'',
            isLoading: false,
            cancellationReasons:[],
            cancellationReason:'',
            cancellationReasonId: '',
            cancellationRemarks: '',
            cancelOrder:'',
            errors: {
                cancellationReason: '',
                cancellationRemarks: '',
                // orderDisputeReason: '',
                // orderDispureRemarks: ''
            },
            pushNotification: this.$store.state.pushNotification.orderDetail
        }
    },
    computed:{
        checkPushNotification(){
            if(this.$store.state.pushNotification.orderDetail){
                this.$store.commit('unsetOrderPushNotification')
            }
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getOrderDetail()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },
    beforeMount() {
        this.getOrderDetail()
    },
    methods: {
        getOrderDetail(){
            this.isLoading = true
            this.orderId = this.navigation.state.params.orderId;
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            console.log('AuthStr')
            console.log(AuthStr)
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
            this.getCancellationReasons()
            return status
        },
        dialPhone(number){
            let phoneNumber = '';
            if (Platform.OS === 'android') { phoneNumber = `tel:${number}`; }
            else {phoneNumber = `telprompt:${number}`; }
            Linking.openURL(phoneNumber);
        },
        getCancellationReasons(){
            console.log('getCancellationReasons')
            this.cancellationReasons = []
            if(this.$store.state.user.loggedIn) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                console.log('getCancellationReasons')
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.getCancellationReasons,
                    headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                })
                .then(response => { 
                    console.log(response.data)
                    response.data.reasons.map((reasonRow) => {
                        this.cancellationReasons.push({label:reasonRow.name, value:{ id:reasonRow.id, name: reasonRow.name }})
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
        orderCancel(order) {
            this.cancelOrder=order; 
            this.$refs.orderCancel.open()
        },
        cancelSubmit(){
            if(!this.cancellationReasonId){
                this.errors.cancellationReason = 'Please select a cancellation reason'
            } else {
                this.errors.cancellationReason = ''
            }
            if(!this.cancellationRemarks){
                this.errors.cancellationRemarks = 'Remarks field is required'
            } else {
                this.errors.cancellationRemarks = ''
            }

            if(!this.errors.cancellationRemarks && !this.errors.cancellationReason){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cancelOrder,
                    data:{
                        order_id:this.cancelOrder.id,
                        reason:this.cancellationReason,
                        reason_id:this.cancellationReasonId,
                        remarks:this.cancellationRemarks
                    },
                    headers: {'Authorization': AuthStr, 'Content-Type': 'application/json' },
                })
                .then(response => { 
                    console.log(response.data);
                    this.$refs.orderCancel.close()
                    Toast.show({
                        text: response.data.success,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                    this.getOrder()
                })
                .catch(error => {
                    console.log(error.response.data);
                    this.$refs.orderCancel.close()
                    Toast.show({
                        text: error.response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                }) 
            }
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
        flex: 1;
        justify-content: flex-end;
        height: 48;
    }
    .footer-button-cancel{
        background-color: #fcbe00;
        padding-horizontal: 15;
        flex-direction: row;
        align-items: center;
        flex: 1;
        justify-content: center;
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
    /* cancel */
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
        color: #000000;
        font-family: Montserrat_Medium;
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

    /* Cancel Modal */

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