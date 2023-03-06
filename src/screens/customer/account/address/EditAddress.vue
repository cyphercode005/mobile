<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <animated:view :style="{position:'absolute', zIndex:2, width:'100%', marginBottom:15}">
            <header :navigation="navigation" headerTitle="" :style="{position:'relative', backgroundColor:'transparent', zIndex:99999}"/>
        </animated:view>
        <nb-content>
            <nb-view :style="{position:'absolute', zIndex:2, width:'100%', marginTop:50, paddingHorizontal:15}" v-if="showSearchPlace">
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
            <nb-view>
                <MapView
                    :initialRegion="{
                        latitude: $store.state.selectedLocation.coords.latitude,
                        longitude: $store.state.selectedLocation.coords.longitude,
                        latitudeDelta: 0.00922,
                        longitudeDelta: 0.00421,
                    }"
                    :region=region
                    provider="google"
                    :style="{width:'100%',height:mapHeight}"
                    :on-press="(e) => {
                        Object.assign(
                            marker, {
                                latitude: e.nativeEvent.coordinate.latitude,
                                longitude: e.nativeEvent.coordinate.longitude
                            }
                        )
                        changeMarker(e.nativeEvent.coordinate);
                    }"> 
                    <Marker draggable
                        :coordinate="{
                            'latitude' : marker.latitude,
                            'longitude' : marker.longitude
                        }"
                        :onDragEnd="(e) => { changeMarker(e.nativeEvent.coordinate)} "
                        :on-change="(e) => { changeMarker(e.nativeEvent) }"
                    >
                        <image :source="require('../../../../../assets/images/icons/address-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                    </Marker>
                </MapView>
            </nb-view>
            <nb-text v-if="errors.location" :style="{color:'red',fontSize:11}">{{errors.location}}</nb-text>
            <nb-view class="address-form" padder v-if="!isLoading">
                <nb-view class="current-address-section">
                    <nb-text class="current-address">{{ selectedLocation ? selectedLocation : $store.state.selectedLocation.address }}</nb-text>
                    <touchable-opacity :on-press="()=>{ showSearchPlace = true }">
                        <nb-text class="current-address-change">Change</nb-text>
                    </touchable-opacity>
                </nb-view>
                
                <InputWithError :error="$v.form.name.$dirty && (!$v.form.name.required || errors.name)"
                    :msg="errors.name!='' ? errors.name : 'Name field is required'">
                    <nb-label class="input-label">Name</nb-label>
                    <nb-input class="input-field" :on-change-text="(text)=>{form.name=text}" :defaultValue="form.name" placeholder="Name" :on-blur="() => $v.form.name.$touch()" />
                </InputWithError>
                <InputWithError
                        :error="$v.form.houseNo.$dirty && (!$v.form.houseNo.required || errors.houseNo)"
                        :msg="errors.houseNo!='' ? errors.houseNo : 'House No. / Name field is required'">
                        <nb-label class="input-label">House No. / Name</nb-label>
                        <nb-input  class="input-field" :on-change-text="(text)=>{form.houseNo=text}" :defaultValue="form.houseNo" placeholder="House No. / Name"
                            :on-blur="() => $v.form.houseNo.$touch()" />
                </InputWithError>
                <InputWithError
                        :error="$v.form.street.$dirty && (!$v.form.street.required || errors.street)"
                        :msg="errors.street!='' ? errors.street : 'Street field is required'">
                        <nb-label class="input-label">Street</nb-label>
                        <nb-input  class="input-field" :on-change-text="(text)=>{form.street=text}" :defaultValue="form.street" placeholder="Street"
                            :on-blur="() => $v.form.street.$touch()" />
                    </InputWithError>
                    <InputWithError
                        :error="$v.form.landmark.$dirty && (!$v.form.landmark.required || errors.landmark)"
                        :msg="errors.landmark!='' ? errors.landmark : 'Landmark field is required'">
                        <nb-label class="input-label">Land Mark</nb-label>
                        <nb-input class="input-field" :on-change-text="(text)=>{form.landmark=text}" :defaultValue="form.landmark" placeholder="Landmark"
                            :on-blur="() => $v.form.landmark.$touch()" />
                    </InputWithError>
                    <InputWithError
                        :error="$v.form.mobile.$dirty && (!$v.form.mobile.required || $v.form.mobile.$invalid || errors.mobile)"
                        :msg="errors.mobile!='' ? errors.mobile : 'Mobile Number field is required'">
                        <nb-label class="input-label">Mobile Number</nb-label>
                        <nb-input keyboardType="phone-pad" class="input-field" :on-change-text="(text)=>{form.mobile=text}" :defaultValue="form.mobile" placeholder="Mobile Number"
                            :on-blur="() => $v.form.mobile.$touch()" />
                    </InputWithError>
                <nb-button rounded block class="address-button" :on-press="()=>editAddress()"><nb-text>Edit Address</nb-text></nb-button>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
    import { StackActions, NavigationActions } from 'react-navigation'
    import MapView, {Marker} from 'react-native-maps'
    import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
    import { required,minLength, maxLength, numeric, email } from 'vuelidate/lib/validators'
    import Geocoder from 'react-native-geocoding'
    import Constants from 'expo-constants'
    import { Toast } from 'native-base'
    export default {
        state : { 
            region: {},
        },
        props: {
            navigation: { Object }
        }, 
        components: {
             MapView, Marker, GooglePlacesAutocomplete, Constants
        },
        data() {
            return {
                statusHeight: this.appConfig.height/2.58,
                mapHeight: this.appConfig.height/2,
                statusVisibility : false,
                marker: {
                    latitude: this.$store.state.selectedLocation.coords.latitude,
                    longitude: this.$store.state.selectedLocation.coords.longitude,
                },
                form:{
                    name: '',
                    houseNo: '',
                    street: '',
                    landmark:'',
                    mobile: '',
                },
                errors:{
                    name: '',
                    houseNo: '',
                    street: '',
                 
                    landmark:'',
                    mobile: '',
                },
                region:{ 
                    latitude:this.$store.state.selectedLocation.coords.latitude,
                    longitude:  this.$store.state.selectedLocation.coords.longitude,
                    latitudeDelta: 0.00922,
                    longitudeDelta: 0.00421,
                },
                format_address:'',
                latitude:'',
                longitude:'',
                editId:'',
                addressType: 0,
                googleApiKey: '',
                showSearchPlace: false,
                selectedLocation: '',
                countryCode:'',
                stateCode:'',
                stateName:'',
                isLoading: false
            }
        },
        validations:{
            form: {
                name: {
                    required,
                },
                houseNo: {
                    required,
                },
                street: {
                    required,
                },
                 landmark: {
                    required,
                },
                mobile: {
                    required,
                    numeric,
                    maxLength: maxLength(10),
                    minLength: minLength(10)
                },  
            }
        },
    beforeMount(){
        this.mapContent()
        this.googleApiKey = this.appConfig.googleApiKey,
        Geocoder.init(this.appConfig.googleApiKey)
    },
    methods: {
        mapContent() {
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            //this.addressId=this.navigation.state.params.addressId;
            // console.log(this.addressId);
            this.isLoading = true
        
            this.api.create({
                method: 'post',
                url:  this.api.routes.getAddressById,
                headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                data: {
                    addressId:this.navigation.state.params.addressId,
                }, 
            })
            .then(response => { 
                // console.log(response.data);
                //this.address=response.data.address;
                this.form.name=response.data.address.name;
                this.form.houseNo=response.data.address.address_line_1;
                this.form.street=response.data.address.address_line_2;
                this.form.landmark=response.data.address.landmark;
                //this.form.area=response.data.address.area;
                this.form.mobile=response.data.address.phone;
                if(response.data.address.latitude!=''){
                    this.latitude=parseFloat(response.data.address.latitude),
                    this.longitude= parseFloat(response.data.address.longitude)
                    this.region={
                        latitude:this.latitude,
                        longitude: this.longitude,
                        latitudeDelta: 0.00922,
                        longitudeDelta: 0.00421,
                    }
                    this.marker={
                        latitude:this.latitude,
                        longitude: this.longitude,
                    } 
                }     
                this.isLoading = false

            })
            .catch(error => {
                for (const key in error.response.data.errors) {
                    if (error.response.data.errors.hasOwnProperty(key)) {
                        this.errors[key]= error.response.data.errors[key][0];
                    }
                }
                this.isLoading = false
                console.log(error.response.data)                   
            });
            return true;
        },
        selectAddressType(type) {
            this.addressType = type;
        },
        changePlace(details) {
            this.selectedLocation = details.formatted_address
            this.format_address=details.formatted_address;
            this.form.street=details.formatted_address;
            this.latitude=details.geometry.location.lat,
            this.longitude= details.geometry.location.lng
            this.region={
                latitude:details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }
            this.marker={
                    latitude:details.geometry.location.lat,
                    longitude: details.geometry.location.lng,
            }
        },

        changeMarker(details) {
            Geocoder.from(
                details.latitude,details.longitude
            )
            .then(json => {
                var addressComponent = json.results[0].formatted_address;
                this.format_address=addressComponent;
                this.form.street=addressComponent;
            })
            .catch(error => 
                console.warn(error)
            );
            this.latitude=details.latitude,
            this.longitude= details.longitude
            this.region={
                latitude:details.latitude,
                longitude: details.longitude,
                latitudeDelta: 0.00922,
                longitudeDelta: 0.00421,
            }
            this.marker={
                latitude:this.latitude,
                longitude: this.longitude,
            }
        },
        editAddress() {
            if(this.latitude=='' ||this.longitude==''){
                this.errors.location = 'Please select your location from map';
            } else {
                this.errors.location = '';
            }   
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            if(!this.$v.form.$error && !this.errors.location){
                this.isLoading = true
                this.api.create({
                    method: 'post',
                    url: this.api.routes.addAddress,
                    headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                    data: {
                        edit_id:this.navigation.state.params.addressId,
                        name: this.form.name,
                        address_1: this.form.houseNo,
                        address_2: this.form.street,
                        type:1,
                        address_type:1,
                        default_status:1,
                        phone: this.form.mobile,
                        latitude:this.latitude,
                        longitude:this.longitude,
                        landmark:this.form.landmark,
                    }, 
                })
                .then(response => { 
                    console.log(response.data)
                    var routeName = 'ManageAddress'
                    if(this.navigation.state.params) {
                        if(this.navigation.state.params.routeName){
                            routeName = this.navigation.state.params.routeName
                        }
                    }
                    this.isLoading = false
                    this.navigation.goBack()
                    Toast.show({
                        text: "Address Updated Successfully",
                        duration: 3000
                    });
                })
                .catch(error => {
                    console.log(error)
                    // var data_error= error.response.data.errors;
                    for (const key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            this.errors[key]= error.response.data.errors[key][0];
                        }
                    }
                    console.log(error.response.data)
                    this.$v.form.$touch()
                    this.isLoading = false
                });
            } else {
                console.log('else case')
                this.$v.form.$touch()
            } 
        },
    },
}
</script> 

<style>
    .input-field{
        margin-bottom: -3;
        font-size: 12;
    }
    .input-label{
        font-size: 12;
    }
    .input-item{
        margin-top: 10;
        font-size: 12;
    }
    .current-address-section{
        flex-direction: row;
        justify-content: space-between;
    }
    .current-address{  
        font-size: 12;
        color: #818080;
        flex: 1;
        font-family: Montserrat_Medium;
        margin-right: 5;
    }
    .current-address-change{
        font-size: 12;
        color: #fcbe00;
    }
    .address-button{
        margin-top:30;
    }
</style>