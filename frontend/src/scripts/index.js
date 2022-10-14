import { Menu } from './components/menu';
import { ROUTES } from './routes';
import { startServer } from './server';
import '../styles/index.scss';


startServer();

const Index = (() => {

    function listControls() {
        const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
        const container = document.querySelector('#controls');

        container.innerHTML = '';

        controls
            .filter(f => f.enabled)
            .sort((a, b) => (a.pin > b.pin) ? 1 : -1)
            .forEach(({ name, pin, times }) => {
                container.insertAdjacentHTML('beforeend', /*html*/`
                    <div class="control">
                        <div class="control-title">${name}</div>

                        <div class="control-separator"></div>

                        <div class="control-content">
                            <div class="left">
                                <label class="switch">
                                    <input name="active" id="switch-pin${pin}" type="checkbox" data-pin="${pin}">
                                    <span class="slider"></span>
                                </label>
                            </div>

                            <ol class="control-times">
                                ${times.map(time => `<li>${time[0]} às ${time[1]}</li>`).join('')}
                            </ol>
                        </div>
                    </div>
                `);
            });
    }

    function events() {
        document.querySelectorAll('.control .switch input').forEach(input => {
            input.addEventListener('change', event => {
                const control = event.target.closest('.control');
                const { pin } = control.dataset;
                const state = event.currentTarget.checked ? 'on' : 'off';

                fetch(`${ROUTES.PIN}${pin}-${state}`, { method: 'POST' })
                    .then(res => res.text())
                    .then(console.log);
            });
        });
    }

    function init() {
        if (!localStorage.getItem('@ESP:initialized')) {
            location.replace('/network.html');
        }

        listControls();
        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', Index.init);