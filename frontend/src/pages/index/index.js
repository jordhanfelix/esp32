import { Menu } from '../../components/menu';
import { sendControl } from '../../utils';
import { startServer } from '../../utils/server';
import './index.scss';


startServer();

const Index = (() => {

    function listControls() {
        const container = document.querySelector('#controls');
        const controls = JSON.parse(localStorage.getItem('@ESP:controls'));

        container.innerHTML = '';

        if (controls?.filter(f => f.enabled).length) {
            controls
                .filter(f => f.enabled)
                .sort((a, b) => (a.pin > b.pin) ? 1 : -1)
                .forEach(({ name, pin, times }) => {
                    const timeList = analiseTimeList(times);
                    const active = timeList.find(f => f.active);

                    container.insertAdjacentHTML('beforeend', /*html*/`
                        <div class="control">
                            <div class="control-title">${name}</div>

                            <div class="control-separator"></div>

                            <div class="control-content">
                                <div class="left">
                                    <label class="switch" aria-label="ativa/desativa controle">
                                        <input name="active" id="switch-pin${pin}" type="checkbox" data-pin="${pin}">
                                        <span class="slider"></span>
                                    </label>
                                </div>

                                <ol class="control-times">
                                    ${timeList.map(({ active, dateIni, dateEnd }) => /*html*/`
                                        <li ${active ? 'class="active"' : ''}>
                                            ${dateIni} às ${dateEnd}
                                        </li>
                                    `).join('')}
                                </ol>
                            </div>
                        </div>
                    `);

                    document.querySelector(`#switch-pin${pin}`).checked = active;
                });
        }
        else {
            container.innerHTML = /*html*/`
                <div class="empty-container">
                    <h2>Nenhum controle disponível!</h2>
                    <a href="/controls.html" class="button secondary">cadastrar</a>
                </div>
            `;
        }
    }

    function analiseTimeList(times) {
        return times.reduce((acc, cur) => {
            const now = new Date();
            const dtIni = new Date();
            const dtEnd = new Date();
            const [hIni, mIni] = cur[0].split(':');
            const [hEnd, mEnd] = cur[1].split(':');

            dtIni.setHours(hIni);
            dtIni.setMinutes(mIni);
            dtEnd.setHours(hEnd);
            dtEnd.setMinutes(mEnd);

            const active = now > dtIni && now < dtEnd;

            acc.push({
                active,
                dateIni: cur[0],
                dateEnd: cur[1]
            });

            return acc;
        }, []);
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