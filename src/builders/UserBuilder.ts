export interface UserDataBuilder {
    email: string,
    password: string,
    name: string,
    firstname: string
}

export default class UserBuilder implements UserDataBuilder {

    public email: string;
    public password: string;
    public name: string;
    public firstname: string;

    constructor(data?: Partial<UserDataBuilder>) {
        this.email = data?.email ?? "";
        this.password = data?.password ?? "";
        this.name = data?.name ?? "";
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

    public toJSON(): UserDataBuilder {
        return { ...this };
    }
}