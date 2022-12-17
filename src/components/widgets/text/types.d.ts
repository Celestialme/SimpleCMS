export type Field =  {
	widget: () => {};
    schema: {[Key: string]: any};
    title: string;
    icon: string | undefined;
    placeholder: string | undefined;
    count: string | undefined;
    prefix: string | undefined;
    suffix: string | undefined;
    required: boolean | undefined;
    localization: boolean | undefined;
    display: Display;
};
export type Params = {
	title: string;
	icon?: string;
	placeholder?: string;
	count?: string;
	prefix?: string;
	suffix?: string;
	required?: boolean;
	localization?:boolean
	display?: Display;
}