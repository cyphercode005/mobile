import React, { Component } from 'react';
import { StyleProvider } from 'native-base';

import getTheme from '@/themes/native-base-theme/components';
import variables from '@/themes/native-base-theme/variables/commonColor';

export default class StyleWrapper extends Component {
    render() {
        return (
            <StyleProvider style={ getTheme(variables) }> 
                { this.props.children }
            </StyleProvider>
        );
    }
}