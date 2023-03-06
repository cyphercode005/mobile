<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Phone Verification" />
        <nb-content padder>
            <nb-text class="enter-otp-head">Enter your OTP here</nb-text>
            <nb-view class="otp-container" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.3,shadowRadius: 1.2}">
                <OTPInputView
                    ref="otpField"
                    :style="{width: '100%', height: 45,}"
                    :pinCount=4
                    :autoFocusOnLoad="false"
                    :codeInputFieldStyle="{width: 40, height: 45, borderWidth: 0, borderBottomWidth: 2,fontSize:24, fontFamily:'Montserrat_Bold', color:'#364151'}"
                    :codeInputHighlightStyle="{borderColor: '#fcbe00', borderBottomWidth:2}"
                    :onCodeFilled="(code)  => { 
                        otp = code
                        verifyOTP()
                    }"
                />
            </nb-view>
            
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
            // otp:'',
            otp:this.navigation.state.params.otp,
            phone: this.navigation.state.params.mobile,
            prefix:this.navigation.state.params.prefix,
            timerValue: 30,
            errors:{
                otp: ''
            },
            isLoading: false
        }
    },
    mounted() {
        
        // this.copyCodeFromClipBoardOnAndroid();
        /* setTimeout(() => {
            this.bringUpKeyBoardIfNeeded();
        }, 50);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
        setInterval(() => {
            if(!this.timerValue<1)
                this.timerValue = this.timerValue - 1
        }, 1000) */
    },
    methods: {
        verifyOTP(){
            if (!this.otp && this.otp.length != 4) {
                this.errors.otp = "Please enter the verification OTP";
                return true;
            } else {
                this.errors.otp = "";
            }

            if(this.otp.length==4) {
                // this.mobile = this.navigation.state.params.mobile
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
                this.api.kitchen({
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
                        this.$store.commit('kitchen/setLoggedIn')
                        Toast.show({
                            text: response.data.message,
                            duration: 3000
                        });
                        this.insertToken()
                        this.isLoading = false
                        var routeCount = (this.navigation.dangerouslyGetParent().state.routes).length
                        this.navigation.dispatch(StackActions.pop({n:routeCount-1}));
                        this.navigation.dispatch(StackActions.replace({ routeName: 'kitchen' }))
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
                    this.isLoading = false
                    console.log(error);
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
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.resendOTP,
                headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr },
                data:{
                    phone:this.phone,
                    prefix:this.prefix,
                }
            })
            .then(response => { 
                this.isLoading = false
                this.navigation.replace('KitchenConfirmOTP',{mobile:this.phone,prefix:this.prefix,otp:response.data.verification_otp});
            })
            .catch(error => {
                this.isLoading = false
                console.log(error);
            }) 
        },
        insertToken(){
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
            this.api.kitchen({
                method: 'post',
                url: this.api.routes.insertToken,
                headers: { Authorization: AuthStr },
                data: {
                    token:this.$store.state.token.token,
                }, 
            })
            .then(response => { 
                console.log(response.data);
            })
            .catch(error => {
                // console.log(error.response.data)
            });
        },
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