import User, { UserData } from "../class/User";
import Client from "./Client";

export interface LoginResponse {
    token: string;
    refresh_token: string;
}

export default class Auth {
    
    private client: Client;
    public me: User | null;
    
    public token: string | null;
    public refresh_token: string | null;

    constructor(client: Client) {
        this.client = client;
        this.me = this.getCurrentUser();
        
        this.token = null;
        this.refresh_token = null;
    }

    private getCurrentUser() {
        this.checkAuth();
        this.client.rest.getRequest("/users/me")
        .then((data: UserData) => {
            return new User(this.client, data);
        });
        return null;
    }

    public checkAuth() {
        if(this.me === null) {
            throw new Error("Not authenticated");
        }     
    }

    public async login(username: string, password: string) {
        const data: LoginResponse = await this.client.rest.postRequest("/login_check", { username, password }, false, 200);
        const { token, refresh_token } = data;

        this.token = token;
        this.refresh_token = refresh_token;
        this.client.rest.setToken(this.token);
        return data;
    }

    public async refresh() {
        this.checkAuth();
        const data: LoginResponse = await this.client.rest.postRequest("/token/refresh", { refresh_token: this.refresh_token }, false, 200);
        const { token, refresh_token } = data;

        this.token = token;
        this.refresh_token = refresh_token;
        this.client.rest.setToken(this.token);
        return data;
    }
}