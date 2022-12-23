import AttachmentBuilder from "./AttachmentBuilder";
import Category from "../class/Category";

export interface ResourceDataBuilder {
    title: string;
    description: string | null;
    isPublic: boolean;
    
    attachments: AttachmentBuilder[];
    categories: Category[];
}

export default class ResourceBuilder implements ResourceDataBuilder {

    public title: string;
    public description: string | null;
    public isPublic: boolean;
    
    public attachments: AttachmentBuilder[];
    public categories: Category[];

    constructor(data?: ResourceDataBuilder) {
        this.title = data?.title ?? "";
        this.description = data?.description ?? null;
        this.isPublic = data?.isPublic ?? false;
        
        this.attachments = data?.attachments ?? [];
        this.categories = data?.categories ?? [];
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