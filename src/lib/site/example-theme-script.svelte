<!--
  An example frame's head script. Before first paint it reads `theme` from
  the address and sets or clears `dark` on <html>, and nothing else: no
  stored choice and no system preference reach a frame, so it shows the
  theme it was opened in until it is replaced.
-->
<svelte:head>
  {@html `<script>(function(){var t=new URLSearchParams(location.search).get("theme");document.documentElement.classList.toggle("dark",t==="dark")})()</` +
    `script>`}
</svelte:head>
