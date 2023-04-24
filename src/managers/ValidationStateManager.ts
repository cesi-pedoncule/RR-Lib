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

    public _add(data: APIValidationStateData) {
        const existing = this.cache.get(data.id);
        if(existing) {
            existing._patch(data);
            return existing;
        }
        const validation = new ValidationState(this.client, data);
        this.cache.set(validation.id, validation);
        return validation;
    }

    public _remove(id: string) {
        this.cache.delete(id);
    }

    /** Fetch all existing validations state from the api */
    public async fetchAll() {
        const data: APIValidationStateData[] = await this.client.rest.getRequest("/validation_states");
        for(const v of data) {
            this._add(v);
        }
        return this.cache;
    }

    /** Fetch one validation with an id from the api */
    public async fetch(id: string) {
        const data: APIValidationStateData | null = await this.client.rest.getRequest(`/validation_states/${id}`);
        if(data) {
            return this._add(data);
        }
        return null;
    }

    /** Create a new validation */
    public async create(validationBuilder: ValidationStateBuilder) {
        const json = validationBuilder.toJSON();
        const data: APIValidationStateData = await this.client.rest.postRequest("/validation_states", json, true);
        return this._add(data);
    }
}