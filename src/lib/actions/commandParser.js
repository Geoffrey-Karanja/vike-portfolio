import { activeSection, printLine, processing } from '$lib/stores/terminal.js';
import { get } from 'svelte/store';

// Command map — voice and text both route through here
const commands = {
  help: cmdHelp,
  about: cmdAbout,
  projects: cmdProjects,
  tools: cmdTools,
  contact: cmdContact,
  vitals: cmdVitals,
  clear: cmdClear,
  whoami: cmdWhoami,
  hireme: cmdHireMe,
};

// Voice aliases — maps natural speech to commands
const aliases = {
  'show me his work':      'projects',
  'show his work':         'projects',
  'show projects':         'projects',
  'tell me his story':     'about',
  'tell his story':        'about',
  'show about':            'about',
  'what are his tools':    'tools',
  'show tools':            'tools',
  'show his tools':        'tools',
  'share his contact':     'contact',
  'show contact':          'contact',
  'get in touch':          'contact',
  'dev vitals':            'vitals',
  'show vitals':           'vitals',
  'show stats':            'vitals',
};

export function parseCommand(raw) {
  const input   = raw.trim().toLowerCase();
  const resolved = aliases[input] ?? input;
  const fn       = commands[resolved];

  if (fn) {
    processing.set(true);
    printLine(raw, 'input');
    setTimeout(() => {
      fn();
      processing.set(false);
    }, 400);
  } else {
    printLine(raw, 'input');
    printLine(`command not found: ${raw}. Type 'help' to see available commands.`, 'error');
  }
}

function cmdHelp() {
  printLine('Available commands:', 'system');
  printLine('  about      → My story', 'output');
  printLine('  projects   → GitHub constellation', 'output');
  printLine('  tools      → My tech stack', 'output');
  printLine('  contact    → Get in touch', 'output');
  printLine('  vitals     → Live dev stats', 'output');
  printLine('  whoami     → Quick intro', 'output');
  printLine('  clear      → Clear terminal', 'output');
}

function cmdAbout() {
  activeSection.set('about');
  printLine('Loading narrative...', 'system');
}

function cmdProjects() {
  activeSection.set('projects');
  printLine('Fetching constellation data...', 'system');
}

function cmdTools() {
  activeSection.set('tools');
  printLine('Loading tool bench...', 'system');
}

function cmdContact() {
  activeSection.set('contact');
  printLine('Opening secure channel...', 'system');
}

function cmdVitals() {
  activeSection.set('vitals');
  printLine('Pulling live stats...', 'system');
}

function cmdClear() {
  import('$lib/stores/terminal.js').then(m => m.clearTerminal());
}


function cmdWhoami() {
  printLine('Geoffrey Karanja', 'output');
  printLine('iOS Developer — Njoro, Kenya', 'output');
  printLine('Building things that feel inevitable.', 'output');
}

function cmdHireMe() {
  printLine('Excellent taste.', 'system');
  printLine('Senior Sir Geoffrey is available and dangerous.', 'system');
  window.dispatchEvent(new CustomEvent('vike:speak', {
    detail: "Excellent taste. Senior Sir Geoffrey is available and dangerous. Shall I open a channel?"
  }));
  window.dispatchEvent(new CustomEvent('hireme:trigger'));
}