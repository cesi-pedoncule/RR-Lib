import User from "../class/User";
import BaseManager from "./BaseManager";
import UserFollow from "../class/UserFollow";
import UserFollowBuilder from "../builders/UserFollowBuilder";

/** User followers manager which allow to manipulate 
 * the user followers */
export default class UserFollowersManager extends BaseManager {

    /** The user this manager belongs to */
    public user: User;

    constructor(user: User) {
        super(user.client);
        this.user = user;
    }

    get cache() {
        return this.client.userFollows.cache.filter(f => f.follower?.id === this.user.id);
    }

    /** Add a new user follow */
    public async add(follower: User): Promise<UserFollow | null> {
        const builder = new UserFollowBuilder();
        builder.setUser(this.user).setFollower(follower);
        return this.client.userFollows.create(builder);
    }

    /** Remove an existing user follow */
    public async remove(follower: User): Promise<UserFollow | null> {
        const follow = this.cache.find(f => f.follower?.id === follower.id);
        if(follow) {
            return this.client.userFollows.delete(follow);
        }
        return null;
    }
}