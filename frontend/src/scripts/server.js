import { createServer } from "miragejs";


export function startServer() {
    if (import.meta.env.MODE === 'production') return;

    createServer({
        routes() {
            this.post("/config", () => true);

            this.post("/pin00-on", () => 'pin00 on');
            this.post("/pin00-off", () => 'pin00 off');
            this.post("/pin01-on", () => 'pin01 on');
            this.post("/pin01-off", () => 'pin01 off');
            this.post("/pin02-on", () => 'pin02 on');
            this.post("/pin02-off", () => 'pin02 off');
            this.post("/pin03-on", () => 'pin03 on');
            this.post("/pin03-off", () => 'pin03 off');
            this.post("/pin04-on", () => 'pin04 on');
            this.post("/pin04-off", () => 'pin04 off');
            this.post("/pin05-on", () => 'pin05 on');
            this.post("/pin05-off", () => 'pin05 off');
            this.post("/pin06-on", () => 'pin06 on');
            this.post("/pin06-off", () => 'pin06 off');
            this.post("/pin07-on", () => 'pin07 on');
            this.post("/pin07-off", () => 'pin07 off');
            this.post("/pin08-on", () => 'pin08 on');
            this.post("/pin08-off", () => 'pin08 off');
            this.post("/pin09-on", () => 'pin09 on');
            this.post("/pin09-off", () => 'pin09 off');
            this.post("/pin10-on", () => 'pin10 on');
            this.post("/pin10-off", () => 'pin10 off');
            this.post("/pin11-on", () => 'pin11 on');
            this.post("/pin11-off", () => 'pin11 off');
            this.post("/pin12-on", () => 'pin12 on');
            this.post("/pin12-off", () => 'pin12 off');
            this.post("/pin13-on", () => 'pin13 on');
            this.post("/pin13-off", () => 'pin13 off');
            this.post("/pin014-on", () => 'pin014 on');
            this.post("/pin014-off", () => 'pin014 off');
            this.post("/pin015-on", () => 'pin015 on');
            this.post("/pin015-off", () => 'pin015 off');
        },
    });
}