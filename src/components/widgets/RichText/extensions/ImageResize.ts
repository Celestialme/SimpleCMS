import ImageExtension from '@tiptap/extension-image';
declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		imageResize: {
			setImageDescription: (description: string) => ReturnType;
			setImageFloat: (size: 'left' | 'right' | 'unset') => ReturnType;
			setImage: (options: {
				src: string;
				alt?: string;
				title?: string;
				id?: string;
				storage_image?: string;
			}) => ReturnType;
		};
	}
}
const DESCRIPTION_STYLE =
	'z-index: 10;text-align: center;position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, .5); color: #fff; padding: 5px; font-size: 16px;';
const ImageResize = ImageExtension.extend({
	addOptions() {
		return {
			...this.parent?.(),
			id: null,
			storage_image: null
		};
	},
	addCommands() {
		return {
			...this.parent?.(),
			setImageFloat:
				(side: 'left' | 'right' | 'unset') =>
				({ commands }) =>
					commands.updateAttributes('image', { float: side }),
			setImageDescription:
				(description: string) =>
				({ commands }) =>
					commands.updateAttributes('image', { description })
		};
	},
	addAttributes() {
		return {
			id: {
				default: null
			},
			storage_image: {
				default: null,
				parseHTML: (element) =>
					(element.querySelector('img') as HTMLElement).getAttribute('storage_image')
			},
			src: {
				default: null,
				parseHTML: (element) => (element.querySelector('img') as HTMLElement).getAttribute('src')
			},
			alt: {
				default: null,
				parseHTML: (element) => (element.querySelector('img') as HTMLElement).getAttribute('alt')
			},
			float: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.float
			},
			w: {
				default: '200px',
				parseHTML: (element) => (element.querySelector('img') as HTMLElement).getAttribute('width')
			},
			h: {
				default: '200px',
				parseHTML: (element) => (element as HTMLElement).style.height
			},
			margin: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.margin
			},
			textAlign: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.textAlign
			},
			default: {
				default: false
			},
			description: {
				default: '',
				parseHTML: (element) => {
					return (element.querySelector('.description') as HTMLElement)?.innerText || '';
				}
			},
			style: {
				default: null,
				parseHTML: (element) => {
					return element.style.cssText;
				}
			}
		};
	},

	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			{
				style: `text-align: ${HTMLAttributes.textAlign};float: ${HTMLAttributes.float};height: ${HTMLAttributes.h}; margin: ${HTMLAttributes.margin}`
			},
			[
				'img',
				{
					storage_image: HTMLAttributes.storage_image,
					src: HTMLAttributes.id || HTMLAttributes.src,
					id: HTMLAttributes.id,
					style: `width: ${HTMLAttributes.w}; height: 100%`
				}
			],
			HTMLAttributes.description
				? [
						'div',
						{
							class: 'description',
							style: DESCRIPTION_STYLE
						},
						HTMLAttributes.description
					]
				: ''
		];
	},
	parseHTML() {
		return [
			{
				tag: 'div',

				getAttrs: (node) => {
					if ((node.firstChild as HTMLElement).tagName == 'IMG') return null;
					return false;
				}
			}
		];
	},
	addNodeView() {
		return ({ editor, HTMLAttributes, node }) => {
			let { src, alt } = HTMLAttributes;
			let nodeAttrs = node.attrs as any;
			nodeAttrs._ = null;

			const container = document.createElement('div');
			const resizer = document.createElement('div');
			const img = document.createElement('img');
			container.style.textAlign = nodeAttrs.textAlign;

			if (nodeAttrs.description) {
				let description = document.createElement('div');
				description.style.cssText = DESCRIPTION_STYLE;
				description.innerText = nodeAttrs.description;
				resizer.appendChild(description);
			}
			let knob1 = document.createElement('div');
			let knob2 = document.createElement('div');
			let knob3 = document.createElement('div');
			knob1.style.cssText =
				'z-index: 10;cursor: ew-resize;width: 15px; height: 100%;  position: absolute; top:0;left:0px;transform:translateX(-50%)';
			knob2.style.cssText =
				'z-index: 10;cursor: ew-resize;width: 15px; height: 100%;  position: absolute; top:0;right:0px;transform:translateX(50%)';
			knob3.style.cssText =
				'z-index: 10;cursor: ns-resize;width: 100%; height: 15px;  position: absolute; bottom:0;left:0;transform:translateY(50%)';

			knob1.onpointerdown = (e) => {
				knobDrag(e, knob1, 'left', resizer, nodeAttrs);
			};
			knob2.onpointerdown = (e) => {
				knobDrag(e, knob2, 'right', resizer, nodeAttrs);
			};
			knob3.onpointerdown = (e) => {
				knobDrag(e, knob3, 'top', resizer, nodeAttrs);
			};

			resizer.appendChild(knob1);
			resizer.appendChild(knob2);
			resizer.appendChild(knob3);

			Object.assign(resizer.style, {
				display: 'inline-block',
				position: 'relative',
				width: nodeAttrs.w,
				height: nodeAttrs.h,
				margin: nodeAttrs.margin,
				float: nodeAttrs.float
			});

			resizer.appendChild(img);

			img.src = src;
			img.alt = alt;
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.top = '0';
			img.style.left = '0';
			img.style.position = 'absolute';
			img.style.cursor = 'pointer';

			container.appendChild(resizer);
			if (nodeAttrs.textAlign != 'justify') {
				if (nodeAttrs.float == 'left') {
					nodeAttrs.margin = resizer.style.margin = `0 10px 0 0`;
				} else if (nodeAttrs.float == 'right') {
					nodeAttrs.margin = resizer.style.margin = `0 0 0 10px`;
				} else if (nodeAttrs.textAlign != 'unset') {
					nodeAttrs.margin = resizer.style.margin = `0`;
				}
			}

			resizer.ondrag = (e) => {
				if (nodeAttrs.textAlign != 'justify') {
					return;
				}
				resizer.style.opacity = '0';
				let marginLeft =
					Math.max(
						((e.clientX -
							editor.$doc.element.getBoundingClientRect().left -
							resizer.offsetWidth / 2) /
							editor.$doc.element.offsetWidth) *
							100,
						0
					) + '%';
				let marginRight =
					Math.max(
						((editor.$doc.element.getBoundingClientRect().right -
							e.clientX -
							+resizer.offsetWidth / 2) /
							editor.$doc.element.offsetWidth) *
							100,
						0
					) + '%';
				if (nodeAttrs.float == 'left' || nodeAttrs.float == 'unset') {
					nodeAttrs.margin = resizer.style.margin = `0 10px 0 ${marginLeft}`;
				} else if (nodeAttrs.float == 'right') {
					nodeAttrs.margin = resizer.style.margin = `0 ${marginRight} 0 10px`;
				}
			};
			resizer.ondragend = (e) => {
				resizer.style.opacity = '1';
			};

			nodeAttrs.default = false;
			return {
				dom: container
			};
		};
	}
});

function knobDrag(
	e: PointerEvent,
	knob: HTMLDivElement,
	side: 'left' | 'right' | 'top' | 'bottom',
	resizer: HTMLDivElement,
	nodeAttrs: any
) {
	e.preventDefault();
	e.stopPropagation();
	knob.setPointerCapture(e.pointerId);
	knob.onpointermove = (e) => {
		if (side == 'left' || side == 'right') {
			nodeAttrs.w = resizer.style.width =
				resizer.offsetWidth + (side == 'left' ? -e.movementX : e.movementX) + 'px';
		} else {
			nodeAttrs.h = resizer.style.height = resizer.offsetHeight + e.movementY + 'px';
		}
	};

	knob.onpointerup = () => {
		knob.onpointermove = null;
		knob.onpointerup = null;
	};
}

export { ImageResize, ImageResize as default };
