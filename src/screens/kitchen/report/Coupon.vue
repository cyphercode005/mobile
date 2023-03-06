<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Coupon Report" :style="{}"/>
        <nb-content padder :contentContainerStyle="{flexGrow: 1, width:'100%'}" :automaticallyAdjustContentInsets="true">
            <DropDownPicker
                :items="reportPeriod"
                :containerStyle="{height: 60, width:100, marginBottom:0}"
                :style="{borderWidth:0, paddingHorizontal:0}"
                :itemStyle="{
                    justifyContent: 'flex-start'
                }"
                :defaultValue="filter"
                :labelStyle="{color:'#000000', fontSize:13, fontFamily:'Montserrat_Medium'}"
                :placeholderStyle="{color:'#000000', fontSize:13, fontFamily:'Montserrat_Medium'}"
                :showArrow=true
                placeholder="All"
                :dropDownStyle="{backgroundColor: '#FFFFFF'}"
                :onChangeItem="(item)=>{
                    selectCategory(item)
                }"
            />
            <nb-view :style="{zIndex: 10}" v-if="orders.length>0">
                <nb-view class="payment-list-item" v-for="order in orders" :key="order.id" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                    <nb-view class="payment-item-left">
                        <nb-text class="payment-id">Coupon Name: {{order.name}}</nb-text>
                        <nb-text class="payment-name">Order Count: {{order.count}}</nb-text>
                    </nb-view>
                    <nb-view class="payment-item-right">
                        <nb-text class="payment-amount">-₹{{order.discount}}</nb-text>
                    </nb-view>
                </nb-view>
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
            orderCount:0,
            reportPeriod:[
                {label: 'All', value: 'All'},
                {label: 'Today', value: 'today'},
                {label: 'Week', value: 'week'},
                {label: 'Month', value: 'month'},
                {label: 'Year', value: 'year'},
            ],
            filter:this.navigation.state.params.filter,
            isLoading: false
        }
    },
    methods: {
        selectCategory(item) {
            this.isLoading = true
            this.filter=item.value 
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);       
            this.api.kitchen({
            method: 'POST',
            url: this.api.routes.couponReport,
                headers: { 'Content-Type': 'application/json',
                'Authorization':AuthStr},
                data:{
                    filter:this.filter
                }
            })
            .then(response => { 
                console.log(response.data)
                this.orders=response.data.orders;
                this.orderCount=response.data.count;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
        },
    },
    beforeMount(){
        this.isLoading = true
        const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);       
        this.api.kitchen({
            method: 'POST',
            url: this.api.routes.couponReport,
            headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
        })
        .then(response => { 
            console.log(response.data)
            this.orders=response.data.orders; 
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data);
        })
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
    .payment-list-item{
        flex-direction: row;
        justify-content: space-between;
        border-radius: 3;
        border-color: #f5f5f5;
        elevation: 2;
        padding: 15;
        background-color: #FFFFFF;
        margin-bottom: 12;
    }
    .payment-item-left{
        flex: 1;
        margin-right: 10;
    }
    .payment-id{
        font-family: SFProDisplay_Regular;
        font-size: 12;
        color: #221f1f;
        margin-bottom: 2;
    }
    .payment-name{
        font-family: SFProDisplay_Regular;
        font-size: 14;
        color: #0b0b0b;
        margin-bottom: 3;
    }
    .payment-date{
        flex-direction: row;
        align-items: center;
    }
    .payment-date-icon{
        width: 9;
        height: 9;
        resize-mode: contain;
    }
    .payment-date-text{
        font-family: SFProDisplay_Regular;
        font-size: 12;
        color: #676767;
    }
    .payment-item-right{
        justify-content: flex-end;
        align-self: flex-end;
    }
    .payment-amount{
        font-family: SFProDisplay_Medium;
        font-size: 14;
        color: #50a722;
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