import { createServer } from "miragejs";
import '../styles/network.scss';
import { ROUTES } from './routes';

if (import.meta.env.MODE === 'development') {
    createServer({
        routes() {
            this.post("/config", () => true)
        },
    });
}

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
            .then(() => {
                localStorage.setItem('@ESP:form', JSON.stringify(form));
                localStorage.setItem('@ESP:initialided', true);
            });
    }

    function events() {
        const menu = document.querySelector('#menu');

        document.querySelector('#menu-open').addEventListener('click', () => {
            menu.classList.add('open');
        });

        document.querySelector('#menu-close').addEventListener('click', () => {
            menu.classList.remove('open');
        });

        document.forms.form.addEventListener('submit', handleFormSubmit);
    }

    function firstInit() {
        document.querySelector('.button.secondary').remove();
        document.querySelector('#menu-open').remove();
        document.querySelector('#btn-submit').style.width = '100%';
    }

    function init() {
        if (!localStorage.getItem('@ESP:initialided')) {
            firstInit();
        }

        loadFormData();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', WifiManager.init);