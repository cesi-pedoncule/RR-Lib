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

    private resource: Resource;
    public cache: Collection<string, UserLike>;
    
    constructor(resource: Resource, data: APIResourceUserLikeData[]) {
        super(resource.client);

        this.resource = resource;
        this.cache = new Collection(data.map(l => [l.id, new UserLike(this.client, this.resource, l)]));
    }

    public async add(like: UserLikeBuilder) {
        const json = like.setResource(this.resource).toJSON();
        const likeData: APIUserLikeData = await this.client.rest.postRequest("/user_likes", json, true);
        const userLike = new UserLike(this.client, this.resource, likeData);
        this.cache.set(userLike.id, userLike);
        return this.resource;
    }

    public async remove(like: UserLike) {
        await this.client.rest.deleteRequest(`/user_likes/${like.id}`);
        this.cache.delete(like.id);
        return this.resource;
    }
}