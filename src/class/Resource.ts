import { APIResourceData } from "../@types";

import Base from "./Base";
import User from "./User";
import Client from "../client/Client";
import UserLikeBuilder from "../builders/UserLikeBuilder";

import ResourceAttachmentManager from "../managers/ResourceAttachmentManager";
import ResourceCategoryManager from "../managers/ResourceCategoryManager";
import ResourceCommentManager from "../managers/ResourceCommentManager";
import ResourceLikeManager from "../managers/ResourceLikeManager";
import ResourceValidationStateManager from "../managers/ResourceValidationStateManager";

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
    public validations: ResourceValidationStateManager;

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
        this.comments = new ResourceCommentManager(this, data.comments);
        this.likes = new ResourceLikeManager(this, data.userLikes);
        this.validations = new ResourceValidationStateManager(this);
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    private getYourLike() {
        if(this.client.auth.me) {
            const me = this.likes.cache.find(l => l.user?.id === this.client.auth.me?.id);
            if(me) {
                return me;
            }
        }
        return null;
    }

    public hasLike() {
        return this.getYourLike() ? true : false;
    }

    public like() {
        const me = this.client.auth.me;
        if(me) {
            this.likes.add(new UserLikeBuilder().setUser(me));
        }
    }

    public unlike() {
        const l = this.getYourLike();
        if(l) {
            this.likes.remove(l);
        }
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