import Base from "./Base";
import Client from "../client/Client";
import UserResourceManager from "../managers/UserResourceManager";
import {
    APIUserData,
    APIUserRole
} from "../@types";

/** Represents an user */
export default class User extends Base {

    /** API data */
    public data: APIUserData;

    /** User's email */
    public email: string;

    /** User's roles */
    public roles: APIUserRole[];

    /** User's name */
    public name: string;

    /** User's firstname */
    public firstname: string;

    /** Creation date of the account */
    public createdAt: Date;

    /** Last updated date */
    public updatedAt: Date | null;

    /** Resources manager for this user */
    public resources: UserResourceManager;

    constructor(client: Client, data: APIUserData) {
        super(client, data.id, "/users");

        this.data = data;
        this.email = data.email;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();

        this.resources = new UserResourceManager(this);
    }

    /** Refresh all user managers */
    public refresh() {
        this.resources.refresh();
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