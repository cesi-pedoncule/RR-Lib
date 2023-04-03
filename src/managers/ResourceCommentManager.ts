import { APICommentData } from "../@types";
import { Collection } from "@discordjs/collection";
import CommentBuilder from "../builders/CommentBuilder";

import Comment from "../class/Comment";
import Resource from "../class/Resource";
import BaseManager from "./BaseManager";

export default class ResourceCommentManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Comments cache from the resource */
    public cache: Collection<string, Comment>;

    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = new Collection();

        for(const c of this.resource.data.comments) {
            const comment = new Comment(this.client, this.resource, c);
            this.cache.set(comment.id, comment);
        }

        const sorted = this.sort();
        this.cache = sorted;
    }

    /** Sort comments by created date */
    public sort() {
        return this.cache.sort((c1, c2) => 
            c2.createdAt.getTime() - c1.createdAt.getTime()
        );
    }

    /** Create a new comment for this resource */
    public async create(data: CommentBuilder) {
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