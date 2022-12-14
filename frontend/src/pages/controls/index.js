import { Menu } from '../../components/menu';
import { Modal } from '../../components/modal';
import { sendControl } from '../../utils';
import { startServer } from '../../utils/server';
import './index.scss';


startServer();

const Controls = (() => {
    function initStorage() {
        if (!localStorage.getItem('@ESP:controls')) {
            localStorage.setItem('@ESP:controls', JSON.stringify([]));
        }
    }

    function saveControl(form) {
        const {
            name, pin, enabled,
            timeIni1, timeEnd1,
            timeIni2, timeEnd2,
            timeIni3, timeEnd3,
            timeIni4, timeEnd4
        } = form;
        const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
        const index = controls.findIndex(control => control.pin === pin);
        const data = {
            name,
            pin,
            enabled: enabled !== 'on' ? false : true,
            active: false,
            times: [
                [timeIni1, timeEnd1],
                [timeIni2, timeEnd2],
                [timeIni3, timeEnd3],
                [timeIni4, timeEnd4],
            ].filter(arr => arr[0] && arr[1])
        }

        if (index > -1) controls[index] = data;
        else controls.push(data);

        localStorage.setItem('@ESP:controls', JSON.stringify(controls));

        sendControl(pin, data => {
            if (data) {
                listControls();
                Modal.close();
            }
            else {
                alert('Falha ao salvar controle.');
            }
        });
    }

    function listControls() {
        const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
        const container = document.querySelector('#controls');

        container.innerHTML = '';

        controls
            .sort((a, b) => (a.pin > b.pin) ? 1 : -1)
            .forEach(({ name, pin, enabled, times }) => {
                container.insertAdjacentHTML('beforeend', /*html*/`
                <div class="control config">
                    <button class="control-menu" data-pin="${pin}" aria-label="menu do controle">
                        <svg width="5" height="17" viewBox="0 0 5 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.5 9.375C2.98325 9.375 3.375 8.98325 3.375 8.5C3.375 8.01675 2.98325 7.625 2.5 7.625C2.01675 7.625 1.625 8.01675 1.625 8.5C1.625 8.98325 2.01675 9.375 2.5 9.375Z" stroke="#626262" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.5 3.25C2.98325 3.25 3.375 2.85825 3.375 2.375C3.375 1.89175 2.98325 1.5 2.5 1.5C2.01675 1.5 1.625 1.89175 1.625 2.375C1.625 2.85825 2.01675 3.25 2.5 3.25Z" stroke="#626262" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.5 15.5C2.98325 15.5 3.375 15.1082 3.375 14.625C3.375 14.1418 2.98325 13.75 2.5 13.75C2.01675 13.75 1.625 14.1418 1.625 14.625C1.625 15.1082 2.01675 15.5 2.5 15.5Z" stroke="#626262" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <div class="control-title">${name}</div>

                    <div class="control-separator"></div>

                    <div class="control-content">
                        <div class="left">
                            <div class="control-pin">
                                pino <span>${pin}</span>
                            </div>

                            <label class="switch small">
                                <span class="label">Habilitado</span>
                                <input name="enabled" id="switch-pin${pin}" type="checkbox" data-pin="${pin}">
                                <span class="slider"></span>
                            </label>
                        </div>

                        <ol class="control-times">
                            ${times.map(time => `<li>${time[0]} ??s ${time[1]}</li>`).join('')}
                        </ol>
                    </div>
                </div>
            `);

                document.querySelector(`#switch-pin${pin}`).checked = enabled;
            });

        addSwitchListener();
    }

    function openModal(pin) {
        if (pin) {
            const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
            const control = controls.find(control => control.pin === pin);

            if (control) {
                const { form } = document.forms;
                const { name, pin, enabled } = form;

                name.value = control.name;
                pin.value = control.pin;
                enabled.checked = control.enabled;
                loadTimes(control.times);
            }
        }
        else {
            const container = document.querySelector('#times .time-container');

            container.innerHTML = '';
            container.insertAdjacentHTML('beforeend', generateTimeHTML(1));
        }

        Modal.open();
    }

    function addTime() {
        const container = document.querySelector('#times .time-container');
        const { childElementCount: count } = container;

        if (count < 4) {
            container.insertAdjacentHTML('beforeend', generateTimeHTML(count + 1));
        }
        else {
            alert('Voc?? j?? atingiu o m??ximo de 4 hor??rios!')
        }
    }

    function loadTimes(times) {
        const container = document.querySelector('#times .time-container');

        container.innerHTML = '';

        times.forEach(([ini, end], i) =>
            container.insertAdjacentHTML('beforeend', generateTimeHTML(i + 1, ini, end))
        );
    }

    function generateTimeHTML(number = 1, ini = '', end = '') {
        return /*html*/`
            <label class="label">
                Hor??rio ${number} (in??cio / fim)
                <div class="input-wrapper">
                    <input name="timeIni${number}" type="time" value="${ini}">
                    <input name="timeEnd${number}" type="time" value="${end}">
                </div>
            </label>
        `;
    }

    function addSwitchListener() {
        document.querySelectorAll('#controls input[data-pin]')
            .forEach(input => {
                input.addEventListener('change', event => {
                    const { pin } = input.dataset;
                    const controls = JSON.parse(localStorage.getItem('@ESP:controls'));
                    const control = controls.find(control => control.pin === pin);

                    control.enabled = input.checked;

                    localStorage.setItem('@ESP:controls', JSON.stringify(controls));

                    // sendControl(pin, data => {
                    //     if (data) {
                    //         listControls();
                    //     }
                    //     else {
                    //         alert('Falha ao atualizar controle.');
                    //     }
                    // });
                });
            });
    }

    function events() {
        document.querySelector('#btn-add-control').addEventListener('click', () => openModal());

        document.querySelector('#btn-add-time').addEventListener('click', addTime);

        document.forms.form.addEventListener('submit', event => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const form = Object.fromEntries(formData);

            saveControl(form);
        });

        window.addEventListener('click', event => {
            const { target } = event;

            if (
                target.classList.contains('control-menu') ||
                target.closest('.control-menu')
            ) {
                const pin = target.dataset?.pin || target.closest('.control-menu')?.dataset?.pin;
                openModal(pin);
            }
        });
    }

    function init() {
        initStorage();
        listControls();
        Modal.init();
        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', Controls.init);