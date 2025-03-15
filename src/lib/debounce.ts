export const debounce = <T extends (...args: any[]) => void>(
    fn: T,
    delay: number
): T => {
    let timer: number;

    return ((...args: any[]) => {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            fn(...args);
        }, delay);
    }) as T;
};
