import Base from "./Base";
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

    constructor(client: Client, resource: Resource, data: APIResourceCommentData) {
        super(client, data.id, "/comments");

        this.data = data;
        this.resource = resource;

        this.comment = data.comment;
        this.createdAt = new Date(data.createdAt);
    }

    /** Creator of this comment */
    get user() {
        const id = this.data.user?.id;
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    public _patch(data: APIResourceCommentData) {
        this.data = data;
        this.comment = data.comment;
        this.createdAt = new Date(data.createdAt);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            comment: this.comment,
        }
    }
}