<script lang="ts">
	function motion(start: number, end: number, duration: number, cb: Function) {
		{
			let frequency = 20;
			let d = (start - end) / (duration / frequency);
			let current = start;

			return new Promise<void>((resolve) => {
				let interval = setInterval(async () => {
					current -= d;

					if ((d < 0 && current >= end) || (d > 0 && current <= end)) {
						cb(end);
						clearInterval(interval);
						resolve();
					} else {
						cb(current);
					}
				}, frequency);
			});
		}
	}
	motion(3000, 1, 1000, (t) => {
		console.log(t);
	});
</script>
