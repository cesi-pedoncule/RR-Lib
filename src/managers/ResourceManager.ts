import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import { APIResourceData } from "../@types";
import ResourceBuilder from "../builders/ResourceBuilder";

/** Resource manager which allow to manipulate 
 * the resources in the api */
export default class ResourceManager extends BaseManager {

    /** Resource cache */
    public cache: Collection<string, Resource>;

    constructor(client: Client) {
        super(client);
        this.cache = this.buildCache();
    }

    private buildCache() {
        const collection = new Collection<string, Resource>();
        this.fetchAll()
            .then(data => {
                if(Array.isArray(data)) {
                    for(const a of data) collection.set(a.id, a);             
                }
            });
        return collection;
    }

    /** Fetch all existing resources from the api */
    public async fetchAll() {
        const data: APIResourceData[] = await this.client.rest.getRequest("/resources");
        return data.map(d => new Resource(this.client, d));
    }

    /** Fetch one resource with an id from the api */
    public async fetch(id: string) {
        const data: APIResourceData | null = await this.client.rest.getRequest(`/resources/${id}`);
        if(data) {
            const ressource = new Resource(this.client, data);
            this.cache.set(ressource.id, ressource);
            return ressource;
        }
        return null;      
    }

    /** Create a new resource */
    public async create(builder: ResourceBuilder) {
        const data = builder.toJSON();
        const ressourceData: APIResourceData = await this.client.rest.postRequest('/resources', data);
        const ressource = new Resource(this.client, ressourceData);
        this.cache.set(ressource.id, ressource);
        return ressource;
    }

    /** Edit an existing resource */
    public async edit(ressource: Resource) {
        const data = ressource.toJSON();
        const ressourceData: APIResourceData = await this.client.rest.putRequest(`/resources/${ressource.id}`, data);
        const editRessource = new Resource(this.client, ressourceData);
        this.cache.set(editRessource.id, editRessource);
        return editRessource;
    }
}