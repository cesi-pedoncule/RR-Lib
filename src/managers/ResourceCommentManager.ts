import { Collection } from "@discordjs/collection";
import CommentBuilder from "../builders/CommentBuilder";
import {
    APICommentData,
    APIResourceCommentData
} from "../@types";

import Comment from "../class/Comment";
import Resource from "../class/Resource";
import BaseManager from "./BaseManager";

export default class ResourceCommentManager extends BaseManager {

    private resource: Resource;
    public cache: Collection<string, Comment>;

    constructor(resource: Resource, data: APIResourceCommentData[]) {
        super(resource.client);
        this.resource = resource;
        this.cache = new Collection(data.map(c => [c.id, new Comment(this.client, this.resource, c)]));
    }

    /** Upload a new comment for this resource */
    public async add(data: CommentBuilder) {
        const json = data.setRessource(this.resource).toJSON();
        const commentData: APICommentData = await this.client.rest.postRequest("/comments", json);
        const comment = new Comment(this.client, this.resource, commentData);
        this.cache.set(comment.id, comment);
        return this.resource;
    }
    
    /** Delete a comment for this resource */
    public async delete(comment: Comment) {
        await this.client.rest.deleteRequest(`/comments/${comment.id}`);
        this.cache.delete(comment.id);
        return this.resource;
    }
}