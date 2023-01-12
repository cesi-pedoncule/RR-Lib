export interface UserDataBuilder {
    email: string,
    name: string,
    password: string,
    firstname: string
}

/** Represents a user */
export default class UserBuilder implements UserDataBuilder {

    public email: string;
    public name: string;
    public password: string;
    public firstname: string;

    constructor(data?: Partial<UserDataBuilder>) {
        this.email = data?.email ?? "";
        this.name = data?.name ?? "";
        this.password = data?.password ?? "";
        this.firstname = data?.firstname ?? "";
    }

    public setEmail(email: string) {
        this.email = email;
        return this;
    }

    public setPassword(password: string) {
        this.password = password;
        return this;
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public setFirstname(firstname: string) {
        this.firstname = firstname;
        return this;
    }

    /** Return data for api request */
    public toJSON(): UserDataBuilder {
        return { ...this };
    }
}