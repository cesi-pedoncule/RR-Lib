import Client from "../client/Client";

export default class BaseManager {
    
    /** The client that instantiated this Manager */
    public client: Client;

    constructor(client: Client) {
        this.client = client
    }
}