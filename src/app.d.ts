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
		transformations?: ({ field, contentLanguage }: { field: any; contentLanguage: string }) => Promise<PipelineStage[]>;
		filters?: ({ field, contentLanguage, filter }: { field: any; contentLanguage: string; filter: string }) => Promise<PipelineStage[]>;
		sorts?: ({ field, contentLanguage, sort }: { field: any; contentLanguage: string; sort: number }) => Promise<PipelineStage[]>;
	};
}
export {};
