import { Collection } from "@discordjs/collection";
import Client from "../client/Client";

import Base from "./Base";
import Resource, { ResourceData } from "./Resource";

export interface UserData {
    id: string;
    email: string;
    roles: string[];
    name: string;
    firstname: string;
    createdAt: string;
    updatedAt: string;
    isBanned: boolean;
    // ressources: Partial<RessourceData>[];
}

export default class User extends Base {

    public email: string;
    public roles: string[];
    public name: string;
    public firstname: string;
    public createdAt: Date;
    public updatedAt: Date;
    public isBanned: boolean;

    public resources: Collection<string, Resource>;

    constructor(client: Client, data: UserData) {
        super(client, data.id, "/users");

        this.email = data.email;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
        this.isBanned = data.isBanned || false;

        this.resources = this.client.resources.cache.filter(r => r.user?.id === this.id);
    }

    public toJSON() {
        return {
            id: this.id,
            email: this.email,
            name: this.name,
            firstname: this.firstname,
        }
    }
}