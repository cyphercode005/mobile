<template>
    <nb-container>
        <nb-view class="watermark">
            <image :source="require('../../../assets/images/chooser/logo-watermark.png')" class="watermark-image" />
        </nb-view>
        <nb-view class="section-choose">
            <nb-text class="chooser-head">Login as a</nb-text>
            <nb-view class="chooser-split">
                <touchable-opacity class="chooser-customer">
                    <image :source="require('../../../assets/images/chooser/customer.png')" class="chooser-icon" />
                    <nb-text class="chooser-name">User</nb-text>
                </touchable-opacity>
                <touchable-opacity class="chooser-kitchen">
                    <image :source="require('../../../assets/images/chooser/kitchen.png')" class="chooser-icon" />
                    <nb-text class="chooser-name">Kitchen</nb-text>
                </touchable-opacity>
            </nb-view>
        </nb-view>
    </nb-container>
</template>

<script>
export default {
    props: {
        navigation: { Object }
    }
}
</script>

<style>
    .section-choose{
        bottom: 0;
        position: absolute;
        left: 0;
        right: 0;
        justify-content: center;
    }
    .chooser-head{
        font-size: 16;
        color: #25282b;
        font-family: Montserrat_Medium;
        align-self: center;
    }
    .watermark{
        flex: 1;
        justify-content: center;
        align-items: center;
        margin-bottom: 130;
    }
    .watermark-image{
        height: 260;
        resize-mode: contain;
        margin-left: -30;
    }
    .chooser-icon{
        width: 83;
        height: 83;
        resize-mode: contain;
    }
    .chooser-name{
        color: #171717;
        font-size: 14;
        font-family: Montserrat_SemiBold;
        margin-top: 5;
    }
    .chooser-customer{
        flex: 1;
        justify-content: center;
        align-items: center;
        border-right-color: #d2d2d2;
        border-right-width: 1;
    }
    .chooser-kitchen{
        flex: 1;
        justify-content: center;
        align-items: center;
        border-left-color: #d2d2d2;
        border-left-width: 1;
    }
    .chooser-split{
        flex: 1;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 30;
        padding-top: 20;
    }
</style>