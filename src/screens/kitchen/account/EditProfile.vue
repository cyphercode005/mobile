<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Edit Profile"/>
        <nb-tabs :tabBarUnderlineStyle="{height:3, marginTop:1}" v-if="!isLoading">
            <nb-tab heading="Info"  :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#ffffff'}">
                <nb-content padder>
                    <InputWithError :error="$v.form.kitchenName.$dirty && (!$v.form.kitchenName.required || errors.kitchenName)"
                    :msg="errors.kitchenName!='' ? errors.kitchenName : 'Kitchen Name field is required'">
                        <nb-label class="input-label">Kitchen Name</nb-label>
                        <nb-input :on-change-text="(text)=>{form.kitchenName=text}" :defaultValue="form.kitchenName" placeholder="Kitchen Name" class="input-field"
                        :on-blur="() => $v.form.kitchenName.$touch()" />
                    </InputWithError>
            
                    <InputWithError :error="$v.form.email.$dirty && (!$v.form.email.required || errors.email)"
                    :msg="errors.email!='' ? errors.email : 'Email field is required'">         
                        <nb-label class="input-label">Email</nb-label>
                        <nb-input :on-change-text="(text)=>{form.email=text}" :defaultValue="form.email" placeholder="Email" class="input-field"
                        :on-blur="() => $v.form.email.$touch()" />
                    </InputWithError>

                    <!-- <InputWithError :error="$v.form.contactEmail.$dirty && (!$v.form.contactEmail.required || errors.contactEmail)"
                    :msg="errors.contactEmail!='' ? errors.contactEmail : 'Contact Email field is required'"> 
                        <nb-label class="input-label">Contact Email</nb-label>
                        <nb-input v-model="form.contactEmail" placeholder="Contact Email" class="input-field"
                        :on-blur="() => $v.form.contactEmail.$touch()" />
                    </InputWithError>

                    <InputWithError :error="$v.form.notificationEmail.$dirty && (!$v.form.notificationEmail.required || errors.notificationEmail)"
                    :msg="errors.notificationEmail!='' ? errors.notificationEmail : 'Notification Email field is required'"> 
                        <nb-label class="input-label">Notification Email</nb-label>
                        <nb-input v-model="form.notificationEmail" placeholder="Notification Email" class="input-field"
                        :on-blur="() => $v.form.notificationEmail.$touch()" />
                    </InputWithError> -->

                    <InputWithError :error="$v.form.phone.$dirty && (!$v.form.phone.required || errors.phone)"
                    :msg="errors.phone!='' ? errors.phone : 'Phone field is required'"> 
                        <nb-label class="input-label">Phone</nb-label>
                        <nb-input :on-change-text="(text)=>{form.phone=text}" :defaultValue="form.phone" keyboardType="phone-pad" placeholder="Phone" class="input-field" 
                        :on-blur="() => $v.form.phone.$touch()" />
                    </InputWithError>
                    <InputWithError> 
                        <nb-label class="input-label">Additional Phone</nb-label>
                        <nb-input :on-change-text="(text)=>{form.additionalPhone=text}" :defaultValue="form.additionalPhone" keyboardType="phone-pad"  class="input-field"/>
                    </InputWithError>

                    <nb-view class="about-section">
                        <nb-text class="label">Short Description</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.shortDescription=text}" :defaultValue="form.shortDescription" :rowSpan="3" placeholder="Short Description" class="input-textarea"/>

                    </nb-view>
                    <nb-view class="about-section">
                        <nb-text class="label">About Kitchen</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.aboutKitchen=text}" :defaultValue="form.aboutKitchen" :rowSpan="3" placeholder="About Kitchen"  class="input-textarea" />
                    </nb-view>

                    <nb-view class="about-section">
                        <nb-text class="label">Specialities</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.specialities=text}" :defaultValue="form.specialities" :rowSpan="3" placeholder="Specialities"  class="input-textarea" />
                    </nb-view>
                    <nb-view class="delivery-type">
                        <nb-view class="delivery-type-item">
                            <nb-text class="delivery-item-text">Enable Kitchen Delivery</nb-text>
                            <nb-checkbox color="#fcbe00" :checked="form.delivery" :on-press="deliveryType"/>
                        </nb-view>
                    </nb-view>
                </nb-content>
            </nb-tab>  
         
            <nb-tab heading="Bank" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#ffffff'}">
                <nb-content padder>
                    <nb-text class="label">Bank Account & Others</nb-text>
                    <!-- <nb-item  class="input-item"> -->
                    <InputWithError :error="$v.form.bankName.$dirty && (!$v.form.bankName.required || errors.bankName)"
                    :msg="errors.bankName!='' ? errors.bankName : 'Bank Name field is required'"> 
                            <nb-label class="input-label">Bank Name</nb-label>
                            <nb-input :on-change-text="(text)=>{form.bankName=text}" :defaultValue="form.bankName" placeholder="Bank Name" class="input-field"
                            :on-blur="() => $v.form.bankName.$touch()"/>
                    </InputWithError>
                    <!-- </nb-item> -->
                    <InputWithError :error="$v.form.branch.$dirty && (!$v.form.branch.required || errors.branch)"
                    :msg="errors.branch!='' ? errors.branch : 'Branch Name field is required'"> 
                        <nb-label class="input-label">Branch</nb-label>
                        <nb-input :on-change-text="(text)=>{form.branch=text}" :defaultValue="form.branch" placeholder="Branch" class="input-field"
                        :on-blur="() => $v.form.branch.$touch()"/>
                    </InputWithError>
                    <!-- <InputWithError :error="$v.form.paymentMethod.$dirty && (!$v.form.paymentMethod.required || errors.paymentMethod)"
                    :msg="errors.paymentMethod!='' ? errors.paymentMethod : 'Payment Method field is required'"> 
                        <nb-label class="input-label">Payment Method</nb-label>
                        <nb-input v-model="form.paymentMethod" placeholder="Payment Method" class="input-field"
                        :on-blur="() => $v.form.paymentMethod.$touch()"/>
                    </InputWithError> -->

                    <InputWithError :error="$v.form.accountNumber.$dirty && (!$v.form.accountNumber.required || errors.accountNumber)"
                    :msg="errors.accountNumber!='' ? errors.accountNumber : 'Account Number field is required'"> 
                        <nb-label class="input-label">Account Number</nb-label>
                        <nb-input :on-change-text="(text)=>{form.accountNumber=text}" :defaultValue="form.accountNumber" keyboardType="phone-pad" placeholder="Account Number" class="input-field"
                        :on-blur="() => $v.form.accountNumber.$touch()"/>
                    </InputWithError>
                    <InputWithError :error="$v.form.ifsc.$dirty && (!$v.form.ifsc.required || errors.ifsc)"
                    :msg="errors.ifsc!='' ? errors.ifsc : 'IFSC field is required'"> 
                        <nb-label class="input-label">IFSC</nb-label>
                        <nb-input :on-change-text="(text)=>{form.ifsc=text}" :defaultValue="form.ifsc" placeholder="IFSC" class="input-field"
                        :on-blur="() => $v.form.ifsc.$touch()"/>
                    </InputWithError>
                    <InputWithError> 
                        <nb-label class="input-label">SWIFT</nb-label>
                        <nb-input :on-change-text="(text)=>{form.swift=text}" :defaultValue="form.swift" class="input-field"/>
                    </InputWithError>
                </nb-content>
            </nb-tab>  
            
            <nb-tab heading="Album" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#ffffff'}">
                <nb-content padder>
                    <nb-view class="uploads-section">
                        <nb-text class="label">Featured Image</nb-text>
                        <touchable-opacity class="photo-container" :on-press="()=> openImageDialog('featuredImage')">
                            <nb-view class="image-uploaded" v-if="featuredImage">
                                <image-background :source="featuredImage" class="image-background" :imageStyle="{borderRadius:4}">
                                    <nb-text class="change-image">click to change</nb-text>
                                </image-background>
                            </nb-view>
                            <nb-view class="image-upload" v-else>
                                <image :source="require('../../../../assets/images/kitchen/upload.png')" class="upload-icon" />
                                <nb-text class="image-upload-head">Upload Featured Image</nb-text>
                                <nb-text class="image-upload-subhead">Please upload your kitchen featured image </nb-text>
                            </nb-view>
                        </touchable-opacity> 
                        <!-- <nb-view class="upload-container">
                            <touchable-opacity class="upload-item" :on-press="()=>openImageDialog('featuredImage')">
                                <image v-if="featuredImage" :source="featuredImage" class="uploaded-item-image" />
                                <image v-else class="upload-item-image" :source="require('../../../../assets/images/kitchen/camera.png')" />
                            </touchable-opacity>
                        </nb-view> -->
                    </nb-view>
                        
                    <nb-view class="gallery-section">
                        <nb-text class="label">Gallery Images</nb-text>
                        <nb-view class="gallery-container">
                            <image-background v-for="(gallery,index) in galleryImages" :key="index" class="image-container" :source="{uri:gallery.image}" :imageStyle="{margin:2}">
                                <touchable-opacity :on-press="()=>deleteGalleryImage(gallery.id,index)" class="image-remove">
                                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="image-remove-icon" />
                                </touchable-opacity>
                            </image-background> 
                            <touchable-opacity class="gallery-item" :on-press="()=>openImageDialog('galleryImage')">
                                <image class="gallery-item-image" :source="require('../../../../assets/images/kitchen/upload-photo.png')" />
                                <nb-text class="gallery-item-text">Upload</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-view>
                    <nb-view class="gallery-section">
                        <nb-text class="label">Slider Images</nb-text>
                        <nb-view class="gallery-container">
                            <image-background v-for="(slider,index) in sliderImages" :key="index" class="image-container" :source="{uri:slider.image}" :imageStyle="{margin:2}">
                                <touchable-opacity :on-press="()=>deleteSliderImage(slider.id,index)" class="image-remove">
                                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="image-remove-icon" />
                                </touchable-opacity>
                            </image-background> 
                            <touchable-opacity class="gallery-item" :on-press="()=>openImageDialog('sliderImage')">
                                <image class="gallery-item-image" :source="require('../../../../assets/images/kitchen/upload-photo.png')" />
                                <nb-text class="gallery-item-text">Upload</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-view>
                    <nb-view class="gallery-section">
                        <nb-text class="label">Gallery Videos</nb-text>
                        <nb-view class="gallery-container">
                            <image-background v-for="(video,index) in galleryVideos" :key="index" class="image-container" :source="video.image" :imageStyle="{margin:2}">
                                <touchable-opacity :on-press="()=>deleteGalleryVideo(index)" class="image-remove">
                                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="image-remove-icon" />
                                </touchable-opacity>
                            </image-background> 
                            <touchable-opacity  class="gallery-item" :on-press="()=>openVideoDialog('galleryVideo')">
                                <image class="gallery-item-image" :source="require('../../../../assets/images/kitchen/upload-photo.png')" />
                                <nb-text class="gallery-item-text">Upload</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-view>
                    <nb-view class="gallery-section">
                        <nb-text class="label">Slider Videos</nb-text>
                        <nb-view class="gallery-container">
                            <image-background v-for="(video,index) in sliderVideos" :key="index" class="image-container" :source="video.image" :imageStyle="{margin:2}">
                                <touchable-opacity :on-press="()=>deleteSliderVideo(index)" class="image-remove">
                                    <image :source="require('../../../../assets/images/icons/modal-close.png')" class="image-remove-icon" />
                                </touchable-opacity>
                            </image-background> 
                            <touchable-opacity  class="gallery-item" :on-press="()=>openVideoDialog('sliderVideo')">
                                <image class="gallery-item-image" :source="require('../../../../assets/images/kitchen/upload-photo.png')" />
                                <nb-text class="gallery-item-text">Upload</nb-text>
                            </touchable-opacity>
                        </nb-view>
                    </nb-view>
                </nb-content>
            </nb-tab>  
            <nb-tab heading="Others" index="orders" :textStyle="{fontSize: 13, color: '#8c8c8c'}" :activeTextStyle="{fontSize: 13, color: '#000000'}" :style="{backgroundColor:'#ffffff'}">
                <nb-content padder>
                    <nb-view class="about-section">
                        <nb-text class="label">Payment Terms</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.paymentTerms=text}" :defaultValue="form.paymentTerms" :rowSpan="3" class="input-textarea" />
                        <!-- <nb-item regular class="input-item-textarea"> -->
                        <!-- </nb-item> -->
                    </nb-view>
                    <nb-view class="about-section">
                        <nb-text class="label">Delivery Policy</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.deliveryPolicy=text}" :defaultValue="form.deliveryPolicy" :rowSpan="3" class="input-textarea" />
                    </nb-view>
                    <nb-view class="about-section">
                        <nb-text class="label">Order Policy</nb-text>
                        <nb-textarea :on-change-text="(text)=>{form.orderPolicy=text}" :defaultValue="form.orderPolicy" :rowSpan="3" class="input-textarea" />
                    </nb-view>
                </nb-content>
            </nb-tab>
        </nb-tabs>
        <nb-view class="footer">
            <touchable-opacity class="cancel-button" :on-press="()=> {navigation.goBack()}">
                <nb-text class="cancel-button-text">Cancel</nb-text>
            </touchable-opacity>
            <touchable-opacity class="update-button" :on-press="()=>updateKitchen()">
                <nb-text class="update-button-text">Update Profile</nb-text>
                <image :source="require('../../../../assets/images/icons/chevron-right.png')" class="update-button-icon" />
            </touchable-opacity>
        </nb-view>
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
            <nb-view padder class="modal-container">
                <nb-view class="modal-upload-container">
                    <touchable-opacity class="modal-upload-camera" :on-press="()=>captureImage(imageType)">
                        <image class="modal-upload-icon" :source="require('../../../../assets/images/kitchen/camera-icon.png')"/>
                        <nb-text class="modal-upload-text">Camera</nb-text>
                    </touchable-opacity>
                    <touchable-opacity class="modal-upload-file" :on-press="()=>pickImage(imageType)">
                        <image class="modal-upload-icon" :source="require('../../../../assets/images/kitchen/upload-icon.png')"/>
                        <nb-text class="modal-upload-text">Upload</nb-text>
                    </touchable-opacity>
                </nb-view>
                <nb-view class="separator"></nb-view>
                <!-- <nb-item class="modal-input-field">
                    <image class="modal-link-icon" :source="require('../../../../assets/images/kitchen/link.png')"/>
                    <nb-input placeholder="Video URL (YouTube,Faceook)" class="modal-input"/>
                    <touchable-opacity :on-press="()=>{}"><nb-text class="modal-setlink-button-text">Set Link</nb-text></touchable-opacity>
                </nb-item> -->
            </nb-view>
        </RBSheet> 
        <RBSheet
            ref="video"
            height="110"
            :closeOnPressMask="false"
            :customStyles="{
                container: {
                    borderTopLeftRadius:15, borderTopRightRadius:15
                }
            }"
        >
            <touchable-opacity class="modal-close" :on-press="()=>{ $refs.video.close() }">
                <image :source="require('../../../../assets/images/icons/modal-close.png')" class="modal-close-icon" />
            </touchable-opacity>
            <nb-view padder class="modal-container">
                <nb-item class="modal-input-field">
                    <image class="modal-link-icon" :source="require('../../../../assets/images/kitchen/link.png')"/>
                    <nb-input placeholder="Video URL (YouTube)" :on-change-text="(text)=>{videoUrl=text}" :defaultValue="videoUrl" class="modal-input"/>
                    <touchable-opacity :on-press="()=>setLink(videoType)" class="modal-setlink-button"><nb-text class="modal-setlink-button-text">Set Link</nb-text></touchable-opacity>
                </nb-item>
                <nb-text v-if="errors.videoLink" :style="{color:'red',fontSize:11}">{{errors.videoLink}}</nb-text>
                <!-- <nb-item class="modal-input-field">
                    <image class="modal-link-icon" :source="require('../../../../assets/images/kitchen/link.png')"/>
                    <nb-input placeholder="Video URL (YouTube,Faceook)" v-model="videoUrl" class="modal-input"/>
                    <touchable-opacity :on-press="()=>setLink(videoType)"><nb-text class="modal-setlink-button-text">Set Link</nb-text></touchable-opacity>
                </nb-item> -->
             </nb-view>
        </RBSheet> 
    </nb-container>
</template>

<script>
import { required,minLength,email } from 'vuelidate/lib/validators'
import { Toast } from 'native-base'
import {StackActions, navigationActions} from 'react-navigation'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import FormData from 'form-data'
import React, {Component} from 'react'

export default {
    props: {
        navigation: { Object }
    },
     components: {
        
    },
    data() {
        return {
            galleryImages:[],
            sliderImages:[],
            newGalleryImages:[],
            newSliderImages:[],
            sliderVideos:[],
            galleryVideos:[],
            featuredImage:'',
            featuredImageStatus: false,
            imageType: '',
            videoType:'',
            videoId: '',
            videoUrl:'',
            isLoading:false,
            form:{
                kitchenName:'',
                email:'',
                contactEmail:'',
                notificationEmail:'',
                phone:'',
                shortDescription:'',
                aboutKitchen:'',
                specialities:'',
                delivery: '',

                bankName:'',
                branch:'',
                accountNumber:'',
                ifsc:'',
                paymentMethod:'',
                paymentTerms:'',
                deliveryPolicy:'',
                orderPolicy:'',

                kitchen:'',
                additionalPhone:'',
                swift:'',
                email:'',
                payoutGroup:'',
            },
             errors:{
                kitchenName:'',
                email:'',
                contactEmail:'',
                notificationEmail:'',
                phone:'',
                shortDescription:'',
                aboutKitchen:'',
                specialities:'',
                bankName:'',
                branch:'',
                accountNumber:'',
                ifsc:'',
                paymentMethod:'',
                paymentTerms:'',
                deliveryPolicy:'',
                orderPolicy:'',
                videoLink: ''
            },
        }
    },

    validations:{
        form: {
            kitchenName: {
                required,
            },
            email:{
                    required, 
            },
            /* contactEmail:{
                    required, 
            },
            notificationEmail:{
                    required, 
            }, */
            phone:{
                    required, 
            },
            /*  shortDescription:{
                required, 
            },
            aboutKitchen:{
                    required, 
            },
            specialities:{
                    required, 
            },
*/
            bankName:{
                    required, 
            },
            branch:{
                required, 
            },
            accountNumber:{
                required,
            },
            ifsc:{
                required,
            },
            /* paymentMethod:{
                    required,
            }, */
        /*      paymentTerms:{
                    required,
            },
            deliveryPolicy:{
                    required,
            },
            orderPolicy:{
                required, 
            }
            */
        },
    },
    beforeMount() {
        this.getKitchenInfo()
    },
    methods: {
        deliveryType(){
            this.form.delivery = !this.form.delivery
        },
        getKitchenInfo(){
            this.isLoading=true
            console.log(this.$store.state.kitchen.authentication);
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            var status = true;
            this.api.kitchen({
                method: 'POST',
                url: this.api.routes.editKitchen,
                headers: { 'Content-Type': 'application/json',   'Authorization':AuthStr },
            })
            .then(response => { 
                this.isLoading=false
                console.log(response.data)
                this.form.kitchenName = response.data.kitchen.name
                this.form.email = response.data.kitchen.email
                this.form.phone = response.data.kitchen.phone
                this.form.additionalPhone = response.data.kitchen.additional_phone
                /* this.form.contactEmail = response.data.kitchen.contact_email
                this.form.notificationEmail = response.data.kitchen.notification_email */
                this.form.shortDescription = response.data.kitchen.description
                this.form.specialities = response.data.kitchen.specialities
                this.form.aboutKitchen = response.data.kitchen.about
                this.form.delivery = response.data.kitchen.delivery==1 ? true : false
                this.form.orderPolicy = response.data.kitchen.order_policy
                this.form.deliveryPolicy = response.data.kitchen.delivery_policy
                this.form.paymentTerms = response.data.kitchen.payment_terms
                this.form.bankName = response.data.kitchen.bank_name
                this.form.paymentMethod = response.data.kitchen.payment_method
                this.form.accountNumber = response.data.kitchen.account_number
                this.form.swift = response.data.kitchen.swift
                this.form.ifsc = response.data.kitchen.ifsc
                this.form.branch = response.data.kitchen.branch
                this.featuredImage={uri:response.data.featuredImage}
                this.sliderImages=response.data.sliderImages
                
                this.galleryImages=response.data.galleryImages
                if(response.data.galleryVideos.length){
                    response.data.galleryVideos.map((video) => {
                        var url = this.parseUrl(video.url)
                        this.galleryVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:video.url, videoId:url.videoId})
                    })
                }
                if(response.data.sliderVideos.length){
                    response.data.sliderVideos.map((video) => {
                        var url = this.parseUrl(video.url)
                        this.sliderVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:video.url, videoId:url.videoId})
                    })
                }
            })
            .catch(error => {
                this.isLoading=false
                console.log(error.response.data);  
                console.log(error); 
            }) 
            return status
        },
        parseUrl(url){
            let regex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/,
            params = {},
            match;
            match = regex.exec(url)
            console.log(match)
            if(match && match.length){
                var imageUrl = 'https://img.youtube.com/vi/'+match[1]+'/maxresdefault.jpg'
                return ({ imageUrl: imageUrl, videoId: match[1] })
            } else {
                return ({ imageUrl: '', videoId: '' })
            }
        },
        openImageDialog(imageType){
            this.imageType = imageType
            this.$refs.upload.open()
        },
        openVideoDialog(videoType){
            this.videoType = videoType
            this.$refs.video.open()
        },
        setLink(videoType) {
            this.isLoading=true
            console.log(videoType)
            this.errors.videoLink = ''
            if(this.videoUrl){
                var url = this.parseUrl(this.videoUrl)
                if(url.videoId){
                    console.log(url.imageUrl)
                    if(videoType=='sliderVideo') {
                        this.sliderVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:this.videoUrl, videoId:url.videoId})
                    } else {
                        this.galleryVideos.push({image: {uri: url.imageUrl}, type:'video',videoUrl:this.videoUrl, videoId:url.videoId})
                    }
                    this.videoUrl = ''
                    this.$refs.video.close()
                } else {
                    this.errors.videoLink = 'Invalid! Please enter a valid video URL'
                }
            } else {
                this.errors.videoLink = 'Please enter a valid video URL'
            }
            this.isLoading=false
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
                            this.featuredImageStatus = true
                            break
                        }
                        case 'sliderImage' : {
                            this.sliderImages.push({image: pickerResult.uri})
                            this.newSliderImages.push({
                        uri: Platform.OS === 'android' ? pickerResult.uri : pickerResult.uri.replace('file://', ''),
                        name: 'sliderImage',
                        type: 'image/jpeg', // it may be necessary in Android. 
                    })
                            break
                        }
                        case 'galleryImage' : {
                            this.galleryImages.push({image: pickerResult.uri})
                                  this.newGalleryImages.push({
                        uri: Platform.OS === 'android' ? pickerResult.uri : pickerResult.uri.replace('file://', ''),
                        name: 'galleryImage',
                        type: 'image/jpeg', // it may be necessary in Android. 
                    })
                            break
                        }
                
                }
            }
        },
        updateKitchen(){
            console.log(this.featuredImage)
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            for (const key in this.errors) {
                if (this.errors.hasOwnProperty(key)) {
                    this.errors[key]= '';
                }
            }
            this.$v.form.$touch()
            if(!this.$v.form.$error){  
                this.isLoading=true
                var formData = new FormData();
                if(this.featuredImageStatus){
                    formData.append('featuredImage', {
                        uri: Platform.OS === 'android' ? this.featuredImage.uri : this.featuredImage.uri.replace('file://', ''),
                        name: 'featuredImage',
                        type: 'image/jpeg', // it may be necessary in Android. 
                    })
                }
                this.newSliderImages.forEach((item) => {
                    formData.append('sliderImages[]', item);
                });
                this.newGalleryImages.forEach((item) => {
                    formData.append('galleryImages[]', item);
                });
                formData.append('galleryVideos',JSON.stringify(this.galleryVideos))
                formData.append('sliderVideos',JSON.stringify(this.sliderVideos))
                formData.append('name',this.form.kitchenName)
                formData.append('email',this.form.email)
                formData.append('phone',this.form.phone)
                formData.append('additional_phone',this.form.additionalPhone)
                formData.append('delivery', this.form.delivery ? 1 : 0)
                /* formData.append('contact_email',this.form.contactEmail)
                formData.append('notification_email',this.form.notificationEmail) */
                formData.append('description',this.form.shortDescription)
                formData.append('specialities',this.form.specialities)
                formData.append('about',this.form.aboutKitchen)
                formData.append('order_policy',this.form.orderPolicy) 
                formData.append('delivery_policy',this.form.deliveryPolicy) 
                formData.append('payment_terms',this.form.paymentTerms) 
                formData.append('bank_name',this.form.bankName) 
                formData.append('payment_method',this.form.paymentMethod) 
                formData.append('account_number',this.form.accountNumber) 
                formData.append('swift',this.form.swift) 
                formData.append('ifsc',this.form.ifsc) 
                formData.append('branch',this.form.branch)
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.updateKitchen,
                    data:formData,
                    headers: {'Content-Type': 'multipart/form-data','Accept': 'application/json',   'Authorization':AuthStr  },
                })
                .then(response => { 
                    console.log(response.data);  
                    this.$store.commit('kitchen/setProfile', {
                        name : response.data.kitchen.name,
                        email : response.data.kitchen.email,
                        phone : response.data.kitchen.phone,
                        id : response.data.kitchen.id,
                        description : response.data.kitchenDetails.about,
                    })
                    this.$store.commit('kitchen/setImage', {
                        image : response.data.image,
                    })
                    Toast.show({
                        text: "Kitchen Updated successfully",
                        duration : 3000
                    });
                    this.isLoading=false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenProfile' }))
                })
                .catch(error => {
                    console.log(error.response.data)
                    this.isLoading=false
                    for (const key in error.response.data.errors) {
                        if (error.response.data.errors.hasOwnProperty(key)) {
                            this.errors[key]= error.response.data.errors[key][0];
                        }
                    }
                    this.$v.form.$touch()
                });
            } else {
                console.log('Else')
                // console.log(this.$v.form.required) 
                this.$v.form.$touch()
            }
        },
        deleteSliderImage(imageId,index){
            this.isLoading=true
            if(imageId){
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.imageDelete,
                    data :{'id':imageId},
                    headers: { 'Content-Type': 'application/json' },    
                })
                .then(response => {  
                    this.isLoading=false
                    this.sliderImages.splice(index,1)
                    Toast.show({
                        text: "Image Deleted Successfully",
                        duration : 3000
                    });
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error.response.data);
                }) 
            } else {
                this.sliderImages.splice(index,1)
                Toast.show({
                    text: "Image Deleted Successfully",
                    duration : 3000
                });
            }
        },
        deleteGalleryImage(imageId,index){
            this.isLoading=true
            console.log(imageId)
            if(imageId){
                console.log('inside imageid')
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.imageDelete,
                    data :{'id':imageId},
                    headers: { 'Content-Type': 'application/json' },    
                })
                .then(response => { 
                    this.isLoading=false
                    this.galleryImages.splice(index,1)
                    Toast.show({
                        text: "Image Deleted Successfully",
                        duration : 3000
                    });
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error.response.data);
                }) 
            } else {
                this.galleryImages.splice(index,1)
                Toast.show({
                    text: "Image Deleted Successfully",
                    duration : 3000
                });
            }
        },
        deleteGalleryVideo(index){
            this.galleryVideos.splice(index,1)
        },
        deleteSliderVideo(index){
            this.sliderVideos.splice(index,1)
        },
    },
}
</script>

<style>
    .label{
        font-size: 12;
        color: #999999;
        margin-bottom: 5;
    }
    .about-section{
        margin-top: 10;
    }
    .uploads-section{
        margin-top: 5;
        margin-bottom: 20;
    }
    .upload-container{
        margin-vertical: 5;
        flex-direction: row;
        padding-horizontal:15;
        align-items: center;
    }
    .upload-item{
        border-color: #dedede;
        border-width: 0.5;
        height: 85;
        width: 85;
        justify-content: center;
        align-items: center;
        background-color: #f7f7f7;
        margin-right: 15;
    }
    .upload-item-image{
        width: 34.3;
        height: 34.3;
        resize-mode: contain;
        margin-bottom: 3;
    }
     .uploaded-item-image{
        width: 100;
        height: 100;
        resize-mode: cover;
    }
    .upload-item-text{
        color: #aaaaaa;
        font-size: 10;
    }

    .input-item-textarea{
        border-radius: 4;
        border-color: #d1d1d1;
        flex: 1;
        margin-bottom: 10;
        padding-top: 8;
    }

    /* Gallery */

    .gallery-section{
        margin-top: 5;
        margin-bottom: 10;
    }
    .gallery-container{
        margin-vertical: 5;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        /* justify-content: space-around; */
    }
    .gallery-item{
        border-color: #dedede;
        border-width: 0.5;
        height: 60;
        width: 60;
        justify-content: center;
        align-items: center;
        background-color: #f7f7f7;
        margin-right: 5;
        margin-bottom: 5;
    }
    .gallery-item-image{
        width: 18;
        height: 18;
        resize-mode: contain;
        margin-bottom: 2;
    }
    .gallery-image{
       width:100%;
       height:100%;
        resize-mode: cover;   
    }
    .gallery-item-text{
        color: #aaaaaa;
        font-size: 7;
    }
    .gallery-delete-button{
       background-color: #020202;
        height:10;
        width:10;
        position:absolute;
        tintColor: #fcbe00;
        border-radius:10;
       
        
    }

     .video-thumb{
          width:100%;
       height:100%;
        resize-mode: cover; 
      
    }
    .video-play-icon{
        width: 25;
        height: 25;
        align-items: center;
        justify-content: center;
    }
    .modal-close{
        margin: 12;
        align-self: flex-end;
    }
    .modal-close-icon{
        width: 24;
        height: 24;
    }
    .modal-container{
        padding-top:10;
    }
    .modal-upload-container{

    }
    .modal-input-field{
        margin-bottom: 8;
        align-items: center;
    }
    .modal-input{
        font-size: 12;
        color: #cbc7c7;
        margin-bottom: -10; 
    }
    .modal-link-icon{
        height: 12;
        width: 12;
        resize-mode: contain;
        align-self: center; 
        margin-right: 10;
        margin-top: 8;
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
    .modal-setlink-button-text{
        font-size: 10;
        color: #fcbe00;
        margin-top: 10;
    }

    .separator{
        margin-top: 15;
        border-bottom-color: #dfdfdf;
        border-bottom-width: 1;
        margin-bottom: 10;
    }
    .input-item {
        margin-top: 15;
        margin-bottom: 5;
        flex-direction: column;
        height: 35;
        align-items: flex-start;
    }
    .input-item-street{
        margin-bottom: 15;
        flex-direction: column;
        height: 25;
        align-items: flex-start;
    }
    .input-field{
        font-size: 13;
        color: #000000;
        font-family: Montserrat_Medium;
        height: 40;
        line-height: 18;
        align-self: stretch;
        /* background-color: green; */
    }
    .input-textarea{
        border-radius: 4;
        border-color: #d1d1d1;
        border-width: 0.5;
        background-color: #f7f7f7;
        flex: 1;
        font-family: Montserrat_Regular;
        font-size: 12;
        /* margin-bottom: 10; */
        padding-top: 8;
    }
    .input-label{
        font-size: 12;
        color: #000000;
        padding-top: 0;
        padding-bottom: 0;
        flex: 1;
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
    .update-button{
        flex: 1;
        background-color: #fcbe00;
        justify-content: center;
        align-items: center;
        border-top-left-radius: 20;
        flex-direction: row;
    }
    .update-button-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_Medium;
    }
    .update-button-icon{
        width: 8.5;
        height: 14.1;
        resize-mode: contain;
        margin-left: 10;
    }
    .info-section-bank{
        margin-top: 10;
    }

    /*  */

    .image-container{
        height: 60;
        width: 60;
        resize-mode:contain;
        border-radius: 9;
        background-color: #FFFFFF;
        margin-right: 15;
    }
    .image-remove{
        align-self: flex-end;
        margin-right: -7;
        margin-top: -7;
    }
    .image-remove-icon{
        width: 19;
        height: 19;
        resize-mode: contain;
        tint-color: #fcbe00
    }

    .photo-container{
        border-radius: 4;
        border-color: #d1d1d1;
        border-width: 1;
        margin-bottom: 15;
    }
    .image-uploaded{
        align-items: center;
        justify-content: center;
        padding: 5;
    }
    .image-upload{
        align-items: center;
        justify-content: center;
        padding: 20;
    }
    .image-background{
        height: 100;
        width: 100%;
        resize-mode: cover;
        justify-content: flex-end;
        align-items: flex-end;
    }
    .change-image{
        /* align-self: center; */
        font-size: 11;
        background-color:rgba(255, 253, 253, 0.6);
        color: #000000;
        padding-horizontal: 5;
        padding-vertical: 2;
    }
    .upload-icon{
        width: 42;
        height: 42;
        resize-mode: contain;
    }
    .modal-setlink-button{
        margin-left: 15;
    }

    /*  */

    .delivery-type{
        flex-direction: row;
        justify-content: space-between;
        margin-top: 5;
        margin-right: 10;
        margin-bottom: 10
    }
    .delivery-type-item{
        flex-direction: row;
        justify-content: space-around;
    }
    .delivery-item-text{
        font-size: 12;
        color: #999999;
        font-family: Montserrat_Medium;
    }
</style>



