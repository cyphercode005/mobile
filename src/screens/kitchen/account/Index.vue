<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="My Account" />
        <nb-content  padder>
            <nb-view class="kitchen-profile-edit">
                <nb-text class="kitchen-profile-text">Kitchen Profile</nb-text>
                <touchable-opacity :on-press="()=>{navigation.navigate('KitchenEditProfile')}" class="edit-profile">
                    <image :source="require('../../../../assets/images/kitchen/edit-profile.png')" class="edit-profile-icon"/>
                    <nb-text class="edit-profile-text">Edit</nb-text> 
                </touchable-opacity>
            </nb-view>
            <image-background class="profile-image" :imageStyle="{borderRadius: 7}" :source="image ? {uri:image} :require('../../../../assets/images/kitchen/kitchen.png')" >
                <LinearGradient
                    :colors="['transparent', '#fcbe00']"
                    :style="{padding: 15, height:'100%',borderRadius:7}">
                    <nb-text class="kitchen-name">{{name}}</nb-text>
                </LinearGradient>
            </image-background>
            <nb-text class="kitchen-description">{{description}}</nb-text>
            <nb-view class="separator-2"></nb-view>
            <nb-list>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{navigation.navigate('ScheduleKitchenMenu')}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/schedule.png')" class="menu-icon" :style="{tintColor:'#fcbe00'}"/>
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Food Schedule</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{navigation.navigate('KitchenPayout')}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/payout.png')" class="menu-icon" :style="{tintColor:'#fcbe00'}"/>
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Kitchen Payouts</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{navigation.navigate('KitchenInformation',{infoId:6})}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/terms-condition.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Terms and Conditions</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{navigation.navigate('KitchenFAQ')}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/support.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Frequently Asked Questions</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{ navigation.navigate('KitchenSupport')}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/support.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Support</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{navigation.navigate('KitchenInformation',{infoId:5})}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/aboutus.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">About Us</nb-text>
                    </nb-body>
                </nb-list-item>
                <!-- <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/wallet.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title">Wallet</nb-text>
                    </nb-body>
                </nb-list-item> -->
                <nb-list-item icon noBorder class="profile-menu-item" button :on-press="()=>{}">
                    <nb-left>
                        <image :source="require('../../../../assets/images/kitchen/logout.png')" class="menu-icon" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title" :on-press="()=>{logout()}">Logout</nb-text>
                    </nb-body>
                </nb-list-item>
            </nb-list>
        </nb-content>
        <footer-Kitchen :navigation="navigation" />
    </nb-container>
</template>

<script>
import { LinearGradient } from 'expo-linear-gradient'
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        LinearGradient
    },
    data() {
        return {
            profile:'',
            name:this.$store.state.kitchen.name.en,
            description:this.$store.state.kitchen.description.en,
            image:this.$store.state.kitchen.image,
        }
     },
    methods:
    {
        logout() {
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.api.kitchen({
                method: 'GET',
                url: this.api.routes.logout,
                headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },   
                    })
            .then(response => { 
                // this.$store.commit('kitchen/unsetVerificationStatus');
                // this.$store.commit('kitchen/unsetAuthentication');
                this.$store.commit('kitchen/unsetUser');
                this.$store.commit('kitchen/unsetImage');
                this.$store.commit('unsetUserType');
                console.log('logout',response.data);
                // this.navigation.dispatch(StackActions.replace({ routeName: 'kitchen' }));
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
      computed:{
     
    }
}
</script>

<style>
    .kitchen-profile-edit{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 11;
    }
    .kitchen-profile-text{
        font-size: 13;
        color: #999999;
    }
    .edit-profile{
        border-radius: 5;
        border-width: 1;
        border-color: #fcbe00;
        height: 25; 
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding-horizontal: 10
    }
    .edit-profile-icon{
        width: 15;
        height: 15;
        resize-mode: contain;
        margin-right: 8;
    }
    .edit-profile-text{
        font-family: Montserrat_Medium;
        font-size: 13;
        color: #999999
    }
    .profile-image{
        border-radius: 7;
        width: 100%;
        background-color: #FFFFFF;
        height: 130;
        resize-mode: contain;
        margin-bottom: 14;
    }
    .kitchen-name{
        font-size: 16;
        font-family: Montserrat_SemiBold;
        color: #FFFFFF;
        align-items: flex-end;
        bottom:15;
        margin-left: 15;
        position: absolute;
    }
    .kitchen-description{
        font-size: 12;
        color: #000000;
    }
    .profile-menu-item{
        margin-left: 10;
    }
    .menu-icon{
        width: 22;
        height: 22  ;
        resize-mode: contain;
    }
    .menu-title{
        font-family: Montserrat_Medium;
        font-size: 14;
    }
    .separator-2{
        margin-top: 10;
        border-bottom-color: #cccccc;
        border-bottom-width: 1;
        margin-bottom: 20;
    }
</style>