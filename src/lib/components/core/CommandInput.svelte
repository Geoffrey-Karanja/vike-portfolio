<script>
  import { parseCommand } from '$lib/actions/commandParser.js';
  import { processing } from '$lib/stores/terminal.js';
  import { playClick } from '$lib/utils/audio.js';

  let value = '';
  let inputEl;

  export function focus() {
    inputEl?.focus();
  }

  function handleKey(e) {
    if (e.key === 'Enter' && value.trim()) {
      playClick();
      parseCommand(value.trim());
      value = '';
    }
  }
</script>

<div class="input-row" class:processing={$processing}>
  <span class="prompt">❯</span>
  <input
    bind:this={inputEl}
    bind:value
    on:keydown={handleKey}
    disabled={$processing}
    placeholder="type a command..."
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  />
</div>

<style>
  .input-row {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-2) 0;
    opacity: 1;
    transition: opacity var(--duration-base) ease;
  }

  .input-row.processing {
    opacity: 0.4;
    pointer-events: none;
  }

  .prompt {
    color: var(--color-terminal);
    font-family: var(--font-mono);
    font-size: 0.9rem;
    flex-shrink: 0;
    user-select: none;
  }

  input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
    font-size: 0.85rem;
    caret-color: var(--color-terminal);
  }

  input::placeholder {
    color: var(--color-text-muted);
  }
</style>