import ImageExtension from '@tiptap/extension-image';

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
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.float
			},
			w: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.width
			},
			h: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.height
			},
			marginLeft: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.marginLeft
			},
			textAlign: {
				default: 'unset',
				parseHTML: (element) => (element as HTMLElement).style.textAlign
			},
			default: {
				default: false
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
				style: `text-align: ${HTMLAttributes.textAlign};float: ${HTMLAttributes.float};width: ${HTMLAttributes.w};height: ${HTMLAttributes.h}; margin-left: ${HTMLAttributes.marginLeft}`
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
			let { src, alt } = HTMLAttributes;
			let nodeAttrs = node.attrs as any;

			const container = document.createElement('div');
			const resizer = document.createElement('div');
			const img = document.createElement('img');
			resizer.style.overflow = 'hidden';
			resizer.style.resize = 'both';
			resizer.style.display = 'inline-block';
			resizer.style.position = 'relative';

			resizer.style.width = nodeAttrs.w;
			resizer.style.height = nodeAttrs.h;
			resizer.style.marginLeft = nodeAttrs.marginLeft;
			resizer.style.float = nodeAttrs.float;
			container.style.textAlign = nodeAttrs.textAlign;

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
