import axios, { 
    AxiosInstance,
    CreateAxiosDefaults
} from 'axios';
import { APIResourceAttachmentData } from '../@types';
import AttachmentBuilder from '../builders/AttachmentBuilder';
import Client from './Client';

export enum RequestMethod {
    Get = "GET",
    Post = "POST",
    Put = "PUT",
    Delete = "Delete"
};

export interface RequestConfig {
    method: RequestMethod;
    waitedStatus: number;
    needAuth: boolean;
    data?: object;
}

/**
 * REST client for the lib
 * All requests are here
 */
export default class REST {

    private client: Client;
    private instance: AxiosInstance;
    
    constructor(client: Client, RESTConfig?: CreateAxiosDefaults<any>) {
        this.instance = axios.create({
            baseURL: "https://api.ressourcesrelationnelles.social",

            // Apply given config
            ...RESTConfig
        });
        this.client = client;
    }

    /** Set token in Authorization header */
    public setToken(token: string) {
        this.instance.defaults.headers["Authorization"] = `bearer ${token}`;
    }

    /** Remove token in Authorization header */
    public removeToken() {
        delete this.instance.defaults.headers["Authorization"];
    }

    private async sendRequest(url: string, config: RequestConfig): Promise<any | null> {
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

        if(response.status === 404) {
            return null;
        }

        throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    /** Upload file in a resource */
    public async postAttachmentResource(attachmentBuilder: AttachmentBuilder) {
        
        this.client.auth.checkAuth();

        if(!attachmentBuilder.file || !attachmentBuilder.resource) {
            throw new Error("Error: Thanks to provide a valid file and resource");
        }

        const formData = new FormData();
        formData.append('resource', attachmentBuilder.resource.id);

        if(attachmentBuilder.file instanceof File) {
            formData.append('file', attachmentBuilder.file, attachmentBuilder.file.name);
        }
        else {
            const file = attachmentBuilder.file;
            const dataFile: any = {
                uri: file.uri,
                name: file.name,
                type: file.mimeType,
            }
            formData.append('file', dataFile);
        }
        
        const response = await this.instance({
            url: "/attachments/resource",
            method: RequestMethod.Post,
            headers: {
                "Content-Type": "multipart/form-data",
            },
            data: formData
        });

        if(response.status === 201) {
            return response.data as APIResourceAttachmentData;
        }

        throw new Error(`Error ${response.status}, ${response.statusText}`);
    }

    /** Send a get request to the API */
    public async getRequest(url: string, needAuth = false) {
        return this.sendRequest(url, {
            method: RequestMethod.Get,
            waitedStatus: 200,
            needAuth,
        });
    }

    /** Send a post request to the API */
    public async postRequest(url: string, data: object, needAuth = true, waitedStatus = 201) {
        return this.sendRequest(url, {
            method: RequestMethod.Post,
            waitedStatus,
            needAuth,
            data,
        });
    }

    /** Send a put request to the API */
    public async putRequest(url: string, data: object) {
        return this.sendRequest(url, {
            method: RequestMethod.Put,
            waitedStatus: 200,
            needAuth: true,
            data,
        });
    }

    /** Send a delete request to the API */
    public async deleteRequest(url: string) {
        return this.sendRequest(url, {
            method: RequestMethod.Delete,
            waitedStatus: 204,
            needAuth: true,
        });
    }
}