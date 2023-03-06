  
import React, {Component} from 'react';    
import {NativeModules} from 'react-native';
import {RNPgReactNativeSDK} from 'react-native-pg-react-native-sdk'
import Constants from 'expo-constants'
import Config from '@/constants/Config'
import axios from 'axios';


    var testUrl = "https://test.cashfree.com/api/v2/cftoken/order"
    var prodUrl = "https://api.cashfree.com/api/v2/cftoken/order"

    var endpoint = 'https://test.cashfree.com/api/v2/cftoken/order'

    const options = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'x-client-id': Config.payment.clientId,
            'x-client-secret': Config.payment.clientSecret
        }
    };

    function initialize(){
        axios.interceptors.request.use(config => {
            console.log('Request was sent');
            return config;
        }, error => {
            // handle the error
            return Promise.reject(error);
        });
        
        axios.interceptors.response.use((response) => {
        // do something with the response data
            console.log('Response was received');
            return response;
        }, error => {
        // handle the response error
            return Promise.reject(error);
        });
        console.log("CF::SDK::",testUrl);
        console.log("CF::SDK::",JSON.stringify(options));

        if(Config.payment.testMode){
            endpoint = prodUrl
        } else {
            endpoint = testUrl
        }

}

var cashFree = {
    makePayment : function(paymentInfo, paymentMode, callback){	
        console.log(endpoint)
        new initialize();
        console.log(endpoint)
        var paymentDetails = paymentInfo;	
        paymentDetails.appId = Constants.installationId
        paymentDetails.orderId = paymentDetails.orderId
        paymentDetails.orderAmount = paymentDetails.orderAmount
        paymentDetails.orderNote  = paymentDetails.orderNote
        paymentDetails.customerName = paymentDetails.customerName
        paymentDetails.customerPhone = paymentDetails.customerPhone
        paymentDetails.customerEmail = paymentDetails.customerEmail
        paymentDetails.notifyUrl = paymentDetails.notifyUrl
        paymentDetails.orderCurrency = Config.payment.currency

		axios.post(endpoint, {orderId: paymentDetails.orderId,
            orderAmount : 1,
            orderCurrency :'INR' }, options)
        .then(response => {
            paymentDetails.tokenData = response.data.cftoken

            RNPgReactNativeSDK.startPaymentWEB(paymentDetails,response.data.cftoken,'Callback')
            console.log(response.data)
            if (response.data.status) {
                console.log("CF::SDK::",response.data.cftoken);
                if(paymentMode=='UPI'){
                    RNPgReactNativeSDK.startPaymentUPI(paymentDetails,response.data.cftoken,'Test');
                    console.log(response);
                } else if (paymentMode=='GPAY') {
                    RNPgReactNativeSDK.startPaymentGPAY(paymentDetails,response.data.cftoken,'Test');
                    console.log(response);
                } else if (paymentMode=='Phonepe') {
                    RNPgReactNativeSDK.startPaymentPhonePe(paymentDetails,response.data.cftoken,'Test');
                    console.log(response);
                } else if (paymentMode=='Amazon') {
                    RNPgReactNativeSDK.startPaymentAmazon(paymentDetails,response.data.cftoken,'Test');
                    console.log(response);
                } else if (paymentMode=='WEB') {
                    paymentDetails.tokenData = response.data.cftoken

                    console.log(paymentDetails)

                    RNPgReactNativeSDK.startPaymentWEB(paymentDetails,'Test',(someData) => {
                        console.log("FROM React_Native",someData);
                    });
                    console.log(response);
                }
            }
        })
        .catch(error => {
            console.log(error)
        });
    },
};

export default cashFree