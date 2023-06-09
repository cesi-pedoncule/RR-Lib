import User from "./User";
import Client from "../client/Client";
import { APIUserAuthenticatedData } from "../@types";
import UserResourceManager from "../managers/UserResourceManager";

/** Represents an authenticated user */
export default class UserAuthenticated extends User {

    public email: string;

    constructor(client: Client, data: APIUserAuthenticatedData) {
        super(client, data);
        this.email = data.email;
    }

    public _patch(data: APIUserAuthenticatedData) {
        this.data = data;
        this.roles = data.roles;
        this.name = data.name;
        this.email = data.email;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.resources = new UserResourceManager(this);
    }

    /** Change the current password for this user */
    public async changePassword(oldPassword: string, newPassword: string) {
        await this.client.rest.putRequest("/users/me/reset_password", { oldPassword, newPassword });
        this.client.auth.logout();
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            roles: this.roles,
            email: this.email,
            firstname: this.firstname,
        }
    }
}