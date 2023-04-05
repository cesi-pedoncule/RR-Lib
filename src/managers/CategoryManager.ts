import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import Category from "../class/Category";
import { APICategoryData } from "../@types";
import CategoryBuilder from "../builders/CategoryBuilder";

/** Category manager which allow to manipulate 
 * the categories in the api */
export default class CategoryManager extends BaseManager {

    /** Categories cache */
    public cache: Collection<string, Category>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    public _add(data: APICategoryData) {
        const existing = this.cache.get(data.id);
        if(existing) {
            existing._patch(data);
            return existing;
        }
        const category = new Category(this.client, data);
        this.cache.set(category.id, category);
        return category;
    }

    public _remove(id: string) {
        this.cache.delete(id);
    }

    /** Fetch all existing categories from the api */
    public async fetchAll() {
        const data: APICategoryData[] =
            await this.client.rest.getRequest("/categories");
        for(const c of data) {
            this._add(c);
        }
        return this.cache;
    }

    /** Fetch one category with an id from the api */
    public async fetch(id: string) {
        const data: APICategoryData | null =
            await this.client.rest.getRequest(`/categories/${id}`);
        if(data) {
            return this._add(data);
        }
        return null;
    }

    /** Create a new category */
    public async create(builder: CategoryBuilder) {
        const data = builder.toJSON();
        const categoryData: APICategoryData =
            await this.client.rest.postRequest('/categories', data);
        return this._add(categoryData);
    }

    /** Edit an existing category */
    public async edit(category: Category) {
        const data = category.toJSON();
        const categoryData: APICategoryData =
            await this.client.rest.putRequest(`/categories/${data.id}`, data);
        return this._add(categoryData);
    }

    /** Delete an existing category */
    public async delete(category: Category) {
        await this.client.rest.deleteRequest(`/categories/${category.id}`);
        this._remove(category.id);
    }
}