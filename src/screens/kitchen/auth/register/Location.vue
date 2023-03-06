<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="" :style="{position:'relative', zIndex:99999}"/>
        <nb-view :style="{position:'absolute', zIndex:2, width:'100%', marginTop:50, paddingHorizontal:15}">
            <GooglePlacesAutocomplete
                placeholder='Enter Location'
                :minLength=2
                :autoFocus= false
                :listViewDisplayed=true
                :enablePoweredByContainer=false
                keyboardShouldPersistTaps="always"
                returnKeyType="default"
                :fetchDetails= true
                :on-press="(data, details=null) => {
                    changePlace(details);
                    Object.assign(
                        marker, {
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng
                        },
                        region,{
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng 
                        }
                    ),
                    showSearchPlace = false
                }"
                :styles="{
                    textInputContainer: {
                        backgroundColor: 'rgba(0,0,0,0)',
                        borderTopWidth: 0,
                        borderBottomWidth:0, 
                        height: 40,
                        marginBottom:2
                    },
                    textInput: {
                        marginLeft: 0,
                        marginRight: 0,
                        height: 40,
                        color: '#5d5d5d',
                        fontSize: 16,
                    },
                    container: {
                        backgroundColor:'#FFFFFF',
                        borderRadius:4,
                        elevation: 3,
                    },
                    predefinedPlacesDescription: {
                        color: '#1faadb'
                    },
                    listView: {
                        backgroundColor:'#FFFFFF'
                    },
                    row: {
                        backgroundColor:'transparent'
                    }
                }"
                :currentLocation=false
                :query="{
                    key: googleApiKey,
                    language: 'en', // language of the results
                    // types: '(cities)' // default: 'geocode'
                }"
                :GooglePlacesDetailsQuery="{
                    fields: 'formatted_address,geometry'
                }"
            />
        </nb-view>
        <MapView
            :initialRegion="{
                latitude: $store.state.selectedLocation.coords.latitude,
                longitude: $store.state.selectedLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }"
            :region=region
            provider="google"
            :style="{width:'100%',flex:1, marginTop:-55}"
        >
            <Marker draggable
                :coordinate="{
                    'latitude' : marker.latitude,
                    'longitude' : marker.longitude,
                }"
                :onDragEnd="(e) => { changeMarker(e.nativeEvent.coordinate)} "
                :on-change="(e) => { changeMarker(e.nativeEvent) }"
            >
                <image :source="require('../../../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
            </Marker>
        </MapView>
        <nb-view class="button-container">
            <nb-button block rounded class="confirm-button" :on-press="()=>confirmLocation()">
                <nb-text>Confirm Location</nb-text>
            </nb-button>
        </nb-view>
    </nb-container>
</template>

<script>
import MapView, {Marker} from 'react-native-maps'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Geocoder from 'react-native-geocoding'
import Constants from 'expo-constants'
import {StackActions, navigationActions} from 'react-navigation'
export default {
    state : { 
            region: {},
    },
    props: {
        navigation: { Object } 
    },
    components: {
        MapView,GooglePlacesAutocomplete, Marker
    },
    data() {
        return {
            marker: {
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
            },
            region:{ 
                latitude:this.$store.state.selectedLocation.coords.latitude,
                longitude:  this.$store.state.selectedLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            format_address:'',
            latitude:this.$store.state.selectedLocation.coords.latitude,
            longitude:  this.$store.state.selectedLocation.coords.longitude,
            googleApiKey: '',
            showSearchPlace: false,
            selectedLocation: ''
        }
    },
    beforeMount(){
        this.googleApiKey = this.appConfig.googleApiKey,
        Geocoder.init(this.appConfig.googleApiKey)
    },
    methods: {
        changePlace(details) {
            // console.log(details)
            this.format_address=details.formatted_address;
            this.latitude = details.geometry.location.lat,
            this.longitude= details.geometry.location.lng
            this.region={
                latitude:details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            this.marker= {
                latitude:details.geometry.location.lat,
                longitude: details.geometry.location.lng,
            }
            let coords = {
                latitude: this.latitude,
                longitude: this.longitude
            }
            Geocoder.from(
                this.latitude,this.longitude
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
                this.selectedLocation = {
                    addressComponents:addressComponents,
                    address:formatted_address,
                    addressTitle: addressTitle,
                    addressSubtitle: addressSubtitle,
                    coords: coords,
                }
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
                console.log(this.selectedLocation)
            })
            .catch(error => 
                console.warn(error)
            );
            // this.changeMarker(details)
        },
        changeMarker(details) {
            // console.log(details)
            let coords = {
                latitude: details.latitude,
                longitude: details.longitude
            }
            Geocoder.from(
                details.latitude,details.longitude
            )
            .then(json => {
                var formatted_address = json.results[0].formatted_address;
                var address_components=json.results[0].address_components;
                var addressComponents = {};
                address_components.forEach(component => {
                    var title= component.types[0]
                    addressComponents[title] = component.long_name;
                    /* if(title == 'country'){
                        addressComponents[title+'_short'] = component.short_name;
                    }
                    if(title =='administrative_area_level_1'){
                        addressComponents[title+'_short'] = component.short_name;
                    } */
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
                this.selectedLocation = {
                    addressComponents:addressComponents,
                    address:formatted_address,
                    addressTitle: addressTitle,
                    addressSubtitle: addressSubtitle,
                    coords: coords,
                }
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
            })
            .catch(error => 
                console.warn(error)
            );
            console.log( this.format_address)
            this.latitude=details.latitude,
            this.longitude= details.longitude
            this.region={
                latitude:details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
            this.marker={
                latitude:this.latitude,
                longitude: this.longitude,
            }  
        },
        confirmLocation(){
            if(this.selectedLocation.length>0)
            {
            this.$store.commit('setSelectedLocation', this.selectedLocation)
            }
            this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenRegister'}))
        }
    },
}
</script>

<style>
    .button-container{
        background-color: transparent;
        padding: 15;
        position: relative;
        bottom: 0;
    }
</style>