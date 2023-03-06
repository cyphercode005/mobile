<template>
    <nb-container>
        <header :navigation="navigation" headerTitle="Profile" />
        <nb-content padder>
            <nb-view class="profile-head">
                <image :source="require('../../../../assets/images/logo.png')" class="profile-image" />
                <nb-view class="profile-body">
                    <nb-view class="profile-name-edit">
                        <nb-text class="profile-name">{{name!=''?name:'Profile Name'}}</nb-text>
                        <touchable-opacity v-if="authToken!=''" :on-press="()=>{navigation.navigate('ProfileEdit')}">
                            <nb-text class="profile-edit-text">Edit</nb-text>
                        </touchable-opacity>
                    </nb-view>
                    <nb-text class="profile-email">{{email!=''?email:''}}</nb-text>
                    <nb-text class="profile-phone">{{phone!=''?phone:''}}</nb-text>
                </nb-view>
            </nb-view>
            <nb-list>
                <nb-list-item v-if="authToken!=''" :on-press="()=>{navigation.navigate('AddressList')}" icon noBorder class="profile-menu-item">
                 
                    <nb-left>
                        <nb-view class="menu-icon-background">
                            <image :source="require('../../../../assets/images/icons/pin.png')" class="menu-icon" />
                        </nb-view>
                    </nb-left>
                    <nb-body  >
                        <nb-text class="menu-title">Manage Address</nb-text>
                    </nb-body>
              
                </nb-list-item>

                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-left>
                        <nb-view class="menu-icon-background">
                            <image :source="require('../../../../assets/images/icons/heart-filled.png')" class="menu-icon" />
                        </nb-view>
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title" :on-press="()=>{navigation.navigate('Favorite')}">Favourites</nb-text>
                    </nb-body>
                </nb-list-item>
                <!-- <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-left>
                        <nb-view class="menu-icon-background">
                            <image :source="require('../../../../assets/images/icons/info.png')" class="menu-icon" />
                        </nb-view>
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title" :on-press="()=>{navigation.navigate('Information',{slug:2})}">Order Help</nb-text>
                    </nb-body>
                </nb-list-item> -->
                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-left>
                        <nb-view class="menu-icon-background">
                            <image :source="require('../../../../assets/images/icons/info.png')" class="menu-icon" />
                        </nb-view>
                    </nb-left>
                    <nb-body>
                        <nb-text class="menu-title" :on-press="()=>{navigation.navigate('Information',{slug:1})}">Terms & Conditions</nb-text>
                    </nb-body>
                </nb-list-item>
            </nb-list>
            <nb-view class="separator"></nb-view>
            <!-- <nb-view class="about-app">
                <nb-text class="about-head">About App</nb-text>
                <nb-text class="about-description">Description, We and our partners store and/or access personal data, such as unique</nb-text>
            </nb-view> -->
            <nb-list>
                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-body>
                        <nb-text class="menu-title-without-icon" :on-press="()=>{navigation.navigate('Information',{slug:7})}">About App</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-body>
                        <nb-text class="menu-title-without-icon" :on-press="()=>{navigation.navigate('Faq')}">FAQ</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-body>
                        <nb-text class="menu-title-without-icon" :on-press="()=>{navigation.navigate('Feedback')}">Feedback</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item">
                    <nb-body>
                        <nb-text class="menu-title-without-icon">Rate Us</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" v-if="isLogged">
                    <nb-body>
                        <nb-text class="menu-title-without-icon" :on-press="()=>{logout()}">Logout</nb-text>
                    </nb-body>
                </nb-list-item>
                <nb-list-item icon noBorder class="profile-menu-item" v-else>
                    <nb-body>
                        <nb-text class="menu-title-without-icon" :on-press="()=>{navigation.navigate('Verify',{routeName:'Home'})}">Login</nb-text>
                    </nb-body>
                </nb-list-item>
                
            </nb-list>
        </nb-content>
        <footer :navigation="navigation" />
    </nb-container>
</template>

<script>
import { StackActions, NavigationActions } from 'react-navigation'
export default {
    props: {
        navigation: { Object }
    },
 data() {
        return {
          
            authToken:this.$store.state.user.authentication,
            isLogged:this.$store.state.user.loggedIn,
            name:this.$store.state.user.username,
            phone:this.$store.state.user.phone,
            email:this.$store.state.user.email,
        }
    },
     methods: {
        handleNavigate(screen){
            this.navigation.navigate(screen)
        },
        logout() {
            const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
            this.api.create({
                method: 'GET',
                url: this.api.routes.logout,
                headers: { 'Content-Type': 'application/json',
                        'Authorization':AuthStr },   
                    })
            .then(response => { 
                console.log('customer logout',response.data);
                this.$store.commit('user/unsetUser');
                this.$store.commit('cart/unsetCart');
                this.$store.commit('cart/unsetCartCount');
                this.$store.commit('unsetSkipLogin');
                this.$store.commit('unsetUserType');
                this.$store.commit('cart/unsetKitchen');
                this.$store.commit('checkout/unsetCoupon');
                const resetAction = StackActions.reset({
                    index: 0,
                    key:'authStackNavigator',
                    actions: [NavigationActions.navigate({ routeName: 'Chooser' })]
                })
                this.navigation.dispatch(resetAction);
                // this.navigation.dispatch(StackActions.replace({ routeName: 'Chooser' }));
            })
            .catch(error => {
                console.log(error.response.data);
            })
        }
    },
}
</script>

<style>
    .profile-head{
        flex-direction: row;
        justify-content: center;
        margin-bottom: 15;
    }
    .profile-body{
        flex: 1;
    }
    .profile-image{ 
        width: 68;
        height: 68;
        resize-mode: contain;
        margin-right: 10;
    }
    .profile-name-edit{
        flex:1;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .profile-name{
        font-size: 16;
        font-family: Montserrat_Medium;
        color: #3b3838;
    }
    .profile-edit-text{
        font-size: 10;
        color: #9f9f9f;
    }
    .profile-email, .profile-phone{
        font-size: 13;
        color: #3b3838;
    }

    /* Menu */
    .profile-menu-item{
        margin-left: 10;
        padding-vertical: 0;
        margin-vertical:-6
    }
    .menu-icon-background{
        background-color: #fcbe00;
        justify-content: center;
        align-items: center;
        border-radius: 30;
        width: 18;
        height: 18;
    }
    .menu-icon{
        width: 10;
        height: 10;
        resize-mode: contain;
    }
    .menu-title{
        color: #3b3838;
        font-family: Montserrat_Medium;
        font-size: 12;
    }
    .menu-title-without-icon{
        color: #3b3838;
        font-family: Montserrat_Medium;
        font-size: 14;
    }

    /* About */

    .separator{
        border-bottom-width: .5;
        border-bottom-color: #c7c7c7;
        margin-bottom: 10;
        margin-top: 10;
        margin-horizontal:10;
    }
    .about-app{
        margin-bottom: 8;
        padding-horizontal:10;
    }
    .about-head{
        font-family: Montserrat_Medium;
        font-size: 14;
        line-height: 18;
        color: #3b3838;
    }
    .about-description{
        font-size: 10;
        color: #000000;
        line-height: 18;
    }
</style>