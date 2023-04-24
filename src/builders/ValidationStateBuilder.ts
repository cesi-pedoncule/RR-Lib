import User from "../class/User";
import { APIValidationStateCreate } from "../@types";
import Resource from "../class/Resource";

export interface ValidationStateDataBuilder {
    state: APIValidationStateCreate;
    moderator?: User;
    resource?: Resource;
}

/** Represents a valid state */
export default class ValidationStateBuilder implements ValidationStateDataBuilder {
    
    public state: APIValidationStateCreate;
    public moderator?: User;
    public resource?: Resource;

    constructor(data?: Partial<ValidationStateDataBuilder>) {
        this.state = data?.state ?? APIValidationStateCreate.Pending;
        this.moderator = data?.moderator!;
        this.resource = data?.resource
    }

    public setState(state: APIValidationStateCreate) {
        this.state = state;
        return this;
    }

    public setModerator(user: User) {
        this.moderator = user;
        return this;
    }

    public setResource(resource: Resource) {
        this.resource = resource;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            state: this.state,
            moderator: this.moderator?.getIri(),
            resource: this.resource?.getIri(),
        }
    }
}