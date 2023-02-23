import { Collection } from "@discordjs/collection";

import User from "../class/User";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";

export default class UserResourceManager extends BaseManager {

    /** The user this manager belongs to */
    public user: User;

    /** Resources cache for this user */
    public cache: Collection<string, Resource>;
    
    constructor(user: User) {
        super(user.client);
        this.user = user;
        this.cache = this.client.resources.cache.filter(r => r.user?.id === user.id);
    }

    /** Refresh this cache */
    public refresh() {
        for(const r of this.user.data.resources) {
            const resource = this.client.resources.cache.get(r.id);
            if(resource) {
                this.cache.set(resource.id, resource);
            }
        }
    }
}