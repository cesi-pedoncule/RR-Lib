import Client from "../client/Client";

export default class Base {
    
    public client: Client;
    public id: string;
    private path: string;

    constructor(client: Client, id: string, path: string) {
        this.client = client;
        this.id = id;
        this.path = path;
    }

    public getIri() {
        return `${this.path}/${this.id}`;
    }
}