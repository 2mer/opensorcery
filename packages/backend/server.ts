import EventEmitter from 'eventemitter3';
import type IClient from './interfaces/IClient';
import type IEffectMessage from './interfaces/IEffectMessage';
import type IEntity from './interfaces/IEntity';

export default class Server {

	clients = new Map<string, IClient>();

	constructor() {
		this.handleMessage = this.handleMessage.bind(this);
	}

	emit(clientId: string, event: string | symbol, payload: any) {
		const client = this.clients.get(clientId);
		if (client) {
			client.events.emit('s2c', { type: event, payload });
		} else {
			throw new Error(`Client '${clientId}' does not exist`)
		}
	}

	emitAll(event: string | symbol, payload: any) {
		[...this.clients.values()].every(client => {
			client.events.emit('s2c', { type: event, payload });
		})
	}

	async handleMessage(client: IClient, message: IEffectMessage) {
		const result = {};

		if (message.message_id) {
			client.events.emit(message.message_id, result);
		}
	}

	connect(id: string): IClient {
		const client = { id, events: new EventEmitter() };
		this.clients.set(id, client);
		this.emitAll('clientConnected', client);

		client.events.on('c2s', (msg) => this.handleMessage(client, msg))

		return client;
	}

	disconnect(id: string): IClient {
		const client: IClient | undefined = this.clients.get(id);

		if (client) {
			this.clients.delete(id);
			this.emitAll('clientDisconnected', client);

			client.events.removeAllListeners();

			return client;
		} else {
			throw new Error(`Client '${id}' does not exist`)
		}
	}


	destroy() {
		this.clients.forEach(client => this.disconnect(client.id));
	}
}