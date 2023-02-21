import Resource from "../class/Resource";
import BaseManager from "./BaseManager";
import { Collection } from "@discordjs/collection";
import ValidationState from "../class/ValidationState";
import ValidationStateBuilder from "../builders/ValidationStateBuilder";

export default class ValidationStateResourceManager extends BaseManager {

    private resource: Resource;
    public cache: Collection<string, ValidationState>;
    
    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = this.resource.client.validations.cache.filter(v => v.resource?.id === this.resource.id);
    }

    public async add(validation: ValidationStateBuilder) {
        const data = await this.client.validations.create(validation.setResource(this.resource));
        this.cache.set(data.id, data);
        return this.resource;
    }

    public async update(validation: ValidationState) {
        const data = await this.client.validations.update(validation);
        this.cache.set(data.id, data);
        return this.resource;
    }
}