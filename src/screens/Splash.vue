<template>
    <nb-container>
        <!-- <StatusBar
            barStyle="light-content"
        /> -->
        <!-- <nb-content :style="{flex:1}"> -->
        <IndicatorViewPager :style="{flex:1, flexDirection:'column-reverse'}" ref="viewPager" :indicator="_renderDotIndicator()" :onPageScroll="(value)=>pageScroll(value)">
            <nb-view :style="{flex:1}">
                <touchable-opacity :on-press="skipToLast" class="skip-button">
                    <nb-text note class="skip-text">Skip</nb-text>
                </touchable-opacity>
                <image :source="require('../../assets/images/walkthrough/1.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                <nb-view class="walkthrough-container">
                    <nb-text class="walkthrough-title">Special Tasty Dishes</nb-text>
                    <nb-text class="walkthrough-description">Enjoy specially prepared tasty dishes straight from home kitchens.</nb-text>
                </nb-view>
                <touchable-opacity class="walkthrough-button" :on-press="() => slide(1)">
                    <image :source="require('../../assets/images/icons/next.png')" class="walkthrough-button-icon" />
                </touchable-opacity>
            </nb-view>
            <nb-view :style="{flex:1}">
                <touchable-opacity :on-press="skipToLast" class="skip-button">
                    <nb-text note class="skip-text">Skip</nb-text>
                </touchable-opacity>
                <image :source="require('../../assets/images/walkthrough/2.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                <nb-view class="walkthrough-container">
                    <nb-text class="walkthrough-title">Fast and Smooth Delivery</nb-text>
                    <nb-text class="walkthrough-description">Our delivery partners are on it to deliver your orders fast and smooth.</nb-text>
                </nb-view>
                <touchable-opacity class="walkthrough-button" :on-press="() => slide(2)">
                    <image :source="require('../../assets/images/icons/next.png')" class="walkthrough-button-icon" />
                </touchable-opacity>
            </nb-view>
            <nb-view :style="{flex:1}">
                <touchable-opacity :on-press="skipToLast" class="skip-button">
                    <nb-text note class="skip-text">Skip</nb-text>
                </touchable-opacity>
                <image :source="require('../../assets/images/walkthrough/3.png')" :style="{width:appConfig.width, alignSelf:'flex-end'}" class="walkthrough-image"/>
                <nb-view class="walkthrough-container">
                    <nb-text class="walkthrough-title">Eat and Satisfy yourself</nb-text>
                    <nb-text class="walkthrough-description">Eat the special dishes you love from your favourite kitchen. Don't forget to rate us</nb-text>
                </nb-view>
                <touchable-opacity class="walkthrough-button"  :on-press="() => slide(3)">
                    <image :source="require('../../assets/images/icons/complete.png')" class="walkthrough-button-icon" />
                </touchable-opacity>
            </nb-view>
            <nb-view :style="{flex:1}">
                <touchable-opacity class="skip-button">
                    <!-- <nb-text note class="skip-text">Skip</nb-text> -->
                </touchable-opacity>
                <image :source="require('../../assets/images/walkthrough/4.png')" :style="{width:appConfig.width-100, alignSelf:'center'}" class="walkthrough-image"/>
                <nb-view class="walkthrough-container">
                    <nb-text class="walkthrough-title" :style="{textAlign:'center'}">Location Permission</nb-text>
                    <nb-text class="walkthrough-description" :style="{fontSize:10}">Chefapp collects location data to identify nearby kitchens. This data is also used to assess if the delivery is possible to the selected locationThe Chef App collects location data to identify nearby kitchens. This data is also used to assess if the delivery is possible to the selected location, even when the app is closed or not in use</nb-text>
                    <touchable-opacity class="location-permission-button" :on-press="()=>getLocationAsync()" v-if="!isLocationReady">
                        <nb-text class="location-permission-button-text">Allow Permission</nb-text>
                    </touchable-opacity> 
                    <nb-text class="permission-granted" v-else>Location permission granted successfully</nb-text>
                </nb-view>
                <touchable-opacity class="continue-button" :on-press="skipWalkthrough" v-if="isLocationReady">
                    <nb-text class="continue-button-text">Continue</nb-text>
                </touchable-opacity>
            </nb-view>
        </IndicatorViewPager>
        <!-- </nb-content> -->
    </nb-container>
</template>

<script>
    import React from 'react'
    import { StackActions, NavigationActions } from 'react-navigation'
    import { PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator } from '@shankarmorwal/rn-viewpager'
    import * as Location from 'expo-location'
    import Geocoder from 'react-native-geocoding'
    import * as Permissions from 'expo-permissions'
    import { Toast } from 'native-base'

    export default {
        props: {
            navigation : { Object }
        },
        components:{
            PagerTabIndicator, IndicatorViewPager, PagerTitleIndicator, PagerDotIndicator
        },
        data() {
            return {
               slideNumber:0,
               isLocationReady:false
            }
        },

        methods: {
            _renderDotIndicator() {
                if(this.slideNumber==3){
                    return 
                } else {
                    return <PagerDotIndicator pageCount="4" 
                        dotStyle={{backgroundColor:'#f9e5a6', width:48,height:9,marginRight:5}}
                        selectedDotStyle={{backgroundColor:'#fcbe00',width:48,height:9,marginRight:5}} 
                        style={{justifyContent:'flex-start', bottom:135, left:25}}/>;
                }  
                /* if(this.appConfig.platform=='ios'){
                    if(this.slideNumber==3){
                        return 
                    } else {
                        return <PagerDotIndicator pageCount="4" 
                            dotStyle={{backgroundColor:'#f9e5a6', width:48,height:9,marginRight:5}}
                            selectedDotStyle={{backgroundColor:'#fcbe00',width:48,height:9,marginRight:5}} 
                            style={{justifyContent:'flex-start', bottom:135, left:25}}/>;
                    }  
                } else {
                    if(this.slideNumber==4){
                        return 
                    } else {
                        return <PagerDotIndicator pageCount="4" 
                            dotStyle={{backgroundColor:'#f9e5a6', width:48,height:9,marginRight:5}}
                            selectedDotStyle={{backgroundColor:'#fcbe00',width:48,height:9,marginRight:5}} 
                            style={{justifyContent:'flex-start', bottom:135, left:25}}/>;
                    }  
                } */
                
            },
            skipWalkthrough(){
                this.$store.commit('unsetSplash')
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({ routeName: 'Chooser' })]
                })
                this.navigation.dispatch(resetAction);
            },
            slide(slideNumber){
                this.slideNumber = slideNumber
                // console.log(this.$refs.viewPager)
                this.$refs.viewPager.setPage(slideNumber);
            },
            pageScroll(value){
                this.slideNumber = value.position
                /* console.log(value)
                console.log(this.$refs.viewPager._currentIndex) */
            },
            skipToLast(){
                this.$refs.viewPager.setPage(3);
            },
            async getLocationAsync(){
                this.isLocationReady = false
                const status = await Permissions.askAsync(Permissions.LOCATION);

                if(status.status !== 'granted' && status.status !== 'denied'){
                    Toast.show({ text: 'Permission to access location was denied.', duration: 3000 });
                    this.isLocationReady = true
                } else {
                    this.isLocationReady = true
                }

                await Location.getCurrentPositionAsync({
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
                        this.$store.commit('setSelectedLocation', {
                            addressComponents:addressComponents,
                            address:formatted_address,
                            addressTitle: addressTitle,
                            addressSubtitle: addressSubtitle,
                            country: addressComponents.country ? addressComponents.country : '',
                            countryCode: addressComponents.countryCode ? addressComponents.countryCode : '',
                            currency: addressComponents.countryCode ? this.getCurrencyCode(addressComponents.countryCode) : 'AED',
                            coords: coords
                        })
                        // this.isLocationLoaded = true
                    })
                    .catch(error => 
                        console.warn(error)
                    );
                })
            },
        },
    }
</script>

<style>
    .skip-button{
        margin-top: 55;
        align-self: flex-end;
        margin-right:30;
    }
    .skip-text{
        color:#fcbe00;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .walkthrough-image{
        height:50%;
        margin-top:25;
        resize-mode: contain;
        margin-bottom: 30;
    }
    .walkthrough-container{
        padding-horizontal:25;
    }
    .walkthrough-title{
        font-size: 16;
        color: #364151;
        margin-bottom: 4;
        font-family: Montserrat_ExtraBold;
    }
    .walkthrough-description{
        color: #656565;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .walkthrough-button{
        bottom: -35;
        align-self: flex-end;
        margin-right: 25;
    }
    .walkthrough-button-icon{
        height: 41;
        width: 41;
    }
    .continue-button{
        height: 50;
        margin-top: 30;
        background-color: #fcbe00;
        margin:20;
        justify-content: center;
        border-radius: 7;
        align-items: center;
    }
    .continue-button-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_Medium;
    }

    /* Permission */

    .location-permission-button{
        align-items: center;
        justify-content: center;
        align-self: center;
        margin-vertical: 10;
        border-radius: 4;
        padding-vertical: 5;
        padding-horizontal: 15;
        background-color: #fcbe00;
    }
    .location-permission-button-text {
        font-size: 16;
        color: #FFFFFF;
        margin-bottom: 4;
        font-family: Montserrat_Medium;
    }

    .permission-granted{
        font-size: 16;
        color: #06b23f;
        align-self: center;
        margin-top: 15;
        font-family: Montserrat_Medium;
    }
</style>