export const no_op = () => {};

export const compose = (acc, fn) => {
    return fn(acc);
};

export const composer = (array_of_fns) => (initial_value) => {
    return array_of_fns.reduce(compose, initial_value);
};

export const getter = (obj) => (property_string = '') => (fallback = '') => {
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
