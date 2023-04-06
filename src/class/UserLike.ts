import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceUserLikeData } from "../@types";

/** Represents an like from a user to a resource */
export default class UserLike extends Base {

    /** API data */
    public data: APIResourceUserLikeData;

    /** UserId who has liked */
    public userId: string;
    
    /** Resource who has liked */
    public resource: Resource;
    
    constructor(client: Client, resource: Resource, data: APIResourceUserLikeData) {
        super(client, data.id, "/user_likes");
        
        this.data = data;
        this.resource = resource;
        this.userId = this.data.user.id;
    }

    /** User who has liked */
    get user() {
        return this.client.users.cache.get(this.userId) ?? null;
    }

    public _patch(data: APIResourceUserLikeData) {
        this.data = data;
        this.userId = this.data.user.id;
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