import Base from "./Base";
import User from "./User";
import Client from "../client/Client";
import { APIUserFollowData } from "../@types";

/** Represents an follow from a user to an another user */
export default class UserFollow extends Base {

    /** API data */
    public data: APIUserFollowData;

    public followAt: Date;
    
    constructor(client: Client, data: APIUserFollowData) {
        super(client, data.id, "/user_follows");
        
        this.data = data;
        this.followAt = new Date(data.followAt);
    }

    /** User who has been followed */
    get user(): User | null {
        return this.client.users.cache.get(this.getIdByIri(this.data.user)) ?? null;
    }

    /** User who has followed */
    get follower(): User | null {
        return this.client.users.cache.get(this.getIdByIri(this.data.follower)) ?? null;
    }

    public _patch(data: APIUserFollowData) {
        this.data = data;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            user: this.user?.getIri(),
            follower: this.follower?.getIri(),
        }
    }
}