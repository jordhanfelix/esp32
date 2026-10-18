import { Menu } from '../../components/menu';
import { ROUTES } from '../routes';
import { requestJson } from '../../utils';
import { startServer } from '../../utils/server';
import './index.scss';


startServer();

const WifiManager = (() => {
    function loadFormData() {
        const formStr = localStorage.getItem('@ESP:network');
        if (!formStr) return;
        const { ssid, password, ip, gateway } = document.forms.form;
        const form = JSON.parse(formStr);

        ip.value = form.ip;
        ssid.value = form.ssid;
        gateway.value = form.gateway;
        password.value = form.password;
    }

    function handleFormSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const form = Object.fromEntries(formData);
        const queryString = new URLSearchParams({
            ssid: form.ssid,
            pass: form.password,
            ip: form.ip,
            gateway: form.gateway
        }).toString();

        localStorage.setItem('@ESP:baseUrl', `http://${form.ip}`);

        requestJson(ROUTES.SAVE_NETWORK, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: queryString
        })
            .then(data => {
                if (data && data.ok !== false) {
                    localStorage.setItem('@ESP:network', JSON.stringify({
                        ssid: form.ssid,
                        password: form.password,
                        ip: form.ip,
                        gateway: form.gateway
                    }));

                    alert('Configurações salvas!');

                    if (!localStorage.getItem('@ESP:initialized')) {
                        localStorage.setItem('@ESP:initialized', true);
                        location.assign(ROUTES.HOME);
                    }
                }
                else {
                    alert('Falha ao salvar as configurações da rede.');
                }
            })
            .catch(() => {
                alert('Falha ao salvar as configurações da rede.');
            });
    }

    function events() {
        document.forms.form.addEventListener('submit', handleFormSubmit);
    }

    function firstInit() {
        if (!localStorage.getItem('@ESP:initialized')) {
            document.querySelector('.button.secondary').style.display = 'none';
            document.querySelector('#btn-submit').style.width = '100%';
        }
    }

    function init() {
        firstInit();
        loadFormData();
        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', WifiManager.init);