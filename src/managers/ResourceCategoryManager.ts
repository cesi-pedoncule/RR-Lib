import { Collection } from "@discordjs/collection";

import BaseManager from "./BaseManager";
import Category from "../class/Category";
import Resource from "../class/Resource";
import { APIResourceData } from "../@types";

export default class ResourceCategoryManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Categories cache from the resource */
    public cache: Collection<string, Category>;

    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = new Collection();

        for(const c of this.resource.data.categories) {
            const category = this.client.categories.cache.get(c.id);
            if(category) {
                this.cache.set(category.id, category);
            }
        }
    }

    private async putResource() {
        const json = this.resource.toJSON();
        const updated: APIResourceData =
            await this.client.rest.putRequest(`/resources/${this.resource.id}`, json);
        this.resource._patch(updated);
        return this.resource;
    }

    /** Set an array of categories for this resource */
    public set(categories: Category[]) {
        this.cache.clear();
        for(const c of categories) {
            this.cache.set(c.id, c);
        }
        return this.putResource();
    }

    /** Add a new category for this resource */
    public add(category: Category) {
        this.cache.set(category.id, category);
        return this.putResource();
    }

    /** Remove a category for this resource */
    public remove(category: Category) {
        this.cache.delete(category.id);
        return this.putResource();
    }
}