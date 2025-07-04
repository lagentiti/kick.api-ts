import express, { Express, Request, Response } from 'express';
import { EventEmitter } from 'events';

interface WebhookServerOptions {
    port?: number;
    path?: string;
}

export class WebhookServer {
    private client: EventEmitter;
    private port: number;
    private path: string;
    private app: Express;
    private server: ReturnType<Express['listen']> | null;

    constructor(client: EventEmitter, options: WebhookServerOptions = {}) {
        this.client = client;
        this.port = options.port || 3000;
        this.path = options.path || '/webhook';
        this.app = express();
        this.server = null;
    }

    private setup() {
        this.app.use(express.raw({ type: 'application/json' }));

        this.app.post(this.path, async (req: Request, res: Response) => {
            try {
                const result = await (this.client as any).handleWebhookRequest(req.headers, req.body);
                res.json({ success: true, event: result.eventType });
            } catch (error: any) {
                res.status(400).json({ error: error.message });
            }
        });
    }

    start(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.setup();
                this.server = this.app.listen(this.port, () => {
                    this.client.emit('webhookServerStarted', {
                        port: this.port,
                        path: this.path
                    });
                    resolve();
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.server) {
                this.server.close((err?: Error) => {
                    if (err) reject(err);
                    else {
                        this.client.emit('webhookServerStopped');
                        resolve();
                    }
                });
            } else {
                resolve();
            }
        });
    }
}
