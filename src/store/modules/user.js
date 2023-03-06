import { AsyncStorage } from "react-native";
// import AsyncStorage from '@callstack/async-storage'


const state = {
    username: '',
    email: '',
    phone: '',
    userId: '',
    authentication: '',
    phonePrefix: '+91',
    loggedIn: false,
    verificationStatus: false,
    status: false,
    deliveryAddress: '',
    deliveryCharge:0
}

const getters = {
    username: state => state.username,
    email: state => state.email,
    phone: state => state.phone,
    userId: state => state.userId,
    authentication: state => state.authentication,
    phonePrefix: state => state.phonePrefix,
    loggedIn: state => state.loggedIn,
    verificationStatus: state => state.verificationStatus,
    status: state => state.status,
    deliveryAddress: state => state.deliveryAddress,
    deliveryCharge: state => state.deliveryCharge
}

const mutations = {
    setUser (state, user) {
        state.username = user.name;
        state.authentication = user.authentication;
        state.userId = user.id;
        state.email = user.email;
        state.phone = user.phone;
        state.phonePrefix = user.phonePrefix;
        state.loggedIn = user.loggedIn;
        state.verificationStatus = user.verificationStatus,
        state.status = user.status
    },

    unsetUser (state) {
        AsyncStorage.clear();
        state.username = '';
        state.authentication = '';
        state.userId = '';
        state.email = '';
        state.phone = '';
        state.loggedIn = false;
        state.verificationStatus = false;
        state.phonePrefix = '+91';
        state.status = false;
    },
    setProfile (state, user) {
        state.username = user.name;
        state.userId = user.id;
        state.email = user.email;
        state.phone = user.phone;
    },
    unsetProfile (state) {
        state.username = '';
        state.userId = '';
        state.email = '';
        state.phone = '';
    },
    setProfileName (state, username) {
        state.username = username
    },
    setLoggedIn(state){
        state.loggedIn = true
    },
    unsetLoggedIn(state){
        state.loggedIn = false
    },
    setStore(state,user)
    {
        state.store = user.store
    },
    unsetStore(state)
    {
        state.store = ''
    },
       
    setAuthentication(state,user)
    {
        state.authentication = user.authentication
    },
    unsetAuthentication(state,user)
    {
        state.authentication = ''
    },
    setVerificationStatus(state){
        state.verificationStatus = true
    },
    unsetVerificationStatus(state){
        state.verificationStatus = false
    },
    setDeliveryAddress(state, addressId){
        state.deliveryAddress = addressId
    },
    unsetDeliveryAddress(state){
        state.deliveryAddress = ''
    },
    setDeliveryCharge(state, amount){
        state.deliveryCharge = amount
    },
    unsetDeliveryCharge(state){
        state.deliveryCharge = ''
    },

}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}