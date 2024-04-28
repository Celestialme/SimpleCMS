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
			style: {
				default: null,
				parseHTML: (element) => {
					return element.style.cssText;
				}
			}
		};
	},
	addStorage() {
		return {
			default: true,
			style: { w: 0, h: 0, float: 'unset', marginLeft: 0 }
		};
	},
	addCommands() {
		return {
			...this.parent?.(),
			float:
				(side) =>
				({}) => {
					return this.storage.float(side);
				}
		};
	},
	renderHTML({ HTMLAttributes }) {
		return [
			'div',
			{
				style: `float: ${this.storage.style.float};width: ${this.storage.style.w};height: ${this.storage.style.h}; margin-left: ${this.storage.style.marginLeft}`
			},
			['img', HTMLAttributes]
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
		return ({ editor, HTMLAttributes, extension }) => {
			let { src, alt, style } = HTMLAttributes;
			const container = document.createElement('div');
			const resizer = document.createElement('div');
			const img = document.createElement('img');
			HTMLAttributes = {};
			resizer.style.overflow = 'hidden';
			resizer.style.resize = 'both';
			resizer.style.display = 'inline-block';
			resizer.style.position = 'relative';

			if (this.storage?.default == false) {
				resizer.style.width = this.storage.style.w;
				resizer.style.height = this.storage.style.h;

				resizer.style.marginLeft = this.storage.style.marginLeft;
				resizer.style.float = this.storage.style.float;
			} else {
				let styles = textToCssObject(style);
				this.storage.style.float = resizer.style.float = styles.float;
				this.storage.style.width = resizer.style.width = styles.width;
				this.storage.style.height = resizer.style.height = styles.height;
				this.storage.style.marginLeft = resizer.style.marginLeft = styles.marginLeft;
			}
			resizer.appendChild(img);

			img.src = src;
			img.alt = alt;
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.cursor = 'pointer';

			const resizeObserver = new ResizeObserver((entries) => {
				this.storage.style.w = resizer.offsetWidth + 'px';
				this.storage.style.h = resizer.offsetHeight + 'px';
			});
			resizeObserver.observe(resizer);

			container.appendChild(resizer);
			this.storage.float = (side) => {
				this.storage.style.float = resizer.style.float = side;
			};

			resizer.ondrag = (e) => {
				resizer.style.opacity = '0';
				this.storage.style.marginLeft = resizer.style.marginLeft =
					((e.clientX - editor.$doc.element.offsetLeft - resizer.offsetWidth / 2) / editor.$doc.element.offsetWidth) * 100 + '%';
			};
			resizer.ondragend = (e) => {
				resizer.style.opacity = '1';
			};
			resizer.onclick = (e) => {
				console.log(extension);
			};
			this.storage.default = false;
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
