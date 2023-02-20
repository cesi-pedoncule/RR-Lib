import Client from "../client/Client";

export default class BaseManager {
    
    public client: Client;

    constructor(client: Client) {
        this.client = client
    }
}