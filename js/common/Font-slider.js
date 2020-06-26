import React, { Component } from 'react'; 
import {
    Dimensions
} from 'react-native';

import Slider from '@react-native-community/slider';

import Utils from '../utils/functions';
import {
    sizes, font_sizes
} from './common.styles';

export default FontSlider = ({ onSlidingComplete = Utils.no_op, style, value = font_sizes.default }) => {
    const screenHeight = Dimensions.get('window').height;
    return (
        <Slider
            style={[{
                transform: [{ translateX: -screenHeight * 0.25 + sizes.large }, { translateY: screenHeight * 0.5 }, { rotateZ: '-90deg' }],
                width: screenHeight * 0.5,
                position: 'absolute'
            }, style]}
            step={0.1 * font_sizes.default}
            value={value}
            minimumValue={0.5 * font_sizes.default}
            maximumValue={5 * font_sizes.default}
            onSlidingComplete={onSlidingComplete}>
        </Slider>
    );
    
};

