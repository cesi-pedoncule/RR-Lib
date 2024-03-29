import { Collection } from "@discordjs/collection";

import User from "../class/User";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import UserLike from "../class/UserLike";
import { APIUserLikeData } from "../@types";
import UserLikeBuilder from "../builders/UserLikeBuilder";


export default class ResourceLikeManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Likes cache from the resource */
    public cache: Collection<string, UserLike>;
    
    constructor(resource: Resource) {
        super(resource.client);

        this.resource = resource;
        this.cache = new Collection();

        for(const l of this.resource.data.userLikes) {
            const like = new UserLike(this.client, this.resource, l);
            this.cache.set(like.id, like);
        }
    }

    private _add(data: APIUserLikeData) {
        const existing = this.cache.get(data.id);
        if(existing) {
            existing._patch(data);
        }
        const like = new UserLike(this.client, this.resource, data);
        this.cache.set(like.id, like);
    }

    private _remove(id: string) {
        this.cache.delete(id);
    }

    /** Check if given user has like this resource */
    public getUserLike(user: User) {
        return this.cache.find(l => l.userId === user.id) ?? null;
    }

    /** Check if authenticated user has like this resource */
    public getMeLike() {
        if(this.client.auth.me) {
            return this.getUserLike(this.client.auth.me);
        }
        return null;
    }

    /** Add a like to this Resource */
    public async add(like: UserLikeBuilder) {
        const hasPreviousLike = this.getMeLike();
        if(hasPreviousLike) {
            return this.resource;
        }
        const json = like.setResource(this.resource).toJSON();
        const likeData: APIUserLikeData = await this.client.rest.postRequest("/user_likes", json, true);
        this._add(likeData);
        return this.resource;
    }

    /** Delete an existing like to this Resource */
    public async remove(like: UserLike) {
        this._remove(like.id);
        await this.client.rest.deleteRequest(`/user_likes/${like.id}`);
        return this.resource;
    }
}