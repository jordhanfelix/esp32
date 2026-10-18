const savedBaseUrl = (typeof localStorage !== 'undefined') ? localStorage.getItem('@ESP:baseUrl') : null;
const fallbackBaseUrl = (typeof window !== 'undefined')
    ? ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://esp32.local'
        : `${window.location.protocol}//${window.location.host}`)
    : 'http://esp32.local';
const BASE_URL = (savedBaseUrl || fallbackBaseUrl).replace(/\/+$/, '');

export const ROUTES = {
    HOME: BASE_URL,
    PIN: `${BASE_URL}/pin`,
    SAVE_PIN: `${BASE_URL}/control`,
    SAVE_NETWORK: `${BASE_URL}/config`
};