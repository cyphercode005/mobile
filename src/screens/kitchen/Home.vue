<template>
    <nb-container padder>
        <StatusBar barStyle="light-content" backgroundColor="#fcbe00"/>
        <Spinner
            :visible="isLoading"
        />
        <StatusBar backgroundColor="#fcbe00" barStyle="dark-content"/>
        <nb-view class="home-header" padder :style="{marginTop: appConfig.platform==='ios'? statusBarHeight : 0}">
            <nb-view class="header-left">
                <nb-text class="header-left-text">Receiving orders</nb-text>
                <nb-switch :value="updateStatus == true ? true : false" :trackColor="{true: '#fcbe00', false: 'grey'}" thumbColor='#FFFFFF' :on-change="()=>getOrderReceivingStatus()"/>
            </nb-view>
            <touchable-opacity  :on-press="()=>{navigation.navigate('KitchenNotification')}">
                <image :source="require('../../../assets/images/kitchen/notification.png')" class="header-notification" />
           </touchable-opacity>
        </nb-view>
        <nb-content>
            <scroll-view  :horizontal=true :showsHorizontalScrollIndicator=false :style="{marginLeft:15, marginBottom:15}" >
                <touchable-opacity :on-press="()=>{}" class="home-status-item">
                    <nb-text class="status-head">TODAY'S INCOME</nb-text>
                    <nb-text class="status-amount">₹{{parseFloat(salesInfo.today_income?salesInfo.today_income:0).toFixed(2)}}</nb-text>
                    <nb-text class="status-order">{{salesInfo.today_orders?salesInfo.today_orders:0}} orders</nb-text>
                </touchable-opacity>
                <touchable-opacity :on-press="()=>{}" class="home-status-item">
                    <nb-text class="status-head">TOTAL INCOME</nb-text>
                    <nb-text class="status-amount">₹{{parseFloat(salesInfo.total_income?salesInfo.total_income:0).toFixed(2)}}</nb-text>
                    <nb-text class="status-order">{{salesInfo.total_orders?salesInfo.total_orders:0}} orders</nb-text>
                </touchable-opacity>
                <!-- <touchable-opacity :on-press="()=>{}" class="home-status-item">
                    <nb-text class="status-head">TODAY'S INCOME</nb-text>
                    <nb-text class="status-amount">₹12,000</nb-text>
                    <nb-text class="status-order">25 orders</nb-text>
                </touchable-opacity> -->
            </scroll-view>
            
                <nb-view  :style="{backgroundColor:'#f4f4f4'}">
                    <nb-tabs ref="homeTab" :tabBarUnderlineStyle="{height:3, marginTop:1}" :onChangeTab="(tab) => {getOrderGroup(tab.ref.props.index)}">
                        <nb-tab heading="All Orders" index="1" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#f4f4f4'}">
                            <PTRView :onRefresh="()=>{getOrderGroup(1)}" >
                                <nb-content padder>
                                    <touchable-opacity :on-press="()=>{ navigation.navigate('KitchenOrderList')}" class="view-order">
                                        <nb-text class="view-order-text">View All Orders</nb-text>
                                    </touchable-opacity>
                                    <nb-view v-if="orders!=''">
                                        <touchable-opacity v-for="order in orders" :key="order.id"  class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:order.id})}">
                                            <nb-view class="order-status-section">
                                                <nb-view :class="(order.statusId == 1 ? 'order-status-new' :order.statusId == 2 ? 'order-status-packing' :order.statusId == 3 ? 'order-status-transit':order.statusId == 4 ? 'order-status-transit': order.statusId == 5 ? 'order-status-delivered' : 'order-status-cancelled' )"> 
                                                    <nb-text class="order-status-text">{{order.statusName}}</nb-text>
                                                </nb-view>
                                    
                                                <nb-text class="order-number">#{{order.invoicePrefix+order.id}}</nb-text>
                                                <nb-text class="order-price">₹{{parseFloat(order.total).toFixed(2)}}</nb-text>
                                            </nb-view>
                                            <nb-view  v-for="food in order.foods" :key="food.id" >
                                                <nb-text class="order-item">{{food.name}}  x {{food.quantity}}</nb-text>
                                                <nb-text class="order-notes">{{food.notes}} </nb-text>
                                            </nb-view>
                                            
                                            <nb-view class="order-date-time">
                                                <nb-text class="order-time">{{order.orderTime}}</nb-text>
                                                <nb-text class="order-date">{{order.orderDate}}</nb-text>
                                                <image :source="require('../../../assets/images/kitchen/3-dots.png')" class="order-detail-icon" />
                                            </nb-view>
                                        </touchable-opacity>
                                    </nb-view>
                                    <nb-view v-else padder class="no-result">
                                        <nb-text class="no-result-text">No Orders Found</nb-text>
                                    </nb-view>
                                </nb-content>
                            </PTRView>
                        </nb-tab>
                        <nb-tab heading="Packing" index="3" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#f4f4f4'}">
                            <PTRView :onRefresh="()=>{getOrderGroup(3)}" >
                                <nb-content v-if="ordersPacking!=''" padder>
                                    <touchable-opacity v-for="packing in ordersPacking" :key="packing.id" class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:packing.id})}">
                                        <nb-view class="order-status-section">
                                            <nb-view class="order-status-packing">
                                                <nb-text class="order-status-text">{{packing.statusName}}</nb-text>
                                            </nb-view>
                                            <nb-text class="order-number">#{{packing.invoicePrefix+packing.id}}</nb-text>
                                            <nb-text class="order-price">₹{{parseFloat(packing.total).toFixed(2)}}</nb-text>
                                        </nb-view>

                                        <nb-view  v-for="foodPacking in packing.foods" :key="foodPacking.id" >
                                            <nb-text class="order-item">{{foodPacking.name}}  x {{foodPacking.quantity}}</nb-text>
                                            <nb-text class="order-notes">{{foodPacking.notes}} </nb-text>
                                        </nb-view>
                        
                                        <nb-view class="order-date-time">
                                            <nb-text class="order-time">{{packing.orderTime}}</nb-text>
                                            <nb-text class="order-date">{{packing.orderDate}}</nb-text>
                                            <image :source="require('../../../assets/images/kitchen/3-dots.png')" class="order-detail-icon" />
                                        </nb-view>
                                    </touchable-opacity>
                                </nb-content>
                                <nb-view v-else padder class="no-result">
                                    <nb-text class="no-result-text">No Orders Found</nb-text>
                                </nb-view>
                            </PTRView>
                        </nb-tab>

                        <nb-tab  heading="Transit" index="4" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#f4f4f4'}">
                            
                            <PTRView :onRefresh="()=>{getOrderGroup(4)}" >
                                <nb-content v-if="ordersTrasit!=''" padder>
                                <touchable-opacity  v-for="transit in ordersTrasit" :key="transit.id" class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:transit.id})}">
                                    <nb-view class="order-status-section">
                                        <nb-view class="order-status-transit">
                                            <nb-text class="order-status-text">{{transit.statusName}}</nb-text>
                                        </nb-view>
                                        <nb-text class="order-number">#{{transit.invoicePrefix+transit.id}}</nb-text>
                                        <nb-text class="order-price">₹{{parseFloat(transit.total).toFixed(2)}}</nb-text>
                                    </nb-view>
                                    
                                    <nb-view  v-for="foodTransit in transit.foods" :key="foodTransit.id" >
                                        <nb-text class="order-item">{{foodTransit.name}}  x {{foodTransit.quantity}}</nb-text>
                                        <nb-text class="order-notes">{{foodTransit.notes}} </nb-text>
                                    </nb-view>
                                
                                    <nb-view class="order-date-time">
                                        <nb-text class="order-time">{{transit.orderTime}}</nb-text>
                                        <nb-text class="order-date">{{transit.orderDate}}</nb-text>
                                        <image :source="require('../../../assets/images/kitchen/3-dots.png')" class="order-detail-icon" />
                                    </nb-view>
                                </touchable-opacity>
                                </nb-content>
                                    <nb-view v-else padder class="no-result">
                                    <nb-text class="no-result-text">No Orders Found</nb-text>
                                </nb-view>
                            </PTRView>
                        </nb-tab>
                        <nb-tab heading="Completed" index="5" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#f4f4f4'}">
                            <PTRView :onRefresh="()=>{getOrderGroup(5)}" >
                                <nb-content  v-if="orderCompleted!=''" padder>
                                    <touchable-opacity  v-for="Completed in orderCompleted" :key="Completed.id" class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:Completed.id})}">
                                        <nb-view class="order-status-section">
                                            <nb-view class="order-status-delivered">
                                                <nb-text class="order-status-text">{{Completed.statusName}}</nb-text>
                                            </nb-view>
                                            <nb-text class="order-number">#{{Completed.invoicePrefix+Completed.id}}</nb-text>
                                            <nb-text class="order-price">₹{{parseFloat(Completed.total).toFixed(2)}}</nb-text>
                                        </nb-view>
                                    <nb-view  v-for="foodCompleted in Completed.foods" :key="foodCompleted.id" >
                                            <nb-text class="order-item">{{foodCompleted.name}}  x {{foodCompleted.quantity}}</nb-text>
                                            <nb-text class="order-notes">{{foodCompleted.notes}} </nb-text>
                                        </nb-view>
                                        <nb-view class="order-date-time">
                                        <nb-text class="order-time">{{Completed.orderTime}}</nb-text>
                                            <nb-text class="order-date">{{Completed.orderDate}}</nb-text>
                                            <image :source="require('../../../assets/images/kitchen/3-dots.png')" class="order-detail-icon" />
                                        </nb-view>
                                    </touchable-opacity>
                                </nb-content>
                                <nb-view v-else padder class="no-result">
                                    <nb-text class="no-result-text">No Orders Found</nb-text>
                                </nb-view>
                            </PTRView>
                        </nb-tab>
                    </nb-tabs>
                </nb-view>
            <!-- </PTRView> -->
        </nb-content> 
        <footer-Kitchen :navigation="navigation"/>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import PTRView from 'react-native-pull-to-refresh'
import { StackActions, NavigationActions } from 'react-navigation'
import { getStatusBarHeight } from 'react-native-status-bar-height';
export default {
    props: {
        navigation: { Object }
    },
    components: {
        PTRView
    },
    data() {
        return {
            bannerImageWidth: (this.appConfig.width - 25) * .59,
            kitchenImageWidth: this.appConfig.width - 30,
            categoryWidth: (this.appConfig.width - 40) / 3,
            search: '',
            orders :'',
            ordersGroups :'',
            ordersPacking :'',
            ordersTrasit :'',
            orderCompleted :'',
            foods :'',
            orderId:'',
            updateStatus :'',
            salesInfo:'',
            isLoading: false,
            statusBarHeight: getStatusBarHeight()
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getOrders()
                this.getSaleInfo()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },
    beforeMount() {
        var routeName = ''
        if(!this.$store.state.kitchen.loggedIn && !this.$store.state.kitchen.verificationStatus && this.$store.state.kitchen.authentication){
            routeName = 'KitchenConfirmOTP'
        } else if(!this.$store.state.kitchen.loggedIn && !this.$store.state.splash){
            routeName = 'KitchenVerify' 
        } else if(this.$store.state.kitchen.loggedIn && !this.$store.state.kitchen.approvalStatus){
            routeName = 'KitchenVerification'
        }
        if(routeName){
            if(routeName=='KitchenConfirmOTP'){
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: routeName, params:{mobile:this.$store.state.kitchen.mobile, otp:''} })]
                })
                this.navigation.dispatch(resetAction);    
            } else if(routeName=='KitchenVerify') {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: routeName })]
                })
                this.navigation.dispatch(resetAction);
            } else {
                this.navigation.dispatch(StackActions.replace({ routeName: routeName }))
            }
        } else {
            this.getOrders()
            this.getSaleInfo()
        }
    },

    methods: {
        getOrders(){
            this.isLoading=true
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.orders,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr  },

            })
            .then(response => { 
                this.isLoading=false
                this.orders=response.data.orders
                console.log(this.orders)
                if(this.orders.length==0)
                    status=false;
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            
            }) 
            return status
        },
        
        getSaleInfo(){
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                        method: 'POST',
                        url: this.api.routes.salesInfo,
                        headers: { 'Content-Type': 'application/json','Authorization':AuthStr  },
                    })
                    .then(response => { 
                    this.salesInfo=response.data.sales;
                    this.updateStatus =response.data.status; 
                    })
                    .catch(error => {
                        console.log(error.response.data);  
                    }) 
            return status
        },
        getOrderGroup(statusID){
            this.isLoading=true
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            console.log(AuthStr);
            if(statusID != 1){
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.orders,
                    data :{status_id:statusID},
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                })
                .then(response => {
                    console.log('gerOrderGroup'); 
                    console.log(response.data);
                    this.isLoading=false
                    if(statusID == 3)
                        this.ordersPacking=response.data.orders;
                    else if(statusID == 4)
                        this.ordersTrasit=response.data.orders;
                    else if(statusID == 5)
                        this.orderCompleted=response.data.orders;
                    
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error.response.data);
                }) 
            } else {
                this.getOrders()
                this.isLoading=false
            }
            return status
        },
        getOrderReceivingStatus(){
            this.isLoading=true
            this.updateStatus = !this.updateStatus
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.updateStatus,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            })
            .then(response => { 
                this.isLoading=false
                this.updateStatus=response.data.status;
                console.log(response.data.status);
                Toast.show({
                    text: "Kitchen Status Updated successfully",
                    duration : 3000
                });
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);  
            }) 
            return status
        },
    },

}
</script>

<style>
    .home-header{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 15;
    }
    .header-left{
        flex-direction: row;
        align-items: center;
    }
    .header-left-text{
        color: #010101;
        font-family: Montserrat_Medium;
        font-size: 12;
        margin-right: 10;
    }
    .header-notification{
        width: 19;
        height: 19;
        resize-mode: contain;
    }

    .home-status-item{
        padding-horizontal: 10;
        padding-vertical: 12;
        border-width: .8;
        border-color: #efefef;
        border-radius: 10;
        margin-right: 15;
        background-color: #f9f9f9;
    }
    .status-head{
        font-family: Montserrat_Medium;
        color: #aaaaaa;
        font-size: 12;
    }
    .status-amount{
        font-family: Montserrat_SemiBold;
        color: #000000;
        font-size: 28;
    }
    .status-order{
        color: #000000;
        font-family: Montserrat_Medium;
        font-size: 16;
    }

    /* Order List */

    .order-list-item{
        background-color: #FFFFFF;
        border-radius: 8;
        padding: 8;
        margin-bottom: 12;
    }
    .order-status-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10;
    }
    .order-status-new{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #04b74c;
        border-radius: 3;
    }
    .order-status-packing{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #b74c04;
        border-radius: 3;
    }
    .order-status-transit{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #fcbe00;
        border-radius: 3;
    }
    .order-status-delivered{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #c0c0c0;
        border-radius: 3;
    }
    .order-status-cancelled{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #ac0312;
        border-radius: 3;
    }
    .order-status-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-number{
        color: #949494;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-price{
        color: #000000;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-item{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
    }
    .order-notes{
        color: #949494;
        font-size: 10;
    }
    .order-date-time{
        margin-top: 8;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
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
    .order-detail-icon{
        height: 5;
        width: 20;
        resize-mode:contain;
    }
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

    .view-order{
        align-self: flex-end;
        /* padding-horizontal: 10; */
        margin-bottom: 10;
    }
    .view-order-text{
        font-size: 12;
        color: #fcbe00;
        font-family: Montserrat_Medium;
    }
</style>