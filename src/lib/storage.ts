const errorMessage =
    'Cannot access local storage or value is corrupted, replacing with default...';

export const getStorageVolume = () => {
    let volume = 1;

    try {
        volume = JSON.parse(localStorage.getItem('volume') ?? '1');
    } catch (_) {
        console.error(errorMessage);
        localStorage.setItem('volume', `${volume}`);
    }

    return volume;
};

export const getStorageMuted = () => {
    let muted = false;

    try {
        muted = JSON.parse(localStorage.getItem('muted') ?? 'false');
    } catch (_) {
        console.error(errorMessage);
        localStorage.setItem('muted', `${muted}`);
    }

    return muted;
};
