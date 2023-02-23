import Base from "./Base";
import User from "./User";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceUserLikeData } from "../@types";

/** Represents an like from a user to a resource */
export default class UserLike extends Base {

    /** User who has like */
    public user: User | null;
    
    /** Resource who has liked */
    public resource: Resource;
    
    constructor(client: Client, resource: Resource, data: APIResourceUserLikeData) {
        super(client, data.id, "/user_likes");
        this.resource = resource;
        this.user = this.client.users.cache.get(data.user.id) ?? null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            user: this.user?.getIri(),
            resource: this.resource.getIri(),
        }
    }
}