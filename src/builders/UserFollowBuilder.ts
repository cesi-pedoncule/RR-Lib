import User from "../class/User";

export interface UserFollowDataBuilder {
    user?: User;
    follower?: User;
}

/** Represents a UserFollow */
export default class UserFollowBuilder implements UserFollowDataBuilder {

    public user?: User;
    public follower?: User;

    constructor(data?: UserFollowDataBuilder) {
        this.user = data?.user;
        this.follower = data?.follower;
    }

    public setUser(user: User) {
        this.user = user;
        return this;
    }

    public setFollower(follower: User) {
        this.follower = follower;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            user: this.user?.getIri(),
            follower: this.follower?.getIri(),
        }
    }
}