import Client from "../client/Client";

export default class Base {
    
    /* Unique identifier */
    public id: string;
    
    /* The client that instantiated this */
    public client: Client;
    
    /* API path */
    public path: string;

    constructor(client: Client, id: string, path: string) {
        this.id = id;
        this.client = client;
        this.path = path;
    }

    /** Return the iri of element */
    public getIri() {
        return `${this.path}/${this.id}`;
    }

    public getIdByIri(iri: string) {
        return iri.split('/').pop()!;
    }
}