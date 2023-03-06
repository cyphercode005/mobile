<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Profile Creation" :registration=true />
        <nb-content padder >
            <MapView 
                :zoomEnabled="false"
                :scrollEnabled="false"
                :initialRegion="{
                    latitude: $store.state.selectedLocation.coords.latitude,
                    longitude: $store.state.selectedLocation.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }"
                :region=region
                provider="google"
                :style="{width:'100%',height:150, borderRadius:4, marginBottom:10}"
                :on-press="()=>{navigation.navigate('KitchenLocation')}"
            >
                <Marker
                    :coordinate="marker"
                >
                    <image :source="require('../../../../../assets/images/icons/kitchen-icon.png')" :style="{height: 35, width:35, resizeMode:'contain' }" />
                </Marker>
                </MapView>
            <nb-item regular :class="($v.form.kitchenName.$dirty && !$v.form.kitchenName.required) || errors.name ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.kitchenName=text}" :defaultValue="form.kitchenName" placeholder="Kitchen Name"
                :on-blur="() => $v.form.kitchenName.$touch()" />
            </nb-item>
            <nb-item regular :class="($v.form.email.$dirty && !$v.form.email.required) || errors.email ?'input-item-error':'input-item'" >
                <nb-input :on-change-text="(text)=>{form.email=text}" :defaultValue="form.email" placeholder="Email Address"
                :on-blur="() => $v.form.email.$touch()" />
            </nb-item>
            <nb-item regular :class="($v.form.phone.$dirty && !$v.form.phone.required) || errors.phone ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.phone=text}" :defaultValue="form.phone" keyboardType="phone-pad" :editable="false" placeholder="Phone" 
                :on-blur="() => $v.form.phone.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.addressLine1.$dirty && !$v.form.addressLine1.required ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.addressLine1=text}" :defaultValue="form.addressLine1" placeholder="Address Line 1" 
                :on-blur="() => $v.form.addressLine1.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.addressLine2.$dirty && !$v.form.addressLine2.required ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.addressLine2=text}" :defaultValue="form.addressLine2" placeholder="Address Line 2"
                :on-blur="() => $v.form.addressLine2.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.streetName.$dirty && !$v.form.streetName.required ?'input-item-error':'input-item'" >
                <nb-input :on-change-text="(text)=>{form.streetName=text}" :defaultValue="form.streetName" placeholder="Street Name"
                :on-blur="() => $v.form.streetName.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.landmark.$dirty && !$v.form.landmark.required ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.landmark=text}" :defaultValue="form.landmark" placeholder="Landmark" 
                :on-blur="() => $v.form.landmark.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.country.$dirty && !$v.form.country.required ?'input-item-error':'input-item'" >
                <nb-input :editable="false" :on-change-text="(text)=>{form.country=text}" :defaultValue="form.country" placeholder="Country" 
                :on-blur="() => $v.form.country.$touch()"/>
            </nb-item>
             <nb-item regular :class="$v.form.state.$dirty && !$v.form.state.required ?'input-item-error':'input-item'" >
                <nb-input :editable="false" :on-change-text="(text)=>{form.state=text}" :defaultValue="form.state" placeholder="State"
                 :on-blur="() => $v.form.state.$touch()"/>
            </nb-item>
            <nb-item regular :class="$v.form.city.$dirty && !$v.form.city.required ?'input-item-error':'input-item'" > 
                <nb-input :on-change-text="(text)=>{form.city=text}" :defaultValue="form.city" placeholder="City" 
                :on-blur="() => $v.form.city.$touch()"/>
            </nb-item>
            <!-- <nb-view class="row-split"> -->
            <nb-item regular  :class="$v.form.postcode.$dirty && !$v.form.postcode.required ?'input-item-error':'input-item'" class="input-item">
                <nb-input :on-change-text="(text)=>{form.postcode=text}" :defaultValue="form.postcode" keyboardType="phone-pad" placeholder="postcode" 
                :on-blur="() => $v.form.postcode.$touch()"/>
            </nb-item>
             
            <!-- </nb-view> -->
            <nb-view class="delivery-type">
                <nb-view class="delivery-type-item">
                    <nb-text class="delivery-item-text">Enable Kitchen Delivery</nb-text>
                    <nb-checkbox color="#fcbe00" :checked="form.delivery" :on-press="deliveryType"/>
                </nb-view>
            </nb-view>

            <nb-button block rounded class="button-next" :on-press="()=>register()">
                <nb-text>Next</nb-text>
            </nb-button>
        </nb-content>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import { required,minLength,email } from 'vuelidate/lib/validators'
import MapView, {Marker} from 'react-native-maps'
import Geocoder from 'react-native-geocoding'
import Constants from 'expo-constants'

export default {
    state : { 
        region: {},
    },
    props: {
        navigation: { Object },
        
    },
    components: {
        MapView,Marker
    },
    data() {
        return {
            marker: {
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
            },
            region:{ 
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
            form:{ 
                delivery:false,
                kitchenName:'',
                email:'',
                phone: this.$store.state.kitchen.phone,
                addressLine1:'',
                addressLine2:'',
                streetName:'',
                landmark:'',
                country:'',
                state:'',
                city:'',
                postcode:'',
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude,
                countryCode:'',
                stateCode:''
            },
            errors: {
                name: '',
                email: '',
                phone: ''
            },
            isLoading:false
        }
    },
    validations:{
        form: {
            kitchenName:{
                required,
            },
            email:{
                required,
                email
            },
            phone:{
                required,
            },
            addressLine1:{
                required,
            },
            addressLine2:{
                required,
            },
            streetName:{
                required,
            },
            landmark:{
                required,
            },
            country:{
                required,
            },
            state:{
                required,
            },
            city:{
                required,
            },
            postcode:{
                required,
            },
            latitude:{
                required,
            },
            longitude:{
                required,
            },
        }
    },
    beforeMount(){
        this.isLoading=true
        const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication)
        this.api.kitchen({
            method: 'POST',
            url: this.api.routes.getProfile,
            headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
        })
        .then(response => { 
            console.log('addressComponents1')
            console.log(response.data.kitchen.country_code)
            console.log('addressComponents')
            console.log(this.$store.state.selectedLocation.addressComponents)
            this.form.kitchenName =isNaN(response.data.kitchen.name.en)?response.data.kitchen.name.en:''
            this.form.email = response.data.kitchen.email!=response.data.kitchen.phone+'@thechef.com' ? response.data.kitchen.email : ''
            this.form.phone = response.data.kitchen.phone
            this.form.addressLine1 = response.data.kitchen.address_line_1
            this.form.addressLine2 = response.data.kitchen.address_line_2
            this.form.city = response.data.kitchen.city ? response.data.kitchen.city : (this.$store.state.selectedLocation.addressComponents.administrative_area_level_2 ? this.$store.state.selectedLocation.addressComponents.administrative_area_level_2 : '')

            this.form.streetName = response.data.kitchen.street_name ? response.data.kitchen.street_name : this.$store.state.selectedLocation.addressComponents.neighborhood
            this.form.landmark = response.data.kitchen.landmark ? response.data.kitchen.landmark : this.$store.state.selectedLocation.addressComponents.political
            this.form.country = response.data.kitchen.country ? response.data.kitchen.country_name : this.$store.state.selectedLocation.addressComponents.country
            this.form.state = response.data.kitchen.state_name ? response.data.kitchen.state_name : this.$store.state.selectedLocation.addressComponents.stateName
            
            this.form.postcode = response.data.kitchen.postcode ? response.data.kitchen.postcode : this.$store.state.selectedLocation.addressComponents.postal_code
            this.stateCode = response.data.kitchen.state_code ? response.data.kitchen.state_code : this.$store.state.selectedLocation.addressComponents.stateCode
            this.countryCode = response.data.kitchen.country_code ? response.data.kitchen.country_code : this.$store.state.selectedLocation.addressComponents.countryCode

            this.latitude= response.data.kitchen.latitude ? parseFloat(response.data.kitchen.latitude) : this.$store.state.selectedLocation.coords.latitude
            this.longitude= response.data.kitchen.longitude ? parseFloat(response.data.kitchen.longitude) : this.$store.state.selectedLocation.coords.longitude
            this.delivery = response.data.kitchen.delivery ? 1 : 0
            this.marker = {
                latitude: response.data.kitchen.latitude ? parseFloat(response.data.kitchen.latitude) : this.$store.state.selectedLocation.coords.latitude,
                longitude: response.data.kitchen.longitude ? parseFloat(response.data.kitchen.longitude) : this.$store.state.selectedLocation.coords.longitude
            }
            this.region = { 
                latitude: response.data.kitchen.latitude ? parseFloat(response.data.kitchen.latitude) : this.$store.state.selectedLocation.coords.latitude,
                longitude: response.data.kitchen.longitude ? parseFloat(response.data.kitchen.longitude) : this.$store.state.selectedLocation.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }

            /* this.form.postcode = this.$store.state.selectedLocation.addressComponents.postal_code
            this.form.state = this.$store.state.selectedLocation.addressComponents.administrative_area_level_1
            this.form.country = this.$store.state.selectedLocation.addressComponents.country
            this.form.streetName = this.$store.state.selectedLocation.addressComponents.neighborhood
            this.form.landmark = this.$store.state.selectedLocation.addressComponents.political
            this.stateCode = this.$store.state.selectedLocation.addressComponents.administrative_area_level_1_short
            this.countryCode = this.$store.state.selectedLocation.addressComponents.country_short
            this.latitude= this.$store.state.selectedLocation.coords.latitude
            this.longitude= this.$store.state.selectedLocation.coords.longitude */
            this.isLoading=false
        })
        .catch(error => {
            // console.log(error.response.data);  
            this.isLoading=false
            console.log(error); 
        }) 
        console.log(" address_",this.$store.state.selectedLocation.addressComponents)
        this.googleApiKey = this.appConfig.googleApiKey,
        Geocoder.init(this.appConfig.googleApiKey)
    },
    methods: {
        deliveryType(){
            this.form.delivery = !this.form.delivery
        },
        register(){
            console.log(this.$store.state.kitchen.authentication);
            this.$v.form.$touch()
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            if(!this.$v.form.required){
                this.isLoading=true
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.register,
                    headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr  },    
                    data:{
                        name:this.form.kitchenName,
                        email:this.form.email,
                        phone:this.form.phone,
                        delivery:this.form.delivery,
                        address_line_1:this.form.addressLine1,
                        address_line_2:this.form.addressLine2,
                        street_name:this.form.streetName,
                        landmark:this.form.landmark,
                        country_id:this.countryCode,
                        state_id:this.stateCode,
                        city:this.form.city,
                        postcode:this.form.postcode,
                        latitude:this.form.latitude,
                        longitude:this.form.longitude
                    },
                })
                .then(response => { 
                    this.$store.commit('kitchen/setProfile', {
                        name : response.data.kitchen.name,
                        email : response.data.kitchen.email,
                        phone : response.data.kitchen.phone,
                        id : response.data.kitchen.id,
                        description : response.data.kitchen.description,
                    })
                    Toast.show({
                        text: response.data.message,
                        duration : 3000
                    });
                    this.isLoading=false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenRegisterFinal' }))
                })
                .catch(error => {
                    console.log(error.response.data);
                    if(error.response){
                        for (const key in error.response.data.errors) {
                            if(key=='email' || key=='name' || key=='phone'){
                                if (error.response.data.errors.hasOwnProperty(key)) {
                                    this.errors[key]= error.response.data.errors[key][0];
                                }
                            }
                        }
                    }
                    
                    this.isLoading=false
                }) 
            } else {
                console.log('else case')
                this.$v.form.$touch()
            }
        },
    },
}
</script>

<style>
    .input-item{
        border-radius: 4;
        border-color: #d1d1d1;
        height: 45;
        flex: 1;
        margin-bottom: 10;
    }
    .input-item-error{
        border-radius: 4;
        border-color: #e94444;
        height: 45;
        flex: 1;
        margin-bottom: 10;
    }
    .row-split{
        flex-direction: row;
        justify-content: space-evenly;
    }
    .button-next{
        margin-top: 25;
    }
     .delivery-type{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5;
        margin-right: 10;
        margin-bottom: 10
    }
    .delivery-type-item{
        flex-direction: row;
        justify-content: space-around;
    }
    .delivery-item-text{
        font-size: 12;
        color: #999999;
        font-family: Montserrat_Medium;
    }
</style>