import { AsyncStorage } from "react-native";
// import AsyncStorage from '@callstack/async-storage'


const state = {
    name: '',
    email: '',
    phone: '',
    userId: '',
    authentication: '',
    phonePrefix: '+91',
    loggedIn: false,
    verificationStatus: false,
    status: false,
    description:'',
    image :'',
    approvalStatus: false,
}

const getters = {
    name: state => state.name,
    email: state => state.email,
    phone: state => state.phone,
    userId: state => state.userId,
    authentication: state => state.authentication,
    phonePrefix: state => state.phonePrefix,
    loggedIn: state => state.loggedIn,
    verificationStatus: state => state.verificationStatus,
    status: state => state.status,
    description: state => state.description,
    image: state => state.image,
    approvalStatus: state => state.approvalStatus,
}

const mutations = {
    setUser (state, user) {
        state.name = user.name;
        state.authentication = user.authentication;
        state.userId = user.id;
        state.email = user.email;
        state.phone = user.phone;
        state.phonePrefix = user.phonePrefix;
        state.loggedIn = user.loggedIn;
        state.image = user.image,
        state.verificationStatus = user.verificationStatus,
        state.status = user.status
        state.approvalStatus = user.approvalStatus
    },

    unsetUser (state) {
        AsyncStorage.clear();
        state.name = '';
        state.authentication = '';
        state.userId = '';
        state.email = '';
        state.phone = '';
        state.loggedIn = false;
        state.verificationStatus = false;
        state.phonePrefix = '';
        state.status = false;
        state.description = '',
        state.image = '',
        state.approvalStatus = false
       
    },
    setProfile (state, kitchen) {
        state.name = kitchen.name;
        state.userId = kitchen.id;
        state.email = kitchen.email;
        state.phone = kitchen.phone;
        state.description = kitchen.description
    },
    setProfileName (state, name) {
        state.name = name
    },
    setImage (state, image) {
        state.name = image
    },
    setLoggedIn(state){
        state.loggedIn = true
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
    setVerificationStatus(state,user){
        state.verificationStatus = true
    },
    unsetVerificationStatus(state,user){
        state.verificationStatus = false
    },
    setDescription(state,user){
        state.description = ''
    },
    unsetDescription(state){
        state.description = ''
    },
    setImage(state,user){
        state.image = user.image
    },
    unsetImage(state){
        state.image = ''
    },
    setApprovalStatus(state,user){
        state.approvalStatus = true
    },
    unsetApprovalStatus(state){
        state.approvalStatus = false
    }
}

export default {
    namespaced: true,
    state,
    getters,
    mutations
}