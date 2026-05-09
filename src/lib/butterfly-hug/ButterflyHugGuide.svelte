<script lang="ts">
  // Animated demonstration of the Butterfly Hug — a self-administered alternating-tap
  // technique. No on-screen tracking target; just the figure plus a slow arm-cycle
  // animation so the user can mirror the timing.
  let { speedHz = 0.7 }: { speedHz?: number } = $props();
  // Period in seconds for one full L+R cycle.
  let period = $derived(1 / speedHz);
</script>

<div class="wrap" aria-label="Butterfly Hug guide">
  <svg viewBox="0 0 240 280" role="img" aria-labelledby="bh-title bh-desc">
    <title id="bh-title">Butterfly Hug demonstration</title>
    <desc id="bh-desc">Animated figure crossing arms over chest and tapping in alternation.</desc>

    <!-- Head -->
    <circle cx="120" cy="50" r="22" fill="none" stroke="currentColor" stroke-width="2" />
    <!-- Torso -->
    <rect x="80" y="78" width="80" height="120" rx="14" fill="none" stroke="currentColor" stroke-width="2" />
    <!-- Crossed arms (CSS-animated for a gentle tap rhythm) -->
    <g class="arms" style="--period: {period}s">
      <line x1="120" y1="120" x2="86" y2="146" class="arm-l" />
      <line x1="120" y1="120" x2="154" y2="146" class="arm-r" />
      <circle cx="86" cy="146" r="6" fill="currentColor" class="hand-l" />
      <circle cx="154" cy="146" r="6" fill="currentColor" class="hand-r" />
    </g>
    <!-- Legs -->
    <line x1="100" y1="200" x2="92" y2="260" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    <line x1="140" y1="200" x2="148" y2="260" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
  </svg>

  <p class="caption">
    Cross your arms over your chest. Tap each shoulder gently, alternating sides at a comfortable
    pace. Slow your breath. Stop whenever you choose.
  </p>
</div>

<style>
  .wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: #c9d3ea;
  }
  svg {
    width: min(240px, 60vw);
    height: auto;
  }
  .arms line {
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }
  .hand-l {
    transform-origin: 86px 146px;
    animation: tap-l var(--period) ease-in-out infinite;
  }
  .hand-r {
    transform-origin: 154px 146px;
    animation: tap-r var(--period) ease-in-out infinite;
  }
  .arm-l {
    transform-origin: 120px 120px;
    animation: tap-l var(--period) ease-in-out infinite;
  }
  .arm-r {
    transform-origin: 120px 120px;
    animation: tap-r var(--period) ease-in-out infinite;
  }
  @keyframes tap-l {
    0%,
    50%,
    100% {
      opacity: 1;
      transform: scale(1);
    }
    25% {
      opacity: 1;
      transform: scale(1.15);
    }
    75% {
      opacity: 0.55;
      transform: scale(0.9);
    }
  }
  @keyframes tap-r {
    0%,
    50%,
    100% {
      opacity: 0.55;
      transform: scale(0.9);
    }
    25% {
      opacity: 0.55;
      transform: scale(0.9);
    }
    75% {
      opacity: 1;
      transform: scale(1.15);
    }
  }
  .caption {
    max-width: 340px;
    text-align: center;
    color: var(--fg-dim, #9a9aa3);
    font-size: 0.95rem;
    line-height: 1.4;
  }
</style>
