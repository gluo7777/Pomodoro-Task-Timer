/**
 * Module for saving items to cookies.
 */
const STORAGE_PREFIX = 'PomodoroTimerTaskApp';
const STORAGE_TYPE = 'localStorage';
/**
 * Check if Web Storage is available and storage space.
 * @param {*} type 
 */
export function storageAvailable(type) {
    try {
        const storage = window[type],
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
};

/**
 * Save to local storage.
 * @param {name of key} key
 * @param {value tied to key} value
 */
export function saveToStorage(key, value) {
    if (!storageAvailable(STORAGE_TYPE)) {
        console.log(`${STORAGE_TYPE} is not available. Unable to save.`);
        return null;
    }
    const st = window[STORAGE_TYPE];
    const k = `${STORAGE_PREFIX}_${key}`;
    if (st === null) {
        console.log("Fail to save %s=%s", k, value);
        return;
    }
    st.setItem(k, value);
    if (st.getItem(k) !== null) {
        console.log("Saved %s=%s to %s", k, value, STORAGE_TYPE);
    } else {
        console.log("Failed to save %s=%s", k, value);
    }
};

/**
 * Retrieve from local storage.
 * @param {name of key to retrieve} key
 */
export function getFromStorage(key) {
    if (!storageAvailable(STORAGE_TYPE)) {
        console.log(`${STORAGE_TYPE} is not available. Unable to retrieve key.`);
        return null;
    }
    const k = `${STORAGE_PREFIX}_${key}`;
    const value = window[STORAGE_TYPE].getItem(k);
    if (value === null) {
        console.log("Value does not exist for key %s in %s storage", k, STORAGE_TYPE);
        return null;
    }
    return value;
}