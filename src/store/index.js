import Vue from "vue-native-core"
import Vuex from 'vuex'
import { AsyncStorage } from "react-native";
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)
 import cart from './modules/cart'

import user from './modules/user'
import kitchen from './modules/kitchen'
import checkout from './modules/checkout'
// import payment from './modules/payment' 

const state = {
    splash: true,
    token: '',
    selectedLocation: '',
    notification:0,
    skipLogin:false,
    locationPermission: false,
    pushNotification: {
        orderDetail: false
    }
}

const mutations = {
    unsetSplash (state) {
        state.splash = false;
    },
    setSplash (state) {
        state.splash = true;
    },
    setToken (state, token) {
        state.token = token;
    },
    setSkipLogin(state){
        state.skipLogin = true
    },
    unsetSkipLogin(state){
        state.skipLogin = false
    },
    setSelectedLocation (state, location) {
        state.selectedLocation = location
    },
    unsetSelectedLocation (state){ 
        state.selectedLocation = ''
    },
    setNotification(state, notificationCount){
        state.notification = notificationCount
    },
    unsetNotification(state){
        state.notification = 0
    },
    setUserType(state, userType){
        state.userType = userType
    },
    unsetUserType(state){
        state.userType = ''
    },
    setLocationPermission(state){
        state.locationPermission = true
    },
    unsetLocationPermission(state){
        state.locationPermission = false
    },
    setOrderPushNotification(state){
        state.pushNotification.orderDetail = true
    },
    unsetOrderPushNotification(state){
        state.pushNotification.orderDetail = false
    }

}

const vuexLocal = new VuexPersistence({
    strictMode: false,
    storage: AsyncStorage,
    asyncStorage: true,
});

const vuexPersistEmitter = () => {
    return store => {
        store.subscribe((mutation,state) => {
            // console.log(mutation.type);
            if (mutation.type === "RESTORE_MUTATION") {
                // console.log("345345345");
                store._vm.$root.$emit("storageReady");
            }
            // vuexLocal.storage.setItem('vuex',JSON.stringify(state))
        });
    };
};

Object.assign(mutations,{
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION
});

const store = new Vuex.Store({
    strict: false,
    modules: {
        user,checkout,cart,kitchen /*payment */
    },
    state : state,
    mutations: mutations,
    plugins: [vuexLocal.plugin,vuexPersistEmitter()]
})

export default store;