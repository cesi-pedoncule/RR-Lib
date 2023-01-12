import Ressource from "../class/Resource";

export interface AttachmentDataBuilder {
    file: string;
    resource?: Ressource;
}

/** Represents a attachment in a ressource */
export default class AttachmentBuilder implements AttachmentDataBuilder {

    public file: string;
    public resource?: Ressource;

    constructor(data?: Partial<AttachmentDataBuilder>) {
        this.file = data?.file ?? "";
        this.resource = data?.resource;
    }

    public setData(data: string) {
        this.file = data;
        return this;
    }

    public setRessource(ressource: Ressource) {
        this.resource = ressource;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            file: this.file,
            ressource: this.resource?.getIri(),
        };
    }
}