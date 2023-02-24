import { Collection } from "@discordjs/collection";

import Resource from "../class/Resource";
import UserLike from "../class/UserLike";
import BaseManager from "./BaseManager";
import UserLikeBuilder from "../builders/UserLikeBuilder";
import {
    APIResourceUserLikeData,
    APIUserLikeData
} from "../@types";

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

    /** Check if authenticated user has like this resource */
    public getMeLike() {
        if(this.client.auth.me) {
            const me = this.cache.find(l => l.user?.id === this.client.auth.me?.id);
            if(me) {
                return me;
            }
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
        const userLike = new UserLike(this.client, this.resource, likeData);
        this.cache.set(userLike.id, userLike);
        return this.resource;
    }

    /** Delete an existing like to this Resource */
    public async remove(like: UserLike) {
        await this.client.rest.deleteRequest(`/user_likes/${like.id}`);
        this.cache.delete(like.id);
        return this.resource;
    }
}