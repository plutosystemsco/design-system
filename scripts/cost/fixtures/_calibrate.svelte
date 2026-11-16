<!--
  025 decision 12: the instrument's check. A button whose click handler
  blocks the main thread for 50 ms by the clock, then counts the click, so a
  run's response time for it must be at least 50 ms.
-->
<script lang="ts">
  let clicks = $state(0);

  function block() {
    const until = performance.now() + 50;
    while (performance.now() < until) {
      // Spin: the wait is the point.
    }
    clicks++;
  }
</script>

<button type="button" onclick={block}>Calibrate</button>
<output>{clicks}</output>
