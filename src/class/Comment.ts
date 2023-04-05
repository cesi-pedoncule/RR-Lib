import Base from "./Base";
import User from "./User";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceCommentData } from "../@types";

/** Represents an resource comment */
export default class Comment extends Base {

    /** API data */
    public data: APIResourceCommentData;

    /** Message of the user */
    public comment: string;
    
    /** Creation date */
    public createdAt: Date;

    /** Linked resource */
    public resource: Resource;
    
    /** Creator of this comment */
    public user: User | null;

    constructor(client: Client, resource: Resource, data: APIResourceCommentData) {
        super(client, data.id, "/comments");

        this.data = data;
        this.resource = resource;
        this.user = data.user ? this.client.users.cache.get(data.user.id) ?? null : null;

        this.comment = data.comment;
        this.createdAt = new Date(data.createdAt);
    }

    public _patch(data: APIResourceCommentData) {
        this.data = data;
        this.comment = data.comment;
        this.createdAt = new Date(data.createdAt);
        this.user = data.user ? this.client.users.cache.get(data.user.id) ?? null : null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            comment: this.comment,
        }
    }
}