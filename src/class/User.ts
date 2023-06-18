import { Collection } from "@discordjs/collection";

import Base from "./Base";
import Resource from "./Resource";
import Client from "../client/Client";
import UserFollow from "./UserFollow";

import UserResourceManager from "../managers/UserResourceManager";
import UserFollowersManager from "../managers/UserFollowersManager";
import {
    APIUserData,
    APIUserRole,
    APIUserRoleType
} from "../@types";

/** Represents an user */
export default class User extends Base {

    /** API data */
    public data: APIUserData;

    /** User's roles */
    public roles: APIUserRoleType[];

    /** User's name */
    public name: string;

    /** User's firstname */
    public firstname: string;

    /** Creation date of the account */
    public createdAt: Date;

    /** Last updated date */
    public updatedAt: Date | null;

    /** Resources manager for this user */
    public resources: UserResourceManager;

    /** Followers manager for this user */
    public followers: UserFollowersManager;

    constructor(client: Client, data: APIUserData) {
        super(client, data.id, "/users");

        this.data = data;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.resources = new UserResourceManager(this);
        this.followers = new UserFollowersManager(this);
    }

    get isSuperAdmin() {
        return this.roles.includes(APIUserRole.SuperAdmin);
    }

    get isAdmin() {
        if(this.isSuperAdmin) return this.isSuperAdmin;
        return this.roles.includes(APIUserRole.Admin);
    }

    get isModerator() {
        if(this.isAdmin) return this.isAdmin;
        return this.roles.includes(APIUserRole.Moderator);
    }

    /* Get user Resource collection whos has liked */
    get likedResources(): Collection<string, Resource> {
        return this.client.resources.cache.filter(r => r.likes.getUserLike(this) !== null);
    }

    get myFollow() {
        const me = this.client.me;
        return this.followers.cache.find(f => 
            f.user?.id === this.id && f.follower?.id === me?.id
        ) ?? null;
    }

    /* Get user follows */
    get follows() {
        return this.client.userFollows.cache.filter(f => f.follower?.id === this.id);
    }

    /* Follow this user */
    public follow(): Promise<UserFollow | null> {
        if(this.client.me) {
            return this.followers.add(this.client.me);
        }
        return new Promise(res => res(null));
    }

    /* Unfollow this user */
    public unfollow(): Promise<UserFollow | null> {
        if(this.client.me) {
            return this.followers.remove(this.client.me);
        }
        return new Promise(res => res(null));
    }

    public _patch(data: APIUserData) {
        this.data = data;
        this.roles = data.roles;
        this.name = data.name;
        this.firstname = data.firstname;
        this.createdAt = new Date(data.createdAt);
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : null;

        this.resources = new UserResourceManager(this);
    }

    /** Return data for api request */
    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            roles: this.roles,
            firstname: this.firstname,
        }
    }
}