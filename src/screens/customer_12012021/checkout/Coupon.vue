<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Coupon" />
        <nb-content padder v-if="getCoupons &&allCoupons.length > 0">
            <touchable-opacity class="coupon-item"  v-for="coupon in allCoupons" :key="coupon.id"  :on-press="()=>{setCoupon(coupon.code)}">
                <nb-view :style="{justifyContent:'center', alignItems:'center', flex:2}">
                    <nb-view class="left-icon">
                        <nb-text class="left-icon-text">M</nb-text>
                    </nb-view>
                </nb-view>
                <nb-view :style="{flex:5}">
                    <nb-text class="coupon-name">{{coupon.name}}</nb-text>
                    <nb-text class="coupon-description">{{coupon.description}}</nb-text>
                    <nb-view class="coupon-code-expiry">
                        <nb-text class="coupon-code">{{coupon.code}}</nb-text>
                        <nb-view class="coupon-expiry">
                            <nb-text class="coupon-expiry-text">{{coupon.expiry}}</nb-text>
                        </nb-view>
                    </nb-view>
                </nb-view>
            </touchable-opacity>
        </nb-content>
        <nb-content padder v-else>
            <nb-view  padder class="no-result">
                <nb-text class="no-result-text">No Cupons Found</nb-text>
            </nb-view>
        </nb-content>
        <nb-view class="footer-button">
            <nb-view class="footer-coupon-code">
                <nb-input v-model="couponCode" class="coupon-code-text" />
            </nb-view>
            <touchable-opacity :on-press="()=>{applyCoupon()}" class="coupon-button">
                <nb-text class="coupon-button-text">Apply Coupon</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="coupon-button-icon" />
            </touchable-opacity>
        </nb-view>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            cart:this.$store.state.cart.cart,
            cartCount:this.$store.state.cart.cartCount,
            cartTotal:this.$store.state.cart.cartTotal,
            authToken:this.$store.state.user.authentication,
            allCoupons:'',
            couponCode:'',
            couponDiscount:'',
            coupon:this.$store.state.checkout.coupon,
            isLoading: false
        }
    },
    computed:{
        getCoupons() {
            this.isLoading = true
            var status = true
            this.api.create({
                method: 'POST',
                url: this.api.routes.couponList,
                headers: { 'Content-Type': 'application/json'},
            })
            .then(response => { 
                console.log(response.data)
                this.allCoupons=response.data.coupons;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            })
            return status;
        }
    },
    methods:{
        setCoupon(couponCode)
        {
            this.couponCode=couponCode;
        },
        applyCoupon()
        {
            if(this.$store.state.user.loggedIn){
                this.isLoading = true
                if(this.couponCode=='') {
                    alert('Please Enter Code!')
                } else {
                    const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                    console.log(AuthStr)
                    this.api.create({
                        method: 'POST',
                        url: this.api.routes.applyCoupon,
                        headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                        data:{coupon_code:this.couponCode}
                    })
                    .then(response => { 
                        if(response.data.success) {
                            console.log(response.data.success);
                            Toast.show({
                                text: response.data.success.message,
                                duration: 4000
                            }); 
                            var coupon={
                                couponApplied:1,
                                couponCode:response.data.success.coupon_code,
                                couponId:response.data.success.coupon_id,
                                discount:response.data.success.discount_total,

                            } 
                            this.$store.commit('checkout/setCoupon',coupon);
                            this.coupon=coupon;
                            this.couponDiscount=response.data.success.discount_total;
                            this.couponCode='';
                            this.isLoading = false
                            //console.log(this.$store.state.checkout.coupon);
                            this.navigation.dispatch(StackActions.replace({ routeName: 'Checkout' }));
                        } else{
                            Toast.show({
                                text: response.data.error.message,
                                duration: 3000
                            }); 
                            this.isLoading = false
                        }
                    })
                    .catch(error => {
                        this.isLoading = false
                        console.log(error.response.data);
                    })
                }
            }
            else{
                this.navigation.navigate('Verify')
            }
        },
    },
}
</script>

<style>
    .coupon-item{
        border-width: 1.3;
        border-color: #fcbe00;
        border-radius: 8;
        flex-direction: row;
        padding: 15;
        padding-left: 0;
        margin-bottom: 15;
    }
    .left-icon{
        height: 40;
        width: 40;
        justify-content: center;
        align-items: center;
        background-color: #ea0000;
        border-radius: 30;
        align-self: center;
        padding: 0;
        margin: 0;
    }
    .left-icon-text{
        font-size:26;
        font-family: Montserrat_SemiBold;
        color: #fcbe00;
        margin: 0;
        padding: 0;
    }
    .coupon-name{
        font-size: 14;
        color: #1d262c;
        font-family: Montserrat_SemiBold;
        margin-bottom: 5;
    }
    .coupon-description{
        font-size: 12;
        color: #9399a3;
        margin-bottom: 8;
    }
    .coupon-code-expiry{
        flex-direction: row;
        justify-content: flex-end;
    }
    .coupon-code{
        font-size: 11;
        color: #04b74c;
        font-family: Montserrat_Medium;
    }
    .coupon-expiry{
        background-color: #f9e7eb;
        padding-horizontal: 10;
        justify-content: center;
        align-items: center;
        border-radius: 15;
        margin-left: 30;
    }
    .coupon-expiry-text{
        font-size: 11;
        color: #cf1e43;
        font-family: Montserrat_Medium;
    }

    /* Footer */

    .footer-button{
        background-color: #364151;
        flex-direction: row;
        height: 48;
        padding-horizontal: 15;
        padding-vertical: 5;
    }
    .footer-coupon-code{
        flex: 1;
        margin-right: 20;
        background-color: #FFFFFF;
        border-style: dashed;
        border-radius: 7;
        border-width: 1;
        border-color: #fcbe00;
    }
    .coupon-code-text{
        border-radius: 7;
        height: 38;
        background-color: #FFFFFF;
        padding-horizontal:10
    }
    .coupon-button{
        flex: 1;
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .coupon-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
    }
    .coupon-button-icon{
        width: 8.5;
        height: 14.1;
        resize-mode: contain;
        margin-left: 8;
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