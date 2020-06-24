import React, { Component } from 'react'; 
import {
    Dimensions
} from 'react-native';

import Slider from '@react-native-community/slider';

import Utils from '../utils/functions';
import {
    sizes
} from './common.styles';

export default FontSlider = ({ onSlidingComplete = Utils.no_op, style }) => {
    const screenHeight = Dimensions.get('window').height;
    return (
        <Slider
            style={[{
                transform: [{ translateX: -screenHeight * 0.25 + sizes.large }, { translateY: screenHeight * 0.5 }, { rotateZ: '-90deg' }],
                width: screenHeight * 0.5,
                position: 'absolute'
            }, style]}
            step={0.1}
            value={1}
            minimumValue={0.5}
            maximumValue={5}
            onSlidingComplete={onSlidingComplete}>
        </Slider>
    );
    
};

