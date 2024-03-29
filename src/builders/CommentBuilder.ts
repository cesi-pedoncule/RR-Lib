import Resource from "../class/Resource";

export interface CommentDataBuilder {
    comment: string;
    resource?: Resource;
}

/** Represents a comment in a resource */
export default class CommentBuilder implements CommentDataBuilder {
    
    public comment: string;
    public resource?: Resource;

    constructor(data?: Partial<CommentDataBuilder>) {
        this.comment = data?.comment ?? "";
        this.resource = data?.resource;
    }

    public setComment(text: string) {
        this.comment = text;
        return this;
    }

    public setRessource(ressource: Resource) {
        this.resource = ressource;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            comment: this.comment,
            resource: this.resource?.getIri(),
        };
    }
}