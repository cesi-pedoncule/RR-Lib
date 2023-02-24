import User from "./User"; 
import Base from "./Base";
import Client from "../client/Client";
import { APICategoryData } from "../@types";
import CategoryResourceManager from "../managers/CategoryResourceManager";

/** Represents an category */
export default class Category extends Base {

    /** API data */
    public data: APICategoryData;

    /** Name of this category */
    public name: string;
    
    /** Visiblity of this category */
    public isVisible: boolean;
    
    /** Creation date */
    public createdAt: Date;
    
    /** Last updated date */
    public updatedAt: Date | null;

    /** User have created this category */
    public creator: User | null;

    /** Linked resource */
    public resources: CategoryResourceManager;

    constructor(client: Client, data: APICategoryData) {
        super(client, data?.id, "/categories");

        this.data = data;
        this.name = data.name;
        this.isVisible = data.isVisible;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.creator = this.getCreator(this.data.creator?.id);
        this.resources = new CategoryResourceManager(this);
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
    }

    /** Refresh all category managers */
    public refresh() {
        this.resources.refresh();
        this.creator = this.getCreator(this.data.creator?.id);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            isVisible: this.isVisible,
        }
    }
}