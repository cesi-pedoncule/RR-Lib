import { Collection } from "@discordjs/collection";

import User from "../class/User";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import ResourceBuilder from "../builders/ResourceBuilder";

export default class UserResourceManager extends BaseManager {

    /** The user this manager belongs to */
    public user: User;
    
    constructor(user: User) {
        super(user.client);
        this.user = user;
    }

    /** Resources cache for this user */
    get cache(): Collection<string, Resource> {
        return this.client.resources.cache.filter(r =>
            r.creator?.id === this.user.id
        );
    }

    /** Create a new resource for this user */
    public create(builder: ResourceBuilder) {
        return this.client.resources.create(builder);
    }

    /** Edit an existing resource for this user */
    public edit(resource: Resource) {
        return this.client.resources.edit(resource);
    }

    /** Delete an existing resource for this user */
    public delete(resource: Resource) {
        return this.client.resources.delete(resource);
    }
}