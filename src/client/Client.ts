import { CreateAxiosDefaults } from "axios";

import Auth from "./Auth";
import REST from "./REST";

import UserManager from "../managers/UserManager";
import CategoryManager from "../managers/CategoryManager";
import ResourceManager from "../managers/ResourceManager";

/** Client configuration object */
export interface ClientConfig extends CreateAxiosDefaults {
    baseURL: string;
    version: "v1";
}

/**
 * Main client of the lib.
 * Everything you need is here
 */
export default class Client {
    
    public auth: Auth;
    public rest: REST;

    /** Users manager for this client */
    public users: UserManager;
    
    /** Categories manager for this client */
    public categories: CategoryManager;
    
    /** Ressources manager for this client */
    public resources: ResourceManager;

    constructor(config?: Partial<ClientConfig>) {
        
        this.rest = new REST(this, config);
        this.auth = new Auth(this);

        this.categories = new CategoryManager(this);
        this.resources = new ResourceManager(this);
        this.users = new UserManager(this);
    }
}