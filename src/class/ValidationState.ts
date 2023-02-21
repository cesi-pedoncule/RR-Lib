import User from "./User";
import Base from "./Base";
import Client from "../client/Client";
import {
    APIValidationState,
    APIValidationStateData
} from "../@types";
import Resource from "./Resource";

export default class ValidationState extends Base {

    public id: string;
    public state: APIValidationState;
    public updatedAt: Date | null;

    public moderator: User | null;
    public resource: Resource | null;

    constructor(client: Client, data: APIValidationStateData) {
        super(client, data.id, "/validation_states");
        this.id = data.id;
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