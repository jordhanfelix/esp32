import '../styles/network.scss';
import { Menu } from './components/menu';
import { ROUTES } from './routes';
import { startServer } from './server';


startServer();

const WifiManager = (() => {
    function loadFormData() {
        const formStr = localStorage.getItem('@ESP:form');
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
        const formData = new FormData(event.target);
        const form = Object.fromEntries(formData);
        const queryString = new URLSearchParams(formData);

        fetch(`${ROUTES.SAVE_CONFIG}?${queryString.toString()}`, { method: 'POST' })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    localStorage.setItem('@ESP:form', JSON.stringify(form));

                    if (!localStorage.getItem('@ESP:initialized')) {
                        localStorage.setItem('@ESP:initialized', true);
                        location.assign(ROUTES.HOME);
                    }
                }
            });
    }

    function events() {
        document.forms.form.addEventListener('submit', handleFormSubmit);
    }

    function firstInit() {
        document.querySelector('.button.secondary').style.display = 'none';
        document.querySelector('#menu-open').style.display = 'none';
        document.querySelector('#btn-submit').style.width = '100%';
    }

    function init() {
        if (!localStorage.getItem('@ESP:initialized')) {
            firstInit();
        }

        loadFormData();
        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', WifiManager.init);