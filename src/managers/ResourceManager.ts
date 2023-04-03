import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import { APIResourceData, APIValidationState } from "../@types";
import ResourceBuilder from "../builders/ResourceBuilder";

/** Resource manager which allow to manipulate 
 * the resources in the api */
export default class ResourceManager extends BaseManager {

    /** Resource cache */
    public cache: Collection<string, Resource>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    public getValidateResources() {
        return this.cache.filter(r => 
            r.validations.getLastValidationState().state === APIValidationState.Validated
        );
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
            const resource = new Resource(this.client, data);
            this.cache.set(resource.id, resource);
            return resource;
        }
        return null;      
    }

    /** Create a new resource */
    public async create(builder: ResourceBuilder) {
        const data = builder.toJSON();
        const ressourceData: APIResourceData = await this.client.rest.postRequest('/resources', data);
        const resource = new Resource(this.client, ressourceData);
        this.cache.set(resource.id, resource);
        this.refreshCategoryManager(resource)
        return resource;
    }

    /** Edit an existing resource */
    public async edit(resource: Resource) {
        const data = resource.toJSON();
        const resourceData: APIResourceData = await this.client.rest.putRequest(`/resources/${resource.id}`, data);
        const editResource = new Resource(this.client, resourceData);
        this.cache.set(editResource.id, editResource);
        this.refreshCategoryManager(editResource);
        return editResource;
    }

    /** Delete an existing resource */
    public async delete(resource: Resource) {
        await this.client.rest.deleteRequest(`/resources/${resource.id}`);
        this.cache.delete(resource.id);
        return resource;
    }

    private refreshCategoryManager(resource: Resource) {
        resource.categories.cache.forEach((c) => {
            c.client.resources.cache.set(resource.id, resource);
            c.resources.cache.set(resource.id, resource);
        });
    }
}