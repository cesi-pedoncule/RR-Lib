import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import UserFollow from "../class/UserFollow";
import { APIUserFollowData } from "../@types";
import UserFollowBuilder from "../builders/UserFollowBuilder";

/** User follow manager which allow to manipulate 
 * the user follow in the api */
export default class UserFollowManager extends BaseManager {

    /** Users caches */
    public cache: Collection<string, UserFollow>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    /** Fetch all existing user follows from the api */
    public async fetchAll() {
        const data: APIUserFollowData[] = await this.client.rest.getRequest("/user_follows");
        for(const f of data) {
            const follow = new UserFollow(this.client, f);
            this.cache.set(follow.id, follow);
        }
        return this.cache;
    }

    /** Fetch an existing user follow from the api */
    public async fetch(id: string) {
        const data: APIUserFollowData | null = await this.client.rest.getRequest(`/user_follows/${id}`);
        if(data) {
            const follow = new UserFollow(this.client, data);
            this.cache.set(follow.id, follow);
            return follow;
        }
        return null;        
    }

    /** Create a new user follow */
    public async create(builder: UserFollowBuilder) {
        this.client.auth.checkAuth();
        builder.setUser(this.client.auth.me!);
        const data = builder.toJSON();
        const followData: APIUserFollowData = await this.client.rest.postRequest('/user_follows', data);
        const follow = new UserFollow(this.client, followData);
        this.cache.set(follow.id, follow);
        return follow;
    }

    /** Delete an existing user follow */
    public async delete(follow: UserFollow) {
        await this.client.rest.deleteRequest(`/user_follows/${follow.id}`);
        this.cache.delete(follow.id);
        return follow;
    }
}