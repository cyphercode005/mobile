<template>
    <!-- <nb-view> -->
        <!-- <StatusBar :style="{backgroundColor:'#fcbe00'}" iosBarStyle="light-content"/> -->
        
        <nb-header iosBarStyle="dark-content" :style="{border:'none', backgroundColor:'transparent', borderShadow:'none', elevation:0.5, width:'100%',shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.2,}">
            <nb-left :style="{flex:0.2}">
                <nb-button transparent :on-press="() => {navigation.goBack()}" v-if="navigation.state.routeName != 'KitchenRegister'">
                    <image :source="require('../../../assets/images/icons/arrow-back.png')" class="navigate-back" />
                </nb-button>
            </nb-left>
            <nb-body class="center" :style="{flex:1}">
                <nb-title class="navigate-header-text">{{ headerTitle }}</nb-title>
            </nb-body>
            <nb-right v-if="registration" :style="{flex:0.2}">
                <nb-button transparent :on-press="() => {navigateToChooser()}">
                    <image :source="require('../../../assets/images/icons/navigation/home.png')" class="home-icon" />
                    <nb-title class="button-home-text">Home</nb-title>
                </nb-button>
            </nb-right>
        </nb-header>
    <!-- </nb-view> -->
</template>
<script>
import { StackActions, NavigationActions } from 'react-navigation';
// import { StatusBar } from 'react-native'
export default {
    
    props:{
        navigation: {
            type: Object,
            required :true
        }, 
        headerTitle: {
            type: String,
            required: false
        },
        registration: {
            type: Boolean,
            required: false
        }
    }, 
    
    methods: {
        navigateToChooser(){
            this.$store.commit('kitchen/unsetUser');
            this.$store.commit('kitchen/unsetImage');
            this.$store.commit('unsetUserType');
            const resetAction = StackActions.reset({
                index: 0,
                key: "authStackNavigator",
                actions: [NavigationActions.navigate({ routeName: "Chooser" })]
            });
            this.navigation.dispatch(resetAction);
        }
    }
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
    .button-home{
        border-width: 1;
        border-color: #fcbe00;
        border-radius: 5;
        height: 30;
    }
    .home-icon{
        height: 14;
        width: 14;
        resize-mode: contain;
        margin-right: 10;
    }
    .button-home-text{
        font-size: 12;
        color: #fcbe00;
        font-family: Montserrat_Medium
    }
</style>