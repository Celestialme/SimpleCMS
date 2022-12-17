export type Field =  {
    widget: () => {};
    schema: {[Key: string]: any};
    title: string;
    imageUploadTitle: string;
    icon: string | undefined;
    upload: boolean;
    fields:Array<any>  & Array<typeof ImageUpload>;
    required: boolean | undefined;
    display: Display;
}
export type Params = {
    
        // Defines type of collections
        title: string;
        imageUploadTitle:string,
        icon?: string;
        required?: boolean;
        fields: Array<any>  & Array<typeof ImageUpload>;
        display?: Display;
    
}