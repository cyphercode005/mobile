<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Menu" />
        <nb-content :contentContainerStyle="{flexGrow: 1, width:'100%'}" :automaticallyAdjustContentInsets="true">
            <nb-list v-if="todaysMenus">
                <nb-list-item v-for="(menu,index) in todaysMenus" :key="index" avatar>
                    <nb-left>
                        <image class="item-image" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/kitchen/menu.png')" />
                    </nb-left>
                    <nb-body>
                        <nb-text  class="item-name">{{menu.name}}</nb-text>
                            <!-- <nb-text class="item-quantity">{{menu.quantity}}</nb-text> -->
                        <nb-view class="item-details">
                            <nb-view class="item-detail">
                                <nb-text class="item-label">Quantity</nb-text>
                                <nb-text class="item-value item-quantity">{{ menu.quantity }}</nb-text>
                            </nb-view>
                            <nb-view class="item-detail">
                                <nb-text class="item-label">Price</nb-text>
                                <nb-text class="item-value item-price">Rs. {{ parseFloat(menu.price).toFixed(2) }}</nb-text>
                            </nb-view>
                        </nb-view>
                        <nb-view class="status-updation">
                            <touchable-opacity :on-press="()=>{navigation.navigate('EditKitchenMenu',{foodId:menu.id})}">
                                <nb-text class="item-edit">Edit</nb-text>
                            </touchable-opacity>
                            <touchable-opacity :on-press="()=>repostOpen(menu.id,menu.image,menu.name)">
                                <nb-text class="item-repost">Repost</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-body>
                    <nb-right :style="{justifyContent:'center'}">
                        <nb-switch :on-change="()=> updateStatus(menu.id, index)" :value="menu.status == 1 ? true : false" :trackColor="{true: '#fcbe00', false: 'grey'}" thumbColor='#FFFFFF' /> 
                    </nb-right>
                </nb-list-item>
            </nb-list>
            <nb-text class="recent">Recent</nb-text>
            <nb-list v-if="menus!=''">
                <nb-list-item v-for="(menu,index) in menus" :key="index" avatar>
                    <nb-left>
                        <image class="item-image grayscale" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/kitchen/menu.png')" />
                    </nb-left>
                    <nb-body>
                        <nb-text  class="item-name">{{menu.name}}</nb-text>
                            <!-- <nb-text class="item-quantity">{{menu.quantity}}</nb-text> -->
                        <nb-view class="item-details">
                            <nb-view class="item-detail">
                                <nb-text class="item-label">Quantity</nb-text>
                                <nb-text class="item-value item-quantity">{{ menu.quantity }}</nb-text>
                            </nb-view>
                            <nb-view class="item-detail">
                                <nb-text class="item-label">Price</nb-text>
                                <nb-text class="item-value item-price">Rs. {{ parseFloat(menu.price).toFixed(2) }}</nb-text>
                            </nb-view>
                        </nb-view>
                        <nb-view class="status-updation">
                            <touchable-opacity :on-press="()=>{navigation.navigate('EditKitchenMenu',{foodId:menu.id})}">
                                <nb-text class="item-edit">Edit</nb-text>
                            </touchable-opacity>
                            <touchable-opacity :on-press="()=>repostOpen(menu.id,menu.image,menu.name)">
                                <nb-text class="item-repost">Repost</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-body>
                </nb-list-item>
            </nb-list>
            <nb-view v-else padder class="no-result">
                <nb-text class="no-result-text">No Foods Found</nb-text>
            </nb-view>

            <!-- <nb-list>
                <nb-list-item v-for="(menu,index) in menus" :key="index" avatar noBorder :on-press="()=>{navigation.navigate('ScheduleKitchenMenu')}">
                    <nb-left v-if="menu.status == 0">
                        <image class="item-image disabled-menu-image" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/kitchen/menu.png')" />
                    </nb-left>
                    <nb-left v-else>
                        <nb-text></nb-text>
                        <image class="item-image" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/kitchen/menu.png')" />
                    </nb-left>
                    <nb-body v-if="menu.status == 0">
                         <nb-view class="item-name-quantity">
                            <nb-text  class="item-name disabled-menu">{{menu.name}}</nb-text>
                            <nb-text class="item-quantity disabled-menu">{{menu.quantity}}</nb-text>
                        </nb-view>
                        <nb-text class="item-price disabled-menu">Rs. {{parseFloat(menu.price).toFixed(2)}}</nb-text>
                        
                        <nb-view class="status-updation">
                            <touchable-opacity :on-press="()=>{navigation.navigate('EditKitchenMenu',{foodId:menu.id})}">
                                <nb-text class="item-edit">Edit</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-body>
                    <nb-body v-else>
                          <nb-view class="item-name-quantity">
                            <nb-text  class="item-name">{{menu.name}}</nb-text>
                            <nb-text class="item-quantity">{{menu.quantity}}</nb-text>
                        </nb-view>
                        <nb-text class="item-price">Rs. {{parseFloat(menu.price).toFixed(2)}}</nb-text>
                       
                    <nb-view class="status-updation">
                        <touchable-opacity :on-press="()=>{navigation.navigate('EditKitchenMenu',{foodId:menu.id})}">
                            <nb-text class="item-edit">Edit</nb-text>
                        </touchable-opacity>
                        <touchable-opacity :on-press="()=>repostOpen(menu.id,menu.image,menu.name)">
                            <nb-text class="item-repost">Repost</nb-text>
                        </touchable-opacity>
                    </nb-view>
                    </nb-body>
                    
                    <nb-right :style="{justifyContent:'center'}">
                 
                       <nb-switch :on-change="()=> updateStatus(menu.id, index)" :value="menu.status == 1 ? true : false" :trackColor="{true: '#fcbe00', false: 'grey'}" thumbColor='#FFFFFF' /> 

                    </nb-right>
                </nb-list-item>
            </nb-list> -->
        </nb-content>
        <touchable-opacity class="add-menu-button" :on-press="()=>{navigation.navigate('KitchenMenuAddNew')}">
            <nb-text class="add-menu-button-text">Add New Dishes</nb-text>
        </touchable-opacity>
        <!-- <footer-Kitchen :navigation="navigation" /> -->
        <RBSheet
            ref="repost"
            height="420"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5, zIndex:1
                }
            }"
        >
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Repost</nb-text>
            </nb-view>
            <nb-content padder> 
                <nb-view class="repost-header">
                    <nb-view class="header-left">
                        <image class="item-image" :source="kitchenFood.featuredImage ? {uri:kitchenFood.featuredImage} :require('../../../../assets/images/kitchen/menu.png')" />
                    </nb-view>
                    <nb-view class="header-body">
                        <nb-text class="item-name">{{kitchenFood.name}}</nb-text>
                        <nb-text class="item-description" :numberOfLines="2">{{ kitchenFood.description }}</nb-text>
                        <nb-text class="item-description" v-if="kitchenFood.categoriesName" :numberOfLines="1">{{ (kitchenFood.categoriesName).join(', ') }}</nb-text>
                    </nb-view>
                </nb-view>
                <nb-view class="row-split">
                    <nb-item regular :class="$v.form.price.$dirty && !$v.form.price.required ?'input-item-error':'input-item'">
                        <nb-input :on-change-text="(text)=>{form.price=text}" :defaultValue="form.price" keyboardType="phone-pad" placeholder="Price" class="input-text" :on-blur="() => $v.form.price.$touch()" />
                    </nb-item>
                    <nb-item regular :class="$v.form.quantity.$dirty && !$v.form.quantity.required ?'input-item-error':'input-item'">
                        <nb-input :on-change-text="(text)=>{form.quantity=text}" :defaultValue="form.quantity" keyboardType="phone-pad" class="input-text" placeholder="Quantity" :on-blur="() => $v.form.quantity.$touch()" />
                    </nb-item>
                </nb-view>
                <nb-view class="quantity-time">
                    <nb-view class="time">
                        <nb-text class="label">Available Time</nb-text>
                        <nb-view class="time-container">
                            <nb-item regular :class="($v.form.timeHours.$dirty && !$v.form.timeHours.required) || errors.timeHours ? 'input-item-split-error':'input-item-split'">
                                <nb-input v-model="form.timeHours" keyboardType="phone-pad"  placeholder="hh" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.timeHours = form.timeHours>12 ? true : false}"
                                :on-blur="() => $v.form.timeHours.$touch()" />
                            </nb-item>
                            <nb-item regular :class="($v.form.timeMinutes.$dirty && !$v.form.timeMinutes.required) || errors.timeMinutes ? 'input-item-split-error':'input-item-split'">
                                <nb-input  v-model="form.timeMinutes" keyboardType="phone-pad"  placeholder="mm" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.timeMinutes = form.timeMinutes>59 ? true : false}"
                                :on-blur="() => $v.form.timeMinutes.$touch()"/>
                            </nb-item>
                            <DropDownPicker
                                :items="[
                                    {label: 'AM', value: 'AM'},
                                    {label: 'PM', value: 'PM'},
                                ]"
                                :containerStyle="{height: 45, width:100, marginTop:-10, padding:0}"
                                :style="{backgroundColor: '#fafafa', margin:0, padding:0}"
                                placeholder="AM/PM"
                                :labelStyle="{fontSize:12, color:'#999999'}"
                                :defaultValue="form.timeFormat"
                                :itemStyle="{  justifyContent: 'flex-start', fontSize:12, color:'#999999'}"
                                :dropDownStyle="{backgroundColor: '#fafafa'}"
                                :onChangeItem="(item)=>{
                                    form.timeFormat = item.value
                                }"
                            />
                        </nb-view>
                    </nb-view>
                </nb-view>
                <nb-view class="food-type">
                    <nb-view class="food-type-item">
                        <nb-text class="food-type-text" :on-press="()=> selectVegStatus(0)">Vegetarian</nb-text>
                            <nb-radio color='#04b74c' 
                                selectedColor='#32c46d' 
                                :on-press="()=> selectVegStatus(0)" 
                                :selected="(form.vegNonVeg==0 ? true : false)" 
                                :style="{alignSelf:'flex-end', marginLeft:10}"/>
                    </nb-view >
                    <nb-view class="food-type-item">
                        <nb-text class="food-type-text" :style="{zIndex:2000}" :on-press="()=> selectVegStatus(1)">Non Vegetarian</nb-text>
                            <nb-radio color='#fb1e1e' 
                                selectedColor='#fb1e1e' 
                                :on-press="()=> selectVegStatus(1)" 
                                :selected="form.vegNonVeg==1 ? true : false" 
                                :style="{alignSelf:'flex-end', marginLeft:10, zIndex:9999}"/>
                            </nb-view>
                </nb-view>
            </nb-content>
            <nb-view class="modal-footer">
                <touchable-opacity class="modal-button-cancel" :on-press="()=>{$refs.repost.close()}">
                    <nb-text class="modal-button-cancel-text">Cancel</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-button-add" :on-press="()=>repostFood()">
                    <nb-text class="modal-button-add-text">Done</nb-text>
                </touchable-opacity>
            </nb-view>
        </RBSheet>
    </nb-container>
</template>

<script>
import { Toast } from 'native-base'
import {StackActions, navigationActions} from 'react-navigation'
import DropDownPicker from 'react-native-dropdown-picker';
import { required,minLength,email } from 'vuelidate/lib/validators'

export default {
    props: {
        navigation: { Object }
    },
    components:{
        DropDownPicker
    },
    data() {
        return {
            menus:'',
            menuStatus:'' ,
            foodId:'',
            foodName:'',
            foodImage:'',
            kitchenFood: '',
            todaysMenus: [],
            form:{   
                price:'',
                quantity:'',
                timeHours:'',
                timeMinutes:'',
                timeFormat: 'AM',
                vegNonVeg:0,     
            },
            errors: {
                timeHours: '',
                timeMinutes: ''
            },
            isLoading:false
        }
    },
      validations:{
        form: {
            price:{
                required,
            },
            quantity:{
                required,
            },
            timeHours:{
                required,
            },
            timeMinutes:{
                required,
            },
        }
    },
    mounted(){
        this.willFocusSubscription = this.navigation.addListener(
            'willFocus',
            () => {
                this.getMenus()
            }
        );
    },
    unmounted() {
        this.willFocusSubscription.remove();
    },
    beforeMount(){
        this.getMenus()
    },
    methods: {
        getMenus(){
            this.isLoading=true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.menu,
                headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
            })
            .then(response => { 
                this.isLoading=false
                this.menus=response.data.menu;
                this.todaysMenus=response.data.todayMenu;
                console.log('getMenus',response.data.menu);
                if(this.menus.length==0)
                    status=false;
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            }) 
            return status
        },
        updateStatus(kitchenFoodId, index){     
            var status = true;
            this.isLoading=true
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.updateMenuStatus,
                data :{'kitchen_food_id':kitchenFoodId},
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
                this.isLoading=false
                console.log(response.data);
                this.todaysMenus[index].status = response.data.status

                Toast.show({
                    text: response.data.status ? 'Menu item has been enabled' : 'Menu item has been disabled',
                    duration : 3000
                });
            })
            .catch(error => {
                    this.isLoading=false
                console.log(error.response.data);
            }) 
            return status
        },  
        selectVegStatus(status){
            this.form.vegNonVeg = status;
            console.log(this.form.vegNonVeg)
        },
        repostOpen(foodId,foodImage,foodName){
            this.kitchenFood = ''
            this.form.price = 0.00
            this.form.quantity = 0
            this.form.vegNonVeg = 0
            
            this.isLoading=true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            // var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.editMenu,
                data :{'kitchen_food_id':foodId},
                headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
            })
            .then(response => { 
                console.log(response.data)
                this.foodId = foodId
                this.kitchenFood = response.data.kitchenFood
                this.form.price = parseFloat(response.data.kitchenFood.price).toFixed(2)
                this.form.quantity = parseFloat(response.data.kitchenFood.quantity).toFixed(0)
                this.form.vegNonVeg = parseInt(response.data.kitchenFood.veg_status)
                var availableTime = response.data.kitchenFood.available_time.replace(' ',':')
                var array = availableTime.split(':');
                this.form.timeHours = array[0];
                this.form.timeMinutes = array[1];
                this.form.timeFormat = array[2];
                this.isLoading=false
                this.$refs.repost.open()
            })
            .catch(error => {
                this.isLoading=false
                console.log(error); 
                console.log(error.response.data);  
            })  
        },
        repostFood(){
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            console.log(this.$store.state.kitchen.authentication)
            this.$v.form.$touch()
            if(this.form.timeHours > 12){
                this.errors.timeHours = true
                return
            } else {
                this.errors.timeHours = false
            }
            if(this.form.timeMinutes > 59){
                this.errors.timeMinutes = true
                return
            } else {
                this.errors.timeMinutes = false
            }
            if(!this.$v.form.$error){
                this.isLoading=true
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.repostMenu,
                    data:{
                        price:this.form.price,
                        quantity:this.form.quantity,
                        available_time:this.form.timeHours+':'+this.form.timeMinutes+' '+this.form.timeFormat,
                        veg_status:this.form.vegNonVeg,
                        kitchen_food_id:this.foodId
                    },
                    headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr },
                })
                .then(response => { 
                    this.isLoading=false
                    this.menus=response.data.menu;
                    Toast.show({
                    text: "Kitchen Menu Repost successfully",
                    duration : 3000
                    });
                    this.$refs.repost.close()
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenMenuIndex' }))
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error)
                    console.log(error.response.data)
                }) 
            } else {
                this.$v.form.$touch()
            }
        },

    },
}
</script>

<style>
    .row-split{
        flex-direction: row;
        justify-content: space-evenly;
    }
    .food-item{
        flex-direction: row;
        margin-bottom: 10;
    }
    .repost-header{
        flex-direction: row;
        align-items: center;
        margin-bottom: 10;
        margin-left: 5;
    }
    .item-image{
        width: 70;
        height: 70;
        resize-mode: cover;
        border-radius: 4;
    }
    .item-name-quantity{
        flex-direction: row;
        align-items: center;
    }
    .item-name{
        font-size: 14;
        color: #070707;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
    }
    .item-quantity{
        font-size: 14;
        color: #ff0c0c;
        font-family: Montserrat_Bold;
        margin-left: 8;
    }
    .item-price{
        font-size: 12;
        color: #222222;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
        margin-right: 10;
    }
    .item-description{
        font-size: 12;
        color: #070707;
        margin-bottom: 5;
    }
    .recent{
        font-family: Montserrat_Medium;
        font-size: 14;
        color: #364151;
        padding-horizontal: 15;
        margin-top: 20;
    }
    .disabled-menu-image{
        tint-color: #949494;
    }
    .disabled-menu{
        color: #949494;
    }
    .add-menu-button{
        height: 48;
        background-color: #364151;
        justify-content: center;
        align-items: center;
    }
    .add-menu-button-text{
        font-size: 14;
        font-family: Montserrat_Medium;
        color: #FFFFFF;
    }
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
    .status-updation{
        flex-direction: row;
        margin-top: 4;
        align-items: center;
    }
    .item-stockout{
        color: red;
        font-size: 13;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
        margin-right: 15;
    }
    .item-repost{
        color: rgb(4, 102, 4);
        font-size: 13;
        font-family: Montserrat_Medium;
        margin-left: 15;
    }
    .item-edit{
        color: #222222;
        font-size: 12;
        font-family: Montserrat_Medium;
        margin-right: 15;
    }

    .modal-header{
        margin-vertical: 15;
        padding-horizontal: 15;
    }
    .modal-header-title{
        font-size: 15;
        font-family: Montserrat_Medium;
        margin-bottom: 5;
        color: #000000;
    }
     .modal-item-title{
        font-size: 12;
        font-family: Montserrat_Medium;
        margin-bottom: 5;
        color: #000000;
    }
    .modal-close{
        padding:15
    }
     .modal-button-cancel{
        align-self: flex-end;
    }
    .modal-button-add{
        margin-left:30;
    }
    .modal-button-add-text{
        font-size: 14;
        color: #fcbe00;
    }
    .modal-button-cancel-text{
        font-size: 14;
        color: #000000;
    }
    .modal-footer{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 5;
        padding-horizontal: 15;
        padding-vertical: 15;
        justify-content: space-between;
    }

    .quantity-time{
        flex-direction: row;
        align-items: center;
    }
     .quantity{
        flex: 1;
        background-color: #f7f7f7;
    }
    .time{
        flex: 3;
    }
    .time-container{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
     .label{
        font-size: 12;
        color: #999999;
        margin-bottom: 10;
    }
     .input-item{
        border-radius: 4;
        border-color: #d1d1d1;
        background-color: #f7f7f7;
        height: 45;
        flex: 1;
        margin-bottom: 10;
    }
     .input-item-error{
        border-radius: 4;
        border-color: #e94444;
        background-color: #f7f7f7;
        height: 45;
        flex: 1;
        margin-bottom: 10;
    }
      .input-item-split{
        border-radius: 4;
        border-color: #d1d1d1;
        flex: 1;
        height: 45;
        background-color: #f7f7f7;
        margin-bottom: 10;
        margin-right: 4;
    }
      .input-item-split-error{
        border-radius: 4;
        border-color: #e94444;
        background-color: #f7f7f7;
        flex: 1;
        height: 45;
        margin-bottom: 10;
        margin-right: 4;
    }
     .input-text{
        font-size: 12;
    }
    .food-type{
        flex-direction: row;
        align-items: center;
        margin-vertical: 5;
        margin-bottom: 10;
    }
    .food-type-text{
        font-size: 12;
        color: #999999;
    }
    .food-type-item{
        flex-direction: row;
        align-items: center;
        margin-right: 15;
    }

    .item-details{
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .item-detail{
        flex: 1;
        align-items: flex-start;
        justify-content: center;
    }
    .item-label{
        font-size: 11;
        color: #24272c;
    }
    .item-value{
        font-size: 13;
        color: #24272c;
        font-family: Montserrat_SemiBold;
    }
    .item-price {
        color: #fcbe00;
    }
    .item-quantity{
        color: #ff0c0c;
    }
    .header-left{
        margin-right: 10;
    }
    .header-body{
        flex: 1;
        align-items: flex-start;
    }
    .grayscale{
        opacity:.7
    }
</style>