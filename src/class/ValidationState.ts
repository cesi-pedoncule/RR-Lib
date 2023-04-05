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

    /** User who intervened */
    public moderator: User | null;

    /** The linked resource */
    public resource: Resource | null;

    constructor(client: Client, data: APIValidationStateData) {
        super(client, data.id, "/validation_states");
        this.data = data;
        this.state = data.state;
        this.updatedAt = new Date(data.updatedAt);

        this.moderator = this.getModerator(data.moderator?.id);
        this.resource = data.resource?.id ? this.client.resources.cache.get(data.resource.id) ?? null : null;
    }

    private getModerator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    public _patch(data: APIValidationStateData) {
        this.data = data;
        this.state = data.state;
        this.updatedAt = new Date(data.updatedAt);

        this.moderator = this.getModerator(data.moderator?.id);
        this.resource = data.resource?.id ? this.client.resources.cache.get(data.resource.id) ?? null : null;
    }

    public refresh() {
        this.moderator = this.getModerator(this.data.moderator?.id);
        this.resource = this.data.resource?.id ? this.client.resources.cache.get(this.data.resource.id) ?? null : null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            state: this.state,
        }
    }

}