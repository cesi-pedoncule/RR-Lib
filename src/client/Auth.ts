import Client from "./Client";
import { APIUserAuthenticatedData } from "../@types";
import UserAuthenticated from "../class/UserAuthenticated";

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
    public me: UserAuthenticated | null;
    
    /** Token of user connected */
    public token: string | null;
    
    /** Refresh token of user connected */
    public refresh_token: string | null;

    private _refreshInterval: NodeJS.Timer | null;

    constructor(client: Client) {
        this.client = client;
        
        this.me = null;
        this.token = null;
        this.refresh_token = null;

        this._refreshInterval = null;
    }

    private startRefreshInterval() {
        this._refreshInterval = setInterval(() => this.refresh(), 36e5);
    }

    private clearRefreshInterval() {
        if(this._refreshInterval) {
            clearInterval(this._refreshInterval);
        }
        this._refreshInterval = null;
    }

    /** Fetch current user from API */
    public async fetchCurrentUser() {
        const data: APIUserAuthenticatedData = await this.client.rest.getRequest("/users/me", true);
        this.me = new UserAuthenticated(this.client, data);
        return this.me;
    }

    /** Throw error if user is not connected (for protected routes) */
    public checkAuth() {
        if(this.token === null) {
            throw new Error("Not authenticated");
        }     
    }

    /** Login user with username and password */
    public async login(username: string, password: string) {
        const data: LoginResponse = await this.client.rest.postRequest("/login_check", { username, password }, false, 200);
        const { token, refresh_token } = data;

        this.clearRefreshInterval();

        this.token = token;
        this.refresh_token = refresh_token;
        this.client.rest.setToken(this.token);

        this.startRefreshInterval();

        await this.fetchCurrentUser();
        return data;
    }

    /** Logout the user from the client */
    public logout() {
        this.me = null;
        this.token = null;
        this.refresh_token = null;
        this.client.rest.removeToken();
        this.clearRefreshInterval();
    }

    /**
     * Refresh auth and get new tokens
     * without login again
     */
    public async refresh() {
        const data: LoginResponse = await this.client.rest.postRequest("/token/refresh", { refresh_token: this.refresh_token }, false, 200);
        const { token, refresh_token } = data;

        this.clearRefreshInterval();

        this.token = token;
        this.refresh_token = refresh_token;
        this.client.rest.setToken(this.token);

        this.startRefreshInterval();

        await this.fetchCurrentUser();
        return data;
    }

    /** Start the password reset process by e-mail */
    public async sendResetPasswordMail(email: string) {
        await this.client.rest.postRequest("/forgot_password/", { email }, false, 204);
    }

    /** Register new password with token received by e-mail */
    public async resetPassword(token: string, newPassword: string) {
        await this.client.rest.postRequest(`/forgot_password/${token}`, { password: newPassword }, false, 204);
        this.logout();
    }
}