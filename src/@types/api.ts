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
    resource: Partial<APIResourceData>;
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
    validationStates: APIResourceValidationStateData[];
    userLikes: APIResourceUserLikeData[];
}

export interface APIUserFollowData {
    id: string;
    user: string;
    follower: string;
    followAt: string;
}

export interface APIUserLikeData {
    id: string;
    user: {
        id: string
    };
    resource: {
        id: string;
    };
    likeAt: string;
}
export interface APIResourceUserLikeData {
    id: string;
    user: {
        id: string;
    }
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
    
    resources: Partial<APIResourceData>[];
    resourceLikes: Partial<APIUserLikeData>[];
    userFollows: Partial<APIUserFollowData>[];
    userFollowers: Partial<APIUserFollowData>[];
}
export type APIBaseUserData = Omit<APIUserData, "resources" | "resourceLikes" | "userFollows" | "userFollowers">;

export interface APIValidationStateData {
    id: string;
    state: APIValidationState;
    updatedAt: string;
    resource: Partial<APIResourceData>;
    moderator: APIBaseUserData;
}
export interface APIResourceValidationStateData {
    id: string;
    state: {
        id: number;
        label: string;
    };
    updatedAt: string;
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
    | APIValidationStateData;

export type APIResponse = APIResponseData | APIErrorData;