import { Application, Sprite } from 'pixi.js';
import { useEffect, useRef } from 'preact/hooks';
import ImplClient from '../impl/ImplClient';
import ImplServer from '../impl/ImplServer';
import { EventEmitter } from 'eventemitter3';
import { v4 } from 'uuid';

function GameView() {
	const ref = useRef<any>();

	useEffect(() => {
		const div = ref.current;
		const app = new Application();
		div.appendChild(app.view);

		const server = new ImplServer();
		const client = new ImplClient();

		// pipe events from server to client (simulate connection)
		const connection = server.connect(client.id);

		console.log('connected!', connection.id);

		connection.events.on('c2s', (...args) => {
			console.log('[c2s]', ...args);
		});
		connection.events.on('s2c', (...args) => {
			console.log('[s2c]', ...args);
		});

		// send client events to server
		client.events.on('c2s', (...args) => {
			connection.events.emit('c2s', ...args);
		});

		// send server events to client
		connection.events.on('s2c', (...args) => {
			client.events.emit('s2c', ...args);
		});

		client.events.on('s2c', (msg) => {
			const { type, payload } = msg;
			if (type !== 'addEntity') return;

			if (payload.type === 'image') {
				const sprite = Sprite.from(payload.src);

				sprite.position.x = payload.x ?? 0;
				sprite.position.y = payload.y ?? 0;

				app.stage.addChild(sprite);
			}
		});

		for (let i = 0; i < 100; i++) {
			server.addEntity({
				type: 'image',
				src: 'mage.png',
				x: 100 * Math.random(),
				y: 100 * Math.random(),
				id: v4(),
			});
		}

		return () => {
			server.destroy();
			app.destroy();
		};
	}, []);

	return <div ref={ref} />;
}

export default GameView;
