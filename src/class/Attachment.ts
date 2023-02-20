import User from "./User";
import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";
import { APIResourceAttachmentData } from "../@types";

export default class Attachment extends Base {

    public fileUrl: string;
    public type: string;
    public fileName: string;
    public createdAt: Date;

    public user: User | null;
    public resource: Resource;

    constructor(client: Client, resource: Resource, user: User | null, data: APIResourceAttachmentData) {
        super(client, data.id, "/attachments");

        this.fileUrl = data.fileUrl;
        this.type = data.type;
        this.fileName = data.fileName;
        this.createdAt = new Date(data.createdAt);

        this.user = user;
        this.resource = resource;
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