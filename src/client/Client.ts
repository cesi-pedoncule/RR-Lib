import { CreateAxiosDefaults } from "axios";

import Auth from "./Auth";
import REST from "./REST";

import UserManager from "../managers/UserManager";
import CategoryManager from "../managers/CategoryManager";
import ResourceManager from "../managers/ResourceManager";

/**
 * Client Configuration
 */
interface ClientConfig extends CreateAxiosDefaults {
    baseURL: string;
    version: "v1";
}

export default class Client {
    
    public auth: Auth;
    public rest: REST;

    public users: UserManager;
    public categories: CategoryManager;
    public resources: ResourceManager;

    /**
     * 
     * @param config Client configuration object
     */
    constructor(config?: Partial<ClientConfig>) {
        this.rest = new REST(this, config);
        this.auth = new Auth(this);

        this.categories = new CategoryManager(this);
        this.resources = new ResourceManager(this);
        this.users = new UserManager(this);
    }
}