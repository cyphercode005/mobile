<template>
    <nb-container>
        <Spinner
          :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Support" />
        <nb-content padder>
            <image class="support-logo" :source="require('../../../../assets/images/kitchen/logo.png')"/>
            <nb-text class="support-head">Write us your queries</nb-text>
            <nb-text class="support-subhead">Your words means a lot to us.</nb-text>
            <nb-item floatingLabel class="form-input" :style="{ marginBottom: errors.phone ? 0 : 15 }">
                <nb-label class="input-label" >Phone</nb-label>
                <nb-input keyboardType="phone-pad" :on-change-text="(text)=>{phone=text}" :defaultValue="phone" :editable="false"/>
            </nb-item>
            <nb-text v-if="errors.phone" :style="{color:'red',fontSize:11, marginBottom:15}">{{ errors.phone }}</nb-text>
            <!-- <nb-item floatingLabel class="form-input">
                <nb-label note >Your Message</nb-label>
                <nb-textarea v-model="message" :rowSpan="3" /> 
                <nb-textarea v-model="message"/> -->

            <!-- </nb-item> --> 
            
            <nb-text class="input-label" :style="{marginBottom:10}">Your Message</nb-text>
            <nb-textarea :on-change-text="(text)=>{message=text}" :defaultValue="message" :rowSpan="3" class="input-textarea"/> 
            <nb-text v-if="errors.message" :style="{color:'red',fontSize:11}">{{ errors.message }}</nb-text>
        </nb-content>
        <nb-view class="footer">
            <touchable-opacity class="cancel-button" :on-press="()=>{ navigation.goBack() }">
                <nb-text class="cancel-button-text">Cancel</nb-text>
            </touchable-opacity>
            <touchable-opacity class="send-button" :on-press="()=>sendMessage()">
                <nb-text class="send-button-text">Send</nb-text>
            </touchable-opacity>
        </nb-view>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import {StackActions, navigationActions} from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            phone: this.$store.state.kitchen.phonePrefix+this.$store.state.kitchen.phone,
            message:'',
            sendResult:'',
            errors: {
                phone: '',
                message: ''
            },
            isLoading: false
        }
    },
    methods: {
        sendMessage(){
            this.errors.phone = ''
            this.errors.message = ''
            if(!this.phone){
                this.errors.phone = 'Phone number is required'
            }
            if(!this.message){
                this.errors.message = 'Please enter your feedback'
            }
            if(!this.errors.message && !this.errors.phone){
                this.isLoading = true
                const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
                console.log(this.message);   
                this.api.kitchen({
                method: 'POST',
                    url: this.api.routes.support,
                    data :{phone:this.phone,message:this.message},
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                })
                .then(response => { 
                    console.log(response.data);
                    this.sendResult=response.data;
                    if(this.sendResult.status == true){
                        Toast.show({
                            text: "Message Send Successfully",
                            duration: 3000
                        }); 
                        this.isLoading = false
                        this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenProfile' }))
                    }
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                }) 
            }
        }
    },
}
</script>

<style>
    .support-logo{
        height: 110;
        width: 100%;
        resize-mode: contain;
        margin-top: 10;
        margin-bottom: 50;
    }
    .support-head{
        font-family: Montserrat_SemiBold;
        font-size: 16;
        color: #364151;
        margin-bottom: 4;
    }
    .support-subhead{
        font-family: Montserrat_Medium;
        font-size: 12;
        color: #364151;
        margin-bottom: 10;
    }
    .form-input{
        margin-top:15
    }
    .footer{
        flex-direction: row;
        height: 48;
        border-top-width:.5;
        border-top-color: #ececec;
    }
    .cancel-button{
        flex: 1;
        background-color: #FFFFFF;
        justify-content: center;
        align-items: center;
    }
    .cancel-button-text{
        color: #b74c04;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .send-button{
        flex: 1;
        background-color: #fcbe00;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 20;
    }
    .send-button-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .input-label{
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .input-textarea{
        border-radius: 4;
        border-color: #d1d1d1;
        border-width: 0.5;
        background-color: #f7f7f7;
        flex: 1;
        font-family: Montserrat_Regular;
        font-size: 12;
        /* margin-bottom: 10; */
        padding-top: 8;
    }
</style>