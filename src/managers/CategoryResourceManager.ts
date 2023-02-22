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
        this.cache = this.client.resources.cache.filter(r => r.categories.cache.has(category.id));
    }
}