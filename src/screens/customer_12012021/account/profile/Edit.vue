<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Edit Profile" :style="{position:'relative', zIndex:99999}"/>
        <!-- <nb-content> -->
        <nb-content padder>
            <InputWithError :error="$v.form.name.$dirty && (!$v.form.name.required || errors.name)"
                    :msg="errors.name!='' ? errors.name : 'Name field is required'">
                <nb-label class="input-label">Name</nb-label>
                <nb-input class="input-field" v-model="form.name" placeholder="Name" :on-blur="() => $v.form.name.$touch()" />
            </InputWithError>
            <InputWithError
                :error="$v.form.email.$dirty && (!$v.form.email.required || $v.form.email.$invalid || errors.email)"
                :msg="errors.email!='' ? errors.email : 'Email field is required'">
                <nb-label class="input-label">Email</nb-label>
                <nb-input  class="input-field" v-model="form.email" placeholder="Email"
                    :on-blur="() => $v.form.email.$touch()" />
            </InputWithError>
            <InputWithError
                :error="$v.form.phone.$dirty && (!$v.form.phone.required || $v.form.phone.$invalid || errors.phone)"
                :msg="errors.phone!='' ? errors.phone : 'Email field is required'">
                <nb-label class="input-label">Phone</nb-label>
                <nb-input   keyboardType="phone-pad" class="input-field" v-model="form.phone" placeholder="Email"
                    :on-blur="() => $v.form.phone.$touch()" />
            </InputWithError>
            <nb-button rounded block class="address-button" :on-press="()=>editProfile()"><nb-text>Edit Profile</nb-text></nb-button>
        </nb-content>
        <RBSheet
            ref="otpVerify"
            height="200"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopLeftRadius:5, borderTopRightRadius:5
                }
            }"
            :onClose="()=>{ }"
        >
           <nb-content padder>
                <!-- <nb-view class="modal-instruction"> -->
                <nb-text class="enter-otp-head">Please verify your OTP</nb-text>
                <nb-view class="otp-container">
                    <OTPInputView
                        :style="{width: '100%', height: 30,}"
                        :pinCount=4
                        :codeInputFieldStyle="{width: 40, height: 45, borderWidth: 0, borderBottomWidth: 2,fontSize:24, fontFamily:'Montserrat_Bold', color:'#364151'}"
                        :codeInputHighlightStyle="{borderColor: '#fcbe00', borderBottomWidth:2}"
                        :onCodeFilled="(code)  => { 
                            otp = code
                            verifyOTP()
                        }"
                    />
                </nb-view>
                <nb-text v-if="otptemp" class="timer">{{otptemp}}</nb-text> 
            <!-- </nb-view> -->
            </nb-content>
        </RBSheet>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import OTPInputView from '@twotalltotems/react-native-otp-input'
import { required,minLength,email } from 'vuelidate/lib/validators'
import Constants from 'expo-constants'
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
            timerValue: 30,
            form:{
                name: this.$store.state.user.username,
                email: this.$store.state.user.email,
                phone: this.$store.state.user.phone,
            },
            errors:{
                name: '',
                email: '',
                phone:'',
            },
            otpVerification: false,
            otp: '',
            otptemp:'',
            isLoading: false
        }
    },
    validations:{
        form: {
            name: {
                required,
            },
                email: {
                required,
                email
            },
            phone: {
                required
                
            },
        }
    },

    methods: {
        editProfile() {
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            if(!this.$v.form.$error && !this.$v.form.required){
                this.isLoading = true
                this.api.create({
                    method: 'post',
                    url: this.api.routes.updateProfile,
                    headers: {'Authorization': AuthStr,'Content-Type' :'application/json' },
                    data: {
                        name: this.form.name,
                        email: this.form.email,
                        phone: this.form.phone,               
                    }, 
                })
                .then(response => { 
                    console.log(response.data)
                    if(response.data.status==1){
                        this.$store.commit('user/setProfile', {
                            name : response.data.customer.name,
                            email : response.data.customer.email,
                            phone : response.data.customer.phone,
                            id : response.data.customer.id,
                        })
                        Toast.show({
                            text: response.data.message,
                            // buttonText: "Okay",
                            duration: 3000
                        });
                        this.isLoading = false
                        this.navigation.dispatch(StackActions.replace({ routeName: 'Profile' }));
                    } else if(response.data.status==2) {
                        console.log(response.data)
                        this.otptemp=response.data.otp;
                        Toast.show({
                            text: response.data.message,
                            // buttonText: "Okay",
                            duration: 30000
                        });
                        this.otpVerification = true
                        this.isLoading = false
                        this.$refs.otpVerify.open();
                    } else {
                        this.isLoading = false
                        console.log(response.data.message)
                    }
                })
                .catch(error => {
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
                this.$v.form.$touch();
                Toast.show({
                    text: error.response.data.message,
                    duration: 3000
                });
            }
        } ,

        verifyOTP(){
            console.log(this.otp);
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
            this.isLoading = true
            this.api.create({
                method: 'POST',
                url:this.api.routes.veryfyOtp,
                headers: {'Authorization': AuthStr },
                data: {
                    email: this.form.email,
                    name: this.form.name,
                    phone: this.form.phone,
                    verification_otp: this.otp
                }, 
            })
            .then(response => { 
                //console.log(response.data)
                if(response.data.status==1){
                    this.$store.commit('user/setProfile', {
                        name : response.data.customer.name,
                        email : response.data.customer.email,
                        phone : response.data.customer.phone,
                        // id : response.data.customer.id,
                    })
                    
                    Toast.show({
                        text: response.data.message,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    this.otpVerification = false
                    this.$refs.otpVerify.close();
                    this.otptemp='';
                    this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'Profile' }));
                    
                } 
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
                Toast.show({
                    text: error.response.data.message,
                    // buttonText: "Okay",
                    duration: 3000
                });
            });
        }   
    },

}
</script>

<style>
    .input-field{
        margin-bottom: 0;
        font-size: 13;
    }
    .input-label{
        font-size: 11;
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
    }
    .current-address-change{
        font-size: 12;
        color: #fcbe00;
    }
    .address-button{
        margin-top:30;
    }

      /* Modal */


    .modal-close{
        margin: 17;
        align-self: flex-end;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
    }
    .modal-instruction{
        margin-top: 20;
    }


    .modal-input-field{
        margin-bottom: 8;
    }
    .modal-input{
        font-size: 12;
        color: #cbc7c7;
        margin-bottom: -8;
    }
    .modal-footer{
        height: 47;
        flex-direction: row;
        border-top-width: 2;
        border-top-color: #e4e1e1;
    }

    .modal-add-cart-button{
        background-color: #fcbe00;
      
        flex: 1;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .add-cart-button-text{
        font-size: 14;
        color: #FFFFFF;
        font-family: Montserrat_Medium;
        
    }
    .enter-otp-head{
        font-size: 14;
        color: #a0a4a8;
        /* margin-top: 15; */
    }
    .otp-container{
        background-color: #FFFFFF;
        border-radius: 20;
        elevation: 3;
        margin-top: 15;
        padding-vertical: 30;
        padding-horizontal: 23; 
    }

</style>