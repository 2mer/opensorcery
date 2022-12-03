import { IEntity, Server } from 'backend';

export default class ImplServer extends Server {
	entities: IEntity[] = [];
	idToEntity = new Map<string, IEntity>()

	addEntity(entity: IEntity) {
		this.entities.push(entity);
		this.idToEntity.set(entity.id, entity);

		this.emitAll('addEntity', entity);
	}

	removeEntity(entity: IEntity) {
		const index = this.entities.indexOf(entity);
		if (index !== -1) {
			this.entities.splice(index, 1);
			this.idToEntity.delete(entity.id);

			this.emitAll('removeEntity', entity);
		}
	}

	destroy(): void {
		super.destroy();
		this.entities.length = 0;
		this.idToEntity.clear();
	}
}