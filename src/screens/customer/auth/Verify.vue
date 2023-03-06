<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <nb-header iosBarStyle="dark-content" :style="{backgroundColor:'transparent', border:'none', borderShadow:'none', elevation:0, width:'100%'}">
            <nb-left>
                <nb-button transparent :on-press="() =>chooser()">
                    <!-- <nb-icon name="back" /> -->
                    <image :source="require('../../../../assets/images/icons/arrow-back.png')" class="navigate-back" />
                </nb-button>
            </nb-left>
            <nb-body class="center">
                <nb-title class="navigate-header-text">Verify Phone Number</nb-title>
            </nb-body>
        </nb-header>
        <nb-content padder>
            <nb-view :style="{paddingHorizontal:15}">
                <nb-text class="verify-message">We have sent you an SMS with a code to number </nb-text>
                <nb-view class="phone-section">
                    <nb-view class="phone-number">
                        <PhoneInput ref="phonePrefix" keyboardType="phone-pad" :textStyle="{fontSize:18,color:'#364151',fontFamily:'Montserrat_SemiBold',marginTop:4}" :textProps="{ editable:false }" class="phone-prefix" :initialCountry="initialCountry" :autoFormat="true" :value="phonePrefix" :onSelectCountry="onSelectCountry"/>
                        <nb-view class="seperator-vertical"></nb-view>
                        <nb-item class="phone-input">
                            <nb-input :on-change-text="(text)=>{mobile=text}" :defaultValue="mobile" keyboardType="phone-pad" :style="{fontSize:18,color:'#364151',fontFamily:'Montserrat_SemiBold',paddingLeft:5}" :on-blur="() => $v.mobile.$touch()"/>
                            <touchable-opacity :on-press="()=>reset()">
                                <image :source="require('../../../../assets/images/icons/close_o.png')" class="input-clear" />
                            </touchable-opacity>
                        </nb-item>
                    </nb-view>
                    <nb-text note :style="{textAlign:'left', alignSelf:'flex-start', marginTop:3, color:'#e84a44'}" v-if="$v.mobile.$dirty && (!$v.mobile.required || $v.mobile.$invalid || errors.mobile)">{{errors.mobile!='' ? errors.mobile : ($v.mobile.required && !$v.mobile.$numeric) ? 'Mobile number entered is invalid' : 'Mobile field is required'}}</nb-text>
                </nb-view>
                <nb-button block rounded :on-press="()=>login()"><nb-text class="button-text">Confirm</nb-text></nb-button>
            </nb-view>
            <touchable-opacity :on-press="skip" class="skip-button">
                <nb-text note class="skip-text">Skip & go to Home</nb-text>
            </touchable-opacity>
        </nb-content>
    </nb-container>
</template>

<script>
import PhoneInput from 'react-native-phone-input'
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import { required, numeric, minLength, maxLength,email } from 'vuelidate/lib/validators'

export default {
    props:{
        navigation: { Object }
    },
    components:{
        PhoneInput
    },
    data() {
        return {
            initialCountry: this.$store.state.selectedLocation.countryCode ? (this.$store.state.selectedLocation.countryCode).toLowerCase() : 'in',
            phonePrefix: '',
            mobile: '',
            errors:{
                mobile: ''
            },
            isLoading: false
        }
    },
    validations:{
        mobile: {
            required,
            numeric,
            maxLength: maxLength(10),
            minLength: minLength(10)
        }
    },
    beforeMount() {
        this.errors.mobile = ''
    },
    mounted() {
        this.phonePrefix = '+'+this.$refs.phonePrefix.getCountryCode()
    },
    methods: {
        skip() {
            this.$store.commit('setSkipLogin')
            this.navigation.navigate('Home')
        },
        chooser() {
            this.$store.commit('unsetSkipLogin')
            this.$store.commit('unsetUserType')
            this.navigation.dispatch(StackActions.replace({ routeName: 'Chooser'}))
        },
        reset() {
            this.errors.mobile=''
            this.mobile='';
        },
        login() {
            this.$v.$touch()
            if(!this.$v.$error){
                this.isLoading = true
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.login,
                    headers: { 'Content-Type': 'application/json' },
                    data:{
                        phone:this.mobile,
                        prefix: this.phonePrefix,
                        country_code: this.initialCountry
                    }
                })
                .then(response => { 
                    console.log(response.data);
                    this.$store.commit('user/setUser', {
                        name : response.data.user.name,
                        email : response.data.user.email,
                        phone : response.data.user.phone,
                        id : response.data.user.id,
                        phonePrefix: response.data.user.phone_prefix,
                        loggedIn: false,
                        authentication : response.data.access_token,
                        verificationStatus : response.data.user.verification_status,
                        status : response.data.user.status
                    })
                    this.isLoading = false
                    this.navigation.navigate('ConfirmOTP',{mobile:this.phone,prefix:this.prefix,otp:response.data.verification_otp,url:this.url});
                })
                .catch(error => {
                    this.isLoading = false
                    if(error.response){
                        Toast.show({
                            text: error.response.data.message,
                            duration: 3000
                        }); 
                    }
                    console.log(error.response.data);
                }) 
            } else {
                this.$v.$touch()
            }
        },
        onSelectCountry(){
            this.phonePrefix = '+'+this.$refs.phonePrefix.getCountryCode()
            this.initialCountry = this.$refs.phonePrefix.getISOCode()
            if(!this.$store.state.selectedLocation.countryCode){
                this.$store.commit('setCountryCode', (this.$refs.phonePrefix.getISOCode()).toUpperCase())
            }
        },
    },
}
</script>




<style>
    .navigate-back{
        width:17;
        resizeMode:contain;
    }
    .header{
        background-color: transparent;
    }
    .navigate-header-text{
        font-size: 16;
        color: #364151;
        font-family: Montserrat_Bold;
    }

    .skip-button{
        margin-top: 30;
        align-self: center;

    }
    .skip-text{
        color:#fcbe00;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }

    .verify-message{
        color: #a0a4a8;
        font-size: 12;
        align-self: center;
        margin-bottom: 80;
    }
    .phone-number{
        background-color: #f5f1f1;
        border-radius: 21;
        flex-direction: row;
        padding-horizontal: 15;
        height: 49;
        align-items: center;
    }
    .phone-section{
        margin-bottom: 35;
    }
    .phone-prefix{
        flex: 3;
        margin-right: 5;
    }
    .phone-input{
        flex: 7;
        border-bottom-width: 0;
    }
    .seperator-vertical{
        border-width: 1;
        height: 30;
        border-color:#cacccf;
    }
    .button-text{
        font-size:18;
        color: #FFFFFF;
    }
    .input-clear{
        height: 22;
        width: 22;
    }
</style>