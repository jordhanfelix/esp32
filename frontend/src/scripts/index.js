import { Menu } from './components/menu';
import { sendControl } from './utils';
import { startServer } from './server';
import '../styles/index.scss';


startServer();

const Index = (() => {

    function listControls() {
        const container = document.querySelector('#controls');
        const controls = JSON.parse(localStorage.getItem('@ESP:controls'));

        if (controls?.filter(f => f.enabled).length) {
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
        else {
            container.innerHTML = /*html*/`
                <div class="empty-container">
                    <h3>Nenhum controle disponível!</h3>
                    <a href="/controls.html" class="button secondary">cadastrar</a>
                </div>
            `;
        }
    }

    function events() {
        document.querySelectorAll('#controls input[data-pin]').forEach(input => {
            input.addEventListener('change', () => {
                const { pin } = input.dataset;
                const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
                const control = controls.find(control => control.pin === pin);

                control.active = input.checked;

                localStorage.setItem('@ESP:controls', JSON.stringify(controls));

                sendControl(pin, data => {
                    if (!data) {
                        alert('Falha ao atualizar controle.');
                    }
                });
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