import { APIResourceData } from "../@types";

import Base from "./Base";
import Client from "../client/Client";
import UserLikeBuilder from "../builders/UserLikeBuilder";

import ResourceAttachmentManager from "../managers/ResourceAttachmentManager";
import ResourceCategoryManager from "../managers/ResourceCategoryManager";
import ResourceCommentManager from "../managers/ResourceCommentManager";
import ResourceLikeManager from "../managers/ResourceLikeManager";
import ResourceValidationStateManager from "../managers/ResourceValidationStateManager";

/** Represents an resource */
export default class Resource extends Base {

    /** API data */
    public data: APIResourceData;

    /** The resource's title */
    public title: string;
    
    /** The resource's description */
    public description: string | null;
    
    /** Creation date */
    public createdAt: Date;

    /** Last updated date */
    public updatedAt: Date | null;
    
    /** Privacy of this resource */
    public isPublic: boolean;
    
    /** Resource's attachments manager */
    public attachments: ResourceAttachmentManager;

    /** Resource's categories manager */
    public categories: ResourceCategoryManager;
    
    /** Resource's comments manager */
    public comments: ResourceCommentManager;

    /** Resource's likes manager */
    public likes: ResourceLikeManager;

    /** Resource's validation state manager */
    public validations: ResourceValidationStateManager;

    constructor(client: Client, data: APIResourceData) {
        super(client, data.id, "/resources");

        this.data = data;
        this.title = data.title;
        this.description = data.description;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.isPublic = data.isPublic;

        this.attachments = new ResourceAttachmentManager(this);
        this.categories = new ResourceCategoryManager(this);
        this.comments = new ResourceCommentManager(this);
        this.likes = new ResourceLikeManager(this);
        this.validations = new ResourceValidationStateManager(this);
    }

    /** @deprecated */
    get user() {
        return this.getCreator();
    }

    get creator() {
        return this.getCreator();
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    /* Check if the current user like this resource */
    get isLiked() {
        return this.likes.getMeLike() ? true : false;
    }

    /** Refresh all resource managers */
    public refresh() {
        this.categories.refresh();
    }

    /* Current user like this resource */
    public like() {
        const me = this.client.auth.me;
        if(me) {
            return this.likes.add(new UserLikeBuilder().setUser(me));
        }
    }

    /* Current user unlike this resource */
    public unlike() {
        const l = this.likes.getMeLike();
        if(l) {
            return this.likes.remove(l);
        }
    }

    public _patch(data: APIResourceData) {
        this.data = data;
        this.title = data.title;
        this.description = data.description;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;
        this.isPublic = data.isPublic;

        this.attachments = new ResourceAttachmentManager(this);
        this.categories = new ResourceCategoryManager(this);
        this.comments = new ResourceCommentManager(this);
        this.likes = new ResourceLikeManager(this);
        this.validations = new ResourceValidationStateManager(this);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            isPublic: this.isPublic,
            attachments: this.attachments.cache.map(a => a.getIri()),
            categories: this.categories.cache.map(c => c.getIri()),
        }
    }
}