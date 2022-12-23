import Client from "../client/Client";
import Base from "./Base";
import Resource from "./Resource";
import User from "./User";

export interface CommentData {
    id: string;
    comment: string;
    createdAt: string;
    isDeleted: boolean;
}

export default class Comment extends Base {

    public comment: string;
    public createdAt: Date;
    public isDeleted: boolean;

    public resource: Resource;
    public user: User | null;

    constructor(client: Client, resource: Resource, user: User | null, data: CommentData) {
        super(client, data.id, "/comments");

        this.resource = resource;
        this.user = user;

        this.comment = data.comment,
        this.createdAt = new Date(data.createdAt),
        this.isDeleted = data.isDeleted;
    }

    public toJSON() {
        return {
            id: this.id,
            comment: this.comment,
            isDeleted: this.isDeleted,
        }
    }
}