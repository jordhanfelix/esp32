import { ROUTES } from '../pages/routes';

export function requestJson(url, options = {}) {
    const requestOptions = {
        ...options,
        headers: {
            Accept: 'application/json',
            ...(options.headers || {})
        }
    };

    return fetch(url, requestOptions)
        .then(async res => {
            const rawText = await res.text();

            if (!rawText) {
                return { ok: res.ok };
            }

            try {
                return JSON.parse(rawText);
            }
            catch (error) {
                return { ok: res.ok, raw: rawText };
            }
        });
}

export function sendControl(pin, callback) {
    const controls = JSON.parse(localStorage.getItem('@ESP:controls') || '[]');
    const control = controls.find(f => f.pin === pin);

    if (!control) {
        callback(null);
        return;
    }

    const action = control.enabled ? 'on' : 'off';
    const link = `${ROUTES.SAVE_PIN}/${pin}/${action}`;
    const body = new URLSearchParams({
        name: control.name || '',
        pin: String(pin),
        action,
        enabled: action,
        timelist: (control.times || [])
            .reduce((acc, cur) => `${acc}_${cur.join('')}`, '')
            .replace(/:/g, '')
            .slice(1)
    }).toString();

    requestJson(link, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body
    })
        .then(data => callback(data))
        .catch(err => {
            alert('Falha ao salvar controle.');
            console.error(err);
            callback(null);
        });
}

function generateQueryString({ name, pin, enabled, times }) {
    const queryString = new URLSearchParams({
        name: name,
        pin: pin,
        enabled: enabled ? 'on' : 'off',
        timelist: times
            .reduce((acc, cur) => acc += '_' + cur.join(''), '')
            .replace(/:/g, '')
            .slice(1)
    });

    return queryString.toString();
}