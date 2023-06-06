// Enums
export enum APIValidationState {
    Pending = "pending",
    Validated = "validated",
    Rejected = "rejected"
}

export type APIValidationStateType = `${APIValidationState}`;

export enum APIValidationStateCreate {
    Pending = "/states/1",
    Validated = "/states/2",
    Rejected = "/states/3"
}

export enum APIUserRole {
    User = "ROLE_USER",
    Admin = "ROLE_ADMIN",
    Moderator = "ROLE_MODERATOR",
    SuperAdmin = "ROLE_SUPER_ADMIN",
}

export type APIUserRoleType = `${APIUserRole}`;

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

    resources: APICategoryResource[];
    creator: APIBaseUserData | null;
}
export type APIResourceCategory = Omit<APICategoryData, "resources" | "creator">;

export interface APICommentData {
    id: string;
    comment: string;
    createdAt: string;

    user: APIBaseUserData | null;
    resource: Partial<APIResourceData>;
}
export type APIResourceCommentData = Omit<APICommentData, "resource">;

export interface APIResourceData {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string | null;
    isPublic: boolean;
    
    user: Partial<APIUserData> | null;
    attachments: APIResourceAttachmentData[];
    categories: APIResourceCategory[];
    comments: APIResourceCommentData[];
    validationStates: APIResourceValidationStateData[];
    userLikes: APIResourceUserLikeData[];
}
export type APICategoryResource = Omit<APIResourceData, "attachments" | "categories" | "comments" | "validationStates" | "userLikes">;
export type APIUserResource = APICategoryResource;

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
    roles: APIUserRoleType[];
    name: string;
    firstname: string;
    createdAt: string;
    updatedAt: string | null;
    isBanned: boolean;
    
    resources: APIUserResource[];
    resourceLikes: Partial<APIUserLikeData>[];
    userFollows: Partial<APIUserFollowData>[];
    userFollowers: Partial<APIUserFollowData>[];
}

export type APIBaseUserData = Omit<APIUserData, "resources" | "resourceLikes" | "userFollows" | "userFollowers">;

export interface APIUserAuthenticatedData extends APIUserData {
    email: string;
}

export interface APIValidationStateData {
    id: string;
    state: APIStateData;
    updatedAt: string;
    resource: Partial<APIResourceData>;
    moderator: APIBaseUserData;
}
export interface APIResourceValidationStateData {
    id: string;
    state: APIStateData;
    updatedAt: string;
}

export interface APIStateData {
    id: number;
    label: APIValidationStateType;
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