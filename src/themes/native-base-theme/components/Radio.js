// @flow

import { Platform } from 'react-native';

import variable from './../variables/platform';
import { PLATFORM } from './../variables/commonColor';

export default (variables /* : * */ = variable) => {
  const radioTheme = {
    '.selected': {
      'NativeBase.IconNB': {
        color:
          Platform.OS === PLATFORM.IOS
            ? variables.radioColor
            : variables.radioSelectedColorAndroid,
        lineHeight:
          Platform.OS === PLATFORM.IOS ? variables.radioBtnLineHeight : variables.radioBtnLineHeight,
        height: Platform.OS === PLATFORM.IOS ? variables.radioBtnLineHeight : undefined,
        fontSize: variables.radioBtnSize,
        alignSelf:'center',
      },
    },
    'NativeBase.IconNB': {
      color: Platform.OS === PLATFORM.IOS ? 'transparent' : undefined,
      lineHeight:
        Platform.OS === PLATFORM.IOS ? undefined : variables.radioBtnLineHeight,
      fontSize:
        Platform.OS === PLATFORM.IOS ? undefined : variables.radioBtnSize,
        
    },
    borderRadius: variables.radioBtnRadius,
    overflow: 'hidden',
    borderWidth: variables.radioBtnBorderWidth,
    borderColor: variables.radioColor,
    width: variables.radioBtnSize,
    height: variables.radioBtnSize,
    paddingLeft: variables.radioBtnPaddingLeft - 1,
    paddingBottom: 10, 
  };

  return radioTheme;
};
