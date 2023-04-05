import Base from "./Base";
import User from "./User";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceUserLikeData } from "../@types";

/** Represents an like from a user to a resource */
export default class UserLike extends Base {

    /** API data */
    public data: APIResourceUserLikeData;

    /** UserId who has liked */
    public userId: string;

    /** User who has liked */
    public user: User | null;
    
    /** Resource who has liked */
    public resource: Resource;
    
    constructor(client: Client, resource: Resource, data: APIResourceUserLikeData) {
        super(client, data.id, "/user_likes");
        
        this.data = data;
        this.resource = resource;
        this.userId = this.data.user.id;
        this.user = this.client.users.cache.get(this.userId) ?? null;
    }

    public _patch(data: APIResourceUserLikeData) {
        this.data = data;
        this.userId = this.data.user.id;
        this.user = this.client.users.cache.get(this.userId) ?? null;
    }

    /** Refresh all resource managers */
    public refresh() {
        this.user = this.client.users.cache.get(this.userId) ?? null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            user: `/users/${this.userId}`,
            resource: this.resource.getIri(),
        }
    }
}