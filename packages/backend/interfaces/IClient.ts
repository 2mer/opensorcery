import EventEmitter from "eventemitter3";

type IClient = {
	id: string,
	events: EventEmitter,
}

export default IClient;