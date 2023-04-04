export type DocumentPickerOptions = {
    type?: string | string[];
    copyToCacheDirectory?: boolean;
    multiple?: boolean;
};
  
export type DocumentPickerAsset = {
    name: string;
    size?: number;
    uri: string;
    mimeType?: string;
    lastModified?: number;
    file?: File;
    output?: FileList | null;
};

export type DocumentPickerResult = {
    canceled: boolean;
    type?: string;
    name?: string;
    size?: number;
    assets: DocumentPickerAsset[] | null;
    uri?: string;
    mimeType?: string;
    lastModified?: number;
    file?: File;
    output?: FileList | null;
} & (DocumentPickerSuccessResult | DocumentPickerCanceledResult);
  
export type DocumentPickerSuccessResult = {
    canceled: false;
    assets: DocumentPickerAsset[];
};
  
export type DocumentPickerCanceledResult = {
    canceled: true;
    assets: null;
};