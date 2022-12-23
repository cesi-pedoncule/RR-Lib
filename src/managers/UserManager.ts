import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import User, { UserData } from "../class/User";
import UserBuilder from "../builders/UserBuilder";

/** User manager which allow to manipulate 
 * the users in the api */
export default class UserManager {

    private client: Client;

    /** Users caches */
    public cache: Collection<string, User>;

    constructor(client: Client) {
        this.client = client;
        this.cache = this.buildCache();
    }

    private buildCache(): Collection<string, User> {
        const collection = new Collection<string, User>();
        if(this.client.auth.token) {
            this.fetchAll()
                .then(data => {
                    for(const a of data) collection.set(a.id, a);
                });
        }
        return collection;
    }

    /** Fetch all existing users from the api */
    public async fetchAll() {
        const data: UserData[] = await this.client.rest.getRequest("/users");
        return data.map(d => new User(this.client, d));
    }

    /** Fetch an existing user from the api */
    public async fetch(id: string){
        const data: UserData | null = await this.client.rest.getRequest(`/users/${id}`);
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
        const ressourceData: UserData = await this.client.rest.postRequest('/users', data);
        const ressource = new User(this.client, ressourceData);
        this.cache.set(ressource.id, ressource);
        return ressource;
    }

    /** Edit an existing user */
    public async edit(user: User) {
        const data = user.toJSON();
        const userData: UserData = await this.client.rest.putRequest(`/users/${user.id}`, data);
        const editUser = new User(this.client, userData);
        this.cache.set(editUser.id, editUser);
        return editUser;
    }
}