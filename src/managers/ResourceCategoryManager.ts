import { Collection } from "@discordjs/collection";

import Category from "../class/Category";
import Resource from "../class/Resource";
import BaseManager from "./BaseManager";

export default class ResourceCategoryManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Categories cache from the resource */
    public cache: Collection<string, Category>;

    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = this.client.categories.cache.filter(c => c.resources.cache.has(resource.id));
    }

    /** Add a new category for this resource */
    public async add(category: Category) {
        this.cache.set(category.id, category);
        const json = this.resource.toJSON();
        await this.client.rest.putRequest(`/ressources/${this.resource.id}`, json);
        return this.resource;
    }

    /** Remove a category for this resource */
    public async remove(category: Category) {
        this.cache.delete(category.id);
        const json = this.resource.toJSON();
        await this.client.rest.putRequest(`/ressources/${this.resource.id}`, json);
        return this.resource;
    }
}