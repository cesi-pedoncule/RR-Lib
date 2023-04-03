import { Collection } from "@discordjs/collection";

import User from "../class/User";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import ResourceBuilder from "../builders/ResourceBuilder";

export default class UserResourceManager extends BaseManager {

    /** The user this manager belongs to */
    public user: User;

    /** Resources cache for this user */
    public cache: Collection<string, Resource>;
    
    constructor(user: User) {
        super(user.client);
        this.user = user;
        this.cache = new Collection();

        this.refresh();
    }

    /** Create a new resource for this user */
    public async create(builder: ResourceBuilder) {
        const resource = await this.client.resources.create(builder);
        this.cache.set(resource.id, resource);
        return resource;
    }

    /** Edit an existing resource for this user */
    public async edit(resource: Resource) {
        const editResource = await this.client.resources.edit(resource);
        this.cache.set(editResource.id, editResource);
        return editResource;
    }

    /** Delete an existing resource for this user */
    public async delete(resource: Resource) {
        this.cache.delete(resource.id);
        await this.client.resources.delete(resource);
        return resource;
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