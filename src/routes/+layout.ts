import type { LayoutLoad } from './$types';
import { collections } from '@src/stores/collections';
export let ssr = false;
export let prerender = false;

export const load: LayoutLoad = async ({fetch}) => {
    const collectionsFile = await fetch("/getCollectionsFile")
    await collections.updateCollection(collectionsFile)
}
