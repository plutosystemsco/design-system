<script lang="ts">
  import Eyebrow from "./eyebrow.svelte";
  import InstallCommand from "./install-command.svelte";

  type Specimen = { step: string; px: number; lineHeight: number };
  let {
    item,
    title,
    role,
    variable,
    family,
    fontClass,
    specimens,
  }: {
    item: string;
    title: string;
    role: string;
    variable: string;
    family: string;
    fontClass: string;
    specimens: Specimen[];
  } = $props();

  const sizes: Record<string, string> = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    "2xl": "text-2xl",
    "5xl": "text-5xl",
  };
</script>

<svelte:head><title>{title} · Pluto Systems design system</title></svelte:head>

<Eyebrow>registry:font · {item}</Eyebrow>
<h1 class="mt-2 text-5xl font-bold tracking-display">{title}</h1>
<p class="mt-4 max-w-prose text-muted-foreground">{role}</p>

<dl class="mt-8 grid gap-2 text-sm">
  <div class="flex flex-wrap gap-2">
    <dt class="text-muted-foreground">Variable</dt>
    <dd><code>{variable}</code></dd>
  </div>
  <div class="flex flex-wrap gap-2">
    <dt class="text-muted-foreground">Family</dt>
    <dd><code class="break-all">{family}</code></dd>
  </div>
</dl>

<div class="mt-6"><InstallCommand name={item} /></div>

<h2 class="mt-12 text-2xl font-bold tracking-section">Specimens</h2>
<ul class="mt-6 grid gap-8">
  {#each specimens as specimen (specimen.step)}
    <li class="groove pt-4">
      <p class="font-mono text-xs text-muted-foreground">
        text-{specimen.step} · {specimen.px}px / {specimen.lineHeight}
      </p>
      <p class="mt-2 {fontClass} {sizes[specimen.step]}">
        Sphinx of black quartz, judge my vow. 0123456789
      </p>
    </li>
  {/each}
</ul>
