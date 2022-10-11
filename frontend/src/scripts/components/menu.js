"strict mode"

export const Menu = (() => {
    function insertMenu() {
        const container = document.querySelector('#header');

        container.insertAdjacentHTML('beforeend', /*html*/`
            <button id="menu-open">
                <img src="./menu.png" alt="OPEN MENU">
            </button>

            <nav id="menu">
                <ul>
                    <li><button id="menu-close"><img src="./close.png" alt="CLOSE MENU"></button></li>
                    <li><a href="/">INÍCIO</a></li>
                    <li><a href="/controls.html">CONTROLES</a></li>
                    <li><a href="/network.html">REDE</a></li>
                </ul>
            </nav>
        `);
    }

    function events() {
        const menu = document.querySelector('#menu');

        document.querySelector('#menu-open').addEventListener('click', () => {
            menu.classList.add('open');
        });

        document.querySelector('#menu-close').addEventListener('click', () => {
            menu.classList.remove('open');
        });
    }

    function init() {
        insertMenu();
        events();
    }

    return {
        init
    }
})();