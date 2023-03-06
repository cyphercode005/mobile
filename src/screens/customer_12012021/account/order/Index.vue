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
                        <image :source="OrderList.icon ? {uri:OrderList.image} :require('../../../../../assets/images/menu/chicken-biriyani.png')" class="order-item-image" />
                    </nb-left>
                    <nb-body class="order-body">
                        <nb-text class="kitchen-name">{{OrderList.kitchenName}}</nb-text>
                        <nb-text class="order-date">{{OrderList.orderTime}}</nb-text>
                        <nb-view class="order-price-item">
                            <nb-text class="order-price">₹{{parseFloat(OrderList.total).toFixed(2)}}</nb-text>
                            <nb-text class="order-item">#{{OrderList.id}}</nb-text>
                        </nb-view>
                    </nb-body>
                    <nb-right class="order-right">
                        <nb-text v-if="OrderList.statusId == '4'" class="order-status-delivered">{{OrderList.statusName}}</nb-text>
                        <nb-text v-else-if="(OrderList.statusId == '2' || OrderList.statusId == '3'  || OrderList.statusId == '1')" class="order-status-ongoing">{{OrderList.statusName}}</nb-text>
                        <nb-text v-else class="order-status-cancelled">Failed</nb-text>
                    </nb-right>
                </nb-list-item>
               
            </nb-list>
            <nb-view  padder v-else class="no-result">
                <nb-text class="no-result-text">No Orders Found</nb-text>
            </nb-view>
        </nb-content>
        <footer :navigation="navigation" />
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            orderLists: '',
            orderId :'',
            isLoading: false
        }
    },
    beforeMount() {
        var status = true;
        this.isLoading = true
        if(this.$store.state.user.authentication) {
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.orderList,
                    headers: { 'Content-Type': 'application/json',
                    'Authorization':AuthStr},
            })
            .then(response => { 
                this.orderLists=response.data.orders;
                console.log(this.orderList);
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
        }
    },
    methods: {
        
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
        width: 45;
        height: 45;
        resize-mode: contain;
        align-self: center;
        margin-right: 0;
    }
    .order-body{
        margin-left: 10;
    }  
    .kitchen-name{
        font-size: 14;
        color: #000000;
        font-family: Montserrat_SemiBold;
        margin-bottom: 3;
    }
    .order-date{
        font-family: Montserrat_Medium;
        font-size: 10;
        color: #b4b4b4;
        margin-bottom: 3;
    }
    .order-price-item{
        flex-direction: row;
        align-items: center;
    }
    .order-price{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #3b3838;
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
        padding-top: 1;
        text-align: center;
        padding-bottom: 3;
        width:75;
         
    }
    .order-status-delivered{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #04b74c;
        text-align: center;
        background-color: #d9fef0;
        padding-horizontal: 10;
        padding-top: 1;
        padding-bottom: 3;
    }
    .order-status-cancelled{
        font-size: 12;
        font-family: Montserrat_Medium;
        color: #fb1e1e;
        background-color: #ffabab;
        padding-horizontal: 10;
        padding-top: 1;
        text-align: center;
        padding-bottom: 3;
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
</style>