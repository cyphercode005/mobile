<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="" />
        <nb-content padder>
            <image :source="require('../../../../assets/images/logo.png')" class="login-logo" />
            <nb-view class="form-fields">
                <nb-text class="login-head">Welcome To The Chef</nb-text>
                <nb-item class="input-name">
                    <nb-input :on-change-text="(text)=>{name=text}" :defaultValue="name" placeholder="Please enter your name" />
                </nb-item>
                <nb-text note :style="{textAlign:'left', alignSelf:'flex-start', marginTop:3, color:'#e84a44'}" v-if="errors.name">{{errors.name}}</nb-text>
                <nb-button block rounded class="login-button" :on-press="setName"><nb-text class="button-text">Login</nb-text></nb-button>
            </nb-view>
        </nb-content>
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object } 
    },
    data() {
        return {
            name: '',
            errors: {
                name: ''
            }
        }
    },
    methods: {
        setName(){
            console.log('test')
            this.errors.name = ''
            if(this.name.length<3){
                this.errors.name = "Please enter a valid name"
            } else {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.setProfileName,
                    headers: { Authorization: AuthStr },
                    data: {
                        name: this.name,
                    },
                })
                .then(response => { 
                    console.log(response.data);
                    this.$store.commit('user/setProfileName', response.data.user.name)
                    Toast.show({
                        text: response.data.message,
                        // buttonText: "Okay",
                        duration: 3000
                    });
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'customer' })]
                    })
                    this.navigation.dispatch(resetAction);

                })
                .catch(error => {
                    console.log(error.response.data);
                    Toast.show({
                        text: 'Something went wrong!!',
                        // buttonText: "Okay",
                        duration: 3000
                    });
                })
            }
        }
    },
}
</script>

<style>
    .login-logo{
        height: 170;
        resize-mode: contain;
        align-self: center;;
        margin-bottom: 48;
    }
    .login-head{
        color: #364151;
        font-size: 24;
        font-family: Montserrat_Bold;
        width: 50%;
        margin-bottom: 20;
    }
    .input-name{
        width: 80%;
        border-bottom-color: #c4c3c3;
    }
    .button-text{
        font-size:18;
        color: #FFFFFF;
    }
    .login-button{
        margin-top: 50;
    }
</style>