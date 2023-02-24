import { Collection } from "@discordjs/collection";

import Client from "../client/Client";
import BaseManager from "./BaseManager";
import { APIValidationStateData } from "../@types";
import ValidationState from "../class/ValidationState";
import ValidationStateBuilder from "../builders/ValidationStateBuilder";

/** Validation State manager which allow to manipulate 
 * the validations of the resources in the api */
export default class ValidationStateManager extends BaseManager {

    /** Validation cache */
    public cache: Collection<string, ValidationState>;

    constructor(client: Client) {
        super(client);
        this.cache = new Collection();
    }

    /** Fetch all existing validations state from the api */
    public async fetchAll() {
        const data: APIValidationStateData[] = await this.client.rest.getRequest("/validation_states");
        for(const v of data) {
            const validation = new ValidationState(this.client, v);
            this.cache.set(validation.id, validation);
        }
        return this.cache;
    }

    /** Fetch one validation with an id from the api */
    public async fetch(id: string) {
        const data: APIValidationStateData | null = await this.client.rest.getRequest(`/validation_states/${id}`);
        if(data) {
            const vs = new ValidationState(this.client, data);
            this.cache.set(vs.id, vs);
            return vs;
        }
        return null;
    }

    /** Create a new validation */
    public async create(validationBuilder: ValidationStateBuilder) {
        const json = validationBuilder.toJSON();
        const data: APIValidationStateData = await this.client.rest.postRequest("/validation_states", json, true);
        const vs = new ValidationState(this.client, data);
        this.cache.set(vs.id, vs);
        return vs;
    }

    /** Update one validation */
    public async update(validation: ValidationState) {
        const json = validation.toJSON();
        const data: APIValidationStateData = await this.client.rest.putRequest(`/validation_states/${json.id}`, json);
        const vs = new ValidationState(this.client, data);
        this.cache.set(vs.id, vs);
        return vs;
    }
}