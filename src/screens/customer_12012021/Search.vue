<template>
    <nb-container padder>
        <Spinner
          :visible="isLoading"
        />
        <StatusBar barStyle="light-content" backgroundColor="#fcbe00"/>
        <nb-view class="home-header" padder  >
            <image :source="require('../../../assets/images/icons/location.png')" :on-press="()=>{navigation.navigate('LocationSearch')}" class="header-location-icon"/>
            <nb-text :on-press="()=>{navigation.navigate('LocationSearch')}" :numberOfLines=1 class="header-location-text">{{ $store.state.selectedLocation.address }}</nb-text>
            <image :source="require('../../../assets/images/icons/notification.png')" class="header-notification-icon"/>
        </nb-view>
        <nb-view class="search-container">
            <nb-item class="search-box">
                <image :source="require('../../../assets/images/icons/search.png')" class="search-icon" />
                <nb-input :on-change-text="searchMenu" class="search-input" v-model="search" placeholder="Search for Item or kitchen" />
            </nb-item>
        </nb-view>

        <nb-tabs :tabBarUnderlineStyle="{height:3, marginTop:1}">
                <nb-tab heading="Menu" :on-press="()=> clickTab('menu')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                    <nb-content padder>
                        <nb-list v-if="allMenus&&allMenus!=''">
                            <nb-list-item  v-for="menu in allMenus" :key="menu.id" avatar noBorder class="menu-list-item" :on-press="()=>{ getMenuDetail(menu.id)}">
                                <nb-left :style="{ marginTop:0, paddingTop:0 }">
                                    <image-background :imageStyle="{borderRadius: 60}" :source="menu.image ? {uri:menu.image} :require('../../../assets/images/menu/chicken-biriyani.png')" class="product-thumb">
                                        <image  v-if="menu.veg_status == '0'"  :source="require('../../../assets/images/icons/veg.png')" class="food-type"/>
                                        <image  v-else :source="require('../../../assets/images/icons/non-veg.png')" class="food-type"/>
                                    </image-background>
                                </nb-left>
                                <nb-body :style="{ marginTop:0, paddingTop:0, marginLeft:8}">
                                    <nb-text class="menu-item-name">{{menu.name}}</nb-text>
                                    <nb-text class="menu-item-kitchen">{{menu.kitchen_name}}</nb-text>
                                    <nb-text class="menu-item-description" :numberOfLines="2">{{menu.description}}</nb-text>
                                    <nb-text class="menu-item-order-time">Order Time <nb-text class="menu-item-time">{{menu.order_time}}</nb-text></nb-text>
                                    <nb-view class="price-section">
                                        <nb-text class="menu-item-price">₹{{parseFloat(menu.price).toFixed(2)}}</nb-text>
                                        <nb-text class="menu-item-quantity">{{menu.quantity}} <nb-text class="menu-item-quantity-remaining">remaining</nb-text></nb-text>
                                        <nb-view class="menu-item-distance">
                                            <image :source="require('../../../assets/images/icons/distance.png')" class="menu-item-distance-icon" />
                                            <nb-text class="menu-item-distance-text">{{menu.distance}}</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-body>
                            </nb-list-item>
                        </nb-list>
                          <nb-content padder v-else >
                        <nb-view  padder class="no-result">
                            <nb-text class="no-result-text">No Items Found</nb-text>
                        </nb-view>
                    </nb-content>
                    </nb-content>
                </nb-tab>
                <nb-tab heading="Kitchen" :on-press="()=>clickTab('kitchen')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                    <nb-content padder v-if="allKitchens&&allKitchens!=''">
                        <nb-view  v-for="kitchen in allKitchens" :key="kitchen.id" class="kitchen-list-item">
                            <touchable-opacity  :on-press="()=> {navigation.navigate('KitchenDetail',{kitchenId:kitchen.id})}">
                                <image :source="kitchen.image ? {uri:kitchen.image} :require('../../../assets/images/home/kitchen.png')" class="kitchen-image" :style="{width:kitchenImageWidth, height:kitchenImageWidth*.4283}"/>
                                <nb-view padder class="kitchen-detail">
                                    <nb-view class="kitchen-head">
                                        <nb-text class="kitchen-name">{{kitchen.name}}</nb-text>
                                        <nb-view class="rating">
                                            <image :source="require('../../../assets/images/icons/star-rating.png')" class="rating-icon" />
                                            <nb-text class="rating-text">{{kitchen.rating}}</nb-text>
                                        </nb-view>
                                    </nb-view>
                                    <nb-view class="kitchen-desc">
                                        <nb-text class="kitchen-description" :numberOfLines="1">{{kitchen.description}}</nb-text>
                                        <nb-view class="kitchen-distance">
                                            <image :source="require('../../../assets/images/icons/distance.png')" class="kitchen-distance-icon" />
                                            <nb-text class="kitchen-distance-text">{{kitchen.distance.toFixed(2)}}</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-view>
                            </touchable-opacity>
                        </nb-view>
                    </nb-content>
                <nb-content padder v-else >
                           <nb-view  padder class="no-result">
                            <nb-text class="no-result-text">No Kitchens Found</nb-text>
                        </nb-view>
                    </nb-content>
          

                </nb-tab>
        </nb-tabs>
        
               <RBSheet
            ref="menuDetail"
            height="480"
            :closeOnPressMask="true"
            :customStyles="{
                container: {
                    borderTopLeftRadius:5, borderTopRightRadius:5
                }
            }"
            :onClose="()=>{ }"
        >
            <image-background :source="menuDetail.image ? {uri:menuDetail.image} :require('../../../assets/images/menu/chicken-biriyani.png')" class="modal-menu-image">
                <touchable-opacity class="modal-close" :on-press="()=>{ $refs.menuDetail.close() }">
                    <image :source="require('../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
                </touchable-opacity>
            </image-background>
            <nb-content padder :style="{paddingTop:0}">
                <nb-text class="modal-menu-name">{{menuDetail.name}}</nb-text>
                <nb-text class="modal-menu-description">{{menuDetail.description}}</nb-text>
                <nb-view class="modal-instruction">
                    <nb-text class="instruction-head">Recipe Details</nb-text>
                    <!-- <nb-item class="modal-input-field">
                        <nb-input v-model="note" placeholder="Edit notes" class="modal-input"/>
                        
                    </nb-item> -->
                     <nb-text class="modal-input">{{menuDetail.recipe}}</nb-text>
                   
                </nb-view>
                <input-spinner 
                    :width=125 
                    :height=42 
                    :buttonFontSize=26
                    :rounded=true
                    :editable=false
                    :initialValue="1"
                    :disabled=false
                    :max="menuDetail.quantity"
                    :min="1"
                    :style="{alignSelf:'center', marginTop:10}"
                    :buttonStyle="{width:41, height:41,alignSelf:'center', borderWidth:2, borderColor:'#fcbe00',fontSize:12, fontFamily:'Montserrat_SemiBold', alignItems:'center', justifyContent:'center', paddingTop:0}"
                    :step=1
                    :on-change="(quantity) => { changeQuantity(quantity) }"
                    :inputStyle="{color:'#000000', fontSize:26, fontFamily:'Montserrat_Regular'}"
                    buttonFontFamily="Montserrat_SemiBold"
                    fontFamily="Montserrat_Regular"
                    color="transparent"
                    buttonTextColor="#000000"
                    colorPress="#e84a44"
                    buttonPressTextColor="#FFFFFF" />
            </nb-content>
            <nb-view class="modal-footer">
                <nb-view class="modal-menu-price">
                    <nb-text  class="menu-quantity" >{{quantity}} Quantity</nb-text>
                    <nb-text  class="menu-price" >₹{{parseFloat(productTotal).toFixed(2)}}</nb-text>
                </nb-view>
               
                <touchable-opacity  class="modal-add-cart-button" :on-press="()=>{ checkCart(menuDetail) }">
                    <nb-text></nb-text>
                    <nb-text class="add-cart-button-text">Add to Cart</nb-text>
                    <image :source="require('../../../assets/images/icons/chevron-right.png')" class="add-cart-button-icon" />
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        
        <footer :navigation="navigation"/>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
export default {
    props: {
        navigation: { Object }
    },
    data() {
        return {
            bannerImageWidth: (this.appConfig.width - 25) * .59,
            kitchenImageWidth: this.appConfig.width - 30,
            categoryWidth: (this.appConfig.width - 40) / 3,
            cart:this.$store.state.cart.cart,
            cartCount:this.$store.state.cart.cartCount,
            cartTotal:this.$store.state.cart.cartTotal,
            authToken:this.$store.state.user.authentication,
            isLogged:this.$store.state.user.loggedIn,
            search: '',
           
            allKitchens :'',
            allMenus:'',
            menuDetail:'',
            quantity:1,
          
            kitchenId:this.$store.state.cart.kitchenId,
            productPrice:0,
            productTotal:0,
            isLoading: false
        }
    },

    methods: {
        searchMenu(){
            var status = true;
            if(this.search.length > 2){
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.search,
                    headers: { 'Content-Type': 'application/json' },
                    data:{
                        searchValue: this.search,
                        latitude: this.$store.state.selectedLocation.coords.latitude,
                        longitude: this.$store.state.selectedLocation.coords.longitude
                    },
                })
                .then(response => { 
                    console.log(response.data.near_kitchen);
                    this.allKitchens=response.data.near_kitchen;
                    this.allMenus=response.data.menu;
                })
                .catch(error => {
                    console.log(error.response.data);
                    this.allKitchens='';
                    this.allMenus='';
                }) 
            }
            return status
        },

        getMenuDetail(foodId){
            var status = true;
            this.note='';
            this.additional='';
            this.quantity=1
            this.productPrice = 0
            this.productTotal = 0
            this.isLoading = true
            this.$refs.menuDetail.open()
            if(this.$store.state.user.loggedIn)
            {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.menuDetailWithCart,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': AuthStr
                    },
                    data:{food_id:foodId}
                })
                .then(response => { 
                    this.productPrice=parseFloat(response.data.kitchen_menu.price);
                    this.menuDetail=response.data.kitchen_menu;
                    if(parseFloat(response.data.kitchen_menu.cartQuantity)>0)
                    { 
                        this.quantity=response.data.kitchen_menu.cartQuantity
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)*parseFloat(response.data.kitchen_menu.cartQuantity);
                    }
                    else
                    {
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)
                        this.quantity=1
                    }
                    this.isLoading = false
                    
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                })
            } else {
                var cartCount=this.cart.length;
                this.cartTotal=this.$store.state.cart.cartTotal;

                this.api.create({
                    method: 'POST',
                    url: this.api.routes.menuDetail,
                    headers: { 'Content-Type': 'application/json' },
                    data:{food_id:foodId}
                })
                .then(response => { 
                    this.menuDetail=response.data.kitchen_menu;
                    this.productPrice=parseFloat(response.data.kitchen_menu.price);
                    this.productTotal=parseFloat(response.data.kitchen_menu.price);
                    this.isLoading = false
                })
                .catch(error => 
                {
                    console.log(error.response.data);
                    this.isLoading = false
                }) 
            }
            return status
        },

        checkCart(food){
            // console.log(this.$store.state.cart.kitchen);
            if(this.$store.state.cart.kitchen=='') {
                this.$store.commit('cart/setKitchen', food.kitchen);
                this.kitchenId=food.kitchen_id;
            }
            if(this.$store.state.cart.kitchen.id==food.kitchen_id) {
                this.addToCart(food);
                this.$refs.menuDetail.close()
            } else {
                Alert.alert(
                    "Confirm",
                    "Clear cart and continue with the order?",
                    [
                        {
                            text: "Cancel",
                            onPress: () => console.log("Cancel Pressed"), style: "cancel"
                        },
                        { 
                            text: "OK", onPress: () => {this.clearCart(food)}
                        }
                    ],
                    { cancelable: false }
                );
            }
        },

        clearCart(food) {
            if(this.$store.state.user.authentication!='') {

                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.clearCart,
                    headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
                })
                .then(response => { 
                    Toast.show({
                        text: "Cart Cleared",
                        duration: 3000
                    });
                    this.addToCart(food);
                    this.$store.commit('cart/setKitchen', food.kitchen);
                    this.kitchenId=food.kitchen_id
                    this.$refs.menuDetail.close()
                })
                .catch(error => {
                    console.log(error.response.data);
                    Toast.show({
                        text: "Something went Wrong ",
                        duration: 3000
                    });  
                })
            } else {
                this.$store.commit('cart/unsetCartCount');
                this.$store.commit('cart/unsetCart');
                this.$store.commit('cart/unsetCartTotal');
                this.addToCart(food);
                this.$store.commit('cart/setKitchen', food.kitchen);
                this.kitchenId=food.kitchen_id;
                this.$refs.menuDetail.close();
            }
        },

        addToCart(food){
            this.isLoading = true
            if(this.$store.state.user.authentication!='') {
                if(this.quantity=='') {
                    this.quantity=1
                }
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication); 
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartStore,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{ food_id:food.id,quantity:this.quantity }
                })
                .then(response => { 
                    this.cartCount=response.data.cartCount;
                    this.cartTotal=response.data.cartTotal;
                    this.quantity=1;
                    Toast.show({
                        text: "Item added to the cart",
                        duration: 3000
                    });
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data);
                    Toast.show({
                        text: "Something went Wrong ",
                        duration: 3000
                    });
                })
            } else { 
                var status = true;
                var cartTotal=0;
                var options=[];
             
                var cartId=this.makeId();
                var data={
                    cartId:cartId,
                    id:food.id,
                    name:food.name,
                    qty:this.quantity,
                    price:food.price,
                    options:options
                }   
                cartTotal=parseFloat(cartTotal)+parseFloat(this.quantity*food.price)
                const storeCart =this.$store.state.cart.cart;
                var cartArray =  []
                for(const key in storeCart){
                    if(food.id==storeCart[key].id) 
                    {
                        // Toast.show({
                        // text: "Already added to the cart",
                    
                        // duration: 3000
                        // }); 
                    } else{
                        const list={
                            'cartId':storeCart[key].cartId,
                            'id':storeCart[key].id,
                            'name':storeCart[key].name,
                            'qty' :storeCart[key].qty,
                            'price':storeCart[key].price,
                            'options':storeCart[key].options
                        }
                        cartTotal=parseFloat(cartTotal)+parseFloat(storeCart[key].qty*storeCart[key].price)
                        cartArray.push(list)
                    }
                }  
                cartArray.push(data)
                var count=cartArray.length
                this.$store.commit('cart/setCartCount',count)
                this.$store.commit('cart/setCart',cartArray)
                this.option=''
                this.cart=this.$store.state.cart.cart;
                this.cartCount=this.$store.state.cart.cartCount;
                this.$store.commit('cart/setCartTotal',cartTotal)
                this.cartTotal=cartTotal;
                console.log(this.cart);
                this.isLoading = false

                Toast.show({
                    text: "Added to the cart",
                    duration: 3000
                }); 
            }
        },

        changeQuantity(quantity)
        {
            this.quantity=quantity
            this.productTotal=(parseFloat(quantity)*parseFloat(this.productPrice)).toFixed(2);
        },
        
        makeid() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        },


    },

  

 
}
</script>

<style>
/* search result */
    .no-result{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-top: 30;
    }
    .no-result-text{
        font-size: 14;
        color: #000000;
    }
    /* header */
    .home-header{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding-bottom: 10; 
    }
    .header-location-icon{
        width: 11;
        height: 15;
        resize-mode: contain;
        margin-right: 10;
    }
    .header-location-text{
        font-size: 14;
        font-family: Montserrat_SemiBold;
        color: #060606;
        flex: 1;
        overflow: hidden;
    }
    .header-notification-icon{
        width: 19;
        height: 19;
        resize-mode:contain;
        margin-left: 10;
    }
    .search-container{
        padding-horizontal: 15;
        margin-bottom: 21;
    }
    .search-box{
        background-color: #f5f5f5;
        border-bottom-width: 0;
        padding-horizontal: 10;
        height: 40;
    }
    .search-icon{
        height: 24;
        width: 24;
        resize-mode: contain;
        margin-right: 10;
    }
    .search-input{
        color: #cacccf;
    }
    .home-banner-image{
        margin-right: 10;
    }

    /* Category */

    .category{
        margin-top: 5;
        margin-bottom: 0;
    }
    .category-header{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 16;
    }
    .category-title{
        font-size: 14;
        color: #364151;
        font-family: Montserrat_SemiBold;
    }
    .category-button-text{
        font-size: 12;
        color: #cacccf;
    }
    .home-category{
        flex-direction: row;
        justify-content: space-between;
    }
    .category-icon{
        width: 52;
        height: 52;
        resize-mode: contain;
        margin-bottom: 5;
    }
    .category-item{
        justify-content: center;
        align-items: center;
    }
    .category-name{
        font-size: 12;
        color: #364151;
        font-family: Montserrat_Medium;
    }
    
    /* Menu Items */
     .product-thumb{
        width: 98;
        height: 98;
        resize-mode: contain;
        border-radius: 60;
    }
    .food-type{
        width: 7;
        height: 7;
        resize-mode:contain;
    }
    .menu-list-item{
        margin-left: 0;
        background-color: #FFFFFF;
        elevation: 3;
        border-radius: 8;
        padding-top: 2;
        padding-right: 10;
        margin-bottom: 7;
    }
    .menu-item-name{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #000000;
    }
    .menu-item-kitchen{
        font-size: 12;
        color: #f2b600;
        font-family: Montserrat_Medium;
    }
    .menu-item-description{
        font-size: 10;
        color: #7d7b76;
        margin-bottom: 5;
    }
    .menu-item-order-time{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #a1a6ae;
        margin-bottom: 5;
    }
    .menu-item-time{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #364151;
    }
    .price-section{
        flex-direction: row;
        justify-content: space-between;
    }
    .menu-item-price{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-quantity{
        color: #f0373e;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-quantity-remaining{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }
    .menu-item-distance{
        flex-direction: row;
        align-items: center;
    }
    .menu-item-distance-icon{
        width: 9.2;
        height: 9.2;
        resize-mode: contain;
        margin-right: 5;
    }
    .menu-item-distance-text{
        color: #364151;
        font-size: 12;
        font-family: Montserrat_SemiBold;
    }

    /* Kitchen */

    .kitchen-image{
        resize-mode:cover;
        background-color: #FFFFFF;
        border-top-left-radius: 10;
        border-top-right-radius: 10;
    }
    .kitchen-list-item{
        elevation:3;
        background-color: #FFFFFF;
        margin-bottom: 10;
        border-top-left-radius: 10;
        border-top-right-radius: 10;
    }
    .kitchen-head{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 4;
    }
    .kitchen-name{
        font-family: Montserrat_SemiBold;
        font-size: 14;
        color: #000000;
    }
    .rating{
        flex-direction: row;
        background-color: #ececec;
        border-radius: 15;
        padding-horizontal:11;
        padding-vertical:2;
        align-items: center;
    }
    .rating-icon{
        width: 11;
        height: 11;
        resize-mode: contain;
        margin-right: 10;
    }
    .rating-text{
        color:#655c5c;
        font-family: Montserrat_SemiBold;
        font-size: 12;
    }
    .kitchen-desc{
        flex-direction: row;
        justify-content: space-between;
    }
    .kitchen-description{
        font-size: 10;
        flex: 1;
        color: #7d7b76;
    }
    .kitchen-distance{
        flex-direction: row;
        align-items: center;
    }
    .kitchen-distance-icon{
        width: 12;
        height: 12;
        resize-mode: contain;
        margin-right: 3.3;
    }
    .kitchen-distance-text{
        font-size: 12;
        font-family: Montserrat_SemiBold;
        color: #364151;
    }
        /* Modal */

    .modal-menu-image{
        height: 150;
        resize-mode: cover;
    }
    .modal-close{
        margin: 17;
        align-self: flex-end;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
    }
    .modal-menu-name{
        color: #5d5757;
        font-size: 16;
        font-family: Montserrat_Medium;
        margin-bottom: 4;
    }
    .modal-menu-description{
        font-size: 12;
        color: #989696;
    }
    .modal-instruction{
        margin-top: 20;
    }
    .instruction-head{
        font-size: 14;
        color: #5d5757;
        font-family: Montserrat_Medium;
        margin-bottom: 5;
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
    .modal-menu-price{
        padding-horizontal: 15;
        flex:0.8;
        justify-content: center;
    }
    .menu-quantity{
        font-size: 12;
        color: #959595;
    }
    .menu-price{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #554444;
    }
    .modal-add-cart-button{
        background-color: #fcbe00;
        border-top-left-radius: 20;
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
    .add-cart-button-icon{
        width: 8.5;
        height: 14.1;
    }
     /* no result */
     .no-result{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-top: 30;
    }
    .no-result-text{
        font-size: 14;
        color: #000000;
    }
    
</style>