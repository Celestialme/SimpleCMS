// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { PipelineStage } from 'mongoose';
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	type DISPLAY = (({ data: any, collection: any, field: any, entry: any, contentLanguage: string }) => Promise<any>) & { default?: boolean };
	type GraphqlSchema = ({ field, label, collection }) => {
		typeName: string | null;
		graphql: string;
		resolver?: { [key: string]: any };
	};
	type Aggregations = {
		transformations?: ({ field, contentLanguage }: { field: any; contentLanguage: string }) => PipelineStage[];
		filters?: ({ field, contentLanguage, filter }: { field: any; contentLanguage: string; filter: string }) => PipelineStage[];
		sorts?: ({ field, contentLanguage, filter }: { field: any; contentLanguage: string; sort: { [key: string]: number } }) => PipelineStage[];
	};
}
export {};
