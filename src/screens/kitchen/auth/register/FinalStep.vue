<template>
    <nb-container>
         <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Uploads" :registration=true />
        <nb-content padder>
            <touchable-opacity class="photo-container" :on-press="()=> openImageDialog('featuredImage')">
                <nb-view class="image-uploaded" v-if="featuredImage">
                    <image-background :source="featuredImage" class="image-background" :imageStyle="{borderRadius:4}">
                        <nb-text class="change-image">click to change</nb-text>
                    </image-background>
                </nb-view>
                <nb-view class="image-upload" v-else>
                    <image :source="require('../../../../../assets/images/kitchen/upload.png')" class="upload-icon" />
                    <nb-text class="image-upload-head">Upload Featured Image</nb-text>
                    <nb-text class="image-upload-subhead">Please upload your kitchen featured image </nb-text>
                </nb-view>
            </touchable-opacity> 
            <nb-text :style="{color:'red',fontSize:12, marginTop:-10, marginBottom:10}" v-if="errors.featuredImage">{{errors.featuredImage}}</nb-text>
            <touchable-opacity class="photo-container" :on-press="()=> openImageDialog('proofFrontImage')">
                <nb-view class="image-uploaded" v-if="proofFrontImage">
                    <image-background :source="proofFrontImage" class="image-background" :imageStyle="{borderRadius:4}">
                        <nb-text class="change-image">click to change</nb-text>
                    </image-background>
                </nb-view>
                <nb-view class="image-upload" v-else>
                    <image :source="require('../../../../../assets/images/kitchen/upload.png')" class="upload-icon" />
                    <nb-text class="image-upload-head">Upload Document</nb-text>
                    <nb-text class="image-upload-subhead">Please upload front page of your Aadhaar or ID card</nb-text>
                </nb-view>
            </touchable-opacity>
            <nb-text :style="{color:'red',fontSize:12, marginTop:-10, marginBottom:10}" v-if="errors.proofFrontImage">{{errors.proofFrontImage}}</nb-text>
            <touchable-opacity class="photo-container" :on-press="()=> openImageDialog('proofBackImage')">
                <nb-view class="image-uploaded" v-if="proofBackImage">
                    <image-background :source="proofBackImage" class="image-background" :imageStyle="{borderRadius:4}">
                        <nb-text class="change-image">click to change</nb-text>
                    </image-background>
                </nb-view>
                <nb-view class="image-upload" v-else>
                    <image :source="require('../../../../../assets/images/kitchen/upload.png')" class="upload-icon" />
                    <nb-text class="image-upload-head">Upload Document</nb-text>
                    <nb-text class="image-upload-subhead">Please upload back page of your Aadhaar or ID card</nb-text>
                </nb-view>
            </touchable-opacity>
            <nb-text :style="{color:'red',fontSize:12, marginTop:-10, marginBottom:10}" v-if="errors.proofBackImage">{{errors.proofBackImage}}</nb-text>

            <nb-button block rounded :on-press="uploadKitchenImage"><nb-text>Request Verification</nb-text></nb-button>
        </nb-content>
        <Dialog
            :visible="uploadDialogVisible"
            :onTouchOutside="()=>{ uploadDialogVisible = false}"
            :footer="()=>{}"
            :dialogStyle="{paddingTop:20}"
        >
            <DialogContent>
                <nb-view>
                    <nb-view class="upload-dialog">
                        <touchable-opacity class="upload-camera" :on-press="()=>captureImage(imageType)">
                            <image class="camera-icon" :source="require('../../../../../assets/images/kitchen/camera.png')"/>
                            <nb-text class="camera-text">Camera</nb-text>
                        </touchable-opacity>
                        <touchable-opacity class="upload-image" :on-press="()=>pickImage(imageType)">
                            <image class="camera-icon" :source="require('../../../../../assets/images/kitchen/upload-photo.png')"/>
                            <nb-text class="camera-text">Upload</nb-text>
                        </touchable-opacity>
                    </nb-view>
                </nb-view>
            </DialogContent>
        </Dialog>
    </nb-container>
</template>

<script>
// import PhotoUpload from 'react-native-photo-upload'
import { Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
import Dialog, { DialogTitle, DialogContent } from 'react-native-popup-dialog'
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import FormData from 'form-data'

export default {
    props: {
        navigation : { Object }
    },
    components: {
        Dialog,DialogTitle,DialogContent
    },
    beforeMount()
    {
  console.log(this.$store.state.kitchen)
    },
    data() {
        return {
            featuredImage: '',
            proofFrontImage: '',
            proofBackImage: '',
            featuredStatus:false,
            proofFrontStatus:false,
            proofBackStatus:false,
            uploadDialogVisible: false,
            imageType: '',
            errors:{
                featuredImage: '',
                proofFrontImage: '',
                proofBackImage :''
            },
            isLoading:false
        }
    },
    methods: {
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
        },
        assignImagePicked(pickerResult, imageType){
            console.log(pickerResult);
            if(!pickerResult.cancelled){
                this.uploadDialogVisible = false
                switch(imageType){
                    case 'featuredImage' : {
                            this.featuredImage = {uri: pickerResult.uri}
                            this.featuredStatus=true
                            break
                        }
                    case 'proofFrontImage' : {
                            this.proofFrontImage = {uri: pickerResult.uri}
                            this.proofFrontStatus=true
                            break
                        }
                    case 'proofBackImage' : {
                            this.proofBackImage = {uri: pickerResult.uri}
                            this.proofBackStatus=true
                            break
                        }
                }
            }
        },
        uploadKitchenImage(){
            var formData = new FormData();
            if(this.featuredStatus) {
                this.errors.featuredImage = ''
                formData.append('featuredImage', {
                    uri: Platform.OS === 'android' ? this.featuredImage.uri : this.featuredImage.uri.replace('file://', ''),
                    name: 'featuredImage',
                    type: 'image/jpeg', // it may be necessary in Android. 
                })
            } else {
                this.errors.featuredImage = 'Kitchen featured image is required'
            }
            if(this.proofFrontStatus) {
                this.errors.proofFrontImage = ''
                formData.append('proofFrontImage', {
                    uri: Platform.OS === 'android' ? this.proofFrontImage.uri : this.proofFrontImage.uri.replace('file://', ''),
                    name: 'proofFrontImage',
                    type: 'image/jpeg', // it may be necessary in Android. 
                })
            } else {
                this.errors.proofFrontImage = 'Front page of proof image is required for verification'
            }
            if(this.proofBackStatus)
            {
                this.errors.proofBackImage =  ''
                formData.append('proofBackImage', {
                    uri: Platform.OS === 'android' ? this.proofBackImage.uri : this.proofBackImage.uri.replace('file://', ''),
                    name: 'proofBackImage',
                    type: 'image/jpeg', // it may be necessary in Android. 
                })
            } else {
                this.errors.proofBackImage = 'Back page of proof image is required for verification'
            }
            const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication);
            console.log(formData);
            if(this.featuredStatus &&this.proofFrontStatus && this.proofBackStatus)
            {
                this.isLoading=true 
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.fileUpload,
                    headers: {'Content-Type': 'multipart/form-data','Accept': 'application/json',   'Authorization':AuthStr  },
                data: formData   
                })
                .then(response => { 
                    this.$store.commit('kitchen/setImage', {
                        image : response.data.featuredImage,
                    })
                    Toast.show({
                        text: "Profile has been submitted for verifiation.",
                        duration : 3000
                    }); 
                    this.isLoading=false
                    this.navigation.dispatch(StackActions.replace({ routeName: 'KitchenVerification' }))
                })
                .catch(error => {
                    this.isLoading=false
                    console.log(error);
                }) 
            }
        },
    },
}
</script>

<style>
    .input-item{
        border-radius: 4;
        border-color: #d1d1d1;
        height: 45;
        flex: 1;
        margin-bottom: 10;
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
    .image-upload-head{
        font-size: 14;
        color: #999999;
        font-family: Montserrat_Medium;
    }
    .image-upload-subhead{
        font-size: 10;
        color: #999999;
    }
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