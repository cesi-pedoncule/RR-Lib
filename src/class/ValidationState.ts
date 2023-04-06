import User from "./User";
import Base from "./Base";
import Client from "../client/Client";
import {
    APIValidationState,
    APIValidationStateData
} from "../@types";
import Resource from "./Resource";

/** Represents an validation state for a resource */
export default class ValidationState extends Base {

    /** API data */
    public data: APIValidationStateData;

    /** Value of the state */
    public state: APIValidationState;
    
    /** Last update */
    public updatedAt: Date;

    constructor(client: Client, data: APIValidationStateData) {
        super(client, data.id, "/validation_states");
        this.data = data;
        this.state = data.state.label;
        this.updatedAt = new Date(data.updatedAt);
    }

    /** User who intervened */
    get moderator() {
        return this.getModerator(this.data.moderator?.id);
    }

    private getModerator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    /** The linked resource */
    get resource() {
        const id = this.data.resource?.id;
        return id ? this.client.resources.cache.get(id) ?? null : null;
    }

    public _patch(data: APIValidationStateData) {
        this.data = data;
        this.state = data.state.label;
        this.updatedAt = new Date(data.updatedAt);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            state: this.state,
        }
    }

}