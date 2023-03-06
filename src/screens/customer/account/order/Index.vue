<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Order History" />
        <nb-content>
            <nb-list v-if="orderLists.length>0">
                <nb-list-item v-for="OrderList in orderLists" :key="OrderList.id" avatar noBorder class="order-list-item" button :on-press="()=>{navigation.navigate('OrderDetail',{orderId:OrderList.id})}">
                    <nb-left class="order-left">
                        <image :source="OrderList.image ? {uri:OrderList.image} :require('../../../../../assets/images/menu/chicken-biriyani.png')" class="order-item-image" />
                    </nb-left>
                    <nb-body class="order-body">
                        <nb-view class="order-number-status">
                            <nb-text class="order-number">#{{ OrderList.invoicePrefix+OrderList.id }}</nb-text>
                            <nb-text v-if="OrderList.statusId == '5'" class="order-status-delivered">{{OrderList.statusName}}</nb-text>
                            <nb-text v-else-if="(OrderList.statusId == '4' ||OrderList.statusId == '3' || OrderList.statusId == '2'  || OrderList.statusId == '1')" class="order-status-ongoing">{{OrderList.statusName}}</nb-text>
                            <nb-text v-else class="order-status-cancelled">{{OrderList.statusName}}</nb-text>
                        </nb-view>
                        <nb-text class="kitchen-name">{{OrderList.kitchenName}}</nb-text>
                        <nb-view class="order-price-item">
                            <nb-text class="order-price">₹{{parseFloat(OrderList.total).toFixed(2)}}</nb-text>
                            <nb-text class="order-date">{{OrderList.orderTime}}</nb-text>
                        </nb-view>
                        <nb-view class="order-actions">
                            <nb-view v-if="(!OrderList.isRated && OrderList.statusId==5) || OrderList.isRated">
                                <touchable-opacity :on-press="()=>{ navigation.navigate('Review',{orderId:OrderList.id,kitchenId:OrderList.kitchenId,invoicePrefix:OrderList.invoicePrefix}) }" v-if="!OrderList.isRated && OrderList.statusId==5">
                                    <nb-text class="order-rate-button">Rate Now</nb-text>
                                </touchable-opacity>
                                <star-rating :style="{}" v-if="OrderList.isRated"
                                    :maxStars=5
                                    :rating=OrderList.rating
                                    :starSize=10
                                    halfStarColor="#fcbe00"
                                    fullStarColor="#fcbe00"
                                    emptyStarColor="#dfdfdf"
                                    :starStyle="{marginRight:3}"
                                    :containerStyle="{justifyContent:'center'}"
                                />
                            </nb-view>
                            <touchable-opacity :on-press="()=>{ navigation.navigate('OrderTrack',{orderId:OrderList.id}) }">
                                <nb-text class="order-track-button">Track Order</nb-text>
                            </touchable-opacity>
                            <touchable-opacity :on-press="()=>orderCancel(OrderList)" v-if="OrderList.statusId<2">
                                <nb-text class="order-cancel-button">Cancel Order</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-body>
                </nb-list-item>
               
            </nb-list>
            <nb-view  padder v-else class="no-result">
                <nb-text class="no-result-text">No Orders Found</nb-text>
            </nb-view>
        </nb-content>
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
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Cancel this Order?</nb-text>
            </nb-view>
            <nb-content padder>
                <nb-text class="cancel-label">Reason to Cancel</nb-text>
                <nb-view class="picker-container" :style="{zIndex:3000}" v-if="appConfig.platform=='ios'">
                    <DropDownPicker
                        :items="cancellationReasons"
                        :containerStyle="{height: 48}"
                        :style="{backgroundColor: '#fafafa'}"
                        :itemStyle="{
                            justifyContent: 'flex-start'
                        }"
                        :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                        :dropDownStyle="{backgroundColor: '#fafafa'}"
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
                        justifyContent: 'flex-start', alignItems:'center'
                    }"
                    :selectedLabelStyle="{fontSize:12, color:'#8c8c8c', fontFamily:'Montserrat_Regular', height:15}"
                    :labelStyle="{fontSize:12, color:'#999999', fontFamily:'Montserrat_Regular'}"
                    :dropDownStyle="{backgroundColor: '#fafafa'}"
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
                    <nb-text class="modal-goback-button-text">Go Back</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-cancel-button" :on-press="()=>{cancelSubmit()}">
                    <nb-text class="modal-cancel-button-text">Cancel</nb-text>
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        <footer :navigation="navigation" />
    </nb-container>
</template>

<script>
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
            orderLists: '',
            orderId :'',
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
            isLoading: false,
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getOrders()
                this.getCancellationReasons()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },
    beforeMount() {
        this.getCancellationReasons()
        this.getOrders()
    },
    methods: {
        getOrders(){
            var status = true;
            if(this.$store.state.user.authentication) {
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.orderList,
                        headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr},
                })
                .then(response => { 
                    // console.log(response.data)
                    this.orderLists=response.data.orders;
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                }) 
            }
        },
        orderCancel(order) {
            this.cancelOrder=order;
            this.$refs.orderCancel.open() 
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
                    // console.log(response.data);
                    this.$refs.orderCancel.close()
                    Toast.show({
                        text: response.data.success,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.isLoading = false
                    this.getOrders()
                })
                .catch(error => {
                    this.$refs.orderCancel.close()
                    // console.log(error.response.data);
                    if(error.response){
                        Toast.show({
                            text: error.response.data.error,
                            // buttonText: "Okay",
                            duration: 3000
                        });
                    }
                    this.isLoading = false
                }) 
            }
        },
    },
}
</script>

<style>
    .order-list-item{
        border-bottom-width: 1;
        border-bottom-color: #e8e8e8;
        margin-right: 15;
    }
    .order-left{
        justify-content: center;
        align-items: center;
    }
    .order-item-image{
        width: 75;
        height: 75;
        resize-mode: cover;
        align-self: center;
        margin-right: 0;
    }
    .order-body{
        margin-left: 10;
    }  
    .kitchen-name{
        font-size: 13;
        color: #363636;
        font-family: Montserrat_SemiBold;
        margin-bottom: 3;
    }
    .order-date{
        font-family: Montserrat_Medium;
        font-size: 11;
        color: #7c7c7c;
    }
    .order-price-item{
        flex-direction: row;
        align-items: center;
    }
    .order-price{
        font-family: Montserrat_SemiBold;
        font-size: 13;
        color: #fcbe00;
        margin-right: 30;
    }
    .order-item{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #818080;
        margin-left: 15;
    }
    .order-right{
        justify-content: center;
        align-items: center;
        padding-right: 0;
    }
    .order-status-ongoing{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #FFFFFF;
        background-color: #04b74c;
        padding-horizontal: 10;
        border-radius:5;
        padding-top: 2;
        text-align: center;
        padding-bottom: 2;
        width:75;
    }
    .order-status-delivered{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #04b74c;
        text-align: center;
        background-color: #d9fef0;
        padding-horizontal: 10;
        border-radius:5;
        padding-top: 2;
        padding-bottom: 2;
    }
    .order-status-cancelled{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #fb1e1e;
        background-color: #ffabab;
        padding-horizontal: 10;
        border-radius:5;
        text-align: center;
        padding-top: 2;
        padding-bottom: 2;
    }
    /* no result */
    .no-result{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-top: 30;
    }
    .no-result-text{
        font-size: 14;
        color: #000000;
    }

    /*  */

    .order-number-status{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
    }
    .order-number{
        font-size: 14;
        font-family: Montserrat_SemiBold;
        color: #000000;
    }
    .order-actions{
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 3;
    }
    .order-cancel-button{
        font-size: 12;
        color: #fb1e1e;
        font-family: Montserrat_Medium;
    }
    .order-track-button{
        font-size: 12;
        color: #04b74c;
        font-family: Montserrat_Medium;
    }
    .order-rate-button{
        font-size: 12;
        color: #616161;
        font-family: Montserrat_Medium;
    }

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
</style>