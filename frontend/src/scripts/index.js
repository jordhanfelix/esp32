import '../styles/index.scss';


const Index = (() => {
    function events() {
        const menu = document.querySelector('#menu');

        document.querySelector('#menu-open').addEventListener('click', () => {
            menu.classList.add('open');
        });

        document.querySelector('#menu-close').addEventListener('click', () => {
            menu.classList.remove('open');
        });

        // Botão de menu dentro do controle
        document.querySelectorAll('.control-trigger').forEach(button => {
            button.addEventListener('click', event => {
                const control = event.target.closest('.control');
                const { pin } = control.dataset;

                console.log(pin);
            });
        });

        // Dispara sempre que clicamos em um switch
        document.querySelectorAll('.control .switch input').forEach(input => {
            input.addEventListener('change', event => {
                // Aqui você poderia enviar uma requisição para o backend de acordo com o estado do switch
                // Por exemplo:
                const control = event.target.closest('.control');
                const { pin } = control.dataset;
                const state = event.currentTarget.checked ? 'on' : 'off';
                const PINS = {
                    pin01: 'bomba-dagua',
                    pin02: 'setor-cafe-novo',
                    pin03: 'setor-morro',
                    pin04: 'setor-aderne',
                }

                fetch(`<API-URL>/${PINS[pin]}-${state}`, {method: 'POST'});
            });
        });
    }

    function init() {
        if (!localStorage.getItem('@ESP:initialided')) {
            location.replace('/network.html');
        }

        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', Index.init);