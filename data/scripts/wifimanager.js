"strict mode"

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

    function events() {
        document.forms.form.addEventListener('submit', event => {
            const formData = new FormData(event.target);
            const form = Object.fromEntries(formData);

            localStorage.setItem('@ESP:form', JSON.stringify(form));
        });
    }

    function init() {
        loadFormData();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', WifiManager.init);