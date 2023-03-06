// import { AsyncStorage } from "react-native";

const state = {
    coupon:{
        couponCode:'',
        discount:0,
        couponId:'' 
    },
    deliveryType:'',
    deliveryCharge:0
}

const getters = {
    coupon: state => state.coupon,
    deliveryType:state => state.deliveryType,
    deliveryCharge:state => state.deliveryCharge,
}

const mutations = {
    unsetCheckout(state){
        state.deliveryType = '';
        state.deliveryCharge = 0
        state.coupon = {
            couponCode: '',
            discount: 0,
            couponId: '' 
        }
    },
    setCoupon(state,checkout)
    {
        state.coupon = {
            couponCode:checkout.couponCode,
            discount:checkout.discount,
            couponId:checkout.couponId 
        }
    }, 
    unsetCoupon(state)
    {
        state.coupon = {
            couponCode:'',
            discount:0, 
            couponId:'' 
        };
    },
    setDeliveryType(state,deliveryType)
    {
        state.deliveryType =deliveryType
    },
    unsetDeliveryType(state)
    {
        state.deliveryType =''
    },
    setDeliveryCharge(state,deliveryCharge)
    {
        state.deliveryCharge =deliveryCharge
    },
    unsetDeliveryCharge(state)
    {
        state.deliveryType =''
    },
    unsetCouponDiscount(state){
        state.coupon.discount = 0
    },


}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}