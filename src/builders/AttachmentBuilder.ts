import { APIResourceData } from "../@types";
import Resource from "../class/Resource";

export type ResourceData = Resource | APIResourceData;

export interface AttachmentDataBuilder {
    file?: File;
    resource?: ResourceData;
}

/** Represents a attachment in a ressource */
export default class AttachmentBuilder implements AttachmentDataBuilder {

    public file?: File;
    public resource?: ResourceData;

    constructor(data?: Partial<AttachmentDataBuilder>) {
        this.file = data?.file;
        this.resource = data?.resource;
    }

    public setFile(file: File) {
        this.file = file;
        return this;
    }

    public setRessource(ressource: ResourceData) {
        this.resource = ressource;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            file: this.file,
            resource: this.resource?.id,
        };
    }
}