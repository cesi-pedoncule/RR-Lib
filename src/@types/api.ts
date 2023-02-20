// Enums
export enum APIValidationState {
    Pending = "pending",
    Validated = "validated",
    Rejected = "rejected"
}

// API data interfaces
export interface APIAttachmentData {
    id: string;
    type: string;
    fileUrl: string;
    fileName: string;
    createdAt: string;
    
    user: string | null;
    resource: Partial<APIResourceData>;
}
export type APIResourceAttachmentData = Omit<APIAttachmentData, "resource" | "user">;

export interface APICategoryData {
    id: string;
    name: string;
    isVisible: boolean;
    createdAt: string;
    updatedAt: string | null;

    creator: Partial<APIUserData> | null;
}

export interface APICommentData {
    id: string;
    comment: string;
    createdAt: string;

    user: Partial<APIUserData> | null;
    ressource: Partial<APIResourceData>;
}

export interface APIResourceData {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
    isPublic: boolean;
    
    user: Partial<APIUserData> | null;
    attachments: APIResourceAttachmentData[];
    categories: Partial<APICategoryData>[];
    comments: Partial<APICommentData>[];
}

export interface APIUserFollowData {
    id: string;
    user: string;
    follower: string;
    followAt: string;
}

export interface APIUserLikeData {
    id: string;
    user: string;
    ressource: string;
    likeAt: string;
}

export interface APIUserData {
    id: string;
    email: string;
    roles: string[];
    name: string;
    firstname: string;
    createdAt: string;
    updatedAt: string | null;
    isBanned: boolean;
    
    ressources: Partial<APIResourceData>[];
    resourceLikes: Partial<APIUserLikeData>[];
    userFollows: Partial<APIUserFollowData>[];
    userFollowers: Partial<APIUserFollowData>[];
}

export interface ValidationStateData {
    id: string;
    state: APIValidationState;
    updatedAt: string;

    moderator: Partial<APIUserData>;
}

// API error

export interface APIErrorData {}

export type APIResponseData =
    | APIAttachmentData
    | APICategoryData
    | APICommentData
    | APIResourceData
    | APIUserFollowData
    | APIUserLikeData
    | APIUserData
    | ValidationStateData;

export type APIResponse = APIResponseData | APIErrorData;