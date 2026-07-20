<script lang="ts">
	import Lenis from 'lenis';
	import 'lenis/dist/lenis.css';

	const { children } = $props<{ children: any }>();

	$effect(() => {
		const lenis = new Lenis({
			duration: 1.2,
			easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // spring-like out easing
			orientation: 'vertical',
			gestureOrientation: 'vertical',
			smoothWheel: true,
			wheelMultiplier: 1.0,
			touchMultiplier: 1.5
		});

		let rafId: number;
		const raf = (time: number) => {
			lenis.raf(time);
			rafId = requestAnimationFrame(raf);
		};

		rafId = requestAnimationFrame(raf);

		return () => {
			cancelAnimationFrame(rafId);
			lenis.destroy();
		};
	});
</script>

{@render children()}
