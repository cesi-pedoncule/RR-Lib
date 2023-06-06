import { Collection } from "@discordjs/collection";

import BaseManager from "./BaseManager";
import Category from "../class/Category";
import Resource from "../class/Resource";
import { APIValidationState } from "../@types";

export default class CategoryRessourceManager extends BaseManager {

    /** The category this manager belongs to */
    public category: Category;

    constructor(category: Category) {
        super(category.client);
        this.category = category;
    }

    /** Resources cache from the category */
    get cache(): Collection<string, Resource> {
        return this.client.resources.cache.filter(r =>
            r.categories.cache.has(this.category.id)
        );
    }

    public getValidateResources() {
        const finalCache: Collection<string, Resource> = new Collection();
        this.cache.forEach(r => {
            const last = r.validations.getLastValidationState();
            if(last && last.state === APIValidationState.Validated) {
                finalCache.set(r.id, r);
            }
        })
        return finalCache;
    }
}