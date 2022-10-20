import { createServer } from "miragejs";
import { ROUTES } from '../pages/routes';


export function startServer() {
    if (import.meta.env.MODE === 'production') return;

    createServer({
        routes() {
            this.post(`${ROUTES.SAVE_NETWORK}`, () => true);

            this.post(`${ROUTES.SAVE_PIN}-00-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-00-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-01-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-01-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-02-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-02-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-03-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-03-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-04-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-04-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-05-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-05-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-06-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-06-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-07-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-07-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-08-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-08-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-09-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-09-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-10-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-10-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-11-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-11-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-12-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-12-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-13-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-13-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-14-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-14-off`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-15-on`, () => true);
            this.post(`${ROUTES.SAVE_PIN}-15-off`, () => true);
        },
    });
}