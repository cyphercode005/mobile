<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Cancelled Orders" :style="{}"/>
        <nb-content padder :contentContainerStyle="{flexGrow: 1, width:'100%'}" :automaticallyAdjustContentInsets="true" v-model="getOrders">
            <DropDownPicker
                :items="reportPeriod"
                :containerStyle="{height: 40, width:100, marginBottom:15}"
                :style="{borderWidth:0, paddingHorizontal:0}"
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
            <nb-view :style="{zIndex: 10}" v-if="orderCount">
                <touchable-opacity class="order-list-item" v-for="order in orders" :key="order.id" :on-press="()=>navigation.navigate('KitchenOrderDetail',{orderId:order.id})" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                    <nb-view class="order-item-left">
                        <nb-view class="order-left-split">
                            <nb-text class="order-number">Order #{{order.invoicePrefix+order.id}}</nb-text>
                        </nb-view>
                        <nb-text class="customer-name">Customer Name: {{order.customerName}}</nb-text>
                        <nb-text class="item-count">Items: {{order.productCount}}</nb-text>
                    </nb-view>
                    <nb-view class="order-item-right">
                        <image class="right-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                    </nb-view>
                </touchable-opacity>
            </nb-view>
            <nb-view  padder class="no-result" v-else>
                <nb-text class="no-result-text">No Orders Found</nb-text>
            </nb-view>
        </nb-content>
        <footer-Kitchen :navigation="navigation"/>
    </nb-container>
</template>

<script>
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
            orders:[],
            orderCount:'',
            reportPeriod:[
                {label: 'All', value: 'All'},
                {label: 'Today', value: 'today'},
                {label: 'Week', value: 'week'},
                {label: 'Month', value: 'month'},
                {label: 'Year', value: 'year'}
            ],
            filter:this.navigation.state.params.filter,
            isLoading: false
        }
    },
    methods: {
        selectCategory(item) {
            this.isLoading = true
            this.filter = item.value
            console.log(item)
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);       
                this.api.kitchen({
                method: 'POST',
                url: this.api.routes.cancelledReport,
                headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
                data:{
                    filter:item.value,

                }
            })
            .then(response => { 
                console.log(response.data)
                this.orders=response.data.cancelledOrders;
                this.orderCount=response.data.orderCount;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
           
        },
    },
    computed:{
        getOrders(){
            var status=true;
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);       
                this.api.kitchen({
                method: 'POST',
                url: this.api.routes.cancelledReport,
                headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
                 data:{
                    filter:this.filter,
                }
            })
            .then(response => { 
                console.log(response.data)
                this.orders=response.data.cancelledOrders;
                this.orderCount=response.data.orderCount;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
            return status;
        }


    }
}
</script>

<style>
    .order-head{
        font-family: SFProDisplay_Medium;
        font-size: 18;
        color: #000000;
        margin-bottom: 20;
    }
    .order-list-item{
        flex-direction: row;
        justify-content: space-between;
        border-radius: 5;
        border-color: #f5f5f5;
        elevation: 2;
        padding: 15;
        background-color: #FFFFFF;
        margin-bottom: 10;
    }
    .order-item-left{
        flex: 1;
        margin-right: 10;
    }
    .order-left-split{
        flex-direction: row;
        align-items: center;
        margin-bottom: 5;
    }
    .order-number{
        font-size: 14;
        color: #a30600;
        font-family: SFProDisplay_Regular;
    }
    .status-new{
        background-color: #49a53d;
        padding-horizontal: 10;
        margin-right: 5;
        padding-bottom: 2;
        margin-left: 20;
    }
    .status-text{
        font-size: 12;
        color: #FFFFFF;
        font-family: SFProDisplay_Regular;
    }
    .customer-name{
        font-size: 12;
        color: #222222;
        font-family: SFProDisplay_Regular;
        margin-bottom: 4;
    }
    .item-count{
        font-size: 12;
        color: #707070;
        font-family: SFProDisplay_Regular;
    }
    .order-item-right{
        justify-content: center;
    }
    .right-icon{
        tint-color: #000000;
        width: 7.6;
        height: 13.9;
    }

    /* No Result */

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