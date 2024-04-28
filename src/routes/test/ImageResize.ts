import ImageExtension from '@tiptap/extension-image';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		imageResize: {
			/**
			 * Set the float side
			 */
			float: (side: 'left' | 'right' | 'unset') => ReturnType;
		};
	}
}

const ImageResize = ImageExtension.extend({
	addAttributes() {
		return {
			src: {
				default: null,
				parseHTML: (element) => (element.firstChild as HTMLElement).getAttribute('src')
			},
			alt: {
				default: null,
				parseHTML: (element) => (element.firstChild as HTMLElement).getAttribute('alt')
			},
			float: {
				default: 'unset'
			},
			w: {
				default: 'unset'
			},
			h: {
				default: 'unset'
			},
			marginLeft: {
				default: 'unset'
			},
			default: {
				default: false
			},
			style: {
				default: 'float:unset;',
				parseHTML: (element) => {
					return element.style.cssText;
				}
			}
		};
	},

	addCommands() {
		return {
			...this.parent?.(),
			float:
				(side) =>
				({}) => {
					return this.editor.commands.updateAttributes('image', { float: side });
				}
		};
	},

	renderHTML({ HTMLAttributes }) {
		console.log(HTMLAttributes);
		return [
			'div',
			{
				style: `text-align: ${textToCssObject(HTMLAttributes.style).textAlign},float: ${HTMLAttributes.float};width: ${HTMLAttributes.w};height: ${
					HTMLAttributes.h
				}; margin-left: ${HTMLAttributes.marginLeft}`
			},
			['img', { src: HTMLAttributes.src, style: 'width: 100%; height: 100%; cursor:pointer' }]
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
			let { src, alt, style } = HTMLAttributes;
			let nodeAttrs = node.attrs as any;

			const container = document.createElement('div');
			const resizer = document.createElement('div');
			const img = document.createElement('img');
			resizer.style.overflow = 'hidden';
			resizer.style.resize = 'both';
			resizer.style.display = 'inline-block';
			resizer.style.position = 'relative';

			if (nodeAttrs?.default == false) {
				resizer.style.width = nodeAttrs.w;
				resizer.style.height = nodeAttrs.h;

				resizer.style.marginLeft = nodeAttrs.marginLeft;
				resizer.style.float = nodeAttrs.float;
				container.style.textAlign = textToCssObject(HTMLAttributes.style).textAlign;
			} else {
				let styles = textToCssObject(style);
				nodeAttrs.float = resizer.style.float = styles.float;
				nodeAttrs.width = resizer.style.width = styles.width;
				nodeAttrs.height = resizer.style.height = styles.height;
				nodeAttrs.marginLeft = resizer.style.marginLeft = styles.marginLeft;
				container.style.textAlign = styles.textAlign;
			}
			resizer.appendChild(img);

			img.src = src;
			img.alt = alt;
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.cursor = 'pointer';

			const resizeObserver = new ResizeObserver((entries) => {
				nodeAttrs.w = resizer.offsetWidth + 'px';
				nodeAttrs.h = resizer.offsetHeight + 'px';
			});
			resizeObserver.observe(resizer);

			container.appendChild(resizer);

			resizer.ondrag = (e) => {
				resizer.style.opacity = '0';
				nodeAttrs.marginLeft = resizer.style.marginLeft =
					((e.clientX - editor.$doc.element.offsetLeft - resizer.offsetWidth / 2) / editor.$doc.element.offsetWidth) * 100 + '%';
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

export { ImageResize, ImageResize as default };

function textToCssObject(text: string) {
	let template = document.createElement('template');
	template.style.cssText = text;
	template.remove();
	return template.style;
}
