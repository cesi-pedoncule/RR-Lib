import User from "./User";
import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";

export interface AttachmentData {
    id: string;
    fileUrl: string;
    fileName: string;
    type: string;
    createdAt: string;
    isDeleted: boolean;
}

export default class Attachment extends Base {

    public fileUrl: string;
    public fileName: string;
    public type: string;
    public createdAt: Date;
    public isDeleted: boolean;

    public user: User | null;
    public resource: Resource;

    constructor(client: Client, resource: Resource, user: User | null, data: AttachmentData) {
        super(client, data.id, "/attachments");

        this.fileUrl = data.fileUrl,
        this.fileName = data.fileName,
        this.type = data.type;
        this.createdAt = new Date(data.createdAt),
        this.isDeleted = data.isDeleted;

        this.user = user;
        this.resource = resource;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            fileName: this.fileName,
            ressource: this.resource.getIri(),
            isDeleted: this.isDeleted,
        }
    }
}