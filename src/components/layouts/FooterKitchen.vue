<template>
    <nb-footer :style="{height:50}">
        <nb-footer-tab>
            <nb-button :active="navigation.state.routeName == 'KitchenHome'" :on-press="()=>handleNavigate('KitchenHome')">
                <image :source="require('../../../assets/images/kitchen/navigation/order.png')" :class="navigation.state.routeName == 'KitchenHome' ? 'footer-icon-active' : 'footer-icon'"/>
                <nb-text>Orders</nb-text>
            </nb-button>

            <nb-button :active="navigation.state.routeName == 'KitchenMenuIndex'" :on-press="()=>handleNavigate('KitchenMenuIndex')">
                <image :source="require('../../../assets/images/kitchen/navigation/menu.png')" :class="navigation.state.routeName == 'KitchenMenuIndex' ? 'footer-icon-active' : 'footer-icon'" />
                <nb-text>Menu</nb-text>
            </nb-button>

            <nb-button :active="navigation.state.routeName == 'ReportIndex'" :on-press="()=>handleNavigate('ReportIndex')">
                <image :source="require('../../../assets/images/kitchen/navigation/insight.png')" :class="navigation.state.routeName == 'ReportIndex' ? 'footer-icon-active' : 'footer-icon'"/>
                <nb-text>Insights</nb-text>
            </nb-button>

            <nb-button :active="navigation.state.routeName == 'KitchenProfile'" :on-press="()=>handleNavigate('KitchenProfile')">
                <image :source="require('../../../assets/images/kitchen/navigation/profile.png')" :class="navigation.state.routeName == 'KitchenProfile' ? 'footer-icon-active' : 'footer-icon'"/>
                <nb-text>Profile</nb-text>
            </nb-button>
        </nb-footer-tab>
    </nb-footer>
</template>

<script>
export default {
    props:{
        navigation: { Object }
    },
    methods: {
        handleNavigate(screen){
            this.navigation.navigate(screen)
        }
    },
}
</script>

<style>
    .footer-icon{
        height:17.5;
        width: 17.5;
        resize-mode: contain;
        margin-bottom: 3.5;
        tint-color: #25282b;
    }
    .footer-icon-active{
        height:17.5;
        width: 17.5;
        resize-mode: contain;
        margin-bottom: 3.5;
        tint-color: #fcbe00;
    }
</style>