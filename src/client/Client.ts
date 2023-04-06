import { CreateAxiosDefaults } from "axios";

import Auth from "./Auth";
import REST from "./REST";

import UserManager from "../managers/UserManager";
import CategoryManager from "../managers/CategoryManager";
import ResourceManager from "../managers/ResourceManager";
import ValidationStateManager from "../managers/ValidationStateManager";

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
    
    /** Auth client */
    public auth: Auth;

    /** REST client */
    public rest: REST;

    /** Users manager for this client */
    public users: UserManager;
    
    /** Categories manager for this client */
    public categories: CategoryManager;
    
    /** Ressources manager for this client */
    public resources: ResourceManager;

    /** Validations manager for this client */
    public validations: ValidationStateManager;

    constructor(config?: Partial<ClientConfig>) {
        
        this.rest = new REST(this, config);
        this.auth = new Auth(this);

        this.users = new UserManager(this);
        this.categories = new CategoryManager(this);
        this.validations = new ValidationStateManager(this);
        this.resources = new ResourceManager(this);
    }

    /** Login user with username and password */
    public async login(username: string, password: string) {
        return this.auth.login(username, password);
    }

    /** Hydrate all data in managers */
    public async fetch() {
        await this.users.fetchAll();
        await this.categories.fetchAll();
        await this.validations.fetchAll();
        await this.resources.fetchAll();

        // Refresh managers
        this.refresh();
    }

    /** Refresh managers */
    public refresh() {
        this.resources.cache.each(r => r.refresh());
    }
}