import { Collection } from "@discordjs/collection";

import User from "../class/User";
import Client from "../client/Client";
import { APIUserData } from "../@types";
import BaseManager from "./BaseManager";
import UserBuilder from "../builders/UserBuilder";

/** User manager which allow to manipulate 
 * the users in the api */
export default class UserManager extends BaseManager {

    /** Users caches */
    public cache: Collection<string, User>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    /** Fetch all existing users from the api */
    public async fetchAll() {
        const data: APIUserData[] = await this.client.rest.getRequest("/users");
        for(const u of data) {
            const user = new User(this.client, u);
            this.cache.set(user.id, user);
        }
        return this.cache;
    }

    /** Fetch an existing user from the api */
    public async fetch(id: string) {
        const data: APIUserData | null = await this.client.rest.getRequest(`/users/${id}`);
        if(data) {
            const user = new User(this.client, data);
            this.cache.set(user.id, user);
            return user;
        }
        return null;        
    }

    /** Create a new user */
    public async create(builder: UserBuilder) {
        const data = builder.toJSON();
        const ressourceData: APIUserData = await this.client.rest.postRequest('/users', data);
        const ressource = new User(this.client, ressourceData);
        this.cache.set(ressource.id, ressource);
        return ressource;
    }

    /** Edit an existing user */
    public async edit(user: User) {
        const data = user.toJSON();
        const userData: APIUserData = await this.client.rest.putRequest(`/users/${user.id}`, data);
        const editUser = new User(this.client, userData);
        this.cache.set(editUser.id, editUser);
        return editUser;
    }
}