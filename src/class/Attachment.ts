import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceAttachmentData } from "../@types";

/**
 * Represents an attachment
 * WARNING: You can't upload a real file yet
 */
export default class Attachment extends Base {

    public fileUrl: string;
    public type: string;
    public fileName: string;
    public createdAt: Date;
    public data: APIResourceAttachmentData;
    
    /** Resource of this attachment */
    public resource: Resource;

    constructor(client: Client, resource: Resource, data: APIResourceAttachmentData) {
        super(client, data.id, "/attachments");

        this.fileUrl = data.fileUrl;
        this.type = data.type;
        this.fileName = data.fileName;
        this.createdAt = new Date(data.createdAt);
        this.data = data;

        this.resource = resource;
    }

    /** User who have create this attachment */
    get creator() {
        return this.resource.creator;
    }

    public _patch(data: APIResourceAttachmentData) {
        this.data = data;
        this.fileUrl = data.fileUrl;
        this.type = data.type;
        this.fileName = data.fileName;
        this.createdAt = new Date(data.createdAt);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            fileName: this.fileName,
            ressource: this.resource.getIri(),
        }
    }
}