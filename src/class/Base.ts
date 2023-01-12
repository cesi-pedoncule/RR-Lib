import Client from "../client/Client";

export default class Base {
    
    public id: string;
    public client: Client;
    private path: string;

    constructor(client: Client, id: string, path: string) {
        this.id = id;
        this.client = client;
        this.path = path;
    }

    /** Return the iri of element */
    public getIri() {
        return `${this.path}/${this.id}`;
    }
}