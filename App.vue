<template>
    <style-wrapper>
        <setup></setup>
    </style-wrapper>
</template>

<script>
  import Setup from '@/Setup'
  import StyleWrapper from '@/plugins/StyleWrapper'
  import * as Sentry from 'sentry-expo';
  import { Text, View, Alert, LogBox } from 'react-native';
//   Sentry.init({
//     dsn: 'https://6e69746c17a9457db6cc69ba98a22a09@o398350.ingest.sentry.io/5594455',
//     enableInExpoDevelopment: true,
//     debug: true, // Sentry will try to print out useful debugging information if something goes wrong with sending an event. Set this to `false` in production.
//   });
  

    export default {
        components: {
            Setup, StyleWrapper
         }
        // beforeMount(){
        //     Sentry.nativeCrash();
        //     console.disableYellowBox = true;
        //     LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
        //     LogBox.ignoreAllLogs();//Ignore all log notifications
        // }
    }
</script>