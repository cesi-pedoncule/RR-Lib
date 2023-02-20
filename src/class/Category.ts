import User from "./User"; 
import Base from "./Base";
import Client from "../client/Client";
import { APICategoryData } from "../@types";
import CategoryRessourceManager from "../managers/CategoryResourceManager";

export default class Category extends Base {

    public name: string;
    public isVisible: boolean;
    public createdAt: Date;
    public updatedAt: Date | null;

    public creator: User | null;
    public resources: CategoryRessourceManager;

    constructor(client: Client, data: APICategoryData) {
        super(client, data?.id, "/categories");

        this.name = data.name;
        this.isVisible = data.isVisible;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.creator = this.getCreator(data?.creator?.id);
        this.resources = new CategoryRessourceManager(this);
    }

    private getCreator(id?: string | null) {
        return id ? this.client.users.cache.get(id) ?? null : null;
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