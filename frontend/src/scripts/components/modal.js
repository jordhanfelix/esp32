import '../../styles/components/modal.scss';


export const Modal = (() => {
    let modal, form;

    function insertModal() {
        document.body.insertAdjacentHTML('beforeend', /*html*/`
            <div id="modal" style="display: none;">
                <div class="overlay">
                    <div class="content">
                        <form name="form" id="form" class="form">
                            <label class="label">
                                Nome do controle
                                <input name="name" required>
                            </label>

                            <label class="label">
                                Pino
                                <select name="pin" required>
                                    <option value="" selected disabled>Selecione...</option>
                                    ${[...Array(15)].map((opt, i) => `<option title="${i}" value="${i < 10 ? '0' + i : i}">Pino ${i < 10 ? '0' + i : i}</option>`).join('')}
                                </select>
                            </label>

                            <div id="times">
                                <div class="time-container"></div>
                                <button id="btn-add-time" type="button">Adicionar horário</button>
                            </div>

                            <label class="switch small">
                                <span class="label">Habilitado</span>
                                <input name="active" type="checkbox" checked>
                                <span class="slider"></span>
                            </label>

                            <div class="controls-wrapper">
                                <button class="button secondary modal-close" type="button">fechar</button>
                                <button class="button primary" id="btn-submit" type="submit">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        `);

        modal = document.querySelector('#modal');
        form = document.forms.form;
    }

    function open() {
        modal.style.display = 'block';
    }

    function close() {
        form.reset();
        modal.style.display = 'none';
    }

    function events() {
        window.addEventListener('click', event => {
            const { target } = event;

            if (
                target.classList.contains('modal-close') ||
                target.classList.contains('overlay') ||
                target.closest('.modal-close')
            ) {
                form.reset();
                modal.style.display = 'none';
            }
            else if (
                target.classList.contains('modal-open') ||
                target.closest('.modal-open')
            ) {
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
        events();
    }

    return {
        init,
        open,
        close,
        modal,
        form
    }
})();