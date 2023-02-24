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
        this.cache = new Collection();

        this.fetchAll();
    }

    /** Fetch all existing resources from the api */
    public async fetchAll() {
        const data: APIResourceData[] = await this.client.rest.getRequest("/resources");
        for(const r of data) {
            const resource = new Resource(this.client, r);
            this.cache.set(resource.id, resource);
        }
        return this.cache;
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