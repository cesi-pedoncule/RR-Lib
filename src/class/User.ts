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
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.resources = new UserResourceManager(this);
    }

    get isSuperAdmin() {
        return this.roles.includes(APIUserRole.SuperAdmin);
    }

    get isAdmin() {
        if(this.isSuperAdmin) return this.isSuperAdmin;
        return this.roles.includes(APIUserRole.Admin);
    }

    get isModerator() {
        if(this.isAdmin) return this.isAdmin;
        return this.roles.includes(APIUserRole.Moderator);
    }

    public _patch(data: APIUserData) {
        this.data = data;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.resources = new UserResourceManager(this);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            roles: this.roles,
            firstname: this.firstname,
        }
    }
}