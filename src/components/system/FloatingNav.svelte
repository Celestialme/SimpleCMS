<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import RoutesIcon from '@src/components/system/icons/RoutesIcon.svelte';
	import { linear } from 'svelte/easing';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	let showRoutes = false;
	let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	window.onresize = () => (center = { x: window.innerWidth / 2, y: window.innerHeight / 2 });
	let navigation_info = JSON.parse(localStorage.getItem('navigation') || '{}');

	function getBasePath(pathname: string) {
		let params = Object.values($page.params);
		let replaced = params.reduce((acc, param) => {
			acc = acc.replace(param, '');
			return acc;
		}, pathname);
		return params.length > 0 ? replaced : pathname;
	}
	$: start = navigation_info?.[getBasePath($page.url.pathname)] || { x: 50, y: window.innerHeight / 2 };
	let firstLine: SVGLineElement;
	let svg: SVGElement;
	let endpoints: {
		x: number;
		y: number;
		url: {
			external: boolean;
			path: string;
		};
		icon: string;
	}[] = [
		{
			x: center.x,
			y: center.y,
			url: { external: false, path: `/` },
			icon: 'solar:home-bold'
		},
		{
			x: 0,
			y: 0,
			url: { external: false, path: `/builder` },
			icon: 'icomoon-free:wrench'
		},
		{
			x: 0,
			y: 0,
			url: { external: false, path: `/profile` },
			icon: 'bi:gear-fill'
		},
		{
			x: 0,
			y: 0,
			url: { external: true, path: `/api/graphql` },
			icon: 'teenyicons:graphql-outline'
		}
	];
	let circles: HTMLDivElement[] = [];
	// Function to calculate the coordinates of the endpoint of a vector
	function calculateSecondVector(startX, startY, x1, y1, distance, angle) {
		let firstAngle = Math.atan2(y1 - startY, x1 - startX) * (180 / Math.PI);
		let x2 = Math.round(Math.cos(((firstAngle - angle) * Math.PI) / 180) * distance + x1);
		let y2 = Math.round(Math.sin(((firstAngle - angle) * Math.PI) / 180) * distance + y1);
		return { x: x2, y: y2 };
	}
	$: endpoints[1] = { ...endpoints[1], ...calculateSecondVector(start.x, start.y, center.x, center.y, 140, 60) };
	$: endpoints[2] = { ...endpoints[2], ...calculateSecondVector(start.x, start.y, center.x, center.y, 140, 0) };
	$: endpoints[3] = { ...endpoints[3], ...calculateSecondVector(start.x, start.y, center.x, center.y, 140, -60) };

	function drag(node: HTMLDivElement) {
		let moved = false;
		let timeout: ReturnType<typeof setTimeout>;
		node.onpointerdown = (e) => {
			timeout = setTimeout(() => {
				start = { x: e.clientX, y: e.clientY };
				node.setPointerCapture(e.pointerId);
				node.onpointermove = (e) => {
					moved = true;
					start = { x: e.clientX, y: e.clientY };
					firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());
				};
			}, 60);
		};
		node.onpointerup = async (e) => {
			if (!moved) {
				showRoutes = !showRoutes;
			}
			timeout && clearTimeout(timeout);
			moved = false;
			node.onpointermove = null;
			node.releasePointerCapture(e.pointerId);

			let distance = [
				start.x, //left
				window.innerWidth - start.x, //right
				start.y, //top
				window.innerHeight - start.y //bottom
			];

			let promise: any;
			switch (distance.indexOf(Math.min(...distance))) {
				case 0:
					{
						let d = start.x / 10;
						let target = 30;
						promise = new Promise<void>((resolve) => {
							let interval = setInterval(async () => {
								start.x -= d;
								if (start.x <= target) {
									start.x = target;
									clearInterval(interval);
									resolve();
								}
								await tick();
								firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());
							}, 20);
						});
					}
					break;
				case 1:
					{
						let d = (window.innerWidth - start.x) / 10;
						let target = window.innerWidth - 30;
						promise = new Promise<void>((resolve) => {
							let interval = setInterval(async () => {
								start.x += d;
								if (start.x >= target) {
									start.x = target;
									clearInterval(interval);
									resolve();
								}
								await tick();
								firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());
							}, 20);
						});
					}
					break;
				case 2:
					{
						let d = start.y / 10;
						let target = 30;
						promise = new Promise<void>((resolve) => {
							let interval = setInterval(async () => {
								start.y -= d;
								if (start.y <= target) {
									start.y = target;
									clearInterval(interval);
									resolve();
								}
								await tick();
								firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());
							}, 20);
						});
					}
					break;
				case 3:
					{
						let d = (window.innerHeight - start.y) / 10;
						let target = window.innerHeight - 30;
						promise = new Promise<void>((resolve) => {
							let interval = setInterval(async () => {
								start.y += d;
								if (start.y >= target) {
									start.y = target;
									clearInterval(interval);
									resolve();
								}
								await tick();
								firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());
							}, 20);
						});
					}
					break;
			}

			await tick();
			firstLine && (firstLine.style.strokeDasharray = firstLine.getTotalLength().toString());

			await promise;
			navigation_info = { ...navigation_info, ...{ [getBasePath($page.url.pathname)]: start } };
			localStorage.setItem('navigation', JSON.stringify(navigation_info));
		};
	}
	function setDash(node: SVGElement) {
		let first = true;
		for (let lineElement of node.children) {
			let el = lineElement as SVGLineElement;
			el.style.strokeDashoffset = el.style.strokeDasharray = el.getTotalLength().toString();
			setTimeout(() => {
				el.style.transition = first ? 'stroke-dashoffset 0.2s ' : 'stroke-dashoffset 0.2s 0.2s';
				el.style.strokeDashoffset = '0';
				first = false;
			}, 0);
		}
	}
	function reverse() {
		if (!svg) return;
		let first = true;
		for (let lineElement of svg.children) {
			let el = lineElement as SVGLineElement;
			el.style.transition = first ? 'stroke-dashoffset 0.2s 0.2s' : 'stroke-dashoffset 0.2s ';
			el.style.strokeDashoffset = el.style.strokeDasharray = el.getTotalLength().toString();
			first = false;
		}
		for (let circle of circles) {
			circle.style.display = 'none';
		}
	}
	$: if (!showRoutes) reverse();
	function keepAlive(node, { delay = 0, duration = 400, easing: easing$1 = linear } = {}) {
		return {
			delay,
			duration,
			easing: easing$1,
			css: (t) => ``
		};
	}
</script>

<div
	use:drag
	class="touch-none circle fixed flex items-center justify-center"
	style="top:{(start.y / window.innerHeight) * 100}%;left:{(start.x / window.innerWidth) * 100}%;width:50px;height:50px"
>
	<RoutesIcon />
</div>
{#if showRoutes}
	<div out:keepAlive on:click|self={() => (showRoutes = false)} class=" fixed top-0 left-0 z-[9999999]">
		<svg bind:this={svg} xmlns="http://www.w3.org/2000/svg" use:setDash>
			<line bind:this={firstLine} x1={start.x} y1={start.y} x2={center.x} y2={center.y} />
			{#each endpoints.slice(1, endpoints.length) as endpoint}
				<line x1={center.x} y1={center.y} x2={endpoint.x} y2={endpoint.y} />
			{/each}
		</svg>
		<!-- HOME -->
		<div
			transition:fade
			class="shell"
			style="top:{center.y}px;left:{center.x}px;visibility:hidden; animation: showEndPoints 0.2s 0.2s forwards"
		></div>
		<div
			bind:this={circles[0]}
			on:click={() => {
				endpoints[0]?.url?.external ? (location.href = endpoints[0]?.url?.path || '/') : goto(endpoints[0]?.url?.path || '/');
				showRoutes = false;
			}}
			class="circle flex items-center justify-center"
			style="top:{center.y}px;left:{center.x}px;visibility:hidden; animation: showEndPoints 0.2s 0.2s forwards"
		>
			<iconify-icon width="30" style="color:white" icon="solar:home-bold" />
		</div>
		{#each endpoints.slice(1, endpoints.length) as endpoint, index}
			<div
				bind:this={circles[index + 1]}
				on:click={() => {
					endpoint?.url?.external ? (location.href = endpoint?.url?.path || '/') : goto(endpoint?.url?.path || '/');
					showRoutes = false;
				}}
				class="circle flex items-center justify-center opacity-0"
				style="top:{endpoint.y}px;left:{endpoint.x}px;animation: showEndPoints 0.2s 0.4s forwards"
			>
				<iconify-icon width="30" style="color:white" icon={endpoint.icon} />
			</div>
		{/each}
	</div>
{/if}

<style>
	div {
		width: 100vw;
		height: 100vh;
	}
	.shell {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 340px;
		height: 340px;
		border-radius: 50%;
		background-color: #37d1e759;
		z-index: -1;
		backdrop-filter: blur(15px);
	}
	svg {
		position: fixed;
		left: 0;
		top: 0;
		height: 100%;
		width: 100%;
		pointer-events: none;
	}
	.circle {
		position: fixed;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		width: 50px;
		height: 50px;
		background-color: #26bdff;
		cursor: pointer;
		z-index: 99999999;
	}
	.circle:not(:first-child):hover {
		transform: translate(-50%, -50%) scale(1.5);
	}
	.circle:not(:first-child):active {
		transform: translate(-50%, -50%) scale(1) !important;
	}
	.circle:first-child:active {
		transform: translate(-50%, -50%) scale(0.9) !important;
	}

	line {
		stroke: #da1f1f;
		stroke-width: 4;
	}

	@keyframes -global-showEndPoints {
		from {
			visibility: hidden;
		}
		100% {
			opacity: 1;
			visibility: visible;
		}
	}
</style>
