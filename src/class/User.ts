import Base from "./Base";
import Client from "../client/Client";
import { APIUserData } from "../@types";
import UserResourceManager from "../managers/UserResourceManager";

export default class User extends Base {

    public email: string;
    public roles: string[];
    public name: string;
    public firstname: string;
    public createdAt: Date;
    public updatedAt: Date | null;

    public resources: UserResourceManager;

    constructor(client: Client, data: APIUserData) {
        super(client, data.id, "/users");

        this.email = data.email;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

        this.resources = new UserResourceManager(this);
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