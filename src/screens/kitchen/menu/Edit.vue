<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Edit Menu" />
        <nb-content padder>   
            <nb-item regular :class="$v.form.dishName.$dirty && !$v.form.dishName.required ?'input-item-error':'input-item'">
                <nb-input :on-change-text="(text)=>{form.dishName=text}" :defaultValue="form.dishName"  placeholder="Dish Name" class="input-text" :on-blur="() => $v.form.dishName.$touch()" />
            </nb-item>
            <nb-view class="row-split">
                <nb-item regular :class="$v.form.price.$dirty && !$v.form.price.required ?'input-item-error':'input-item'">
                    <nb-input :on-change-text="(text)=>{form.price=text}" :defaultValue="form.price" keyboardType="phone-pad" placeholder="Price" class="input-text" 
                    :on-blur="() => $v.form.price.$touch()" />
                </nb-item>
                <nb-item regular :class="$v.form.quantity.$dirty && !$v.form.quantity.required ?'input-item-error':'input-item'">
                    <nb-input :on-change-text="(text)=>{form.quantity=text}" :defaultValue="form.quantity" keyboardType="phone-pad" class="input-text" placeholder="Quantity" :on-blur="() => $v.form.quantity.$touch()" />
                </nb-item>
            </nb-view>
            <!-- <nb-item regular class="input-item-textarea">
                <nb-textarea :rowSpan="3" placeholder="Dish Name" />
            </nb-item> -->
            <nb-view :class="appConfig.platform == 'ios' ? 'quantity-time-ios' : 'quantity-time'">
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
                        <nb-view :style="{zIndex:3000}" v-if="appConfig.platform=='ios'">
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
                        <DropDownPicker v-else
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
            <nb-view class="about-section" :style="{zIndex:1}">
                <nb-text class="label">Description</nb-text>
                <nb-textarea :on-change-text="(text)=>{form.description=text}" :defaultValue="form.description" :rowSpan="3" :class="$v.form.description.$dirty && !$v.form.description.required ?'input-item-textarea-error':'input-item-textarea'" placeholder="Short Description"
                :on-blur="() => $v.form.description.$touch()"/>
            </nb-view>
            <nb-view class="about-section">
                <nb-text class="label">Recipe Details</nb-text>
                <nb-textarea :on-change-text="(text)=>{form.recipe=text}" :defaultValue="form.recipe" :rowSpan="3" :class="$v.form.recipe.$dirty && !$v.form.recipe.required ?'input-item-textarea-error':'input-item-textarea'" placeholder="Recipe Details" :on-blur="() => $v.form.recipe.$touch()"/>
            </nb-view>
            <nb-view class="food-type">
                <nb-view class="food-type-item">
                    <nb-text class="food-type-text">Vegetarian</nb-text>
                    <nb-radio color='#04b74c' 
                        selectedColor='#32c46d' 
                        :on-press="()=> selectVegStatus(0)" 
                        :selected="(form.vegNonVeg==0 ? true :false)" 
                        :style="{alignSelf:'flex-end', marginLeft:10}"/>
                </nb-view >
                <nb-view class="food-type-item">
                    <nb-text class="food-type-text">Non Vegetarian</nb-text>
                    <nb-radio color='#fb1e1e' 
                        selectedColor='#fb1e1e' 
                        :on-press="()=> selectVegStatus(1)" 
                        :selected="(form.vegNonVeg==1 ? true :false)" 
                        :style="{alignSelf:'flex-end', marginLeft:10}"/>
                </nb-view>
            </nb-view>
            <touchable-opacity regular :class="!form.selectedItems.length ? 'input-item-touchable-error':'input-item-touchable'" :on-press="()=>{ $refs.category.open()}">
                <nb-text v-if="form.selectedItems.length == 0" class="category-text">Select Category</nb-text>
                <nb-text v-else class="category-text">{{form.selectedItems.join(', ')}}</nb-text>
                 <!-- <nb-input disabled class="assisted-input" placeholder="Category"/> -->
                <image class="category-drop-icon" :source="require('../../../../assets/images/icons/chevron_down.png')"/>
            </touchable-opacity>
            <nb-view class="uploads-section">
                <nb-text class="label">Upload Photo</nb-text>
                <nb-view class="upload-container">
                    <touchable-opacity class="upload-item" :on-press="()=>openImageDialog('featuredImage')">
                        <image v-if="featuredImage" :source="featuredImage" class="uploaded-item-image" />
                        <image v-else class="upload-item-image" :source="require('../../../../assets/images/kitchen/camera.png')" />
                    </touchable-opacity>
                </nb-view>
                <nb-text v-if="errors.featuredImage" :style="{color:'red',fontSize:12}">{{errors.featuredImage}}</nb-text>
            </nb-view>
        </nb-content>
        <nb-view class="footer">
            <touchable-opacity class="cancel-button" :on-press="()=>{ navigation.goBack() }">
                <nb-text class="cancel-button-text">Cancel</nb-text>
            </touchable-opacity>
            <touchable-opacity class="save-button" :on-press="()=>updateMenu()">
                <nb-text class="save-button-text">Save</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="save-button-icon" />
            </touchable-opacity>
        </nb-view>
        <RBSheet
            ref="category"
            height="350"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5
                }
            }"
        >
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Select Category</nb-text>
            </nb-view>
            <nb-content v-if="getAllCategory">
                <nb-list-item icon class="category-item" v-for="category in categories" :key="category.id" button :on-press="()=>{selectCategory(category.id,category.name)}" noBorder>
                    <nb-left>
                        <nb-checkbox color="#fcbe00" :checked="form.selectedCategories.includes(category.id)" :on-press="()=>{selectCategory(category.id,category.name)}" />
                    </nb-left>
                    <nb-body>
                        <nb-text class="category-item-text">{{category.name}}</nb-text>
                    </nb-body>
                </nb-list-item>
            </nb-content>
            <nb-view class="modal-footer">
                <touchable-opacity class="modal-button-cancel" :on-press="()=>cancelCategories()">
                    <nb-text class="modal-button-cancel-text">Cancel</nb-text>
                </touchable-opacity>
                <touchable-opacity class="modal-button-add" :on-press="()=>{ $refs.category.close() }">
                    <nb-text class="modal-button-add-text">Done</nb-text>
                </touchable-opacity>
            </nb-view>
        </RBSheet>
        <Dialog
            :visible="uploadDialogVisible"
            :onTouchOutside="()=>{ uploadDialogVisible = false}"
            :footer="()=>{}"
            :onHardwareBackPress="()=>{ uploadDialogVisible = false }"
            :dialogStyle="{paddingTop:20}"
        >
            <DialogContent>
                <nb-view>
                    <nb-view class="upload-dialog">
                        <touchable-opacity class="upload-camera" :on-press="()=>captureImage(imageType)">
                            <image class="camera-icon" :source="require('../../../../assets/images/kitchen/camera.png')"/>
                            <nb-text class="camera-text">Camera</nb-text>
                        </touchable-opacity>
                        <touchable-opacity class="upload-image" :on-press="()=>pickImage(imageType)">
                            <image class="camera-icon" :source="require('../../../../assets/images/kitchen/upload-photo.png')"/>
                            <nb-text class="camera-text">Upload</nb-text>
                        </touchable-opacity>
                    </nb-view>
                </nb-view>
            </DialogContent>
        </Dialog>
    </nb-container>
</template>

<script>
import DropDownPicker from 'react-native-dropdown-picker';
import {StackActions, navigationActions} from 'react-navigation'
import { Toast } from 'native-base'
import { required,minLength,email } from 'vuelidate/lib/validators'
import Dialog, { DialogTitle, DialogContent } from 'react-native-popup-dialog'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import FormData from 'form-data'

export default {
    props: {
        navigation : { Object }
    },
      components: {
        Dialog,DialogTitle,DialogContent, DropDownPicker
    },
    data() {
        return {
           
            featuredImage:'',
            featuredStatus:false,
            imageType: '',
            categories:'',
            menuTime:'',
            arr:[],
            uploadDialogVisible: false,
            kitchenFoodId:'',
            form:{    
                selectedCategories:[],
                vegNonVeg:0,
                selectedItems:[],       
                dishName:'',
                price:'',
                quantity:'',
                timeHours:'',
                timeMinutes:'',
                description:'',
                recipe:'',
                // availableTime:'',
                timeFormat: 'AM',
            },
            errors:{
                featuredImage : '',
                timeHours: '',
                timeMinutes: ''
            },
            isLoading:false
        }
    },
    validations:{
        form: {
            selectedCategories:{
                required,
            },
            selectedItems:{
                required,
            },
            dishName:{
                required,
            },
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
            description:{
                required,
            },
            recipe:{
                required,
            },
            /* availableTime:{
                required,
            }, */
        }
    },
    beforeMount()
    {   
        this.isLoading=true
        this.kitchenFoodId = this.navigation.state.params.foodId,
        console.log(this.$store.state.kitchen.authentication);
        const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
        var status = true;
        this.api.kitchen({
            method: 'POST',
            url: this.api.routes.editMenu,
            data :{'kitchen_food_id':this.kitchenFoodId},
            headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
        })
        .then(response => { 
            console.log(response.data)
            this.isLoading=false
            this.form.dishName = response.data.kitchenFood.name
            this.form.quantity = parseFloat(response.data.kitchenFood.quantity).toFixed(0)
            this.form.price = parseFloat(response.data.kitchenFood.price).toFixed(2)
            this.form.description = response.data.kitchenFood.description
            this.form.recipe = response.data.kitchenFood.recipe_details
            this.form.vegNonVeg = response.data.kitchenFood.veg_status
            this.featuredImage={uri:response.data.kitchenFood.featuredImage}
            this.menuTime= response.data.kitchenFood.available_time.replace(' ',':')
            console.log('hour',this.menuTime)
            this.form.selectedCategories=response.data.kitchenFood.categories
            this.form.selectedItems=response.data.kitchenFood.categoriesName
            this.arr = this.menuTime.split(':');
            this.form.timeHours = this.arr[0];
            this.form.timeMinutes = this.arr[1];
            this.form.timeFormat = this.arr[2];

        })
        .catch(error => {
            this.isLoading=false
            console.log(error.response.data);  
            console.log(error); 
        })  
    },
    methods: {
        selectCategory(categoryId,categoryName){
            if(this.form.selectedCategories.includes(categoryId)){
                var index = this.form.selectedCategories.indexOf(categoryId)
                this.form.selectedCategories.splice(index,1)
                this.form.selectedItems.splice(index,1)
            } else {
                this.form.selectedCategories.push(categoryId)
                this.form.selectedItems.push(categoryName)
            }
           
        },
        cancelCategories(){
                this.form.selectedCategories = []
                this.form.selectedItems = []
                this.$refs.category.close()
        },

        selectVegStatus(status){
                this.form.vegNonVeg = status;
                console.log(this.form.vegNonVeg)
        },
        openImageDialog(imageType){
            this.imageType = imageType
            this.uploadDialogVisible = true
        },
        async pickImage(imageType){
            console.log('Test')
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            // only if user allows permission to camera roll
            if (cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // aspect: [4, 3],
                });
                this.assignImagePicked(pickerResult, imageType)                
            }
              this.$refs.upload.close()
        },
        async captureImage(imageType){
            const {
                status: cameraPerm
            } = await Permissions.askAsync(Permissions.CAMERA);

            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

            // only if user allows permission to camera AND camera roll
            if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // aspect: [4, 3],
                });
                this.assignImagePicked(pickerResult, imageType)  
            }
            this.$refs.upload.close()
        },
        assignImagePicked(pickerResult, imageType){
            if(!pickerResult.cancelled){
                this.uploadDialogVisible = false
                switch(imageType){
                    case 'featuredImage' : {
                        this.featuredImage = {uri: pickerResult.uri}
                        this.featuredStatus=true
                        break
                    }
                }
            }
        },
        updateMenu(){
            this.isLoading=true
            this.kitchenFoodId = this.navigation.state.params.foodId
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            console.log(this.$store.state.kitchen.authentication)
            this.$v.form.$touch()
            var formData = new FormData();
            if(this.featuredStatus) {
                if(this.featuredImage){
                    formData.append('featuredImage', {
                        uri: Platform.OS === 'android' ? this.featuredImage.uri : this.featuredImage.uri.replace('file://', ''),
                        name: 'featuredImage',
                        type: 'image/jpeg', // it may be necessary in Android. 
                    })
                } else {
                    this.errors.featuredImage = 'Menu Image is required'
                    return 
                }
            }
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
            if(!this.$v.form.required && !this.errors.timeMinutes && !this.errors.timeHours && this.form.selectedCategories.length){
                formData.append('name', this.form.dishName)
                formData.append('price',this.form.price)
                formData.append('quantity',this.form.quantity)
                formData.append('available_time',this.form.timeHours+':'+this.form.timeMinutes+' '+this.form.timeFormat)
                formData.append('veg_status',this.form.vegNonVeg)
                formData.append('description',this.form.description)
                formData.append('recipe_details',this.form.recipe)
                formData.append('food_category',JSON.stringify(this.form.selectedCategories))
                formData.append('kitchen_food_id',this.kitchenFoodId)
                // console.log(formData)
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.updateMenu,
                    data:formData,
                    headers: {'Content-Type': 'multipart/form-data','Accept': 'application/json','Authorization':AuthStr  },   
                })
                .then(response => { 
                    console.log(response)
                    this.isLoading=false
                    Toast.show({
                        text: "Kitchen Menu updated successfully",
                        duration : 3000
                    });
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenMenuIndex' }))
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error)
                }) 
            } else {
                this.$v.form.$touch()
            }
        },
       
    },

    computed: {
        getAllCategory(){
            this.isLoading=true
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.allCategories,
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
                this.isLoading=false
                console.log(response.data.categories);
                this.categories=response.data.categories;
                console.log( this.categories);
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);
            }) 
            return status
        },
    },
}
</script>

<style>
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
    .input-text{
        font-size: 12;
    }
    .input-item-textarea{
        border-radius: 4;
        border-color: #d1d1d1;
        border-width: 0.5;
        background-color: #f7f7f7;
        flex: 1;
        font-family: Montserrat_Regular;
        font-size: 12;
        margin-bottom: 10;
        padding-top: 8;
    }
    
     .input-item-textarea-error{
        border-radius: 4;
        border-width: 0.5;
        border-color: #e94444;
        background-color: #f7f7f7;
        flex: 1;
        margin-bottom: 10;
        padding-top: 8;
        font-family: Montserrat_Regular;
        font-size: 12;
    }
    .input-item-touchable{
        border-radius: 4;
        border-color: #d1d1d1;
        background-color: #f7f7f7;
        border-width: .8;
        height: 45;
        margin-bottom: 10;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        padding:10;
    }
    .input-item-touchable-error{
        border-radius: 4;
        border-color: #e94444;
        border-width: .8;
        background-color: #f7f7f7;
        height: 45;
        flex: 1;
        margin-bottom: 10;
        align-items: center;
        flex-direction: row;
        justify-content: space-between;
        padding:10;
    }
    .row-split{
        flex-direction: row;
        justify-content: space-evenly;
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
    .quantity-time{
        flex-direction: row;
        align-items: center;
    }
    .quantity-time-ios{
        flex-direction: row;
        align-items: center;
        z-index:2;
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
        align-items: center;
    }
    .label{
        font-size: 12;
        color: #999999;
        margin-bottom: 10;
    }
    .input-center{
        text-align: center;
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
    .category-text{
        font-size: 12;
        color: #999999;
    }
    .category-drop-icon{
        width: 14.1;
        height: 8.5;
        resize-mode: contain;
    }
    .uploads-section{
        margin-top: 5;
        margin-bottom: 10;
    }
    .upload-container{
        margin-vertical: 5;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .upload-item{
        border-color: #d1d1d1;
        border-width: 0.8;
        border-radius: 10;
        background-color: #f7f7f7;
    }
    .upload-item-image{
        width: 34.3;
        height: 34.3;
        resize-mode: contain;
        margin: 33;
    }
    .delivery-type{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5;
        margin-right: 10;
    }
    .delivery-type-item{
        flex-direction: row;
        justify-content: space-around;
    }
    .delivery-item-text{
        font-size: 12;
        color: #999999;
        /* margin-right: 10; */
    }
    .footer{
        flex-direction: row;
        height: 48;
        border-top-width:.5;
        border-top-color: #ececec;
    }
    .cancel-button{
        flex: 1;
        background-color: #FFFFFF;
        justify-content: center;
        align-items: center;
    }
    .cancel-button-text{
        color: #b74c04;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .save-button{
        flex: 1;
        background-color: #fcbe00;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 20;
        flex-direction: row;
        justify-content: center;
    }
    .save-button-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .save-button-icon{
        width: 8.5;
        height: 14.1;
        resize-mode: contain;
        margin-left: 35;
    }
    .modal-close-icon{
        height: 14;
        width: 14;
        resize-mode: contain;
        align-self: flex-end;
        tintColor: #fcbe00;
    }
    .modal-header{
        margin-vertical: 15;
        padding-horizontal: 25;
    }
    .modal-header-title{
        font-size: 15;
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
        padding-horizontal: 25;
        padding-vertical: 25;
        justify-content: space-between;
    }
    .uploaded-item-image{
        width: 100;
        height: 100;
        resize-mode: cover;
        border-radius: 10;
    }

    /* Upload Dialog */

    .upload-dialog{
        flex-direction: row;
        justify-content: center;
        align-items: center;
    }
    .upload-camera{
        padding-vertical: 15;
        padding-horizontal: 25;
        padding-right: 40;
        align-items: center;
        justify-content: center;
        border-right-width: 1;
        border-color: #bababa;
    }
    .upload-image{
        padding-vertical: 15;
        padding-horizontal: 25;
        padding-left: 40;
        align-items: center;
        justify-content: center;
        border-left-width: 1;
        border-color: #999999;
    }
    .camera-icon{
        width: 45;
        height: 45;
        resize-mode: contain;
        margin-bottom: 5;
    }
    .camera-text{
        font-size: 12;
        color: #999999;
    }

</style>