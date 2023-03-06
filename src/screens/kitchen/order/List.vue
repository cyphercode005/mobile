<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="All Orders"/>
        <nb-content padder :contentContainerStyle="{flexGrow: 1, width:'100%',backgroundColor:'#f4f4f4'}" :automaticallyAdjustContentInsets="true">
            <DropDownPicker
                :items="orderStatuses"
                :containerStyle="{height: 40, width:150, marginBottom:15, }"
                :style="{borderWidth:0, paddingHorizontal:10, }"
                :itemStyle="{
                    justifyContent: 'flex-start'
                }"
                :defaultValue="filter"
                :labelStyle="{color:'#000000', fontSize:13, fontFamily:'Montserrat_Medium'}"
                :placeholderStyle="{color:'#000000', fontSize:13, fontFamily:'Montserrat_Medium'}"
                :showArrow=true
                placeholder="Filter"
                :dropDownStyle="{backgroundColor: '#FFFFFF'}"
                :onChangeItem="(item)=>{
                    selectCategory(item)
                }"
            />
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
                        <image :source="require('../../../../assets/images/kitchen/3-dots.png')" class="order-detail-icon" />
                    </nb-view>
                </touchable-opacity>
            </nb-view>
            <nb-view v-else padder class="no-result">
                <nb-text class="no-result-text">No Orders Found</nb-text>
            </nb-view>
        </nb-content>
        <footer-Kitchen :navigation="navigation"/>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import DropDownPicker from 'react-native-dropdown-picker';
export default {
    props: {
        navigation: { Object }
    },
    components: {
        DropDownPicker
    },
    data() {
        return {
            bannerImageWidth: (this.appConfig.width - 25) * .59,
            kitchenImageWidth: this.appConfig.width - 30,
            categoryWidth: (this.appConfig.width - 40) / 3,
            orders :'',
            isLoading: false,
            orderStatuses:[
                {label: 'Placed', value: 1},
                {label: 'Confirmed', value: 2},
                {label: 'Packing', value: 3},
                {label: 'Ready', value: 4},
                {label: 'Completed', value: 5},
                {label: 'Cancelled', value: 6},
                {label: 'Out of Stock', value: 7},
                {label: 'Refunded', value: 8},
                {label: 'Delivery Failed', value: 9},
                {label: 'Failed', value: 10}
            ],
            filter:'',
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getOrders()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },
    beforeMount() {
        this.getOrders()
    },

    methods: {
        getOrders(){
            this.isLoading=true
            var status = true;
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getAllOrders,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr  },
            })
            .then(response => { 
                this.orders=response.data.orders
                this.isLoading=false
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            }) 
            return status
        },

        selectCategory(item) {
            this.isLoading = true
            this.filter = item.value
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);       
                this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getAllOrders,
                headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
                data:{
                    filter:item.value,
                }
            })
            .then(response => { 
                this.orders=response.data.orders
                this.isLoading=false
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            }) 
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
</style>