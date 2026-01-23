// js/uiComponents.js
// Unified UI component library

/* BUTTONS */

export function createButton({ label, variant = "primary", onClick, type = "button" }) {
  const btn = document.createElement("button");
  btn.type = type;
  btn.className = `btn btn-${variant}`;
  btn.textContent = label;

  if (typeof onClick === "function") {
    btn.addEventListener("click", onClick);
  }

  return btn;
}

/* INPUT GROUPS */

export function createInputGroup({
  label,
  name,
  type = "text",
  placeholder = "",
  variant = "dark"
}) {
  const group = document.createElement("div");
  group.className = "input-group";

  const labelEl = document.createElement("label");
  labelEl.className = "label";
  labelEl.textContent = label;
  if (name) labelEl.htmlFor = name;

  const input = document.createElement("input");
  input.type = type;
  input.placeholder = placeholder;
  if (name) input.name = name;
  if (name) input.id = name;
  input.className = variant === "light" ? "input-light" : "input";

  group.append(labelEl, input);
  return { group, input };
}

/* CARD */

export function createCard({ title, subtext, variant = "dark", content }) {
  const card = document.createElement("div");
  card.className = variant === "light" ? "card card-light" : "card";

  if (title) {
    const header = document.createElement("div");
    header.className = "card-header";
    header.textContent = title;
    card.appendChild(header);
  }

  if (subtext) {
    const sub = document.createElement("p");
    sub.className = "card-subtext";
    sub.textContent = subtext;
    card.appendChild(sub);
  }

  if (content) {
    if (Array.isArray(content)) {
      content.forEach((c) => card.appendChild(c));
    } else if (typeof content === "string") {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = content;
      card.appendChild(wrapper);
    } else {
      card.appendChild(content);
    }
  }

  return card;
}

/* METRIC ROW */

export function createMetricRow(label, value) {
  const row = document.createElement("div");
  row.className = "card-row";

  const l = document.createElement("span");
  l.textContent = label;

  const v = document.createElement("strong");
  v.textContent = value;

  row.append(l, v);
  return row;
}
