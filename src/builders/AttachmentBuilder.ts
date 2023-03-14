import Ressource from "../class/Resource";

export interface AttachmentDataBuilder {
    file?: File;
    resource?: Ressource;
}

/** Represents a attachment in a ressource */
export default class AttachmentBuilder implements AttachmentDataBuilder {

    public file?: File;
    public resource?: Ressource;

    constructor(data?: Partial<AttachmentDataBuilder>) {
        this.file = data?.file;
        this.resource = data?.resource;
    }

    public setFile(file: File) {
        this.file = file;
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
            resource: this.resource?.getIri(),
        };
    }
}