import { Menu } from './components/menu';
import { ROUTES } from './routes';
import { startServer } from './server';
import '../styles/index.scss';


startServer();

const Index = (() => {
    function events() {
        document.querySelectorAll('.control .switch input').forEach(input => {
            input.addEventListener('change', event => {
                const control = event.target.closest('.control');
                const { pin } = control.dataset;
                const state = event.currentTarget.checked ? 'on' : 'off';

                fetch(`${ROUTES.PIN}${pin}-${state}`, {method: 'POST'})
                .then(res => res.text())
                .then(console.log);
            });
        });
    }

    function init() {
        if (!localStorage.getItem('@ESP:initialized')) {
            location.replace('/network.html');
        }

        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', Index.init);