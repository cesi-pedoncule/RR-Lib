import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import CategoryBuilder from "../builders/CategoryBuilder";
import Category, { CategoryData } from "../class/Category";

/** Category manager which allow to manipulate 
 * the categories in the api */
export default class CategoryManager {

    private client: Client;

    /** Categories cache */
    public cache: Collection<string, Category>;

    constructor(client: Client) {
        this.client = client;
        this.cache = this.buildCache();
    }

    private buildCache(): Collection<string, Category> {
        const collection = new Collection<string, Category>();
        this.fetchAll()
            .then(data => {
                if(Array.isArray(data)) {
                    for(const c of data) collection.set(c.id, c);             
                }
            });
        return collection;
    }

    /** Fetch all existing users from the api */
    public async fetchAll() {
        const data: CategoryData[] = await this.client.rest.getRequest("/categories");
        return data.map(d => new Category(this.client, d));
    }

    /** Fetch one category with an id from the api */
    public async fetch(id: string){
        const data: CategoryData | null = await this.client.rest.getRequest(`/categories/${id}`);
        if(data) {
            const category = new Category(this.client, data);
            this.cache.set(category.id, category);
            return category;
        }
        return null;
    }

    /** Create a new category */
    public async create(builder: CategoryBuilder) {
        const data = builder.toJSON();
        const categoryData: CategoryData = await this.client.rest.postRequest('/categories', data);
        const category = new Category(this.client, categoryData);
        this.cache.set(category.id, category);
        return category;
    }

    /** Edit an existing category */
    public async edit(category: Category) {
        const data = category.toJSON();
        const categoryData: CategoryData = await this.client.rest.putRequest(`/categories/${data.id}`, data);
        const editCategory = new Category(this.client, categoryData);
        this.cache.set(editCategory.id, editCategory);
        return editCategory;
    }
}