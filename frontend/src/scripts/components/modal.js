import '../../styles/components/modal.scss';


export const Modal = (() => {
    let modal;

    function insertModal() {
        document.body.insertAdjacentHTML('beforeend', /*html*/`
            <div id="modal" style="display: none;">
                <div class="overlay">
                    <div class="content">
                        <form name="form" id="form" class="form">
                            <label class="label">
                                Nome do controle
                                <input name="nome" required>
                            </label>

                            <label class="label">
                                Pino
                                <select name="pino" required>
                                    <option value="" selected disabled>Selecione...</option>
                                    ${[...Array(15)].map((opt, i) => `<option value="${i < 10 ? '0' + i : i}">Pino ${i < 10 ? '0' + i : i}</option>`).join()}
                                </select>
                            </label>

                            <div id="times">
                                <div class="time-container">
                                    <label class="label">
                                        Horário (início / fim)
                                        <div class="input-wrapper">
                                            <input name="horario1Ini" type="time" required>
                                            <input name="horario1Fim" type="time" required>
                                        </div>
                                    </label>
                                </div>

                                <button type="button">Adicionar horário</button>
                            </div>

                            <label class="switch small">
                                <span class="label">Habilitado</span>
                                <input type="checkbox" checked>
                                <span class="slider"></span>
                            </label>

                            <div class="controls-wrapper">
                                <button class="button secondary modal-close" type="button">cancelar</button>
                                <button class="button primary" id="btn-submit" type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `);
    }

    function events() {
        window.addEventListener('click', event => {
            const { target } = event;

            if (
                target.classList.contains('modal-close') ||
                target.classList.contains('overlay') ||
                target.closest('.modal-close')
            ) {
                modal.style.display = 'none';
            }
            else if (
                target.classList.contains('modal-open') ||
                target.closest('.modal-open')
            ) {
                const tgt = target.closest('.modal-open');
                const pin = tgt.dataset?.pin;

                if (pin) {
                    // preencher forma a partir do pin
                    console.log(pin);
                }

                modal.style.display = 'block';
            }
        });

        window.addEventListener('keyup', event => {
            if (event.key === 'Escape') {
                modal.style.display = 'none';
            }
        });

    }

    function init() {
        insertModal();
        modal = document.querySelector('#modal');
        events();
    }

    return {
        init
    }
})();