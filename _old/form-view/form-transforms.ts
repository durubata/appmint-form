import { getRandomString, niceURI, toTitleCase } from "../utils";

export const applyFunction = (fn, value, rowData, data) => {
    fn = fn.startsWith('return') ? fn : `return ${fn}`;
    try {
        const result = new Function('value', 'rowData', 'data', fn)(value, rowData, data);
        return { status: 'success', value: result }
    } catch (e) {
        console.error(e)
        return { status: 'error', message: e.message, value }
    }
}

export const applyFormTransform = (newValue = '', transform) => {
    if (!transform) return newValue;
    const thisTransform: any = typeof transform === 'string' ? [transform] : transform;
    thisTransform.forEach(transform => {
        const [type, arg] = transform.toLowerCase().split('::');
        switch (type) {
            case 'uppercase': {
                newValue = newValue.toUpperCase();
                break;
            }
            case 'lowercase': {
                newValue = newValue.toLowerCase();
                break;
            }
            case 'titlecase': {
                newValue = toTitleCase(newValue);
                break;
            }
            case 'prefix': {
                if (newValue && arg && !newValue.endsWith(arg)) {
                    newValue = arg + newValue;
                }
                break;
            }
            case 'suffix': {
                if (newValue && arg && !newValue.startsWith(arg)) {
                    newValue = newValue + arg;
                }
                break;
            }
            case 'random-string': {
                const newLength = (arg || 4) * 1
                if (newValue.length < newLength) {
                    newValue = newValue + getRandomString(newLength);
                }
                break;
            }
            case 'script': {
                newValue = newValue;
                break;
            }
            case 'date-now': {
                if (!newValue) {
                    newValue = new Date().toLocaleDateString();
                }
                break;
            }
            case 'time-now': {
                if (!newValue) {
                    newValue = new Date().toLocaleTimeString();
                }
                break;
            }
            case 'uri': {
                newValue = niceURI(newValue);
                break;
            }
            default: {
                return newValue;
            }
        }
    });

    return newValue;
};