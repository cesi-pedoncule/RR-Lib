import { Collection } from "@discordjs/collection";

import CommentBuilder from "../builders/CommentBuilder";
import AttachmentBuilder from "../builders/AttachmentBuilder";

import {
    APIAttachmentData,
    APICategoryData,
    APICommentData,
    APIResourceData
} from "../@types";

import Base from "./Base";
import Client from "../client/Client";
import User from "./User";
import Comment from "./Comment";
import Category from "./Category";
import Attachment from "./Attachment";

export default class Resource extends Base {

    public title: string;
    public description: string | null;
    public createdAt: Date;
    public updatedAt: Date | null;
    public isPublic: boolean;
    
    public user: User | null;
    public attachments: Collection<string, Attachment>;
    public categories: Collection<string, Category>;
    public comments: Collection<string, Comment>;

    constructor(client: Client, data: APIResourceData) {
        super(client, data.id, "/resources");

        this.title = data.title;
        this.description = data.description;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.isPublic = data.isPublic;

        this.user = this.getCreator(data.user?.id);

        this.attachments = this.buildAttachCollection(data.attachments);
        this.categories = this.buildCategoriesCollection(data.categories);
        this.comments = this.buildCommentCollection(data.comments);
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    private buildAttachCollection(attachments: Partial<APIAttachmentData>[]) {
        const collection = new Collection<string, Attachment>();
        for(const a of attachments) {
            if(!a.id || !a.fileName || !a.fileUrl || !a.type || !a.createdAt) continue;
            collection.set(a.id, new Attachment(this.client, this, this.user, a));
        }
        return collection;
    }

    private buildCategoriesCollection(categories: APICategoryData[]) {
        const collection = new Collection<string, Category>();
        for(const a of categories) {
            collection.set(a.id, new Category(this.client, a));
        }
        return collection;
    }

    private buildCommentCollection(comments: APICommentData[]) {
        const collection = new Collection<string, Comment>();
        for(const c of comments) {
            collection.set(c.id, new Comment(this.client, this, this.user, c));
        }
        return collection;
    }

    /** Upload a new attachment for this resource */
    public async addNewAttachement(data: AttachmentBuilder) {
        const json = data.setRessource(this).toJSON();
        const attachData: APIAttachmentData = await this.client.rest.postRequest("/attachments/resource", json);
        const attachment = new Attachment(this.client, this, this.client.auth.me, attachData);
        this.attachments.set(attachment.id, attachment);
        return this;
    }
    
    /** Delete a attachment for this resource */
    public async deleteAttachement(attachment: Attachment) {
        await this.client.rest.deleteRequest(`/attachments/${attachment.id}`);
        this.attachments.delete(attachment.id);
        return this;
    }

    /** Upload a new comment for this resource */
    public async addComment(data: CommentBuilder) {
        const json = data.setRessource(this).toJSON();
        const commentData: APICommentData = await this.client.rest.postRequest("/comments", json);
        const comment = new Comment(this.client, this, this.client.auth.me!, commentData);
        this.comments.set(comment.id, comment);
        return this;
    }
    
    /** Delete a comment for this resource */
    public async deleteComment(comment: Comment) {
        await this.client.rest.deleteRequest(`/comments/${comment.id}`);
        this.comments.delete(comment.id);
        return this;
    }

    /** Update the categories for this resource */
    public async setCategories(categories: Collection<string, Category>) {
        this.categories = categories;
        const json = this.toJSON();
        await this.client.rest.putRequest(`/ressources/${this.id}`, json);
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isPublic: this.isPublic,
            categories: Array.from(this.categories.keys()),
        }
    }
}