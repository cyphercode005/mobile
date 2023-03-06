<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Phone Verification" />
        <nb-content padder>
            <nb-text class="enter-otp-head">Enter your OTP here</nb-text>
            <nb-view class="otp-container">
                <OTPInputView
                    :style="{width: '100%', height: 45,}"
                    :pinCount=4
                    autoFocusOnLoad
                    :codeInputFieldStyle="{width: 40, height: 45, borderWidth: 0, borderBottomWidth: 2,fontSize:24, fontFamily:'Montserrat_Bold', color:'#364151'}"
                    :codeInputHighlightStyle="{borderColor: '#fcbe00', borderBottomWidth:2}"
                    :onCodeFilled="(code)  => { 
                        otp = code
                        verifyOTP()
                    }"
                />
            </nb-view>
            <nb-text class="timer">{{otp}}</nb-text>
            <nb-text :style="{color:'red',fontSize:14,alignSelf:'flex-start'}" v-if="errors.otp">{{ errors.otp }}</nb-text>
            <nb-text class="resend-otp-text">Didn't you received any code ?</nb-text>
            <touchable-opacity :on-press="resendOTP">
                <nb-text class="resend-button-text">Click Resend</nb-text>
            </touchable-opacity>
        </nb-content>
    </nb-container>
</template>

<script>
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { StackActions, NavigationActions } from 'react-navigation'
import { Toast } from 'native-base'

export default {
    props: {
        navigation: { Object }
    },
    components:{
        OTPInputView
    },
    data() {
        return {
            otp: '',
            phone: this.navigation.state.params.mobile,
            prefix:this.navigation.state.params.prefix,
            url:this.navigation.state.params.url,
            otp:this.navigation.state.params.otp,
            errors:{
                otp: ''
            },
            isLoading: false
        }
    },

    methods: {
        verifyOTP(){
            console.log('verifyOTP');
            console.log(this.otp.length);
            if (!this.otp && this.otp.length != 4) {
                this.errors.otp = "Please enter the verification OTP";
                return true;
            } else {
                this.errors.otp = "";
            }

            if(this.otp.length==4)
            {
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                console.log('AuthStr') 
                console.log(AuthStr)
                this.api.create({
                    method: 'post',
                    url: this.api.routes.otpVerify,
                    headers: { Authorization: AuthStr },
                    data: {
                        otp: this.otp,
                    },
                })
                .then(response => { 
                     console.log(response);
                    if(response.data.status == 1){
                        this.$store.commit('user/setLoggedIn')
                        Toast.show({
                            text: response.data.message,
                            duration: 3000
                        });
                    if(this.$store.state.cart.cart.length >0){
                            this.api.create({
                                method: 'POST',
                                url: this.api.routes.cartStore,
                                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                                data:{ cart:this.$store.state.cart.cart, latitude: this.$store.state.selectedLocation.coords.latitude,
                                    longitude: this.$store.state.selectedLocation.coords.longitude}
                            })
                            .then(response => { 
                                this.cartCount=response.data.cartCount;
                                this.cartTotal=response.data.cartTotal;
                                this.grandTotal=response.data.cartTotal;
                                this.carts=response.data.cart;
                                console.log(this.carts);
                                this.$store.commit('cart/unsetCart');
                                this.$store.commit('cart/unsetCartCount');
                                this.$store.commit('cart/unsetCartTotal');
                            })
                            .catch(error => {
                                    console.log(error.response.data);
                                    console.log(error);
                                Toast.show({
                                    text: "Something went Wrong ",
                                    duration: 3000
                                });
                            })
                            this.navigation.dispatch(StackActions.replace({ routeName: 'Checkout' }))
                        }
                        this.isLoading = false

                        if(this.$store.state.user.username==this.$store.state.user.phone){
                            this.navigation.dispatch(StackActions.replace({ routeName: 'Login'}));
                        } else {
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'customer' })]
                            })
                            this.navigation.dispatch(resetAction);
                        }
                    } else {
                        this.isLoading = false
                        Toast.show({
                            text: response.data.error,
                            // buttonText: "Okay",
                            duration: 3000
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.isLoading = false
                    Toast.show({
                        text: error.response.data.error,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                });  
            }
        },
        resendOTP(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'POST',
                url: this.api.routes.resendOTP,
                headers: { 'Content-Type': 'application/json',Authorization: AuthStr },
                data:{
                    phone:this.phone,
                    prefix:this.prefix,
                }
            })
            .then(response => { 
                this.isLoading = false
                this.navigation.replace('ConfirmOTP',{mobile:this.phone,prefix:this.prefix,otp:response.data.verification_otp});
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
        }
    },
}
</script>


<style>
    .enter-otp-head{
        font-size: 12;
        color: #a0a4a8;
        margin-top: 15;
    }
    .otp-container{
        background-color: #FFFFFF;
        border-radius: 20;
        elevation: 3;
        margin-vertical:50;
        padding-vertical: 30;
        padding-horizontal: 23; 
    }
    .resend-otp-text{
        font-size: 12;
        color: #a0a4a8;
    }
    .resend-button-text{
        font-size: 12;
        color: #52575c;
        font-family: Montserrat_Bold;
    }
</style>