import { Client } from 'client';
import { v4 } from 'uuid';

export default class ImplClient extends Client {
	createEffect(effectId: string, payload: any, callback: (msg: any) => void) {
		const messageId = v4();
		this.events.once(messageId, callback);
		this.events.emit('effect', { message_id: messageId, effect: effectId, payload });
	}
}