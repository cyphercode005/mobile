<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Set Delivery Location" />
        <nb-content>
            <nb-view padder>
                <GooglePlacesAutocomplete
                    placeholder='Enter new Address'
                    :minLength=2 
                    :autoFocus= false
                    :listViewDisplayed= true
                    keyboardShouldPersistTaps="always"
                    returnKeyType="default"
                    nearbyPlacesAPI="GoogleReverseGeocoding"
                    :fetchDetails= true
                    :renderRow="(location) => renderDescription(location)"
                    :renderDescription="(row)=> row.description || row.formatted_address || row.name"
                    :on-press="(data, details=null) => {
                         changePlace(details);
                    }"
                    :styles="{
                        textInputContainer: {
                            height:42,
                            borderWidth:1,
                            borderRadius: 4,
                            marginBottom: 10,
                            borderColor: '#d3d3d3',
                            alignItems:'center'
                        },
                        textInput: {
                            marginLeft: 0,
                            marginRight: 0,
                            height: 36,
                            color: '#5d5d5d',
                            marginBottom:0,
                            fontSize: 14,
                        },
                        listView: {
                            position: 'absolute',
                            backgroundColor: '#FFFFFF',
                            zIndex: 10,
                            marginTop: 80
                        },
                        description: {
                            padding:0
                        },
                        container: {
                            backgroundColor:'transparent',
                            alignItems:'center'
                        },
                        separator:{
                            backgroundColor:'#FFFFFF'
                        }, 
                        predefinedPlacesDescription: {
                            color: 'red',
                        },
                        row: {
                            paddingHorizontal:0,
                            paddingVertical:10,
                            backgroundColor:'transparent'

                        },
                        loader: {
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            height: 20,
                        },
                    }"
                    :currentLocation=true
                    currentLocationLabel="Use my location"
                    :isRowScrollable=false
                    :enablePoweredByContainer=false
                    :query="{
                        key: googleApiKey,
                        language: 'en', // language of the results
                        //types: 'address' // default: 'geocode' -->
                    }"
                    :GooglePlacesDetailsQuery="{
                        fields: 'formatted_address,geometry'
                    }"
                />
            </nb-view>
            <nb-text v-if="savedAddresses" class="address-header">Delivery Location</nb-text>
            <nb-list v-if="savedAddresses">
                <nb-list-item avatar noBorder class="search-location-item" v-for="savedAddress in savedAddresses" :key="savedAddress.id" :on-press="()=>setDeliveryAddress(savedAddress)">
                    <nb-left :style="{marginLeft:0}">
                        <image :source="require('../../../../assets/images/icons/location-filled.png')" class="search-location-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="search-location-title">{{ savedAddress.name }}</nb-text>
                        <nb-text class="search-location-address">{{savedAddress.address_line1}}, {{savedAddress.address_line2}}, {{savedAddress.landmark}}</nb-text>
                    </nb-body>
                </nb-list-item>
            </nb-list>
        </nb-content>
    </nb-container>
</template>

<script>
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Geocoder from 'react-native-geocoding'
import React from 'react'
import { Icon } from 'react-native-elements'
import {Text,View, Image} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props:{
        navigation : { Object }
    },
    components: {
            GooglePlacesAutocomplete
        },
    data() {
        return {
            search:'',
            googleApiKey: '',
            savedAddresses:'',
            isLoading: false
        }
    },
    beforeMount(){
        this.getAddress()
        this.googleApiKey = this.appConfig.googleApiKey
        Geocoder.init(this.appConfig.googleApiKey)
    },
    methods:{
        getAddress() {
            if(this.$store.state.user.loggedIn){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                var status=true;
                this.api.create({
                    method: 'GET',
                    url: this.api.routes.address,
                    headers: {'Authorization': AuthStr,'Content-Type': 'application/json' },
                })
                .then(response => { 
                    this.savedAddresses=response.data.address;
                    this.isLoading = false
                    // console.log('savedAddress1');
                    // console.log(this.savedAddresses);
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                }) 
                return status;
            }
        },
        /* renderLeftButton(){
            return(
            <Image source={require('../../../assets/images/icons/search.png')} style={{width:16,height:16,marginLeft:15,marginRight:5}}/>
            )
        }, */
        renderDescription(location){
            if(location.structured_formatting){
                return (
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('../../../../assets/images/icons/location-filled.png')} style={{height:13,width: 13,marginTop:3,resizeMode: 'contain', marginRight:10}} />
                        <View>
                            <Text style={{ fontSize: 12,color: '#646464',fontFamily:'Montserrat_Regular',lineHeight: 14,flexWrap: 'wrap'}}>{(location.structured_formatting ? location.structured_formatting.secondary_text : location.description)}</Text>
                        </View>
                    </View>
                )
            } else if(location.isCurrentLocation){
                return (
                    <View style={{paddingTop: 12,flexDirection:'row',alignItems:'center',height:this.appConfig.platform==='android' ? 10 : undefined}}>
                        <Image source={require('../../../../assets/images/icons/location-pointer.png')} style={{width:15,height:15}} />
                        <Text style={{fontSize:12,color: '#fcbe00',fontFamily:'Montserrat_Regular',marginLeft: 11}}>{location.description}</Text>
                    </View>
                )
            } else if(location.formatted_address) {
                return (
                    <View style={{flexDirection:'row'}}>
                        <Image source={require('../../../../assets/images/icons/location-filled.png')} style={{height:13,width: 13,marginTop:3,resizeMode: 'contain', marginRight:10}} />
                        <View>
                            <Text style={{ fontSize: 12,color: '#646464', fontFamily:'Montserrat_Regular',lineHeight: 14,flexWrap: 'wrap'}}>{location.formatted_address}</Text>
                        </View>
                    </View>
                )
            }
        },
        setDeliveryAddress(savedAddress){
            console.log()
            this.$store.commit('user/setDeliveryAddress', savedAddress.id)
            this.changePlace({
                geometry: {
                    location: {
                        lat : parseFloat(savedAddress.latitude),
                        lng : parseFloat(savedAddress.longitude)
                    }
                }
            })
        },
        changePlace(details) {
            this.isLoading = true
            let coords = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng
            }
            Geocoder.from(
                parseFloat(details.geometry.location.lat),parseFloat(details.geometry.location.lng)
            )
            .then(json => {
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
                setTimeout(() => {
                    // this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'Home' }))
                }, 1000)
                console.log('completed')
            })
            .catch(error => {
                this.isLoading = false
                console.warn(error)
            } );
        },
     }
}
</script>

<style>
    .searchbox{
        height:37;
        margin-bottom: 10;
        margin-top: -10;
        border-bottom-width: 0;
        background-color: #fbfbfb;
    }
    .address-header{
        padding-horizontal: 15;
        margin-bottom: 5;
    }
    .search-input{
        font-size:14;
        border-bottom-width: 0;
        padding-horizontal: 15;
    }
    .search-icon{
        width:24;
        height:24;
        margin-left:15;
        margin-right:5;
    }
    .current-location{
        padding-top: 12;
        flex-direction: row;
        align-items: center;
        padding-left: 8;
        padding-bottom: 10;
        
    }
    .current-location-icon{
        width: 15;
        height: 15;
    }
    .current-location-text{
        font-size:12;
        color: #fcbe00;
        margin-left: 11;
    }
    .search-location-icon{
        height:13;
        width: 13;
        resize-mode: contain;
    }
    .search-location-title{
        font-size: 12;
        padding-bottom: 5;
    }
    .search-location-address{
        font-size: 12;
        color: #646464;
        line-height: 14;
    }
    .search-location-item{
        margin-bottom: -6;
    }
</style>