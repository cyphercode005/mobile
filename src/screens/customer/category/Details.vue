<template>
    <nb-container padder>
        <Spinner
            :visible="isLoading"
        />
        <nb-content> 
            <nb-tabs :tabBarUnderlineStyle="{height:3, marginTop:1}">
                <nb-tab heading="Menu" :on-press="()=> clickTab('menu')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                    <nb-content padder>
                        <nb-list v-if="allMenus">
                            <nb-list-item  v-for="menu in allMenus" :key="menu.id" avatar noBorder class="menu-list-item" :on-press="()=>{ getMenuDetail(menu.id)}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                                <nb-left :style="{ marginTop:0, padding:6, paddingRight:0, paddingTop:6, justifyContent:'center', alignItems:'center' }">
                                    <image-background :imageStyle="{borderRadius: 60}" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/no-image.png')" class="product-thumb">
                                        <image  v-if="menu.veg_status == '0'"  :source="require('../../../../assets/images/icons/veg.png')" class="food-type"/>
                                        <image  v-else :source="require('../../../../assets/images/icons/non-veg.png')" class="food-type"/>
                                    </image-background>
                                </nb-left>
                                <nb-body :style="{ marginTop:0, paddingTop:3, marginLeft:8}">
                                    <nb-text class="menu-item-name">{{menu.name}}</nb-text>
                                    <nb-text class="menu-item-kitchen">{{menu.kitchen_name}}</nb-text>
                                    <nb-text class="menu-item-description" :numberOfLines="2" >{{menu.description}}</nb-text>
                                    <nb-text class="menu-item-order-time">Order Time <nb-text class="menu-item-time">{{menu.order_time}}</nb-text></nb-text>
                                    <nb-view class="price-section">
                                        <nb-text class="menu-item-price">₹{{parseFloat(menu.price).toFixed(2)}}</nb-text>
                                        <nb-text class="menu-item-quantity">{{menu.quantity}} <nb-text class="menu-item-quantity-remaining">remaining</nb-text></nb-text>
                                        <nb-view class="menu-item-distance">
                                            <image :source="require('../../../../assets/images/icons/distance.png')" class="menu-item-distance-icon" />
                                            <nb-text class="menu-item-distance-text">{{ parseFloat(menu.distance).toFixed(1) }} Km</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-body>
                            </nb-list-item>
                        </nb-list>
                        <nb-view v-else padder class="no-result">
                            <nb-text class="no-result-text">No Items Found</nb-text>
                        </nb-view>
                    </nb-content>
                </nb-tab>
                <nb-tab heading="Kitchen" :on-press="()=> clickTab('kitchen')" :textStyle="{fontSize: 14, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 14, color: '#000000'}">
                    <nb-content padder v-if="allKitchens">
                        <nb-view  v-for="kitchen in allKitchens" :key="kitchen.id" class="kitchen-list-item"  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <touchable-opacity  :on-press="()=> {navigation.navigate('KitchenDetail',{kitchenId:kitchen.id})}">
                                <image :source="kitchen.image ? {uri:kitchen.image} :require('../../../../assets/images/no-image.png')" class="kitchen-image" :style="{width:kitchenImageWidth, height:kitchenImageWidth*.4283}"/>
                                <nb-view padder class="kitchen-detail">
                                    <nb-view class="kitchen-head">
                                        <nb-text class="kitchen-name">{{kitchen.name}}</nb-text>
                                        <nb-view class="rating">
                                            <image :source="require('../../../../assets/images/icons/star-rating.png')" class="rating-icon" />
                                            <nb-text class="rating-text">{{ parseFloat(kitchen.rating).toFixed(1) }}</nb-text>
                                        </nb-view>
                                    </nb-view>
                                    <nb-view class="kitchen-desc">
                                        <nb-text class="kitchen-description" :numberOfLines="1">{{kitchen.description}}</nb-text>
                                        <nb-view class="kitchen-distance">
                                            <image :source="require('../../../../assets/images/icons/distance.png')" class="kitchen-distance-icon" />
                                            <nb-text class="kitchen-distance-text">{{parseFloat(kitchen.distance).toFixed(1)}} Km</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-view>
                            </touchable-opacity>
                        </nb-view>
                    </nb-content>
                    <nb-view v-else padder class="no-result">
                        <nb-text class="no-result-text">No Kitchens Found</nb-text>
                    </nb-view>
                </nb-tab>
            </nb-tabs>
        </nb-content>

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
            <Spinner
                :visible="isMenuLoading"
            />
            <image-background :source="menuDetail.image ? {uri:menuDetail.image} :require('../../../../assets/images/no-image.png')" class="modal-menu-image">
                <touchable-opacity class="modal-close" :on-press="()=>{ $refs.menuDetail.close() }">
                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
                </touchable-opacity>
            </image-background>
            <nb-content padder :style="{paddingTop:0}">
                <nb-text class="modal-menu-name">{{menuDetail.name}}</nb-text>
                <nb-text class="modal-menu-description">{{menuDetail.description}}</nb-text>
                <nb-view class="modal-instruction">
                    <nb-text class="instruction-head">Recipe Details</nb-text>
                    <nb-text class="modal-input">{{menuDetail.recipe}}</nb-text>
                   <!-- <nb-text :style="{color:'red',fontSize:12, marginTop:-20, marginBottom:10}" v-if="cartMessage">{{cartMessage}}</nb-text> -->
                </nb-view>
                <input-spinner 
                    :width=125 
                    :height=42 
                    :buttonFontSize=26
                    :rounded=true
                    :editable=false
                    :min=1
                    :disabled=false
                    :value=variantQty
                    :max="menuDetail.quantity"
                    :style="{alignSelf:'center', marginTop:10}"
                    :buttonStyle="{width:41, height:41,alignSelf:'center', borderWidth:2, borderColor:'#fcbe00',fontSize:12, fontFamily:'Montserrat_SemiBold', alignItems:'center', justifyContent:'center', paddingTop:0}"
                    :step=1
                    :on-change="(quantity) => { changeQuantity(quantity,menuDetail.quantity,menuDetail.id) }"
                    :inputStyle="{color:'#000000', fontSize:26, fontFamily:'Montserrat_Regular'}"
                    buttonFontFamily="Montserrat_SemiBold"
                    fontFamily="Montserrat_Regular"
                    color="#FFFFFF"
                    buttonTextColor="#000000"
                    colorPress="#fcbe00"
                    buttonPressTextColor="#FFFFFF" />
                       
            </nb-content>
            <nb-view class="modal-footer">
                <nb-view class="modal-menu-price">
                    <nb-text  class="menu-quantity" >{{quantity}} Quantity</nb-text>
                    <nb-text  class="menu-price" >₹{{parseFloat(productTotal).toFixed(2)}}</nb-text>
                </nb-view>
                <touchable-opacity v-if="itemCart.cartQuantity>0"  class="modal-add-cart-button" :on-press="()=>{cartUpdate(quantity,menuDetail.id,itemCart.rowId) }">
                    <nb-text></nb-text>
                    <nb-text class="add-cart-button-text">Update Cart</nb-text>
                    <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="add-cart-button-icon" />
                </touchable-opacity>
                <touchable-opacity v-else class="modal-add-cart-button" :on-press="()=>{ checkCart(menuDetail) }">
                    <nb-text></nb-text>
                    <nb-text class="add-cart-button-text">Add to Cart</nb-text>
                    <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="add-cart-button-icon" />
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        <footer :navigation="navigation"/>
    </nb-container>
</template>

<script>
import { Alert } from "react-native"
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
            search: '',
            allBanners :'',
            allCategories:'',
            allKitchens :'',
            allMenus:'',
            categoryId:'',

            cart:this.$store.state.cart.cart,
            cartCount:this.$store.state.cart.cartCount,
            cartTotal:this.$store.state.cart.cartTotal,
            authToken:this.$store.state.user.authentication,
            isLogged:this.$store.state.user.loggedIn,
          
            menuDetail:'',
            quantity:1,
      
            kitchenId:this.$store.state.cart.kitchenId,
            maxQuantity:'',
            productPrice:0,
            productTotal:0,
            variantQty:'',
            cartMessage:'',
            itemCart:'',
            isLoading: false,
            isMenuLoading: false
        }
    },
    beforeMount() {
        this.getAllMenus()
    },
   
    methods: {
        getAllMenus(){
            if(this.navigation.state.params)
            {
                this.categoryId = this.navigation.state.params.categoryId;
            } else {
                this.categoryId='';
            }
            this.isLoading = true
            var status = true;
            this.api.create({
                method: 'POST',
                url: this.api.routes.GetKitchenByCategory,
                data :{category_id:this.categoryId,
                latitude: this.$store.state.selectedLocation.coords.latitude,
                longitude: this.$store.state.selectedLocation.coords.longitude},
                headers: { 'Content-Type': 'application/json' },
                
            })
            .then(response => { 
                console.log(response.data);
                this.allMenus=response.data.menu;
                this.allKitchens=response.data.near_kitchen;
                this.isLoading = false
            })
            .catch(error => {
                this.isLoading = false
                console.log(error.response.data);
            }) 
            return status
        },
        handleNavigate(screen){
            this.navigation.navigate(screen);
        },
        getMenuDetail(foodId){
            var status = true;
            this.isMenuLoading = true
            this.$refs.menuDetail.open()
            this.menuDetail=''
            this.productPrice = 0
            this.productTotal = 0
            this.cartMessage=''
            if(this.$store.state.user.loggedIn) {
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
                    this.itemCart=response.data.cartDetails
                    // console.log(response.data.kitchen_menu.cartQuantity)
                    if(parseFloat(response.data.kitchen_menu.cartQuantity)>0) { 
                        this.quantity=parseInt(response.data.kitchen_menu.cartQuantity)
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)*parseFloat(response.data.kitchen_menu.cartQuantity);
                        this.variantQty=parseFloat(response.data.kitchen_menu.cartQuantity)
                        this.cartMessage="Item already added to the cart"
                    } else {
                        this.productTotal=parseFloat(response.data.kitchen_menu.price)
                        this.quantity=1
                        this.variantQty=1
                    }
                    this.isMenuLoading = false
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                })
            } else {
                this.cart=this.$store.state.cart.cart
                this.itemCart=''
                if(this.cart.length>0)
                {
                var cartRow=this.cart.filter(x => x.id ===foodId)
                if(cartRow.length>0)
                this.itemCart={'cartQuantity':cartRow[0].qty,cartCount:this.$store.state.cart.cartCount,cartTotal:this.$store.state.cart.cartTotal}
                }
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.menuDetail,
                    headers: { 'Content-Type': 'application/json' },
                    data:{food_id:foodId}
                })
                .then(response => { 
                    this.menuDetail=response.data.kitchen_menu;
                    console.log('menuDetail')
                    console.log(this.menuDetail)
                    this.productPrice=parseFloat(response.data.kitchen_menu.price);
                    if(this.cart.length>0)
                    {
                        if(this.cart.filter(x => x.id ===foodId).length>0)
                            { 
                            this.quantity=parseInt(this.cart.filter(x => x.id ===foodId)[0].qty)
                            this.productTotal=parseFloat(response.data.kitchen_menu.price)*parseFloat(this.cart.filter(x => x.id ===foodId)[0].qty);
                            this.variantQty=parseFloat(this.cart.filter(x => x.id ===foodId)[0].qty)
                            this.cartMessage="Item already added to the cart"
                            }
                            else
                            {
                                this.productTotal=parseFloat(response.data.kitchen_menu.price)
                                this.quantity=1
                                this.variantQty=1
                            }
                        }
                        else{
                            this.productTotal=parseFloat(response.data.kitchen_menu.price)
                            this.quantity=1
                            this.variantQty=1
                        }
                    this.isMenuLoading = false
                    // this.$refs.menuDetail.open()
                   
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                }) 
            }
            return status
        },
        checkCart(food){
            if(this.$store.state.cart.kitchen!='') {
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
                                text: "OK", onPress: () => {this.clearCart(food),this.$refs.menuDetail.close()}
                            }
                        ],
                        { cancelable: false }
                    );
                }
               
            }
            else{
                 this.addToCart(food);
                 this.$refs.menuDetail.close()
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
                    /* Toast.show({
                        text: "Cart Cleared",
                        duration: 3000
                    }); */
                    this.addToCart(food);
                    this.$store.commit('cart/setKitchen', food.kitchen);
                    this.kitchenId=food.kitchen_id
                    this.$refs.menuDetail.close()
                })
                .catch(error => {
                    // console.log(error.response.data);
                    Toast.show({
                        text: "Something went wrong",
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
        addToCart(food) {
            this.isMenuLoading = true
            if(this.$store.state.user.authentication) {
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
                    this.$store.commit('cart/setCartCount',response.data.cartCount)
                    this.cartTotal=response.data.cartTotal;
                    this.quantity=1;
                     if(!this.$store.state.cart.kitchen) {
                      this.$store.commit('cart/setKitchen',food.kitchen);
                    }
                    this.$store.commit('checkout/unsetCouponDiscount')
                    this.isMenuLoading = false
                    Toast.show({
                        text: "Item added to the cart",
                        duration: 3000
                    });
                })
                .catch(error => {
                    this.isMenuLoading = false
                    // console.log(error.response.data);
                    Toast.show({
                        text: "Something went Wrong ",
                        duration: 3000
                    });
                })
            } else { 
                var status = true;
                var cartTotal=0;
                var options={'currentQty':food.quantity,'kitchen_id':food.kitchen_id};
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
                    if(food.id==storeCart[key].id) {
                        // alert('test');
                        // Toast.show({
                        // text: "Already added to the cart",
                    
                        // duration: 3000
                        // }); 
                    } else {
                        const list= {
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
                if(!this.$store.state.cart.kitchen) {
                    this.$store.commit('cart/setKitchen',food.kitchen);
                }
                this.option=''
                this.cart=this.$store.state.cart.cart;
                this.cartCount=this.$store.state.cart.cartCount;
                this.$store.commit('cart/setCartTotal',cartTotal)
                this.$store.commit('checkout/unsetCouponDiscount')
                this.cartTotal=cartTotal;
                // console.log(this.cart);
                this.isMenuLoading = false
                Toast.show({
                    text: "Added to the cart",
                    duration: 3000
                }); 
            }
        },
        cartUpdate(qty,Id='',rowId='') {
            // console.log('changeQty')
            this.isMenuLoading = true
            if(this.$store.state.user.authentication) {
                const AuthStr = 'Bearer '.concat(this.$store.state.user.authentication);
                this.api.create({
                    method: 'POST',
                    url: this.api.routes.cartUpdateQuantity,
                    headers: {'Content-Type': 'application/json','Authorization':AuthStr },
                    data:{rowId:rowId,quantity:qty,latitude: this.$store.state.selectedLocation.coords.latitude,longitude: this.$store.state.selectedLocation.coords.longitude}      
                })
                .then(response => { 
                    // console.log(response.data.cart)
                     Toast.show({
                        text: "Cart Updated",
                        duration: 3000
                    }); 
                   
                    this.cart=response.data.cart
                    this.cartCount=response.data.cartCount;
                    this.cartTotal=response.data.cartTotal;
                    this.$store.commit('checkout/unsetCouponDiscount')
                    this.isMenuLoading = false
                    this.$refs.menuDetail.close();
                })
                .catch(error => {
                    this.isMenuLoading = false
                    console.log(error.response.data);
                })
             } else {
                var status = true;
                var cartTotal=0;
                var Total=0;
                const storeCart =this.$store.state.cart.cart;
                var cartArray =  []
                var oldArray='';
                oldArray=storeCart.filter(x => x.id === Id);
                console.log(oldArray[0].cartId);
                    var data={
                        cartId:oldArray[0].cartId,
                        id:oldArray[0].id,
                        name:oldArray[0].name,
                        qty:qty,
                        price:oldArray[0].price,
                        options:oldArray[0].options,
                        }
                    cartTotal=parseFloat(cartTotal)+parseFloat(qty*oldArray[0].price)                   
                    for(const key in storeCart){
                        if(storeCart[key].id!=oldArray[0].id){
                            const list={
                                'cartId':storeCart[key].cartId,
                                'id':storeCart[key].id,
                                'name':storeCart[key].name,
                                'qty' :storeCart[key].qty,
                                'price':storeCart[key].price,
                                'options':storeCart[key].options
                            }
                            Total=parseFloat(storeCart[key].qty*storeCart[key].price)
                            cartArray.push(list)
                        }  
                    }
                    cartTotal=parseFloat(cartTotal)+parseFloat(Total)
                    cartArray.push(data)
                    var cartCount=cartArray.length
                    this.carts=cartArray;
                    this.cartCount=cartCount;
                    this.cartTotal=cartTotal;
                    this.$store.commit('cart/setCartCount',this.cartCount);
                    this.$store.commit('cart/setCart',this.carts);
                    this.$store.commit('cart/setCartTotal',this.cartTotal);
                    this.$store.commit('checkout/unsetCouponDiscount')
                    Toast.show({
                        text: "Cart Updated",
                        duration: 3000
                    }); 
                    this.isMenuLoading = false
                   this.$refs.menuDetail.close();
            }
        },
        changeQuantity(quantity,max,id) {
            this.quantity=quantity
            this.productTotal=(parseFloat(quantity)*parseFloat(this.productPrice)).toFixed(2);
        },
        makeId() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
    },
}
</script>

<style>
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
        background-color: #f2b600;
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
        border-radius: 7;
        padding: 0;
        padding-right: 10;
        margin-bottom: 10;
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
        margin-bottom: 3;
    }
    .menu-item-time{
        font-size: 10;
        font-family: Montserrat_SemiBold;
        color: #364151;
    }
    .price-section{
        flex-direction: row;
        justify-content: space-between;
        margin-bottom:-3;
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
        background-color: #f2b600;
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
        margin: 15;
        align-self: flex-end;
        border-radius:30;
        background-color: #FFFFFF; 
        padding:3;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
        tint-color: #000000;
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
        margin-bottom: 15;
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