// js/uiComponents.js
// Lightweight UI component helpers for your SPA
// Matches your CSS component library (buttons, cards, inputs)

/**
 * Create a button element
 * @param {Object} opts
 * @param {string} opts.label - Button text
 * @param {string} [opts.variant='primary'] - 'primary' | 'secondary' | 'ghost' | 'danger'
 * @param {Function} [opts.onClick] - Click handler
 * @param {string} [opts.type='button'] - 'button' | 'submit'
 */
export function createButton({ label, variant = 'primary', onClick, type = 'button' }) {
  const btn = document.createElement('button');
  btn.type = type;
  btn.className = `btn btn-${variant}`;
  btn.textContent = label;

  if (typeof onClick === 'function') {
    btn.addEventListener('click', onClick);
  }

  return btn;
}

/**
 * Create a card container
 * @param {Object} opts
 * @param {string} [opts.title] - Card header text
 * @param {string} [opts.subtext] - Small muted text under title
 * @param {('dark'|'light')} [opts.variant='dark']
 * @param {HTMLElement|HTMLElement[]|string} [opts.content] - Inner content
 */
export function createCard({ title, subtext, variant = 'dark', content } = {}) {
  const card = document.createElement('div');
  card.className = variant === 'light' ? 'card card-light' : 'card';

  if (title) {
    const header = document.createElement('div');
    header.className = 'card-header';
    header.textContent = title;
    card.appendChild(header);
  }

  if (subtext) {
    const sub = document.createElement('p');
    sub.className = 'card-subtext';
    sub.textContent = subtext;
    card.appendChild(sub);
  }

  if (content) {
    if (typeof content === 'string') {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = content;
      card.appendChild(wrapper);
    } else if (Array.isArray(content)) {
      content.forEach((child) => child && card.appendChild(child));
    } else {
      card.appendChild(content);
    }
  }

  return card;
}

/**
 * Create a labeled input group
 * @param {Object} opts
 * @param {string} opts.label - Label text
 * @param {string} [opts.type='text'] - Input type
 * @param {string} [opts.name] - Name/id
 * @param {string} [opts.placeholder]
 * @param {('dark'|'light')} [opts.variant='dark']
 */
export function createInputGroup({
  label,
  type = 'text',
  name,
  placeholder = '',
  variant = 'dark'
}) {
  const group = document.createElement('div');
  group.className = 'input-group';

  const labelEl = document.createElement('label');
  labelEl.className = 'label';
  if (name) labelEl.htmlFor = name;
  labelEl.textContent = label;

  const input = document.createElement('input');
  input.type = type;
  input.placeholder = placeholder;
  if (name) input.name = name;
  if (name) input.id = name;
  input.className = variant === 'light' ? 'input input-light' : 'input';

  group.appendChild(labelEl);
  group.appendChild(input);

  return { group, input };
}
