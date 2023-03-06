<template>
    <view class="container">
        <!-- <app-loading v-if="!isAppReady || !isLocationLoaded"> </app-loading> -->

        <image-background :source="require('../assets/splash.png')" class="splash-container" v-if="!isAppReady || !isLocationLoaded"></image-background>
        <!-- <nb-view class="splash-container" v-if="!isAppReady || !isLocationLoaded">
            <image class="splash-logo" :source="require('../assets/splash-logo.gif')" />
        </nb-view> -->
        <app v-if="isAppReady && !isCrashed && isNetworkConnected && isLocationLoaded" :notification="notification"></app>
        <nb-button v-if="!isNetworkConnected"><nb-text>No Internet Connection</nb-text></nb-button>
        <nb-button v-if="isCrashed"><nb-text>RETRY</nb-text></nb-button>
    </view>
</template>

<script>
    // import React from 'react'
    import Vue from "vue-native-core"
    import { VueNativeBase } from "native-base"
    import { Input,Textarea } from "native-base"
    import { AppState, Platform, StatusBar, LogBox } from 'react-native'
    import Clipboard from "@react-native-community/clipboard"
    import NetInfo from "@react-native-community/netinfo";
    // import AppLoading from 'expo-app-loading'
    import * as Font from "expo-font";
    import * as Permissions from 'expo-permissions'
    import * as Location from 'expo-location'
    import * as Notifications from 'expo-notifications'
    import Constants from 'expo-constants'
    import appConfig from '@/constants/Config'
    import store from '@/store'
    import Splash from '@/screens/Splash'
    import App from '@/Index'
    import Header from '@/components/layouts/Header'
    import Footer from '@/components/layouts/Footer'
    import FooterKitchen from '@/components/layouts/FooterKitchen'
    import StarRating from 'react-native-star-rating'
    import InputSpinner from "react-native-input-spinner"
    import Modal from 'react-native-modal'
    import RBSheet from "react-native-raw-bottom-sheet"
    import Geocoder from 'react-native-geocoding'
    import api from '@/constants/Api'
    import HTML from 'react-native-render-html'
    import InputWithError from '@/components/InputWithError'
    import Vuelidate from 'vuelidate'
    import distance from '@/plugins/GeoDistance'
    import getCurrencyCode from '@/plugins/currency' 
    import GeoDistanceTime from '@/plugins/GeoDistanceTime'
    import Spinner from 'react-native-loading-spinner-overlay'
    import VueMoment from 'vue-moment'
    /* import App from "@/Index";
    import StyleWrapper from '@/plugins/StyleWrapper'
    
  
    import HeaderMessage from '@/components/HeaderMessage'
    import SkeletonContent from 'react-native-skeleton-content'
    import { LinearGradient } from 'expo-linear-gradient'
    
     */
    import { Toast } from 'native-base'
    
    Vue.use(VueNativeBase)
    Vue.component('Header', Header)
    Vue.component('Footer', Footer)
    Vue.component('FooterKitchen', FooterKitchen)
    Vue.component('StarRating', StarRating)
    Vue.component('InputSpinner', InputSpinner)
    Vue.component('Modal', Modal)
    Vue.component('RBSheet', RBSheet)
    Vue.component('HTML', HTML)
    Vue.component('InputWithError', InputWithError)
    Vue.use(Vuelidate)
    Vue.use(VueMoment)
    // Vue.use(Toast)

   
    //Vue.component('SkeletonContent', SkeletonContent)
   // Vue.component('LinearGradient', LinearGradient)
    Vue.component('Spinner', Spinner)
    //Vue.component('HeaderMessage', HeaderMessage)

    Vue.prototype.geoDistance = distance; 
    Vue.prototype.geoDistanceTime = GeoDistanceTime; 
    Vue.prototype.getCurrencyCode = getCurrencyCode; 
    Vue.prototype.api = api;
    Vue.prototype.$store = store;
    Vue.prototype.appConfig = appConfig;

    export default {
        components: { App, StatusBar },
        data() {
            return {
                isAppReady: false,
                isCrashed: false,
                notification: '',
                isNetworkConnected: false,
                isLocationLoaded: false
            };
        },
        props:{
            navigation: { type: Object }
        },
        created() {
            NetInfo.addEventListener(network => {
                if(network.isConnected){
                    this.isNetworkConnected = true
                } else {
                    this.isNetworkConnected = false
                }
            }); 

        },
        beforeMount(){
            if(!store.state.splash){
                this.getLocationAsync();
            } else {
                this.isLocationLoaded = true
            }
            Geocoder.init(this.appConfig.googleApiKey)
            this.loadFonts();
            this.registerForPushNotificationsAsync()
        },

        mounted() {
            
            /* Input.defaultProps.autoCapitalize = 'none';
            Input.defaultProps.autoCorrect = false;
            Input.defaultProps.autoComplete = 'off';
            Input.defaultProps.autoCompleteType = 'off';
            Input.defaultProps.textContentType = 'none';
            Input.defaultProps.importantForAutofill = 'yesExcludeDescendants';
            Textarea.defaultProps.autoCapitalize = 'none';
            Textarea.defaultProps.autoCorrect = false;
            Textarea.defaultProps.autoComplete = 'off';
            Textarea.defaultProps.autoCompleteType = 'off';
            Textarea.defaultProps.textContentType = 'none';
            Textarea.defaultProps.importantForAutofill = 'yesExcludeDescendants'; */
            // Icon.defaultProps.type = 'Ionicons';
            // Input.defaultProps.secureTextEntry = true
            // Input.defaultProps.keyboardType = 'visible-password'
            // Input.defaultProps.contextMenuHidden = true

            /* 
             */
        },
        methods: {
            async loadFonts() {
                try {
                    this.isAppReady = false;
                    await Font.loadAsync({
                        Montserrat_Regular: require("../assets/fonts/Montserrat-Regular.ttf"),
                        Montserrat_Medium: require("../assets/fonts/Montserrat-Medium.ttf"),
                        Montserrat_SemiBold: require("../assets/fonts/Montserrat-SemiBold.ttf"),
                        Montserrat_Bold: require("../assets/fonts/Montserrat-Bold.ttf"),
                        Montserrat_ExtraBold: require("../assets/fonts/Montserrat-ExtraBold.ttf"),
                        Ionicons: require("../assets/fonts/Ionicons.ttf"),
                        FontAwesome: require("../assets/fonts/FontAwesome.ttf")
                    });
                    this.isAppReady = true;
                } catch (error) {
                    console.log("some error occured", error);
                    this.isAppReady = false;
                    this.isCrashed = true;
                }
            },
            /* _handleNotification(notification) {
                // do whatever you want to do with the notification
                if(AppState.currentState == 'active' && notification.origin === 'received'){
                    this.notification = notification
                }
            }, */
            async registerForPushNotificationsAsync(){
                // console.log(store.state.token)
                try{
                    if (!store.state.token){
                        if (Constants.isDevice) {
                            let { status: existingStatus } = await Notifications.getPermissionsAsync();
                            let finalStatus = existingStatus;
                            // console.warn(finalStatus)
                            if (existingStatus !== 'granted') {
                                const { status } = await Notifications.requestPermissionsAsync();
                                finalStatus = status;
                                // alert('permission')
                            }
                            if (finalStatus !== 'granted') {
                                // alert('Failed to get push token for push notification!');
                                return;
                            }
                            token = (await Notifications.getExpoPushTokenAsync()).data;
                            // alert(token)
                            store.commit('setToken', {
                                token : token
                            })
                            // alert(token)
                            // console.log(token);
                        } else {
                            // alert('Must use physical device for Push Notifications');
                        }
                    }
                } catch(error){
                    // alert(error)
                }
            },
            async getLocationAsync(){
                const status = await Permissions.askAsync(Permissions.LOCATION);
                console.log(status)
                if(status.status !== 'granted' && status.status !== 'denied'){
                     alert('Permission to access location was denied.')
                    //alert('Permission to access location was denied. App need to access location to work. Please go to settings and set permission')
                    // Toast.show({ text: 'Permission to access location was denied. App need to access location to work', duration: 3000 });
                    // this.getLocationAsync();
                    // this.isLocationLoaded = true
                // } else {
                    await Location.getCurrentPositionAsync(
                    {
                        accuracy: 4
                    })
                    .then((newLocation) => {
                        // console.log('newLocation')
                        // console.log(newLocation)
                        let coords = newLocation.coords
                        Geocoder.from(
                            parseFloat(coords.latitude),parseFloat(coords.longitude)
                        )
                        .then(json => {
                            // console.log(json)
                            var formatted_address = json.results[0].formatted_address;
                            var address_components=json.results[0].address_components;
                            var addressComponents = {};
                            address_components.forEach(component => {
                                var title= component.types[0]
                                addressComponents[title] = component.long_name;
                                if(component.types[0]=='country'){
                                    addressComponents['countryCode'] = component.short_name
                                }
                                if(component.types[0]=='administrative_area_level_1'){
                                    addressComponents['stateCode'] = component.short_name
                                    addressComponents['stateName'] = component.long_name
                                }
                            });
                            var formattedAddress = formatted_address.split(",")
                            var addressTitle= formattedAddress[0]
                            formattedAddress = formattedAddress.slice(1)
                            var addressSubtitle = formattedAddress.join(',')
                            store.commit('setSelectedLocation', {
                                addressComponents:addressComponents,
                                address:formatted_address,
                                addressTitle: addressTitle,
                                addressSubtitle: addressSubtitle,
                                country: addressComponents.country ? addressComponents.country : '',
                                countryCode: addressComponents.countryCode ? addressComponents.countryCode : '',
                                currency: addressComponents.countryCode ? getCurrencyCode(addressComponents.countryCode) : 'AED',
                                coords: coords
                            })
                            this.isLocationLoaded = true
                        })
                        .catch(error => 
                            console.warn(error)
                        );
                    })
                }
            },
        }
    }   
</script>
<style>
.container {
  flex: 1;
  /* align-items: center; */
  /*justify-content: center; */
}

.splash-container {
    flex: 1;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
}

</style>