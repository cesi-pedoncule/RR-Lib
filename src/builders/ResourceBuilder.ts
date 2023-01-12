import Category from "../class/Category";
import AttachmentBuilder from "./AttachmentBuilder";

export interface ResourceDataBuilder {
    title: string;
    isPublic: boolean;
    description: string | null;
    
    categories: Category[];
    attachments: AttachmentBuilder[];
}

/** Represents a resource */
export default class ResourceBuilder implements ResourceDataBuilder {

    public title: string;
    public isPublic: boolean;
    public description: string | null;
    
    public attachments: AttachmentBuilder[];
    public categories: Category[];

    constructor(data?: ResourceDataBuilder) {
        this.title = data?.title ?? "";
        this.isPublic = data?.isPublic ?? false;
        this.description = data?.description ?? null;
        
        this.categories = data?.categories ?? [];
        this.attachments = data?.attachments ?? [];
    }

    public setTitle(title: string) {
        this.title = title;
        return this;
    }

    public setDescription(description: string | null) {
        this.description = description;
        return this;
    }

    public setIsPublic(isPublic: boolean) {
        this.isPublic = isPublic;
        return this;
    }

    
    public setAttachments(attachments: AttachmentBuilder[]) {
        this.attachments = attachments;
        return this;
    }

    public addAttachment(attachment: AttachmentBuilder) {
        this.attachments.push(attachment);
        return this;
    }

    public setCategories(categories: Category[]) {
        this.categories = categories;
        return this;
    }

    public addCategory(category: Category) {
        this.categories.push(category);
        return this;
    }

    /** Return data for api request */
    public toJSON() {
        return {
            title: this.title,
            description: this.description,
            isPublic: this.isPublic,
            attachments: this.attachments.map(a => a.toJSON()),
            categories: this.categories.map(c => c.getIri()),
        }
    }
}