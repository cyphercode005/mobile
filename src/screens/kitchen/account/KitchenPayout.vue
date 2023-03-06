<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="Payouts"/>
        <nb-content padder>
            <nb-view class="total-section">
                <nb-view class="total-section-left">
                    <nb-text class="total-title">TOTAL PAYOUT</nb-text>
                    <nb-view class="total-value">
                        <image class="total-value-image" :source="require('../../../../assets/images/kitchen/income.png')"/>
                        <nb-text class="total-count">{{ $store.state.currency }}₹ {{ parseFloat(totalPayoutAmount).toFixed(2)}}</nb-text>
                    </nb-view>
                </nb-view>
                <nb-view class="total-section-left">
                    <nb-text class="total-title">PENDING</nb-text>
                    <nb-view class="total-value">
                        <image class="total-value-image" :source="require('../../../../assets/images/kitchen/payout.png')" :style="{tintColor:'#fcbe00'}"/>
                        <nb-text class="total-count">{{ $store.state.currency }}₹ {{  parseFloat(totalPending).toFixed(2) }}</nb-text>
                    </nb-view>
                </nb-view>
            </nb-view>
            <nb-text class="report-period">Payout Group : <nb-text class="report-date">{{ payoutGroup.name }}</nb-text></nb-text>
            <nb-view v-if="payouts.length!=0">
                <nb-view class="payout-item" v-for="payout in payouts" :key="payout.id" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                    <nb-view class="payout-left">
                        <nb-view class="duration">
                            <nb-text class="duration-head">Period : </nb-text>
                            <nb-text class="duration-value">{{ payout.startDate }} - </nb-text>
                            <nb-text class="duration-value">{{ payout.endDate }}</nb-text>
                        </nb-view>
                        <nb-text class="transaction">Txn ID: {{ payout.transactionId ? payout.transactionId : '-'}}</nb-text>
                        <nb-view class="split-row">
                            <nb-text class="duration-head">Generated on : </nb-text>
                            <nb-text class="duration-head">{{ payout.payoutGeneratedDate }}</nb-text>
                        </nb-view>
                        <nb-text class="payout-remarks" >Remarks: {{ payout.remarks }}</nb-text>
                    </nb-view>
                    <nb-view class="payout-right">
                        <nb-text :class="payout.status==0 ? 'payout-amount-pending' : 'payout-amount-complete'">{{ $store.state.currency }}₹ {{ parseFloat(payout.payableAmount).toFixed(2) }}</nb-text>
                    </nb-view>
                </nb-view>
            </nb-view>
            <nb-view v-else padder class="no-result">
                <nb-text class="no-result-text">No payouts generated</nb-text>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            payouts : [],
            totalOrderAmount : 0,
            totalOrderCount : 0,
            totalPayoutAmount : 0,
            totalPending : 0,
            payoutGroup: ''
        }
    },
    beforeMount() {
        this.isLoading = true
        const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
        console.log('AuthStr');
        console.log(AuthStr);
        this.api.kitchen({
            method: 'POST',
            url: this.api.routes.getPayouts,
            headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
        })
        .then(response => { 
            this.payouts = response.data.payouts
            this.totalOrderAmount = response.data.totalOrderAmount
            this.totalOrderCount = response.data.totalOrderCount
            this.totalPayoutAmount = response.data.totalPayoutAmount
            this.totalPending = response.data.totalPending
            this.payoutGroup = response.data.payoutGroup
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data) 
        }); 
    },
}
</script>

<style>
    .report-background{
        background-color: #f4f4f4;
        flex: 1;
    }

    /* Total Section */

    .total-section{
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-bottom: 15;
    }
    .total-section-left{
        flex: 1;
        border-radius: 10;
        background-color: #FFFFFF;
        padding: 15;
        border-width: 1;
        margin-right: 10;
        border-color: #efefef;
    }
    .total-title{
        font-family: Montserrat_Medium;
        font-size: 13;
        color: #aaaaaa;
    }
    .total-value {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 10;
    }
    .total-value-image{
        height: 35;
        width: 35;
        resize-mode: contain;
    }
    .total-count{
        font-family: Montserrat_SemiBold;
        font-size: 20;
        color: #000000;
        /* margin-bottom: 3; */
    }
    .total-section-right{
        flex: 1;
        border-radius: 10;
        background-color: #FFFFFF;
        padding: 15;
        border-width: 1;
        margin-right: 10;
        border-color: #efefef;
    }
    .report-period{
        font-family: Montserrat_Regular;
        font-size: 12;
        color: #999999;
        margin-bottom: 10;
    }
    .report-date{
        font-family: Montserrat_Bold;
        font-size: 12;
        color: #191717;
    }
    

    /* Report Buttons */

    .payout-item{
        border-radius: 8;
        elevation:2;
        background-color: #FFFFFF;
        margin-vertical: 5;
        flex-direction: row;
        align-items: center;
        padding:15;
    }
    .payout-left{
        flex: .8;
    }
    .payout-right{
        flex: .2;
        align-items: center;
        justify-content: center;
    }
    .duration{
        flex-direction: row;
        align-items: center;
        margin-bottom: 5;
    }
    .split-row{
        flex: 1;
        flex-direction: row;
        align-items: center;
    }
    .duration-head{
        color: #000000;
        font-size: 13;
        font-family: Montserrat_Regular;
    }
    .duration-value{
        color: #000000;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .transaction{
        font-size: 14;
        color: #000000;
        font-family: Montserrat_Medium;
        margin-bottom: 3;
    }
    .payout-amount-pending{
        font-size: 18;
        color: #fcbe00;
        font-family: Montserrat_Medium;
        /* margin-bottom: 3; */
    }
    .payout-amount-complete{
        font-size: 18;
        color: #04b74c;
        font-family: Montserrat_Medium;
        /* margin-bottom: 3; */
    }

    .payout-remarks{
        font-size: 13;
        color: #000000;
        font-family: Montserrat_Medium;
        margin-top: 3;
    }

    /* Order List */

    .order-list-header{
        font-size: 16;
        font-family: Montserrat_SemiBold;
        color: #191717;
        margin-vertical: 5;
    }
    .order-list-item{
        background-color: #FFFFFF;
        border-radius: 8;
        padding: 10;
        margin-bottom: 6;
        margin-top: 6;
        elevation:2;
    }
    .order-status-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10;
    }
    .order-status-new{
        color: #04b74c;
    }
    .order-status-packing{
        color: #b74c04;
    }
    .order-status-transit{
        color: #fcbe00;
    }
    .order-status-delivered{
        color: #c0c0c0;
    }
    .order-number{
        color: #949494;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-price{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
    }
    .order-item{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        /* margin-bottom: 4; */
    }
    .order-notes{
        color: #949494;
        font-size: 10;
    }
    .order-date-time{
        margin-top: 5;
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