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

    /** Value of the state */
    public state: APIValidationState;
    
    /** Las update */
    public updatedAt: Date | null;

    /** User who intervened */
    public moderator: User | null;

    /** The linked resource */
    public resource: Resource | null;

    constructor(client: Client, data: APIValidationStateData) {
        super(client, data.id, "/validation_states");
        this.state = data.state;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.moderator = this.getModerator(data.moderator?.id);
        this.resource = data.resource?.id ? this.client.resources.cache.get(data.resource.id) ?? null : null;
    }

    private getModerator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            state: this.state,
        }
    }

}