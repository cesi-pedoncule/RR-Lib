import { Collection } from "@discordjs/collection";

import Attachment from "../class/Attachment";
import Resource from "../class/Resource";
import BaseManager from "./BaseManager";
import { APIAttachmentData, APIResourceAttachmentData } from "../@types";
import AttachmentBuilder from "../builders/AttachmentBuilder";

export default class ResourceAttachmentManager extends BaseManager {

    private resource: Resource;
    public cache: Collection<string, Attachment>;

    constructor(resource: Resource, data: APIResourceAttachmentData[]) {
        super(resource.client);
        this.resource = resource;
        this.cache = this.buildAttachmentCache(data);
    }

    private buildAttachmentCache(data: APIResourceAttachmentData[]) {
        const final: Collection<string, Attachment> = new Collection();
        for(const a of data) {
            final.set(a.id, new Attachment(this.client, this.resource, null, a));
        }
        return final;
    }

    /** Upload a new attachment for this resource */
    public async add(data: AttachmentBuilder) {
        const json = data.setRessource(this.resource).toJSON();
        const attachData: APIAttachmentData = await this.client.rest.postRequest("/attachments/resource", json);
        const attachment = new Attachment(this.client, this.resource, this.client.auth.me, attachData);
        this.cache.set(attachment.id, attachment);
        return this.resource;
    }
    
    /** Delete a attachment for this resource */
    public async delete(attachment: Attachment) {
        await this.client.rest.deleteRequest(`/attachments/${attachment.id}`);
        this.cache.delete(attachment.id);
        return this.resource;
    }
}