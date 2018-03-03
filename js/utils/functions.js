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
        if (acc === undefined || acc === null) return undefined;
        return acc[property];
    }, obj);

    return (value === undefined || value === null) ? fallback : value;
};
