import { APIResourceData } from "../@types";

import Base from "./Base";
import User from "./User";
import Client from "../client/Client";

import ResourceAttachmentManager from "../managers/ResourceAttachmentManager";
import ResourceCategoryManager from "../managers/ResourceCategoryManager";
import ResourceCommentManager from "../managers/ResourceCommentManager";
import ResourceLikeManager from "../managers/ResourceLikeManager";

export default class Resource extends Base {

    public title: string;
    public description: string | null;
    public createdAt: Date;
    public updatedAt: Date | null;
    public isPublic: boolean;
    
    public user: User | null;
    public attachments: ResourceAttachmentManager;
    public categories: ResourceCategoryManager;
    public comments: ResourceCommentManager;
    public likes: ResourceLikeManager;

    constructor(client: Client, data: APIResourceData) {
        super(client, data.id, "/resources");

        this.title = data.title;
        this.description = data.description;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.isPublic = data.isPublic;

        this.user = this.getCreator(data.user?.id);

        this.attachments = new ResourceAttachmentManager(this, data.attachments);
        this.categories = new ResourceCategoryManager(this);
        this.comments = new ResourceCommentManager(this);
        this.likes = new ResourceLikeManager(this, data.userLikes);
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isPublic: this.isPublic,
            categories: Array.from(this.categories.cache.keys()),
        }
    }
}