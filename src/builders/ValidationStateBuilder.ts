import User from "../class/User";
import { APIValidationState } from "../@types";
import Resource from "../class/Resource";

export interface ValidationStateDataBuilder {
    state: APIValidationState;
    moderator?: User;
    resource?: Resource;
}

/** Represents a valid state */
export default class ValidationStateBuilder implements ValidationStateDataBuilder {
    
    public state: APIValidationState;
    public moderator?: User;
    public resource?: Resource;

    constructor(data?: Partial<ValidationStateDataBuilder>) {
        this.state = data?.state ?? APIValidationState.Pending;
        this.moderator = data?.moderator!;
        this.resource = data?.resource
    }

    public setState(state: APIValidationState) {
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