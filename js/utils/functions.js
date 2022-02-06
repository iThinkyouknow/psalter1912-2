import { font_sizes } from '../common/common.styles';
import { font_size_key } from '../common/constants';

export const no_op = () => { };

export const apply = (acc, fn) => {
    return fn(acc);
};

export const composer = (array_of_fns) => (initial_value) => {
    return array_of_fns.reduce(apply, initial_value);
};

export const getty = (obj) => (property_string = '') => (fallback = '') => {
    const properties = property_string.split('.');
    const value = properties.reduce((acc, property) => {
        if (typeof acc !== 'object') return undefined;
        return acc[property];
    }, obj);

    return (value === undefined || value === null) ? fallback : value;
};

export const is_present = (thing) => (thing !== undefined && thing !== null);

export const is_present_type = (type = 'string') => (thing) => {

    const is_typeof = (typeof thing === type);

    if (type === 'string') {
        return (is_typeof && thing.length > 0);
    } else if (type === 'number') {
        return (is_typeof && !Number.isNaN(thing));
    } else if (type === 'array') {
        return (Array.isArray(thing) && thing.length > 0);
    } else if (type === 'function' || type === 'object' || type === 'boolean') {
        return is_typeof;
    } else {
        return false;
    }
};

export const is_string = is_present_type('string');
export const is_number = is_present_type('number');
export const is_array = is_present_type('array');
export const is_function = is_present_type('function');
export const is_object = is_present_type('object');
export const is_boolean = is_present_type('boolean');


export const debounce = (func, wait, immediate) => {
    var timeout;
    return function () {
        var context = this, args = arguments;
        var later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export const minus = by => a => a - by;
export const add = a => b => a + b;
export const multiply = a => b => a * b;
export const divide = by => a => a / by;
export const not = (bool) => !bool;


export const save_font_size = (AsyncStorage, font_size = font_sizes.default) => {
    AsyncStorage.setItem(font_size_key, `${font_size}`);
}
