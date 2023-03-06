<template>
    <nb-container padder>
        <Spinner
            :visible="isLoading"
        />    
        <header :navigation="navigation" headerTitle="Food Schedule" />
        <nb-content padder>
            <nb-view class="calendar-item" v-for="(schedule, index) in foodSchedule" :key="schedule.id">
                <nb-view :class="index>0 ? 'status-left' : 'status-left-first'">
                    <nb-view :class="index==foodSchedule.length-1 ? 'track-line-last' : 'track-line'" v-if="index>0"></nb-view>
                    <nb-view class="status-icon"><nb-text class="week-day-text">{{ (schedule.name).substring(0,3) }}</nb-text></nb-view>
                    <nb-view class="track-line" v-if="index!=foodSchedule.length-1"></nb-view>
                </nb-view>
                <nb-view class="status-inactive" :style="{shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1.2}">
                    <nb-view class="status-body">
                        <nb-view class="header">
                            <nb-text class="header-title">{{ schedule.name }}</nb-text>
                            <touchable-opacity class="add-button" :on-press="()=>addItem(schedule.id)">
                                <nb-text class="add-button-text">+ Add Item</nb-text>
                            </touchable-opacity>
                        </nb-view>
                        <nb-view v-if="(schedule.items).length">
                            <nb-view class="menu-item" v-for="item in schedule.items" :key="item.id">
                                <nb-view class="menu-item-left">
                                    <image class="item-image" :source="item.food.image ? {uri: item.food.image} : require('../../../../assets/images/kitchen/menu.png')" />
                                </nb-view>
                                <nb-view class="menu-item-body">
                                    <nb-text class="item-name">{{item.food.name}}</nb-text>
                                    <nb-view class="item-details">
                                        <nb-view class="item-detail">
                                            <nb-text class="item-label">Time</nb-text>
                                            <nb-text class="item-value">{{ item.time }}</nb-text>
                                        </nb-view>
                                        <nb-view class="item-detail">
                                            <nb-text class="item-label">Quantity</nb-text>
                                            <nb-text class="item-value">{{ item.food.quantity }}</nb-text>
                                        </nb-view>
                                        <nb-view class="item-detail">
                                            <nb-text class="item-label">Price</nb-text>
                                            <nb-text class="item-value">Rs. {{ parseFloat(item.food.price).toFixed(2) }}</nb-text>
                                        </nb-view>
                                    </nb-view>
                                </nb-view>
                                <nb-view class="menu-item-right" :style="{justifyContent:'center'}">
                                    <touchable-opacity :on-press="()=>deleteScheduledFood(item.id)">
                                        <image :source="require('../../../../assets/images/kitchen/delete.png')" class="delete-icon" />
                                    </touchable-opacity>
                                </nb-view>
                            </nb-view>
                        </nb-view>
                        <nb-view v-else>
                            <nb-text class="no-result-text">No Items</nb-text>
                        </nb-view>
                    </nb-view>
                </nb-view>
            </nb-view>
        </nb-content>
        <RBSheet
            ref="addFood"
            height="450"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5
                }
            }"
        >
            <nb-view class="modal-header">
                <nb-text class="modal-header-title">Schedule Food</nb-text>
            </nb-view>
            <nb-tabs :tabBarUnderlineStyle="{height:3, marginTop:1}" :onChangeTab="(tab) => {}">
                <nb-tab heading="Select Food" index="1" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" >
                    <nb-content padder :contentContainerStyle="{ flexGrow: 1,}" :automaticallyAdjustContentInsets="true">
                        <nb-view>
                            <touchable-opacity regular :class="!formSelected.foodId || formSelected.foodName ?'input-item-touchable-error':'input-item-touchable'" :on-press="()=>{ $refs.food.open() }">
                                <nb-text v-if="!formSelected.foodName" class="category-text">Select Food</nb-text>
                                <nb-text v-else class="category-text">{{formSelected.foodName}}</nb-text>
                                <image class="category-drop-icon" :source="require('../../../../assets/images/icons/chevron_down.png')"/>
                            </touchable-opacity>
                            <nb-view class="row-split">
                                <nb-item regular :class="$v.formSelected.price.$dirty && !$v.formSelected.price.required ?'input-item-error':'input-item'">
                                    <nb-input :on-change-text="(text)=>{formSelected.price=text}" :defaultValue="formSelected.price" keyboardType="phone-pad" placeholder="Price" class="input-text" 
                                    :on-blur="() => $v.formSelected.price.$touch()" />
                                </nb-item>
                                <nb-item regular :class="$v.formSelected.quantity.$dirty && !$v.formSelected.quantity.required ?'input-item-error':'input-item'">
                                    <nb-input  :on-change-text="(text)=>{formSelected.quantity=text}" :defaultValue="formSelected.quantity"  keyboardType="phone-pad" class="input-text" placeholder="Quantity" :on-blur="() => $v.formSelected.quantity.$touch()" />
                                </nb-item>
                            </nb-view>
                            <nb-view class="quantity-time">
                                <nb-view class="time">
                                    <nb-text class="label">Available Time</nb-text>
                                    <nb-view class="time-container">
                                        <nb-item regular :class="($v.formSelected.timeHours.$dirty && !$v.formSelected.timeHours.required) || errors.formSelected.timeHours ? 'input-item-split-error':'input-item-split'">
                                            <nb-input v-model="formSelected.timeHours" keyboardType="phone-pad"  placeholder="hh" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.timeHours = formSelected.timeHours>12 ? true : false}"
                                            :on-blur="() => $v.formSelected.timeHours.$touch()" />
                                        </nb-item>
                                        <nb-item regular :class="($v.formSelected.timeMinutes.$dirty && !$v.formSelected.timeMinutes.required) || errors.formSelected.timeMinutes ? 'input-item-split-error':'input-item-split'">
                                            <nb-input  v-model="formSelected.timeMinutes" keyboardType="phone-pad"  placeholder="mm" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.timeMinutes = formSelected.timeMinutes>59 ? true : false}"
                                            :on-blur="() => $v.formSelected.timeMinutes.$touch()"/>
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
                                                :defaultValue="formSelected.timeFormat"
                                                :itemStyle="{  justifyContent: 'flex-start', fontSize:12, color:'#999999'}"
                                                :dropDownStyle="{backgroundColor: '#fafafa'}"
                                                :onChangeItem="(item)=>{
                                                    formSelected.timeFormat = item.value
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
                                            :defaultValue="formSelected.timeFormat"
                                            :itemStyle="{  justifyContent: 'flex-start', fontSize:12, color:'#999999'}"
                                            :dropDownStyle="{backgroundColor: '#fafafa'}"
                                            :onChangeItem="(item)=>{
                                                formSelected.timeFormat = item.value
                                            }"
                                        />
                                    </nb-view>
                                </nb-view>
                            </nb-view>
                             <!-- <nb-view class="quantity-time">
                                <nb-view class="time">
                                    <nb-text class="label">Available Date</nb-text>
                                    <nb-view class="time-container">
                                        <nb-item regular :class="($v.formSelected.date.$dirty && !$v.formSelected.date.required) || errors.formSelected.date ? 'input-item-split-error':'input-item-split'">
                                            <nb-input v-model="formSelected.date" keyboardType="phone-pad"  placeholder="dd" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.date = formSelected.date>31 ? true : false}"
                                            :on-blur="() => $v.formSelected.timeHours.$touch()" />
                                        </nb-item>
                                        <nb-item regular :class="($v.formSelected.month.$dirty && !$v.formSelected.month.required) || errors.formSelected.month ? 'input-item-split-error':'input-item-split'">
                                            <nb-input  v-model="formSelected.month" keyboardType="phone-pad"  placeholder="mm" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.month = formSelected.month>12 ? true : false}"
                                            :on-blur="() => $v.formSelected.month.$touch()"/>
                                        </nb-item>
                                        <nb-item regular :class="($v.formSelected.year.$dirty && !$v.formSelected.year.required) || errors.formSelected.year ? 'input-item-split-error':'input-item-split'">
                                            <nb-input  v-model="formSelected.year" keyboardType="phone-pad"  placeholder="yy" class="input-center input-text" :maxLength="4"
                                            :on-blur="() => $v.formSelected.month.$touch()"/>
                                        </nb-item>
                                    </nb-view>
                                </nb-view>
                            </nb-view> -->
                        </nb-view>
                    </nb-content>
                    <nb-view class="footer">
                        <touchable-opacity class="cancel-button" :on-press="()=>{ $refs.addFood.close()}">
                            <nb-text class="cancel-button-text">Cancel</nb-text>
                        </touchable-opacity>
                        <touchable-opacity class="save-button" :on-press="()=>saveSelectFood()">
                            <nb-text class="save-button-text">Save</nb-text>
                            <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="save-button-icon" />
                        </touchable-opacity>
                    </nb-view>
                </nb-tab>
                <nb-tab heading="Add New" index="2" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" >
                    <nb-content padder :automaticallyAdjustContentInsets="true">   
                        <nb-item regular :class="$v.formNew.dishName.$dirty && !$v.formNew.dishName.required ?'input-item-error':'input-item'">
                            <nb-input :on-change-text="(text)=>{formNew.dishName=text}" :defaultValue="formNew.dishName" placeholder="Dish Name" class="input-text" :on-blur="() => $v.formNew.dishName.$touch()" />
                        </nb-item>
                        <nb-view class="row-split">
                            <nb-item regular :class="$v.formNew.price.$dirty && !$v.formNew.price.required ?'input-item-error':'input-item'">
                                <nb-input :on-change-text="(text)=>{formSelected.price=text}" :defaultValue="formNew.price" keyboardType="phone-pad" placeholder="Price" class="input-text" 
                                :on-blur="() => $v.formNew.price.$touch()" />
                            </nb-item>
                            <nb-item regular :class="$v.formNew.quantity.$dirty && !$v.formNew.quantity.required ?'input-item-error':'input-item'">
                                <nb-input :on-change-text="(text)=>{formSelected.quantity=text}" :defaultValue="formNew.quantity" keyboardType="phone-pad" class="input-text" placeholder="Quantity" :on-blur="() => $v.formNew.quantity.$touch()" />
                            </nb-item>
                        </nb-view>
                        <nb-view class="quantity-time">
                            <nb-view class="time">
                                <nb-text class="label">Available Time</nb-text>
                                <nb-view class="time-container">
                                    <nb-item regular :class="($v.formNew.timeHours.$dirty && !$v.formNew.timeHours.required) || errors.formNew.timeHours ? 'input-item-split-error':'input-item-split'">
                                        <nb-input v-model="formNew.timeHours" keyboardType="phone-pad"  placeholder="hh" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formNew.timeHours = formNew.timeHours>12 ? true : false}"
                                        :on-blur="() => $v.formNew.timeHours.$touch()" />
                                    </nb-item>
                                    <nb-item regular :class="($v.formNew.timeMinutes.$dirty && !$v.formNew.timeMinutes.required) || errors.formNew.timeMinutes ? 'input-item-split-error':'input-item-split'">
                                        <nb-input  v-model="formNew.timeMinutes" keyboardType="phone-pad"  placeholder="mm" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formNew.timeMinutes = formNew.timeMinutes>59 ? true : false}"
                                        :on-blur="() => $v.formNew.timeMinutes.$touch()"/>
                                    </nb-item>
                                    <nb-view :style="{ zIndex:3000 }" v-if="appConfig.platform=='ios'">
                                        <DropDownPicker
                                            :items="[
                                                {label: 'AM', value: 'AM'},
                                                {label: 'PM', value: 'PM'},
                                            ]"
                                            :containerStyle="{height: 45, width:100, marginTop:-10, padding:0}"
                                            :style="{backgroundColor: '#fafafa', margin:0, padding:0}"
                                            placeholder="AM/PM"
                                            :defaultValue="formNew.timeFormat"
                                            :labelStyle="{fontSize:12, color:'#999999'}"
                                            :itemStyle="{ justifyContent: 'flex-start', fontSize:12, color:'#999999'}"
                                            :dropDownStyle="{backgroundColor: '#fafafa'}"
                                            :onChangeItem="(item)=>{
                                                formNew.timeFormat = item.value
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
                                        :defaultValue="formNew.timeFormat"
                                        :labelStyle="{fontSize:12, color:'#999999'}"
                                        :itemStyle="{ justifyContent: 'flex-start', fontSize:12, color:'#999999'}"
                                        :dropDownStyle="{backgroundColor: '#fafafa'}"
                                        :onChangeItem="(item)=>{
                                            formNew.timeFormat = item.value
                                        }"
                                    />
                                </nb-view>
                            </nb-view>
                        </nb-view>
                         <nb-view class="quantity-time">
                                <nb-view class="time">
                                    <nb-text class="label">Available Date</nb-text>
                                    <nb-view class="time-container">
                                        <nb-item regular :class="(!$v.formSelected.date.required) || errors.formSelected.date ? 'input-item-split-error':'input-item-split'">
                                            <nb-input v-model="formSelected.date" keyboardType="phone-pad"  placeholder="dd" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.date = formSelected.date>31 ? true : false}"
                                            :on-blur="() => $v.formSelected.timeHours.$touch()" />
                                        </nb-item>
                                        <nb-item regular :class="(!$v.formSelected.month.required) || errors.formSelected.month ? 'input-item-split-error':'input-item-split'">
                                            <nb-input  v-model="formSelected.month" keyboardType="phone-pad"  placeholder="mm" class="input-center input-text" :maxLength="2" :on-change-text="()=>{errors.formSelected.month = formSelected.month>12 ? true : false}"
                                            :on-blur="() => $v.formSelected.month.$touch()"/>
                                        </nb-item>
                                        <nb-item regular :class="(!$v.formSelected.year.required) || errors.formSelected.year ? 'input-item-split-error':'input-item-split'">
                                            <nb-input  v-model="formSelected.year" keyboardType="phone-pad"  placeholder="yy" class="input-center input-text" :maxLength="4"
                                            :on-blur="() => $v.formSelected.month.$touch()"/>
                                        </nb-item>
                                    </nb-view>
                                </nb-view>
                            </nb-view>
                        <nb-view :style="{zIndex:1}">
                            <nb-text class="label">Description</nb-text>
                            <nb-textarea :on-change-text="(text)=>{formNew.description=text}" :defaultValue="formNew.description" :rowSpan="3" :class="$v.formNew.description.$dirty && !$v.formNew.description.required ?'input-item-textarea-error':'input-item-textarea'" placeholder="Short Description"
                            :on-blur="() => $v.formNew.description.$touch()"/>
                        </nb-view>
                        <nb-view >
                            <nb-text class="label">Recipe Details</nb-text>
                            <nb-textarea :on-change-text="(text)=>{formNew.recipe=text}" :defaultValue="formNew.recipe" :rowSpan="3" :class="$v.formNew.recipe.$dirty && !$v.formNew.recipe.required ?'input-item-textarea-error':'input-item-textarea'" placeholder="Recipe Details" :on-blur="() => $v.formNew.recipe.$touch()"/>
                        </nb-view>
                        <nb-view class="food-type">
                            <nb-view class="food-type-item">
                                <nb-text class="food-type-text">Vegetarian</nb-text>
                                    <nb-radio color='#04b74c' 
                                        selectedColor='#32c46d' 
                                        :on-press="()=> selectVegStatus(0)" 
                                        :selected="(formNew.vegNonVeg==0 ? true :false)" 
                                        :style="{alignSelf:'flex-end', marginLeft:10}"/>
                                </nb-view >
                            <nb-view class="food-type-item">
                                <nb-text class="food-type-text">Non Vegetarian</nb-text>
                                    <nb-radio color='#fb1e1e' 
                                        selectedColor='#fb1e1e' 
                                        :on-press="()=> selectVegStatus(1)" 
                                        :selected="(formNew.vegNonVeg==1 ? true :false)" 
                                        :style="{alignSelf:'flex-end', marginLeft:10}"/>
                            </nb-view>
                        </nb-view>
                        <touchable-opacity regular :class="!formNew.selectedItems.length ? 'input-item-touchable-error':'input-item-touchable'" :on-press="()=>{ $refs.category.open()}">
                            <nb-text v-if="formNew.selectedItems.length == 0" class="category-text">Select Category</nb-text>
                            <nb-text v-else class="category-text">{{formNew.selectedItems.join(', ')}}</nb-text>
                            <!-- <nb-input disabled class="assisted-input" placeholder="Category"/> -->
                            <image class="category-drop-icon" :source="require('../../../../assets/images/icons/chevron_down.png')"/>
                        </touchable-opacity>
                        <nb-view class="uploads-section">
                            <nb-text class="label">Upload Photo</nb-text>
                            <nb-view class="upload-container">
                                <touchable-opacity class="upload-item" :on-press="()=>{this.$refs.upload.open()}">
                                    <image v-if="formNew.featuredImage" :source="formNew.featuredImage" class="uploaded-item-image" />
                                    <image v-else class="upload-item-image" :source="require('../../../../assets/images/kitchen/camera.png')" />
                                </touchable-opacity>
                            </nb-view>
                            <nb-text v-if="errors.featuredImage" :style="{color:'red',fontSize:12}">{{errors.featuredImage}}</nb-text>
                        </nb-view>
                    </nb-content>
                    <nb-view class="footer">
                        <touchable-opacity class="cancel-button" :on-press="()=>{ $refs.addFood.close()}">
                            <nb-text class="cancel-button-text">Cancel</nb-text>
                        </touchable-opacity>
                        <touchable-opacity class="save-button" :on-press="()=>addNewFood()">
                            <nb-text class="save-button-text">Save</nb-text>
                            <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="save-button-icon" />
                        </touchable-opacity>
                    </nb-view>
                </nb-tab>
            </nb-tabs>

            <RBSheet
                ref="food"
                height="350"
                :closeOnPressMask="false"
                :customStyles="{
                    container: {
                        borderTopRightRadius:15, borderTopLeftRadius:15, paddingTop:5
                    }
                }"
            >
                <nb-view class="modal-header">
                    <nb-text class="modal-header-title">Select Food</nb-text>
                </nb-view>
                <nb-content v-if="getMenus">
                    <nb-list-item v-for="(menu,index) in menus" :key="index" avatar noBorder :on-press="()=>{selectedFoodItems(menu)}">
                        <nb-left>
                            <nb-text></nb-text>
                            <image class="item-image" :source="menu.image ? {uri:menu.image} :require('../../../../assets/images/kitchen/menu.png')" />
                        </nb-left>
                        <nb-body >
                            <nb-view class="item-name-quantity">
                                <nb-text  class="item-name">{{menu.name}}</nb-text>
                            </nb-view>
                        </nb-body>
                    </nb-list-item> 
                </nb-content>
                <nb-view class="modal-footer">
                    <touchable-opacity class="modal-button-cancel" :on-press="()=>{this.$refs.food.close()}">
                        <nb-text class="modal-button-cancel-text">Cancel</nb-text>
                    </touchable-opacity>
                </nb-view>
            </RBSheet>
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
                            <nb-checkbox color="#fcbe00" :checked="formNew.selectedCategories.includes(category.id)" :on-press="()=>{selectCategory(category.id,category.name)}" />
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
            <RBSheet
                ref="upload"
                height="100"
                :closeOnPressMask="false"
                :customStyles="{
                    container: {
                        borderTopLeftRadius:15, borderTopRightRadius:15
                    }
                }"
            >
                <touchable-opacity class="modal-close" :on-press="()=>{ $refs.upload.close() }">
                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
                </touchable-opacity>
                <nb-content padder class="modal-container">
                    <nb-view class="modal-upload-container">
                        <touchable-opacity class="modal-upload-camera" :on-press="()=>captureImage()">
                            <image class="modal-upload-icon" :source="require('../../../../assets/images/kitchen/camera-icon.png')"/>
                            <nb-text class="modal-upload-text">Camera</nb-text>
                        </touchable-opacity>
                        <touchable-opacity class="modal-upload-file" :on-press="()=>pickImage()">
                            <image class="modal-upload-icon" :source="require('../../../../assets/images/kitchen/upload-icon.png')"/>
                            <nb-text class="modal-upload-text">Upload</nb-text>
                        </touchable-opacity>
                    </nb-view>
                    <nb-view class="separator"></nb-view>
                </nb-content>
            </RBSheet>
        </RBSheet>
        
    </nb-container>
</template>
<script>
import React from "react";
import { Toast } from 'native-base';
import DropDownPicker from 'react-native-dropdown-picker';
import {StackActions, navigationActions} from 'react-navigation'
import { required,minLength,email } from 'vuelidate/lib/validators'
import Dialog, { DialogTitle, DialogContent } from 'react-native-popup-dialog'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import FormData from 'form-data'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        Dialog,DialogTitle,DialogContent,DropDownPicker
    },
    data() {
        return {
            foodSchedule:'',
            categories:'',
            day:'',
            uploadDialogVisible: false,
            menus:'',
            isLoading:false,
            formSelected:{
                foodName:'',
                foodId:'',      
                price:'',
                quantity:'',
                date:'',
                month:'',
                year:'',
                timeHours:'',
                timeMinutes:'',
                timeFormat: 'AM',
            },
            formNew:{
                selectedCategories:[],
                selectedItems:[],
                timeFormat: 'AM',
                dishName:'',
                price:'',
                quantity:'',
                date:'',
                month:'',
                year:'',
                timeHours:'',
                timeMinutes:'',
                description:'',
                recipe:'',
                featuredImage : '',
                vegNonVeg:0,
            },
            errors:{
                featuredImage : '',
                formSelected: {
                    timeHours:'',
                    timeMinutes:'',
                    date:'',
                    month:'',
                    year:'',
                },
                formNew:{
                    timeHours:'',
                    timeMinutes:'',
                    date:'',
                    month:'',
                    year:'',
                },
            }
        }
    },
    validations:{
        formNew: {
            selectedCategories:{
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
            date:{
                required,
            },
            month:{
                required,
            },
            year:{
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
        },
        formSelected: {
            foodId:{
                required,
            },
            price:{
                required,
            },
            quantity:{
                required,
            },
            date:{
                required,
            },
            month:{
                required,
            },
            year:{
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
    beforeMount(){
        this.getSchedule()
        this.getMenus()
        this.getAllCategory()
    },
    methods: {
        getSchedule(){
            this.isLoading=true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.foodSchedule,
                headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
            })
            .then(response => { 
                console.log("MY SCHEDULE",response.data.foodSchedule)
                this.foodSchedule = response.data.foodSchedule
                this.isLoading=false
                })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);  
                console.log(error); 
            })
            return status
        }, 
        getMenus(){
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.getAllMenu,
                headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
            })
            .then(response => { 
                console.log(response.data)
                this.menus=response.data.menu;
                if(this.menus.length==0)
                status=false;
            })
            .catch(error => {
                console.log(error.response.data); 
            }) 
            return status
        }, 
        getAllCategory(){
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.allCategories,
                headers: { 'Content-Type': 'application/json' },    
            })
            .then(response => { 
                this.categories=response.data.categories;   
            })
            .catch(error => {
                console.log(error.response.data);
            }) 
            return status
        },
        addItem(day){
            this.isLoading=true
            this.getMenus()
            this.$refs.addFood.open()
            this.day=day
            this.isLoading=false
        },
        cancelFood(){
             this.$refs.food.close()
        },
        selectedFoodItems(menuItem){
            console.log("MY MENU",menuItem.availableTime)
            this.formSelected.foodId = menuItem.id
            this.formSelected.foodName = menuItem.name
            this.formSelected.price = parseFloat(menuItem.price).toFixed(2)
            this.formSelected.quantity = menuItem.quantity
            var availableTime = menuItem.availableTime.replace(' ',':')
            //var availableDate = menuItem.availableDate.replace(' ','-')
            var array = availableTime.split(':');
            var array1 = availableDate.split('-');
            this.formSelected.date = array1[0];
            this.formSelected.month = array1[1];
            this.formSelected.year = array1[2];
            this.formSelected.timeHours = array[0];
            this.formSelected.timeMinutes = array[1];
            this.formSelected.timeFormat = array[2];
            this.$refs.food.close()
        },
        selectCategory(categoryId,categoryName){
            if(this.formNew.selectedCategories.includes(categoryId)){
                var index = this.formNew.selectedCategories.indexOf(categoryId)
                this.formNew.selectedCategories.splice(index,1)
                this.formNew.selectedItems.splice(index,1)
            } else {
                this.formNew.selectedCategories.push(categoryId)
                this.formNew.selectedItems.push(categoryName)
            }
        },
        cancelCategories(){
            this.formNew.selectedCategories = []
            this.formNew.selectedItems = []
            this.$refs.category.close()
        },
        selectVegStatus(status){
            this.formNew.vegNonVeg = status;
            console.log(this.formNew.vegNonVeg)
        },
        async pickImage(){
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchImageLibraryAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                });
                this.assignImagePicked(pickerResult)                
            }
            this.$refs.upload.close()
        },
        async captureImage(){
            const {
                status: cameraPerm
            } = await Permissions.askAsync(Permissions.CAMERA);
            const {
                status: cameraRollPerm
            } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
            if (cameraPerm === 'granted' && cameraRollPerm === 'granted') {
                let pickerResult = await ImagePicker.launchCameraAsync({
                    allowsEditing: true,
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    // aspect: [4, 3],
                });
                this.assignImagePicked(pickerResult)  
            }
            this.$refs.upload.close()
        },
        assignImagePicked(pickerResult){
            if(!pickerResult.cancelled){
                this.$refs.upload.open()
                this.formNew.featuredImage = {uri: pickerResult.uri}
                console.log(this.formNew.featuredImage)
            }
        },
        deleteScheduledFood(foodId){
            this.isLoading=true
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.foodDelete,
                data :{'id':foodId},
                headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr},
            })
            .then(response => { 
                // this.getSchedule()
                this.foodSchedule = response.data.foodSchedule
                Toast.show({
                    text: "Schedule Deleted successfully",
                    duration : 3000
                });
                this.isLoading=false
            })
            .catch(error => {
                 this.isLoading=false
                console.log(error.response.data); 
            }) 
            return status
        },  
        saveSelectFood(){
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            this.$v.formSelected.$touch()
            if(this.formSelected.timeHours > 12){
                this.errors.formSelected.timeHours = true
                return
            } else {
                this.errors.formSelected.timeHours = false
            }
            if(this.formSelected.timeMinutes > 59){
                this.errors.formSelected.timeMinutes = true
                return
            } else {
                this.errors.formSelected.timeMinutes = false
            }
            if(this.formSelected.date > 31){
                this.errors.formSelected.date = true
                return
            } else {
                this.errors.formSelected.date = false
            }
            if(this.formSelected.month > 12){
                this.errors.formSelected.month = true
                return
            } else {
                this.errors.formSelected.month = false
            }
            
            if(!this.$v.formSelected.$error && !this.errors.formSelected.date && !this.errors.formSelected.month &&  !this.errors.formSelected.timeMinutes && !this.errors.formSelected.timeHours) {
                this.isLoading=true
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.scheduleFood,
                    headers: { 'Content-Type': 'application/json', 'Authorization':AuthStr },
                    data:{
                        price:this.formSelected.price,
                        quantity:this.formSelected.quantity,
                        available_date:this.formSelected.date+'-'+this.formSelected.month+'-'+this.formSelected.year,
                        available_time:this.formSelected.timeHours+':'+this.formSelected.timeMinutes+' '+this.formSelected.timeFormat,
                        // veg_status:this.vegNonVeg,
                        kitchen_food_id:this.formSelected.foodId,
                        day:this.day
                    },
                })
                .then(response => { 
                    this.foodSchedule = response.data.foodSchedule
                    Toast.show({
                        text: "Food scheduled successfully",
                        duration : 3000
                    });
                    this.isLoading=false
                    this.$refs.addFood.close()
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error)
                    console.log(error.response.data)
                })
            }
        },
        addNewFood(){
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            console.log(this.$store.state.kitchen.authentication)
            this.$v.formNew.$touch()
            if(this.formNew.timeHours > 12){
                this.errors.formNew.timeHours = true
                return
            } else {
                this.errors.formNew.timeHours = false
            }
            if(this.formNew.timeMinutes > 59){
                this.errors.formNew.timeMinutes = true
                return
            } else {
                this.errors.formNew.timeMinutes = false
            }
            if(this.formSelected.date > 31){
                this.errors.formSelected.date = true
                return
            } else {
                this.errors.formSelected.date = false
            } 
            if(this.formSelected.month > 12){
                this.errors.formSelected.month = true
                return
            } else {
                this.errors.formSelected.month = false
            }
            if(!this.$v.formNew.$error && !this.errors.formNew.timeMinutes && !this.errors.formNew.timeHours && this.formNew.selectedCategories.length) {
                var formData = new FormData();
                if(this.formNew.featuredImage){
                    formData.append('featuredImage', {
                    uri: Platform.OS === 'android' ? this.formNew.featuredImage.uri : this.formNew.featuredImage.uri.replace('file://', ''),
                    name: 'featuredImage',
                    type: 'image/jpeg', // it may be necessary in Android. 
                    })
                } else {
                    this.errors.featuredImage = 'Food Image is required'
                    return 
                }
                formData.append('name', this.formNew.dishName)
                formData.append('price',this.formNew.price)
                formData.append('quantity',this.formNew.quantity)
                formData.append('available_time',this.formNew.timeHours+':'+this.formNew.timeMinutes+' '+this.formNew.timeFormat)
                formData.append('available_date',this.formNew.date+'-'+this.formNew.month+'-'+this.formNew.year)
                formData.append('veg_status',this.formNew.vegNonVeg)
                formData.append('description',this.formNew.description)
                formData.append('recipe_details',this.formNew.recipe)
                formData.append('day',this.day)
                formData.append('food_category',JSON.stringify(this.formNew.selectedCategories))

                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.addFood,
                    data:formData,
                    headers: {'Content-Type': 'multipart/form-data','Accept': 'application/json','Authorization':AuthStr  },  
                })
                .then(response => { 
                    this.isLoading=false
                    console.log("Added Food Schedule",response.data)
                    this.foodSchedule = response.data.foodSchedule
                    Toast.show({
                        text: "Food added & scheduled successfully",
                        duration : 3000
                    });
                    this.$refs.addFood.close()
                })
                .catch(error => {
                    this.isLoading=false
                }) 
            }
        },
    },
}
</script>
<style>
    .item-image{
        width: 50;
        height: 50;
        resize-mode: cover;
    }
    .about-section{
        height: 50;
        margin-left: 10;
        margin-right: 10;
        flex-direction: row;
         border-color: #d1d1d1;
        border-width: 0.5;
        background-color: #f7f7f7;
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
    .input-text{
        font-size: 12;
    }
    .row-split{
        flex-direction: row;
        justify-content: space-evenly;
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
     .category-text{
        font-size: 12;
        color: #999999;
    }
      .category-drop-icon{
        width: 14.1;
        height: 8.5;
        resize-mode: contain;
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
    .quantity-time{
        flex-direction: row;
        align-items: center;
    }
    .time{
        flex: 3;
    }
    .time-container{
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
    }
    .label{
        font-size: 12;
        color: #999999;
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
     .footer{
        flex-direction: row;
        height: 48;
        border-top-width:.5;
        border-top-color: #ececec;
         justify-content: flex-end;
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
     .modal-footer{
        flex-direction: row;
        justify-content: flex-end;
        margin-top: 5;
        padding-horizontal: 15;
        padding-vertical: 15;
        justify-content: space-between;
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
    .modal-container{
        padding-top: 0;
        margin-top: -20;
    }
    .modal-upload-container{
        flex-direction: row;
    }
    .modal-upload-camera{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .modal-upload-file{
        flex-direction: row;
        align-items: center;
        flex: 1;
    }
    .modal-upload-icon{
        height: 16;
        width: 19.2;
        resize-mode: contain;
        margin-right: 12;
    }
    .modal-upload-text{
        font-size: 12;
        color: #000000;
    }
    .modal-close{
        margin: 12;
        align-self: flex-end;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
    }
    .separator{
        margin-top: 15;
        border-bottom-color: #dfdfdf;
        border-bottom-width: 1;
        margin-bottom: 10;
    }
    .uploaded-item-image{
        width: 100;
        height: 100;
        resize-mode: cover;
        border-radius: 10;
    }

    /* Status Second Inactive */

    .calendar-item{
        flex-direction: row;
        padding-left:0;
        padding-bottom: 0;
        padding-top: 15;
        padding-right: 0;
    }
    .status-left{
        margin-right: 10;
        margin-top: -15;
        width: 30;
        align-items: center;
    }
    .status-left-first{
        margin-right: 10;
        margin-top: 15;
        width: 30;
        align-items: center;
    }
    .status-icon{
        width: 35;
        height: 35;
        border-radius: 30;
        resize-mode: contain;
        tint-color: #fcbe00;
        border-width: .5;
        border-color: #e0e0e0;
        background-color: #fcbe00;
        justify-content: center;
        align-items: center;
    }
    .week-day-text{
        font-size: 11;
        font-family: Montserrat_Medium;
        text-align: center;
        align-self: center;
        text-transform: uppercase;
        color: #FFFFFF;
    }
    .status-inactive{
        flex-direction: row;
        flex: 1;
        /* padding:10; */
        border-radius: 6;
        background-color: #FFFFFF;
        elevation: 3;
        
        justify-content: space-between;
    }
    .status-body{
        flex: 1;
    }
    .header-title{
        font-family: Montserrat_Medium;
        font-size: 13;
        color: #24272c;
        margin-bottom: 3;
    }
    .order-item{
        font-size: 10;
        color: #24272c;
    }
    .status-right{
        /* flex:2; */
    }
    .status-image{
        width: 48;
        height: 48;
        resize-mode: contain;
    }
    .track-line{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: 1;
        z-index: 9999;
        border-color: #d8d8d8;
    }
    .track-line-last{
        border-width: .5;
        width: 0;
        align-self: center;
        flex: .5;
        z-index: 9999;
        border-color: #d8d8d8;
    }

    /* Schedule Content */

    .header{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        background-color: #e0e0e0;
        border-top-left-radius: 6;
        border-top-right-radius: 6;
        padding-horizontal: 10;
        padding-vertical:5;
    }
    .add-button{

    }
    .add-button-text{
        font-size: 11;
        font-family: Montserrat_Medium;
        color: #fcbe00;
    }

    /* Menu Items */

    .menu-item{
        flex-direction: row;
        justify-content: space-between;
        padding-horizontal: 5;
        padding-vertical: 5;
        border-bottom-width: 1;
        border-color: #999999;
    }
    .menu-item-left{
        margin-right: 10;
    }
    .menu-item-body{
        flex: 1;
        align-items: flex-start;
    }
    .menu-item-right{
        margin-left: 5;
        margin-right: 5;
    }
    .delete-icon{
        width: 15;
        height: 15;
        resize-mode: contain;
        tint-color: #c90909;
    }
    .item-image{
        width: 45;
        height: 45;
        resize-mode: cover;
    }
    .item-name-quantity{
        flex-direction: row;
        align-items: center;
    }
    .item-name{
        font-size: 12;
        color: #070707;
        font-family: Montserrat_Medium;
        margin-bottom: 4;
    }
    .item-quantity{
        font-size: 14;
        color: #ff0c0c;
        font-family: Montserrat_SemiBold;
        margin-left: 8;
    }
    .item-price{
        font-size: 12;
        color: #222222;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
    }
    .item-description{
        font-size: 10;
        color: #070707;
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
        font-size: 10;
        color: #24272c;
    }
    .item-value{
        font-size: 11;
        color: #24272c;
        font-family: Montserrat_Medium;
    }

    .no-result-text{
        font-size: 12;
        color: #070707;
        margin-vertical: 4;
        font-family: Montserrat_Medium;
        text-align: center;
    }
    .category-item-text{
        font-size: 13;
        font-family: Montserrat_Medium;
    }
</style>