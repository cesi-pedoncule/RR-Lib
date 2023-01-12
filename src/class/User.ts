import { Collection } from "@discordjs/collection";

import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";

export interface UserData {
    id: string;
    email: string;
    roles: string[];
    name: string;
    firstname: string;
    createdAt: string;
    updatedAt: string | null;
    isBanned: boolean;
}

export default class User extends Base {

    public email: string;
    public roles: string[];
    public name: string;
    public firstname: string;
    public createdAt: Date;
    public updatedAt: Date | null;
    public isBanned: boolean;

    public resources: Collection<string, Resource>;

    constructor(client: Client, data: UserData) {
        super(client, data.id, "/users");

        this.email = data.email;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.isBanned = data.isBanned || false;

        this.resources = this.client.resources.cache.filter(r => r.user?.id === this.id);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            firstname: this.firstname,
        }
    }
}