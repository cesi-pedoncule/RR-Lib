import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import ResourceBuilder from "../builders/ResourceBuilder";
import { APIResourceData, APIValidationState } from "../@types";

/** Resource manager which allow to manipulate 
 * the resources in the api */
export default class ResourceManager extends BaseManager {

    /** Resource cache */
    public cache: Collection<string, Resource>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    public _add(data: APIResourceData) {
        const existing = this.cache.get(data.id);
        if(existing) {
            existing._patch(data);
            existing.categories.cache.forEach(c => {
                c.resources.cache.delete(existing.id);
            });
            return existing;
        }
        const resource = new Resource(this.client, data);
        this.cache.set(resource.id, resource);
        return resource;
    }

    public _remove(id: string) {
        this.cache.delete(id);
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

    /** Fetch all existing resources from the api */
    public async fetchAll() {
        const data: APIResourceData[] = await this.client.rest.getRequest("/resources");
        for(const r of data) {
            this._add(r);
        }
        return this.cache;
    }

    /** Fetch one resource with an id from the api */
    public async fetch(id: string) {
        const data: APIResourceData | null =
            await this.client.rest.getRequest(`/resources/${id}`);
        if(data) {
            return this._add(data);
        }
        return null;      
    }

    /** Create a new resource */
    public async create(builder: ResourceBuilder) {
        const data = builder.toJSON();
        const resourceData: APIResourceData =
            await this.client.rest.postRequest('/resources', data);
        let resource: Resource;
        
        if(builder.attachments.length > 0) {
            for(const a of builder.attachments) {
                a.setRessource(resourceData);
                await this.client.rest.postAttachmentResource(a);
            }
            const data: APIResourceData =
                await this.client.rest.getRequest(`/resources/${resourceData.id}`);
            resource = new Resource(this.client, data);
        }
        else {
            resource = new Resource(this.client, resourceData);
        }
        return this._add(resourceData);
    }

    /** Edit an existing resource */
    public async edit(resource: Resource) {
        const data = resource.toJSON();
        const resourceData: APIResourceData =
            await this.client.rest.putRequest(`/resources/${resource.id}`, data);
        return this._add(resourceData);
    }

    /** Delete an existing resource */
    public async delete(resource: Resource) {
        this._remove(resource.id);
        await this.client.rest.deleteRequest(`/resources/${resource.id}`);
    }
}