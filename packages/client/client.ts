import { EventEmitter } from 'eventemitter3';
import { v4 } from 'uuid';

export default class Client {
	id: string = v4();
	events = new EventEmitter();
}