import { createServer } from "miragejs";
import { ROUTES } from '../pages/routes';


export function startServer() {
    if (import.meta.env.MODE === 'production') return;
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    if (localStorage.getItem('@ESP:baseUrl')) return;

    createServer({
        routes() {
            this.post('/config', () => ({ ok: true }));
            this.post('/control/:pin/:action', () => ({ ok: true }));
        },
    });
}