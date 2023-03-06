<template>
    <nb-container>
        <Spinner
            :visible="isLoading"
        />
        <header :navigation="navigation" headerTitle="Insights"/>
        <nb-view class="report-background">
            <nb-tabs :tabBarUnderlineStyle="{height:2, marginTop:1,backgroundColor:'#fcbe00'}" :locked="true" :onChangeTab="(tab) => {getReport(tab.ref.props.index)}" :style="{backgroundColor:'#f4f4f4'}">
                <nb-tab heading="Day" index="1" :textStyle="{fontSize: 14, color: '#aaaaaa', fontFamily:'Montserrat_SemiBold'}" :activeTextStyle="{fontSize: 14, color: '#000000', fontFamily:'Montserrat_SemiBold'}" :style="{backgroundColor:'#F4F4F4'}" :activeTabStyle="{backgroundColor: '#FFFFFF'}" :tabStyle="{backgroundColor: '#FFFFFF'}" >
                    <nb-content padder>
                        <nb-view class="total-section">
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">TODAY'S ORDERS</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/order.png')"/>
                                    <nb-text class="total-count">{{ totalOrders}}</nb-text>
                                </nb-view>
                            </nb-view>
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">TODAY'S INCOME</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/income.png')"/>
                                    <nb-text class="total-count">{{ $store.state.currency }} {{totalSales}}</nb-text>
                                </nb-view>
                            </nb-view>
                        </nb-view>
                        <nb-text class="report-period">Orders on <nb-text class="report-date">{{currentDate}}</nb-text></nb-text>
                        <scroll-view :horizontal=true :showsHorizontalScrollIndicator=true :style="{backgroundColor:'#FFFFFF', paddingVertical:20, borderRadius:10, marginBottom:10, elevation:2, shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <TouchableWithoutFeedback>
                                <BarChart
                                    :data="mapReport"
                                    :width="appConfig.width-15"
                                    :height="170"
                                    :fromZero=true
                                    :chartConfig="{
                                        backgroundColor: '#FFFFFF',
                                        backgroundGradientFrom: '#FFFFFF',
                                        backgroundGradientTo: '#FFFFFF',
                                        decimalPlaces: 0,
                                        strokeWidth: 1, 
                                        data:mapReport.datasets,
                                        fillShadowGradient: 'rgba(252, 190, 0)',
                                        fillShadowGradientOpacity:1,
                                        labelColor: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                                        barPercentage: .1,
                                        useShadowColorFromDataset:false,
                                        color: (opacity = 255) => `rgba(252, 190, 0)`,
                                        propsForLabels: {
                                            fill: '#000000',
                                        },
                                        propsForHorizontalLabels: {
                                            fontSize:10,
                                            color: '#000000'
                                        },
                                        propsForVerticalLabels: {
                                            fontSize:10,
                                            color: '#000000'
                                        }
                                    }"
                                    :withInnerLines=false
                                    :style="{ borderRadius: 10, marginLeft:-15, marginRight:-15}"
                                    :withOuterLines=false
                                />
                            </TouchableWithoutFeedback>
                        </scroll-view>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('CouponReport',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Coupon Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{couponAmount}}</nb-text>
                            </nb-view>
                              <nb-text class="report-button-value">{{couponOrderCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('ReportDelivery',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Delivery Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDelivered}}</nb-text>
                            </nb-view>
                            <nb-text class="report-button-value">{{salesDeliveredCount}}</nb-text>
                            
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                            <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderCancelled',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Cancelled Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesCancelled}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesCancelledCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                         <!-- <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderDispute',{filter:'today'})}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Dispute Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDispute}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesDisputeCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity> -->
                        <nb-text class="order-list-header">Orders</nb-text>
                        <nb-view v-if="orders!=''">
                        <touchable-opacity v-for="order in orders" :key="order.id"  class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:order.id})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="order-status-section">
                                <nb-view :class="(order.statusId == 1 ? 'order-status-new' :order.statusId == 2 ? 'order-status-packing' :order.statusId == 3 ? 'order-status-transit':'order-status-delivered')"> 
                                    <nb-text class="order-status-text">{{order.statusName}}</nb-text>
                                </nb-view>
                                <nb-text class="order-number">#{{order.id}}</nb-text>
                                <nb-text class="order-price">₹{{parseFloat(order.total).toFixed(2)}}</nb-text>
                            </nb-view>
                            <nb-view  v-for="food in order.foods" :key="food.id" >
                                <nb-text class="order-item">{{food.name}}  x {{food.quantity}}</nb-text>
                                <nb-text class="order-notes">{{food.notes}} </nb-text>
                            </nb-view>
                        </touchable-opacity>
                        </nb-view>
                        <nb-view v-else padder class="no-result">
                            <nb-text class="no-result-text">No Orders Found</nb-text>
                        </nb-view>
                    </nb-content>
                </nb-tab>
                <nb-tab heading="Week" index="2" :textStyle="{fontSize: 14, color: '#aaaaaa', fontFamily:'Montserrat_Medium'}" :activeTextStyle="{fontSize: 14, color: '#000000', fontFamily:'Montserrat_Medium'}" :style="{backgroundColor:'#F4F4F4'}" :activeTabStyle="{backgroundColor: '#FFFFFF'}" :tabStyle="{backgroundColor: '#FFFFFF'}" >
                    <nb-content padder>
                        <nb-view class="total-section">
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">WEEKLY ORDERS</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/order.png')"/>
                                    <nb-text class="total-count">{{ totalOrders}}</nb-text>
                                </nb-view>
                            </nb-view>
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">WEEKLY INCOME</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/income.png')"/>
                                    <nb-text class="total-count">{{ $store.state.currency }} {{totalSales}}</nb-text>
                                </nb-view>
                            </nb-view>
                        </nb-view>
                        <nb-text class="report-period">Orders on <nb-text class="report-date">{{startWeek+' to '+endWeek}}</nb-text></nb-text>
                        <scroll-view :horizontal=true :showsHorizontalScrollIndicator=true :style="{backgroundColor:'#FFFFFF', paddingVertical:20, borderRadius:10, marginBottom:10, elevation:2, shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <TouchableWithoutFeedback>
                                <BarChart
                                    :data="mapReport"
                                    :width="appConfig.width-15"
                                    :height="170"
                                    :fromZero=true
                                    :chartConfig="{
                                        backgroundColor: '#FFFFFF',
                                        backgroundGradientFrom: '#FFFFFF',
                                        backgroundGradientTo: '#FFFFFF',
                                        decimalPlaces: 0,
                                        strokeWidth: 1, 
                                        data:mapReport.datasets,
                                        fillShadowGradient: 'rgba(252, 190, 0)',
                                        fillShadowGradientOpacity:1,
                                        labelColor: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                                        barPercentage: .1,
                                        useShadowColorFromDataset:false,
                                        color: (opacity = 255) => `rgba(252, 190, 0)`,
                                        propsForLabels: {
                                            fill: '#000000',
                                        },
                                        propsForHorizontalLabels: {
                                            fontSize:10,
                                            color: '#000000'
                                        },
                                        propsForVerticalLabels: {
                                            fontSize:10,
                                            color: '#000000'
                                        }
                                    }"
                                    :withInnerLines=false
                                    :style="{ borderRadius: 10, marginLeft:-15, marginRight:-15}"
                                    :withOuterLines=false
                                />
                            </TouchableWithoutFeedback>
                        </scroll-view>

                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('CouponReport',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Coupon Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{couponAmount}}</nb-text>
                            </nb-view>
                              <nb-text class="report-button-value">{{couponOrderCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('ReportDelivery',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Delivery Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDelivered}}</nb-text>
                            </nb-view>
                            <nb-text class="report-button-value">{{salesDeliveredCount}}</nb-text>
                            
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderCancelled',{filter:'today'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Cancelled Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesCancelled}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesCancelledCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                         <!-- <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderDispute',{filter:'today'})}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Dispute Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDispute}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesDisputeCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity> -->
                        <nb-text class="order-list-header">Orders</nb-text>
                        <nb-view v-if="orders!=''">
                        <touchable-opacity v-for="order in orders" :key="order.id"  class="order-list-item" :on-press="()=>{navigation.navigate('KitchenOrderDetail',{orderId:order.id})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="order-status-section">
                                <nb-view :class="(order.statusId == 1 ? 'order-status-new' :order.statusId == 2 ? 'order-status-packing' :order.statusId == 3 ? 'order-status-transit':'order-status-delivered')"> 
                                    <nb-text class="order-status-text">{{order.statusName}}</nb-text>
                                </nb-view>
                                <nb-text class="order-number">#{{order.id}}</nb-text>
                                <nb-text class="order-price">₹{{parseFloat(order.total).toFixed(2)}}</nb-text>
                            </nb-view>
                            <nb-view  v-for="food in order.foods" :key="food.id" >
                                <nb-text class="order-item">{{food.name}}  x {{food.quantity}}</nb-text>
                                <nb-text class="order-notes">{{food.notes}} </nb-text>
                            </nb-view>
                        </touchable-opacity>
                        </nb-view>
                        <!-- <nb-view v-else padder class="no-result">
                            <nb-text class="no-result-text">No Orders Found</nb-text>
                        </nb-view> -->
                    </nb-content>
                </nb-tab>
                <nb-tab heading="Month" index="3" :textStyle="{fontSize: 14, color: '#aaaaaa', fontFamily:'Montserrat_Medium'}" :activeTextStyle="{fontSize: 14, color: '#000000', fontFamily:'Montserrat_Medium'}" :style="{backgroundColor:'#F4F4F4'}" :activeTabStyle="{backgroundColor: '#FFFFFF'}" :tabStyle="{backgroundColor: '#FFFFFF'}" >
                    <nb-content padder>
                       <nb-view class="total-section">
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">MONTHLY ORDERS</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/order.png')"/>
                                    <nb-text class="total-count">{{ totalOrders}}</nb-text>
                                </nb-view>
                            </nb-view>
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">MONTHLY INCOME</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/income.png')"/>
                                    <nb-text class="total-count">{{ $store.state.currency }} {{totalSales}}</nb-text>
                                </nb-view>
                            </nb-view>
                        </nb-view>
                        <nb-view class="graph" padder  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="gragh-head">
                                <nb-text class="graph-head-text">This Month</nb-text>
                            </nb-view>
                            <scroll-view :horizontal=true :showsHorizontalScrollIndicator=true  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                                <TouchableWithoutFeedback>
                                    <BarChart
                                        :data="mapReport"
                                       :width="appConfig.width-15"
                                        :height="170"
                                        :fromZero=true
                                        :verticalLabelRotation="270"
                                        :chartConfig="{
                                            backgroundColor: '#FFFFFF',
                                            backgroundGradientFrom: '#FFFFFF',
                                            backgroundGradientTo: '#FFFFFF',
                                            decimalPlaces: 0,
                                            strokeWidth: 1, 
                                            data:mapReport.datasets,
                                            fillShadowGradient: 'rgba(252, 190, 0)',
                                            fillShadowGradientOpacity:1,
                                            labelColor: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                                            barPercentage: .1,
                                            useShadowColorFromDataset:false,
                                            color: (opacity = 255) => `rgba(252, 190, 0)`,
                                            propsForLabels: {
                                                fill: '#000000',
                                            },
                                            propsForHorizontalLabels: {
                                                fontSize:10,
                                                color: '#000000'
                                            },
                                            propsForVerticalLabels: {
                                                fontSize:8,
                                                color: '#000000'
                                            }
                                        }"
                                        :withInnerLines=false
                                        :style="{ marginHorizontal:-30, paddingVertical:15, marginRight:10}"
                                        :withOuterLines=false
                                    />
                                </TouchableWithoutFeedback>
                            </scroll-view>
                        </nb-view>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('CouponReport',{filter:'month'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Coupon Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{couponAmount}}</nb-text>
                            </nb-view>
                            <nb-text class="report-button-value">{{couponOrderCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                         <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('ReportDelivery',{filter:'month'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Delivery Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDelivered}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesDeliveredCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                         <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderCancelled',{filter:'month'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Cancelled Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesCancelled}}</nb-text>
                            </nb-view>
                            <nb-text class="report-button-value">{{salesCancelledCount}}</nb-text>
                        <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <!-- <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderDispute',{filter:'month'})}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Dispute Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDispute}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesDisputeCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity> -->
                    </nb-content>
                </nb-tab>
                <nb-tab heading="Year" index="4" :textStyle="{fontSize: 14, color: '#aaaaaa', fontFamily:'Montserrat_Medium'}" :activeTextStyle="{fontSize: 14, color: '#000000', fontFamily:'Montserrat_Medium'}" :style="{backgroundColor:'#F4F4F4'}" :activeTabStyle="{backgroundColor: '#FFFFFF'}" :tabStyle="{backgroundColor: '#FFFFFF'}" >
                    <nb-content padder>
                        <nb-view class="total-section">
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">YEARLY ORDERS</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/order.png')"/>
                                    <nb-text class="total-count">{{ totalOrders}}</nb-text>
                                </nb-view>
                            </nb-view>
                            <nb-view class="total-section-left">
                                <nb-text class="total-title">YEARLY INCOME</nb-text>
                                <nb-view class="total-value">
                                    <image class="total-value-image" :source="require('../../../../assets/images/kitchen/income.png')"/>
                                    <nb-text class="total-count">{{ $store.state.currency }} {{totalSales}}</nb-text>
                                </nb-view>
                            </nb-view>
                        </nb-view>
                        <nb-view class="graph" padder>
                            <nb-view class="gragh-head">
                                <nb-text class="graph-head-text">This Year</nb-text>
                            </nb-view>
                            <scroll-view :horizontal=true :showsHorizontalScrollIndicator=true  :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                                <BarChart
                                    :data="mapReport"
                                    :width="appConfig.width"
                                    :height=170
                                    :fromZero=true
                                    :verticalLabelRotation="270"
                                    :chartConfig="{
                                        backgroundColor: '#FFFFFF',
                                        backgroundGradientFrom: '#FFFFFF',
                                        backgroundGradientTo: '#FFFFFF',
                                        decimalPlaces: 0,
                                        strokeWidth: 1, 
                                        data:mapReport.datasets,
                                        fillShadowGradient: 'rgba(252, 190, 0)',
                                        fillShadowGradientOpacity:1,
                                        labelColor: (opacity = 255) => `rgba(0, 0, 0, ${opacity})`,
                                        barPercentage: .2,
                                        useShadowColorFromDataset:false,
                                        color: (opacity = 255) => `rgba(252, 190, 0)`,
                                        propsForLabels: {
                                            fill: '#000000',
                                        },
                                        propsForHorizontalLabels: {
                                            fontSize:11,
                                            color: '#000000',
                                        },
                                        propsForVerticalLabels: {
                                            fontSize:11,
                                            color: '#000000',
                                        }
                                    }"
                                    :withInnerLines=false
                                    :style="{ marginLeft: -10, paddingVertical:15, }"
                                    :withOuterLines=false
                                />
                            </scroll-view>
                        </nb-view>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('CouponReport',{filter:'year'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Coupon Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{couponAmount}}</nb-text>
                            </nb-view>
                              <nb-text class="report-button-value">{{couponOrderCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('ReportDelivery',{filter:'year'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Delivery Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDelivered}}</nb-text>
                            </nb-view>
                            <nb-text class="report-button-value">{{salesDeliveredCount}}</nb-text>
                            
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                            <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderCancelled',{filter:'year'})}" :style="{ shadowColor: '#000',shadowOffset: { width: 0, height: 1 },shadowOpacity: 0.2,shadowRadius: 1.2}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Cancelled Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesCancelled}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesCancelledCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity>
                        <!-- <touchable-opacity class="report-button" :on-press="()=>{navigation.navigate('OrderDispute',{filter:'year'})}">
                            <nb-view class="report-button-left">
                                <nb-text class="report-button-label">Dispute Report</nb-text>
                                <nb-text class="report-button-value">{{ $store.state.currency }} {{salesDispute}}</nb-text>
                            </nb-view>
                             <nb-text class="report-button-value">{{salesDisputeCount}}</nb-text>
                            <image class="report-button-icon" :source="require('../../../../assets/images/icons/chevron-right.png')" />
                        </touchable-opacity> -->
                    </nb-content>
                </nb-tab>
            </nb-tabs>
        </nb-view>
         <footer-Kitchen :navigation="navigation"/>
    </nb-container>
</template>

<script>
import { LineChart, BarChart, PieChart, ProgressChart, ContributionGraph, StackedBarChart } from "react-native-chart-kit";
import { StackActions, NavigationActions } from 'react-navigation'
import { TouchableWithoutFeedback } from "react-native";
import moment from 'moment'
export default {
    props: {
        navigation: { Object }
    },
    components: {
        LineChart,BarChart
    },
    data(){
         return{
            totalSales:0,
            currentDate: new moment().format('DD-MMM-YYYY'),
            startWeek:new moment().startOf('week').add(1, 'day').format('DD-MMM-YYYY'),
            endWeek:new moment().endOf('week').add(1, 'day').format('DD-MMM-YYYY'),
            totalOrders:0,
            cancelledOrders:0,
            totalDelivered: 0,
            couponAmount:0,
            salesDelivered:0,
            salesCancelled:0,
            salesDeliveredCount:0,
            salesCancelledCount:0,
            salesDispute:0,
            salesDisputeCount:0,
            couponOrderCount:0,
            dateBetween:'',
            orders: '',
            mapReport:{
                labels: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
                datasets: [
                    {
                        data: [0, 0, 0, 0, 0, 0,0]
                    },
                ],
            },
            isLoading: false
        }
    },
    beforeMount() {
        this.cancelledOrders=0
        this.totalDelivered=0
        this.couponAmount=0
        this.salesDelivered=0
        this.salesCancelled=0
        this.salesDeliveredCount=0
        this.salesCancelledCount=0
        this.salesDispute=0
        this.salesDisputeCount=0
        this.couponOrderCount=0
        this.isLoading = true
        const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
        console.log('AuthStr');
        console.log(AuthStr);
        this.api.kitchen({
            method: 'POST',
            url: this.api.routes.report,
            headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
            data: {
                start_date: new moment().format('YYYY-MM-DD')
            },
        })
        .then(response => { 
            console.log('data')
            console.log(response.data)
            this.totalSales= response.data.totalSales
            this.totalOrders= response.data.totalOrders
            this.cancelledOrders = response.data.cancelledOrders
            this.salesCancelledCount=response.data.cancelledOrders
            this.totalDelivered  = response.data.totalDelivered
            this.couponAmount =  response.data.couponSales
            this.couponOrderCount=response.data.couponCount
            this.salesDelivered=response.data.salesDelivered
            this.salesDeliveredCount=response.data.totalDelivered
            this.salesCancelled=response.data.cancelledSales
            this.salesDispute=response.data.disputeTotal
            this.salesDisputeCount=response.data.disputeCount
            this.orders=response.data.orders
            if((response.data.label).length && (response.data.orderData).length){
                this.mapReport={
                    labels: response.data.label,
                        datasets: [
                        {
                            data: response.data.orderData
                        },
                    ],
                }
            }
            this.isLoading = false
        })
        .catch(error => {
            this.isLoading = false
            console.log(error.response.data) 
        }); 
    },
    methods: {
        getReport(index) {
            this.cancelledOrders=0
            this.totalDelivered=0
            this.couponAmount=0
            this.salesDelivered=0
            this.salesCancelled=0
            this.salesDeliveredCount=0
            this.salesCancelledCount=0
            this.salesDispute=0
            this.salesDisputeCount=0
            this.couponOrderCount=0
            this.isLoading = true
            if(index!=1)
            {
                const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
                console.log('AuthStr');
                this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.mapReport,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data: {
                        type:index
                    },
                })
                .then(response => { 
                    console.log(response.data)
                    this.totalSales=response.data.totalSales
                    this.totalOrders=response.data.totalOrders
                    this.couponAmount=response.data.couponAmount
                    this.salesDelivered=response.data.salesDelivered
                    this.salesCancelled=response.data.salesCancelled
                    this.salesDeliveredCount=response.data.totalDelivered
                    this.salesCancelledCount=response.data.totalCancelled
                    this.salesDispute=response.data.disputeTotal
                    this.salesDisputeCount=response.data.disputeCount
                    this.couponOrderCount=response.data.couponOrderCount
                    this.orders=response.data.orders
                    if((response.data.label).length && (response.data.orderData).length){
                        this.mapReport={
                            labels: response.data.label,
                                datasets: [
                                {
                                    data: response.data.orderData
                                },
                            ],
                        }
                    }
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data) 
                }); 
            }
            else{
                const AuthStr = 'Bearer '.concat(this.$store.state.kitchen.authentication); 
                console.log('AuthStr');
                    this.api.kitchen({
                    method: 'POST',
                    url: this.api.routes.report,
                    headers: { 'Content-Type': 'application/json','Authorization':AuthStr },
                    data: {
                        start_date: this.currentDate
                    },
                    })
                .then(response => { 
                    console.log('data')
                    console.log(response.data)
                    this.totalSales= response.data.totalSales
                    this.totalOrders= response.data.totalOrders
                    this.cancelledOrders = response.data.cancelledOrders
                    this.totalDelivered  = response.data.totalDelivered
                    this.couponAmount =  response.data.couponSales
                    this.couponOrderCount=response.data.couponCount
                    this.salesDelivered=response.data.salesDelivered
                    this.salesDeliveredCount=response.data.totalDelivered
                    this.salesCancelled=response.data.cancelledSales
                    this.salesCancelledCount=response.data.cancelledOrders
                    this.salesDispute=response.data.disputeTotal
                    this.salesDisputeCount=response.data.disputeCount
                    this.orders=response.data.orders
                    if((response.data.label).length && (response.data.orderData).length){
                        this.mapReport={
                            labels: response.data.label,
                                datasets: [
                                {
                                    data: response.data.orderData
                                },
                            ],
                        }
                    }
                    this.isLoading = false
                })
                .catch(error => {
                    this.isLoading = false
                    console.log(error.response.data) 
                }); 
            }
        }
    }
}
</script>

<style>
    
    .report-background{
        background-color: #f4f4f4;
        flex: 1;
    }

    /* Grpah */
    
    .graph{
        border-radius: 8;
        elevation:2;
        background-color: #FFFFFF;
        margin-vertical: 5;
    }
    .graph-head-text{
        font-size: 14;
        color: #121212;
        font-family: SFProDisplay_Medium;
    }

    /* Total Section */

    .total-section{
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        margin-bottom: 15;
    }
    .total-section-left{
        flex: 1;
        border-radius: 10;
        background-color: #FFFFFF;
        padding: 15;
        border-width: 1;
        margin-right: 10;
        border-color: #efefef;
    }
    .total-title{
        font-family: Montserrat_Medium;
        font-size: 13;
        color: #aaaaaa;
    }
    .total-value {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        margin-top: 10;
    }
    .total-value-image{
        height: 35;
        width: 35;
        resize-mode: contain;
    }
    .total-count{
        font-family: Montserrat_SemiBold;
        font-size: 20;
        color: #000000;
        /* margin-bottom: 3; */
    }
    .total-section-right{
        flex: 1;
        border-radius: 10;
        background-color: #FFFFFF;
        padding: 15;
        border-width: 1;
        margin-right: 10;
        border-color: #efefef;
    }
    .report-period{
        font-family: Montserrat_Regular;
        font-size: 12;
        color: #999999;
        margin-bottom: 10;
    }
    .report-date{
        font-family: Montserrat_Bold;
        font-size: 12;
        color: #191717;
    }
    

    /* Report Buttons */

    .report-button{
        border-radius: 8;
        elevation:2;
        background-color: #FFFFFF;
        margin-vertical: 5;
        flex-direction: row;
        align-items: center;
        padding:20;
    }
    .report-button-label{
        font-size: 14;
        color: #4e4e4e;
        font-family: Montserrat_Regular;
        margin-bottom: 3;
    }
    .report-button-left{
        flex: 1;
    }
    .report-button-value{
        font-size: 18;
        color: #000000;
        font-family: Montserrat_Medium;
        margin-bottom: 3;
    }
    .report-button-icon{
        width: 15;
        height: 15;
        margin-left: 15;
        resize-mode: contain;
        tint-color: #fcbe00;
    }

    /* Order List */

    .order-list-header{
        font-size: 16;
        font-family: Montserrat_SemiBold;
        color: #191717;
        margin-vertical: 5;
    }
    .order-list-item{
        background-color: #FFFFFF;
        border-radius: 8;
        padding: 10;
        margin-bottom: 6;
        margin-top: 6;
        elevation:2;
    }
    .order-status-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10;
    }
    .order-status-new{
        color: #04b74c;
    }
    .order-status-packing{
        color: #b74c04;
    }
    .order-status-transit{
        color: #fcbe00;
    }
    .order-status-delivered{
        color: #c0c0c0;
    }
    .order-number{
        color: #949494;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-price{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
    }
    .order-item{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        /* margin-bottom: 4; */
    }
    .order-notes{
        color: #949494;
        font-size: 10;
    }
    .order-date-time{
        margin-top: 5;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .order-time{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-date{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-detail-icon{
        height: 5;
        width: 20;
        resize-mode:contain;
    }
      /* Order List */

    .order-list-item{
        background-color: #FFFFFF;
        border-radius: 8;
        padding: 8;
        margin-bottom: 12;
    }
    .order-status-section{
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10;
    }
    .order-status-new{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #04b74c;
        border-radius: 3;
    }
    .order-status-packing{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #b74c04;
        border-radius: 3;
    }
    .order-status-transit{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #fcbe00;
        border-radius: 3;
    }
    .order-status-delivered{
        padding-horizontal: 7;
        padding-vertical: 3;
        background-color: #c0c0c0;
        border-radius: 3;
    }
    .order-status-text{
        color: #FFFFFF;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-number{
        color: #949494;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-price{
        color: #000000;
        font-size: 14;
        font-family: Montserrat_SemiBold;
    }
    .order-item{
        color: #000000;
        font-size: 16;
        font-family: Montserrat_SemiBold;
        margin-bottom: 4;
    }
    .order-notes{
        color: #949494;
        font-size: 10;
    }
    .order-date-time{
        margin-top: 8;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
    .order-time{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-date{
        color: #949494;
        font-size: 12;
        font-family: Montserrat_Medium;
    }
    .order-detail-icon{
        height: 5;
        width: 20;
        resize-mode:contain;
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
</style>