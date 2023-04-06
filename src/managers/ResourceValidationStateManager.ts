import Resource from "../class/Resource";
import BaseManager from "./BaseManager";
import { Collection } from "@discordjs/collection";
import ValidationState from "../class/ValidationState";
import ValidationStateBuilder from "../builders/ValidationStateBuilder";

export default class ResourceValidationStateManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;
    
    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
    }

    /** Validation state cache for this resource */
    get cache(): Collection<string, ValidationState> {
        return this.client.validations.cache.filter(v => 
            v.resource?.id === this.resource.id
        );
    }

    /** Get last validation state */
    public getLastValidationState() {
        const defaultArray = Array.from(this.cache.values());
        if(defaultArray.length === 0) {
            return null;
        }
        const sortByDate = defaultArray.sort((v1, v2) => 
            v2.updatedAt.getTime() - v1.updatedAt.getTime()
        );
        return sortByDate[0];
    }

    /** Create a new validation state for this resource */
    public create(validation: ValidationStateBuilder) {
        return this.client.validations.create(validation.setResource(this.resource));
    }

    /** Delete an existing validation state for this resource */
    public update(validation: ValidationState) {
        return this.client.validations.update(validation);
    }
}