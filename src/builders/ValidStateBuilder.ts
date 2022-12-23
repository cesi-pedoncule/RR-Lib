import User from "../class/User";

export type State = "pending" | "validated" | "rejected";

export interface ValidStateDataBuilder {
    state: State;
    moderator: User;
}

/** Represents a valid state */
export default class ValidStateBuilder implements ValidStateDataBuilder {
    
    public state: State;
    public moderator: User;

    constructor(data?: Partial<ValidStateDataBuilder>) {
        this.state = data?.state ?? "pending";
        this.moderator = data?.moderator!;
    }

    public setState(state: State) {
        this.state = state;
        return this;
    }

    public setModerator(user: User) {
        this.moderator = user;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            state: this.state,
            moderator: this.moderator.getIri(),
        }
    }
}