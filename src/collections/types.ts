import { roles, type Roles } from '@src/auth/types';
import type widgets from '@src/components/widgets';

export let permissions = ['read', 'write'] as const;

export let defaultPermissions = roles.reduce((acc, role) => {
	return {
		...acc,
		[role]: permissions.reduce((acc, permission) => {
			switch (role) {
				case 'admin':
				case 'editor':
					return { ...acc, [permission]: true };
				case 'user':
					return { ...acc, [permission]: true, write: false };
				default:
					return { ...acc, [permission]: false };
			}
		}, {})
	} as Permissions;
}, {} as Permissions);

export type Permissions = {
	[K in Roles]?: { [permissions in (typeof permissions)[number]]?: boolean };
};
export interface Schema {
	name?: CollectionNames;
	hidden?: boolean;
	label?: string;
	links?: CollectionNames[];
	icon?: string;
	fields: ReturnType<(typeof widgets)[keyof typeof widgets]>[];
	status?: 'published' | 'unpublished' | 'draft';
	permissions?: Permissions;
}

export let sanitizePermissions = (permissions) => {
	let res = Object.keys(permissions).reduce((acc, r) => {
		acc[r] = Object.keys(permissions[r]).reduce((acc, p) => {
			if (permissions[r][p] != defaultPermissions[r][p]) {
				acc[p] = permissions[r][p];
			}
			return acc;
		}, {});
		if (Object.keys(acc[r]).length == 0) delete acc[r];
		return acc;
	}, {});
	if (Object.keys(res).length == 0) return undefined;
	return res;
};
export type CollectionNames = 'About'|'imageArray'|'Menu'|'Menu1'|'Menu2'|'News'|'Posts1'|'Posts2'|'Relation'|'thumbs'|'დიპლომისშემდგომი'|'კვლევა'|'კლინიკური ბაზები'|'კლინიკური საქმიანობა'|'მედიცინა'|'მედიცინისა და სტომატოლოგიის საერთაშორისო ფაკულტეტი'|'საერთაშორისო პროექტების მოზიდვისა და ხელშეწყობის განყოფილება'|'საექთნო საქმის და სამეანო საქმის საბაკალავრო პროგრამები'|'საზოგადოებრივი ჯანდაცვა'|'სიახლეები'|'სტომატოლოგია'|'ფარმაცია'|'ფიზიკური მედიცინა და რეაბილიტაცია';
export type CollectionContent = {"About":["RichText"],"imageArray":["ImageArray"],"Menu":["Menu"],"Menu1":["Menu"],"Menu2":["Menu"],"News":["Date","thumbnail","Content"],"Posts1":["email","text","image"],"Posts2":["RichText","image"],"Relation":["info","relation2"],"thumbs":["Image","Image2"],"დიპლომისშემდგომი":["text 1","text 2","text 3","text 4","text 5"],"კვლევა":["text 1","text 2","text 3","text 4","text 5"],"კლინიკური ბაზები":["text 1","text 2","text 3","text 4","text 5"],"კლინიკური საქმიანობა":["text 1","text 2","text 3","text 4","text 5"],"მედიცინა":["text 1","text 2","text 3","text 4","text 5"],"მედიცინისა და სტომატოლოგიის საერთაშორისო ფაკულტეტი":["text 1","text 2","text 3","text 4","text 5"],"საერთაშორისო პროექტების მოზიდვისა და ხელშეწყობის განყოფილება":["text 1","text 2","text 3","text 4","text 5"],"საექთნო საქმის და სამეანო საქმის საბაკალავრო პროგრამები":["text 1","text 2","text 3","text 4","text 5"],"საზოგადოებრივი ჯანდაცვა":["text 1","text 2","text 3","text 4","text 5"],"სიახლეები":["text 1","text 2","text 3","text 4","text 5"],"სტომატოლოგია":["text 1","text 2","text 3","text 4","text 5"],"ფარმაცია":["text 1","text 2","text 3","text 4","text 5"],"ფიზიკური მედიცინა და რეაბილიტაცია":["text 1","text 2","text 3","text 4","text 5"]};