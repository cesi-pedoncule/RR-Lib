import axios, { 
    AxiosInstance,
    CreateAxiosDefaults
} from 'axios';
import Client from './Client';

type RequestMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestConfig {
    method: RequestMethod;
    waitedStatus: number;
    needAuth: boolean;
    data?: object;
}

export default class REST {

    private client: Client;
    public instance: AxiosInstance;
    
    constructor(client: Client, RESTConfig?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            baseURL: "https://rr-api.aymeric-cucherousset.fr",

            // Apply given config
            ...RESTConfig
        });
        this.client = client;
    }

    public setToken(token: string) {
        this.instance.defaults.headers["Authorization"] = `bearer ${token}`;
    }

    private async sendRequest(url: string, config: RequestConfig) {
        if(config.needAuth) {
            this.client.auth.checkAuth();
        }
        const response = await this.instance({
            url,
            method: config.method,
            data: config.data
        });

        if(response.status === config.waitedStatus) {
            return response.data;
        }

        throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    public async getRequest(url: string, needAuth = false) {
        return this.sendRequest(url, {
            method: "GET",
            waitedStatus: 200,
            needAuth,
        });
    }

    public async postRequest(url: string, data: object, needAuth = true, waitedStatus = 201) {
        return this.sendRequest(url, {
            method: "POST",
            waitedStatus,
            needAuth,
            data,
        });
    }

    public async putRequest(url: string, data: object) {
        return this.sendRequest(url, {
            method: "PUT",
            waitedStatus: 200,
            needAuth: true,
            data,
        });
    }

    public async deleteRequest(url: string) {
        return this.sendRequest(url, {
            method: "DELETE",
            waitedStatus: 2004,
            needAuth: true,
        });
    }
}