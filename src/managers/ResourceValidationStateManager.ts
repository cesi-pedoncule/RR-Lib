import Resource from "../class/Resource";
import BaseManager from "./BaseManager";
import { Collection } from "@discordjs/collection";
import ValidationState from "../class/ValidationState";
import ValidationStateBuilder from "../builders/ValidationStateBuilder";

export default class ResourceValidationStateManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Validation state cache for this resource */
    public cache: Collection<string, ValidationState>;
    
    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = new Collection();

        this.refresh();
    }

    /** Refresh this cache */
    public refresh() {
        for(const c of this.resource.data.validationStates) {
            const validationState = this.client.validations.cache.get(c.id);
            if(validationState) {
                this.cache.set(validationState.id, validationState);
            }
        }
    }

    /** Get last validation state */
    public getLastValidationState() {
        const defaultArray = Array.from(this.cache.values());
        const sortByDate = defaultArray.sort((v1, v2) => 
            v2.updatedAt.getTime() - v1.updatedAt.getTime()
        );
        return sortByDate[0];
    }

    /** Create a new validation state for this resource */
    public async create(validation: ValidationStateBuilder) {
        const data = await this.client.validations.create(validation.setResource(this.resource));
        this.cache.set(data.id, data);
        return this.resource;
    }

    /** Delete an existing validation state for this resource */
    public async update(validation: ValidationState) {
        const data = await this.client.validations.update(validation);
        this.cache.set(data.id, data);
        return this.resource;
    }
}