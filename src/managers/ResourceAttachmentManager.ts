import { Collection } from "@discordjs/collection";

import BaseManager from "./BaseManager";
import Resource from "../class/Resource";
import Attachment from "../class/Attachment";
import AttachmentBuilder from "../builders/AttachmentBuilder";

export default class ResourceAttachmentManager extends BaseManager {

    /** The resource this manager belongs to */
    public resource: Resource;

    /** Attachments cache from the resource */
    public cache: Collection<string, Attachment>;

    constructor(resource: Resource) {
        super(resource.client);
        this.resource = resource;
        this.cache = new Collection();

        for(const a of this.resource.data.attachments) {
            this.cache.set(a.id, new Attachment(this.client, this.resource, null, a));
        }
    }

    /** Upload a new attachment for this resource */
    public async create(data: AttachmentBuilder) {
        const attachData = await this.client.rest.postAttachmentResource(data);
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