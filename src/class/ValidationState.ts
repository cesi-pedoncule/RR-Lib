import User from "./User";
import { State } from "../builders/ValidStateBuilder";
import Base from "./Base";
import Client from "../client/Client";
import { APIUserData } from "../@types";

export interface ValidationStateData {
    id: string;
    state: State;
    updatedAt: string | null;

    moderator: Partial<APIUserData> | null;
}

export default class ValidationState extends Base {

    public id: string;
    public state: State;
    public updatedAt: Date | null;

    public moderator: User | null;

    constructor(client: Client, data: ValidationStateData) {
        super(client, data.id, "/validation_states");
        this.id = data.id;
        this.state = data.state;
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.moderator = this.getModerator(data.moderator?.id);
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