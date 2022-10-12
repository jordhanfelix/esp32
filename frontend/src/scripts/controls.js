import '../styles/controls.scss';
import { Menu } from './components/menu';
import { Modal } from './components/modal';
import { ROUTES } from './routes';
import { startServer } from './server';


startServer();

const controls = (() => {
    function events() {

    }

    function init() {
        Modal.init();
        Menu.init();
        events();
    }

    return {
        init
    }
})();

document.addEventListener('DOMContentLoaded', controls.init);