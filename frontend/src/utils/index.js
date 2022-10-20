import { ROUTES } from '../pages/routes';


export function sendControl(pin, callback) {
    const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
    const control = controls.find(f => f.pin === pin);
    const link = `${ROUTES.SAVE_PIN}-${pin}-${control.active ? 'on' : 'off'}?${generateQueryString(control)}`;

    fetch(link, { method: 'POST' })
        .then(res => res.json())
        .then(callback)
        .catch(err => {
            alert('Falha ao salvar controle.');
            console.error(err);
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