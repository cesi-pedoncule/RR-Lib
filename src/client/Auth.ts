import User, { UserData } from "../class/User";
import Client from "./Client";

export interface LoginResponse {
    token: string;
    refresh_token: string;
}

/**
 * Auth client for the lib.
 * Manage authentication (tokens)
 */
export default class Auth {
    
    private client: Client;
    
    /**
     * User currently logged in or null if no one
     * has logged in with their account
     */
    public me: User | null;
    
    /** Token of user connected */
    public token: string | null;
    
    /** Refresh token of user connected */
    public refresh_token: string | null;

    constructor(client: Client) {
        this.client = client;
        this.me = this.getCurrentUser();
        
        this.token = null;
        this.refresh_token = null;
    }

    private getCurrentUser(): User | null {
        this.checkAuth();
        this.client.rest.getRequest("/users/me")
        .then((data: UserData) => {
            return new User(this.client, data);
        });
        return null;
    }

    /** Throw error if user is not connected (for protected routes) */
    public checkAuth() {
        if(this.me === null) {
            throw new Error("Not authenticated");
        }     
    }

    /** Login user with username and password */
    public async login(username: string, password: string) {
        const data: LoginResponse = await this.client.rest.postRequest("/login_check", { username, password }, false, 200);
        const { token, refresh_token } = data;

        this.token = token;
        this.refresh_token = refresh_token;
        this.client.rest.setToken(this.token);
        return data;
    }

    /**
     * Refresh auth and get new tokens
     * without login again
     */
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