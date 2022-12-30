const config = {
	content: [
	  "./src/**/*.{html,js,svelte,ts}",
	  "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
	  require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
  
	theme: {
	  extend: {},
  
	  screens: {
		// Start with default and use xs/sm/md/lg/xl/2xl 
  
		'xs': '360px',
		// => @media (min-width: 360px) { ... }
  
		'sm': '567px',
		// => @media (min-width: 576px) { ... }
  
		'md': '768px',
		// => @media (min-width: 768px) { ... }
  
		'lg': '992px',
		// => @media (min-width: 992px) { ... }
  
		'xl': '1200px',
		// => @media (min-width: 1200px) { ... }
  
		'2xl': '1536px',
		// => @media (min-width: 1536px) { ... }
	  },
  
	},
  
	plugins: [
		require('flowbite/plugin'),
		require('@skeletonlabs/skeleton/tailwind/theme.cjs'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
	],
	darkMode: 'class',
  };
  
  module.exports = config;