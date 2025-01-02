/**
 * A wrapper function that holds the throttle function
 * @param callback : is used to call the function that needs to be throttled
 * @param delay : is the time after which the next callback shall happen
 */
function throttle(callback: (...args:any[]) => any, delay: number) {
    let lastCall = Date.now();

    return (...args:any[]) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            callback(...args);
        }
    }
}

function debounce(callback: (...args:any[]) => any, delay: number) {
    let lastTimeout: NodeJS.Timeout | false = false;

    return (...args:any[]) => {
        if (!lastTimeout) {
            callback(...args);
        } else {
            clearTimeout(lastTimeout);
        }
        lastTimeout = setTimeout(() => {
            lastTimeout = false;
        }, delay)
    }
}

export {
    throttle,
    debounce
}