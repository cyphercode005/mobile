<template>
    <root>
        <AppNavigator />
    </root>
</template>

<script>
    import { Root } from 'native-base'
    import Splash from '@/screens/Splash'
    import Home from '@/screens/customer/Home'
    import Chooser from '@/screens/Chooser'
    import Verify from '@/screens/customer/auth/Verify'
    import ConfirmOTP from '@/screens/customer/auth/ConfirmOTP'
    import Login from '@/screens/customer/auth/Login'
    import Categories from '@/screens/customer/category/Index'
    import Search from '@/screens/customer/Search'
    import KitchenDetail from '@/screens/customer/kitchen/Detail'
    import Cart from '@/screens/customer/checkout/Cart'
    import Checkout from '@/screens/customer/checkout/Checkout'
    import CheckoutAddress from '@/screens/customer/checkout/Address'
    import Coupon from '@/screens/customer/checkout/Coupon'
    import Payment from '@/screens/customer/payment/Index'
    import Review from '@/screens/customer/account/order/Review'
    import Success from '@/screens/customer/payment/Success'
    import LocationSearch from '@/screens/customer/location/Search'
    import AddAddress from '@/screens/customer/account/address/AddAddress'
    import EditAddress from '@/screens/customer/account/address/EditAddress'
    import AddressList from '@/screens/customer/account/address/Index'
    import Profile from '@/screens/customer/account/Index'
    import Faq from '@/screens/customer/account/faq/Faq'
    import Feedback from '@/screens/customer/Feedback'
    import Information from '@/screens/customer/account/information/Information'
    import Favorite from '@/screens/customer/account/favorites/Favorite'
    import ProfileEdit from '@/screens/customer/account/profile/Edit'
    import ManageAddress from '@/screens/customer/account/address/Index'

    import OrderList from '@/screens/customer/account/order/Index'
    import OrderDetail from '@/screens/customer/account/order/Detail'
    import OrderTrack from '@/screens/customer/account/order/Track'
    import Notification from '@/screens/customer/Notification'
 
    import CategoryDetail from '@/screens/customer/category/Details'
    import CategoryList from '@/screens/customer/category/Index'
     //kitchen
    import KitchenHome from '@/screens/kitchen/Home'
    import KitchenVerify from '@/screens/kitchen/auth/Verify'
    import KitchenRegister from '@/screens/kitchen/auth/register/Index'
    import KitchenLocation from '@/screens/kitchen/auth/register/Location'
    import KitchenRegisterFinal from '@/screens/kitchen/auth/register/FinalStep'
    import KitchenVerification from '@/screens/kitchen/auth/register/Verification'
    import KitchenConfirmOTP from '@/screens/kitchen/auth/ConfirmOTP'
    import KitchenNotification from '@/screens/kitchen/Notification'
    import KitchenProfile from '@/screens/kitchen/account/Index'
    import KitchenEditProfile from '@/screens/kitchen/account/EditProfile'
    import KitchenSupport from '@/screens/kitchen/account/Support'
    import KitchenOrderList from '@/screens/kitchen/order/List'
    import KitchenOrderDetail from '@/screens/kitchen/order/Detail'
    import KitchenInformation from '@/screens/kitchen/Information'
    import KitchenFAQ from '@/screens/kitchen/FAQ'
    import KitchenMenuIndex from '@/screens/kitchen/menu/Index'
    import KitchenMenuAddNew from '@/screens/kitchen/menu/AddNew'
    import EditKitchenMenu from '@/screens/kitchen/menu/Edit'
    import ScheduleKitchenMenu from '@/screens/kitchen/menu/Schedule'

    import ReportIndex from '@/screens/kitchen/report/Index'
    import OrderCancelled from '@/screens/kitchen/report/Cancelled'
    import ReportDelivery from '@/screens/kitchen/report/Delivered'
    import CouponReport from '@/screens/kitchen/report/Coupon'
    import KitchenPayout from '@/screens/kitchen/account/KitchenPayout'

    
    import { createStackNavigator, createAppContainer, StackActions, NavigationActions, createDrawerNavigator, createSwitchNavigator } from 'react-navigation'
    
    const customer = createStackNavigator({Home,Verify,ConfirmOTP,Login,KitchenDetail,Cart,Checkout,Coupon,Payment,Review,Success,LocationSearch,OrderList,Notification,Profile,OrderDetail,AddAddress,OrderTrack,AddressList,CategoryDetail,EditAddress,Categories,Search,CheckoutAddress,Faq,Information,Favorite,ProfileEdit,ManageAddress,CategoryList,Feedback },{ initialRouteName: 'Home',headerMode: 'none'})
    const kitchen = createStackNavigator({KitchenHome,KitchenVerify,KitchenConfirmOTP,KitchenRegister,KitchenNotification,KitchenProfile,KitchenLocation,KitchenRegisterFinal,KitchenVerification,KitchenOrderDetail,KitchenSupport,KitchenInformation,KitchenMenuIndex,KitchenMenuAddNew,KitchenEditProfile,KitchenFAQ,EditKitchenMenu,ScheduleKitchenMenu,ReportIndex,OrderCancelled,ReportDelivery,CouponReport,KitchenPayout,KitchenOrderList},{ initialRouteName: 'KitchenHome',headerMode: 'none'})

    /*  const drawerNavigator = createDrawerNavigator({
        drawer,
    },
    {
        initialRouteName: 'drawer',
        headerMode: 'float',
        drawerType: 'front',
        overlayColor: 0.5,
        drawerBackgroundColor: '#0d2a17',
        // contentComponent: Sidebar
    }) */

    const authStackNavigator = createStackNavigator({ 
        Splash,
        customer,
        kitchen,
        Chooser,
        Verify,
        ConfirmOTP,
        Login,
        KitchenVerify,KitchenConfirmOTP,Checkout
        // drawerNavigator
    },
    {
        initialRouteName: 'Chooser',
        headerMode: 'none',
    })

    const AppNavigator = createAppContainer(createSwitchNavigator({
            authStackNavigator: {
                screen: authStackNavigator
            },
            /* drawerNavigator: {
                screen: drawerNavigator
            }, */
        },
        { 
            initialRouteName : 'authStackNavigator'
        })
    )

    export default {
        components: {
            Root, AppNavigator
        },
    }
</script>