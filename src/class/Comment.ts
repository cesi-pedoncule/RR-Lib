import Base from "./Base";
import User from "./User";
import Resource from "./Resource";
import Client from "../client/Client";
import { APICommentData } from "../@types";

export default class Comment extends Base {

    public comment: string;
    public createdAt: Date;

    public resource: Resource;
    public user: User | null;

    constructor(client: Client, resource: Resource, user: User | null, data: APICommentData) {
        super(client, data.id, "/comments");

        this.resource = resource;
        this.user = user;

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