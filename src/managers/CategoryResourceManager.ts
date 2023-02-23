import { Collection } from "@discordjs/collection";

import Category from "../class/Category";
import Resource from "../class/Resource";
import BaseManager from "./BaseManager";

export default class CategoryRessourceManager extends BaseManager {

    /** The category this manager belongs to */
    public category: Category;
    
    /** Resources cache from the category */
    public cache: Collection<string, Resource>

    constructor(category: Category) {
        super(category.client);
        this.category = category;
        this.cache = new Collection();

        this.refresh();
    }

    /** Refresh this cache */
    public refresh() {
        for(const r of this.category.data.resources) {
            const resource = this.client.resources.cache.get(r.id);
            if(resource) {
                this.cache.set(resource.id, resource);
            }
        }
    }
}