import Server from "../server";
import { v4 } from 'uuid';
import IClient from "../interfaces/IClient";

function createEffect(client: IClient, effect: string, payload: any, callback: (msg: any) => void) {
	const messageId = v4();
	client.events.once(messageId, callback);
	client.events.emit('effect', { message_id: messageId, effect, payload });

}

test('message from server <-> client', () => {
	return new Promise<void>((resolve => {
		const server = new Server();

		const client1 = server.connect(v4());

		createEffect(client1, 'flame', {}, (data) => {
			resolve();
		})
	}));
});

test('client connected message', () => {
	return new Promise<void>((resolve => {
		const server = new Server();

		const client1 = server.connect(v4());

		client1.events.once('clientConnected', resolve);

		// client 2
		server.connect(v4());
	}));
});