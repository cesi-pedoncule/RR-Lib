export interface CategoryDataBuilder {
    name: string;
    isVisible: boolean;
}

/** Represents a categegory */
export default class CategoryBuilder implements CategoryDataBuilder {

    public name: string;
    public isVisible: boolean;

    constructor(data?: Partial<CategoryDataBuilder>) {
        this.name = data?.name ?? "";
        this.isVisible = data?.isVisible ?? false;
    }

    public setName(name: string) {
        this.name = name;
        return this;
    }

    public setIsVisible(isVisible: boolean) {
        this.isVisible = isVisible;
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            name: this.name,
            isVisible: this.isVisible,
        }
    }
}