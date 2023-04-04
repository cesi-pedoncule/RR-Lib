import Resource from "../class/Resource";
import {
    APIResourceData,
    DocumentPickerResult
} from "../@types";

export type ResourceData = Resource | APIResourceData;

export type AttachmentDataFile = File | DocumentPickerResult;

export interface AttachmentDataBuilder {
    file?: AttachmentDataFile;
    resource?: ResourceData;
}

/** Represents a attachment in a ressource */
export default class AttachmentBuilder implements AttachmentDataBuilder {

    public file?: AttachmentDataFile;
    public resource?: ResourceData;

    constructor(data?: Partial<AttachmentDataBuilder>) {
        this.file = data?.file;
        this.resource = data?.resource;
    }

    public setFile(file: AttachmentDataFile) {
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