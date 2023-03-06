<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <nb-view class="verification" padder v-model="initCheckStatus">
            <image :source="require('../../../../../assets/images/kitchen/verification.png')" class="verification-image" />
            <nb-text class="verification-title">Verification on process</nb-text>
            <nb-text class="verification-description">Your request for verification has been recieved. Our KYC team will be verifying your documents and details soon and welcome you on board to The Chef app</nb-text>
        </nb-view>
        <nb-view padder>
            <nb-button block rounded :on-press="()=>logout()"><nb-text class="button-text">Register New Kitchen</nb-text></nb-button>
        </nb-view>
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
            isLoading: false
        }
    },
    computed: {
        initCheckStatus(){
            this.checkStatus()
        }
    },
    methods: {
        checkStatus(){
            this.isLoading = true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getUser,
                headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            })
            .then(response => {
                console.log(response.data)
                if(response.data.approval_status){
                    this.$store.commit('kitchen/setApprovalStatus')
                    Toast.show({
                        text: 'Verfication Successful',
                        duration : 3000
                    });
                    this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenHome'}))
                } else if(!response.data.verification_request_date) {
                    this.isLoading = false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenRegister'}))
                } else {
                    this.isLoading = false
                    setTimeout(function(){
                        Toast.show({
                            text: 'Checking Verification Status',
                            duration: 2000
                        })
                        this.checkStatus()
                    }.bind(this), 10000);
                }
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
        },
        logout() {
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'GET',
                url: this.api.routes.logout,
                headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },   
                    })
            .then(response => { 
                this.$store.commit('kitchen/unsetUser');
                this.$store.commit('kitchen/unsetImage');
                this.$store.commit('unsetUserType');
                const resetAction = StackActions.reset({
                    index: 0,
                    key: "authStackNavigator",
                    actions: [NavigationActions.navigate({ routeName: "Chooser" })]
                });
                this.navigation.dispatch(resetAction);
            })
            .catch(error => {
                console.log(error.response.data);
            })
        }
    },
}
</script>

<style>
    .verification{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .verification-image{
        height: 250;
        width: 100%;
        resize-mode: contain;
        margin-bottom: 25;
    }   
    .verification-title{
        font-size: 22;
        color: #707070;
        font-family: Montserrat_SemiBold;
        margin-bottom: 15;
    }
    .verification-description{
        font-size: 12;
        color: #707070;
        padding-horizontal: 15;
        text-align: center;
    }
    .button-text{
        font-size:18;
        color: #FFFFFF;
    }
</style>