// import { AsyncStorage } from "react-native";

const state = {
    cartCount: 0,
    cart:'',
    cartTotal:0,
    kitchen:'',
}

const getters = {
    cartCount: state => state.cartCount,
    cart: state => state.cart,
    cartTotal: state => state.cartTotal,
    kitchen: state => state.kitchen,
}

const mutations = {
    setCartCount(state,cartCount)
    {
        state.cartCount = cartCount
    },
    unsetCartCount(state)
    {
        state.cartCount = 0
    },
    setCart(state,cart)
    {
        state.cart= cart
    },
    unsetCart(state)
    {
        state.cart = ''
    },
    setCartTotal(state,cartTotal)
    {
        state.cartTotal= cartTotal
       
    },
    unsetCartTotal(state)
    {
        state.cartTotal='';
       
    },
    setKitchen(state,kitchen)
    {
        state.kitchen= kitchen;
       
    },
    unsetKitchen(state)
    {
        state.kitchen='';
       
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}