import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import Resource, { ResourceData } from "../class/Resource";
import ResourceBuilder from "../builders/ResourceBuilder";

export default class ResourceManager {

    private client: Client;
    public cache: Collection<string, Resource>;

    constructor(client: Client) {
        this.client = client;
        this.cache = this.buildCache();
    }

    private buildCache(): Collection<string, Resource> {
        const collection = new Collection<string, Resource>();
        this.fetchAll()
            .then(data => {
                if(Array.isArray(data)) {
                    for(const a of data) collection.set(a.id, a);             
                }
            });
        return collection;
    }

    public async fetchAll() {
        const data: ResourceData[] = await this.client.rest.getRequest("/resources");
        return data.map(d => new Resource(this.client, d));
    }

    public async fetch(id: string){
        const data: ResourceData = await this.client.rest.getRequest(`/resources/${id}`);
        const ressource = new Resource(this.client, data);
        this.cache.set(ressource.id, ressource);
        return ressource;
    }

    public async create(builder: ResourceBuilder) {
        const data = builder.toJSON();
        const ressourceData: ResourceData = await this.client.rest.postRequest('/resources', data);
        const ressource = new Resource(this.client, ressourceData);
        this.cache.set(ressource.id, ressource);
        return ressource;
    }

    public async edit(ressource: Resource) {
        const data = ressource.toJSON();
        const ressourceData: ResourceData = await this.client.rest.putRequest(`/resources/${ressource.id}`, data);
        const editRessource = new Resource(this.client, ressourceData);
        this.cache.set(editRessource.id, editRessource);
        return editRessource;
    }
}