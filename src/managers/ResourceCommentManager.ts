import { Collection } from "@discordjs/collection";

import Comment from "../class/Comment";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import CommentBuilder from "../builders/CommentBuilder";

import {
    APICommentData,
    APIResourceCommentData,
} from "../@types";

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
            this._add(c);
        }
        this.sort();
    }

    private _add(data: APIResourceCommentData) {
        const existing = this.cache.get(data.id);
        if(existing) {
            existing._patch(data);
        }
        const comment = new Comment(this.client, this.resource, data);
        this.cache.set(comment.id, comment);
    }

    private _remove(id: string) {
        this.cache.delete(id);
    }

    /** Sort comments by created date */
    public sort() {
        this.cache.sort((c1, c2) => 
            c2.createdAt.getTime() - c1.createdAt.getTime()
        );
        return this.cache;
    }

    /** Create a new comment for this resource */
    public async create(data: CommentBuilder) {
        const json = data.setRessource(this.resource).toJSON();
        const commentData: APICommentData = await this.client.rest.postRequest("/comments", json);
        this._add(commentData);
        return this.resource;
    }
    
    /** Delete a comment for this resource */
    public async delete(comment: Comment) {
        this._remove(comment.id);
        await this.client.rest.deleteRequest(`/comments/${comment.id}`);
        return this.resource;
    }
}