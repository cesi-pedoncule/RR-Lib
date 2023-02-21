import User from "../class/User";
import Resource from "../class/Resource";

export interface UserLikeDataBuilder {
    user?: User;
    resource?: Resource;
}

/** Represents a resource */
export default class UserLikeBuilder implements UserLikeDataBuilder {

    public user?: User;
    public resource?: Resource;

    constructor(data?: UserLikeDataBuilder) {
        this.user = data?.user;
        this.resource = data?.resource;
    }

    public setUser(user: User) {
        this.user = user;
        return this;
    }

    public setResource(resource: Resource) {
        this.resource = resource;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            user: this.user?.getIri(),
            resource: this.resource?.getIri(),
        }
    }
}