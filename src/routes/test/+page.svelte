<script lang="ts">
	import RoutesIcon from './RoutesIcon.svelte';
	let showRoutes = false;
	let center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
	let start = { x: 50, y: center.y };
	let firstLine: SVGLineElement;
	// Function to calculate the coordinates of the endpoint of a vector
	function calculateSecondVector(startX, startY, x1, y1, distance, angle) {
		let firstAngle = Math.atan2(y1 - startY, x1 - startX) * (180 / Math.PI);
		let x2 = Math.round(Math.cos(((firstAngle - angle) * Math.PI) / 180) * distance + x1);
		let y2 = Math.round(Math.sin(((firstAngle - angle) * Math.PI) / 180) * distance + y1);
		return { x: x2, y: y2 };
	}
	$: line1 = calculateSecondVector(start.x, start.y, center.x, center.y, 160, 60);
	$: line2 = calculateSecondVector(start.x, start.y, center.x, center.y, 160, 0);
	$: line3 = calculateSecondVector(start.x, start.y, center.x, center.y, 160, -60);
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
					firstLine.style.strokeDasharray = firstLine.getTotalLength().toString();
				};
			}, 60);
		};
		node.onpointerup = (e) => {
			if (!moved) {
				showRoutes = !showRoutes;
			}
			timeout && clearTimeout(timeout);
			moved = false;
			node.onpointermove = null;
			node.releasePointerCapture(e.pointerId);
		};
	}
	function setDash(node: SVGElement) {
		for (let lineElement of node.children) {
			let el = lineElement as SVGLineElement;
			el.style.strokeDashoffset = el.style.strokeDasharray = el.getTotalLength().toString();
		}
	}
</script>

<div class="touch-none">
	<div use:drag class="circle flex items-center justify-center z-10" style="top:{start.y}px;left:{start.x}px;width:70px;height:70px">
		<RoutesIcon />
	</div>
	{#if showRoutes}
		<svg xmlns="http://www.w3.org/2000/svg" use:setDash>
			<line bind:this={firstLine} x1={start.x} y1={start.y} x2={center.x} y2={center.y} style="animation:showLine 0.2s forwards" />
			<line x1={center.x} y1={center.y} x2={line1.x} y2={line1.y} style="animation:showLine 0.2s 0.2s forwards" />
			<line x1={center.x} y1={center.y} x2={line2.x} y2={line2.y} style="animation:showLine 0.2s 0.2s forwards" />
			<line x1={center.x} y1={center.y} x2={line3.x} y2={line3.y} style="animation:showLine 0.2s 0.2s forwards" />
		</svg>
		<div
			class="circle flex items-center justify-center"
			style="top:{center.y}px;left:{center.x}px;visibility:hidden; animation: showEndPoints 0.2s 0.2s forwards"
		>
			<iconify-icon width="30" style="color:white" icon="solar:home-bold" />
		</div>
		<div
			class="circle flex items-center justify-center opacity-0"
			style="top:{line1.y}px;left:{line1.x}px;animation: showEndPoints 0.2s 0.4s forwards"
		>
			<iconify-icon width="30" style="color:white" icon="solar:home-bold" />
		</div>
		<div
			class="circle flex items-center justify-center opacity-0"
			style="top:{line2.y}px;left:{line2.x}px;animation: showEndPoints 0.2s 0.4s forwards"
		>
			<iconify-icon width="30" style="color:white" icon="solar:home-bold" />
		</div>
		<div
			class="circle flex items-center justify-center opacity-0"
			style="top:{line3.y}px;left:{line3.x}px;animation: showEndPoints 0.2s 0.4s forwards"
		>
			<iconify-icon width="30" style="color:white" icon="solar:home-bold" />
		</div>
	{/if}
</div>

<style>
	div {
		width: 100vw;
		height: 100vh;
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
		background-color: black;

		z-index: 100;
	}
	line {
		stroke: black;
		stroke-width: 4;
	}
	@keyframes -global-showLine {
		100% {
			stroke-dashoffset: 0;
		}
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
