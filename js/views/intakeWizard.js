// js/views/intakeWizard.js
// LendingTree-style multi-step intake wizard

import { createButton, createInputGroup } from "../uiComponents.js";
import { navigate } from "../router.js";

export async function renderIntakeWizardView({ root }) {
  root.innerHTML = "";

  const container = document.createElement("section");
  container.className = "intake-wizard";

  const title = document.createElement("h1");
  title.textContent = "Get Your Free Roof Report";

  /* ---------------------------------------------
     Wizard Progress
  --------------------------------------------- */
  const progress = document.createElement("div");
  progress.className = "wizard-progress";

  const dots = [0, 1, 2].map(() => {
    const dot = document.createElement("div");
    dot.className = "dot";
    progress.appendChild(dot);
    return dot;
  });

  /* ---------------------------------------------
     Step Containers
  --------------------------------------------- */
  const steps = [step1(), step2(), step3()];
  let current = 0;

  function showStep(i) {
    steps.forEach((s, idx) => (s.style.display = idx === i ? "block" : "none"));
    dots.forEach((d, idx) =>
      d.classList.toggle("active", idx === i)
    );
    current = i;
  }

  /* ---------------------------------------------
     Navigation Buttons
  --------------------------------------------- */
  const nav = document.createElement("div");
  nav.className = "wizard-nav";

  const prev = createButton({
    label: "Back",
    variant: "secondary",
    onClick: () => showStep(current - 1)
  });
  prev.id = "prevStep";

  const next = createButton({
    label: "Next",
    variant: "primary",
    onClick: () => showStep(current + 1)
  });
  next.id = "nextStep";

  const submit = createButton({
    label: "Analyze My Roof",
    variant: "primary",
    onClick: submitWizard
  });
  submit.id = "submitWizard";
  submit.style.display = "none";

  nav.append(prev, next, submit);

  /* ---------------------------------------------
     Assemble Wizard
  --------------------------------------------- */
  container.append(title, progress, ...steps, nav);
  root.appendChild(container);

  showStep(0);

  /* ---------------------------------------------
     Step Definitions
  --------------------------------------------- */

  function step1() {
    const step = document.createElement("div");
    step.className = "wizard-step";

    const { group: addressGroup, input: addressInput } = createInputGroup({
      label: "Property address",
      name: "wiz_address",
      placeholder: "123 Main St, St Augustine, FL",
      variant: "light"
    });

    step.append(addressGroup);

    step.getData = () => ({
      address: addressInput.value.trim()
    });

    return step;
  }

  function step2() {
    const step = document.createElement("div");
    step.className = "wizard-step";

    const { group: storiesGroup, input: storiesInput } = createInputGroup({
      label: "Number of stories",
      name: "wiz_stories",
      type: "number",
      placeholder: "1",
      variant: "light"
    });

    const { group: materialGroup, input: materialInput } = createInputGroup({
      label: "Roof material",
      name: "wiz_material",
      placeholder: "Asphalt shingles",
      variant: "light"
    });

    step.append(storiesGroup, materialGroup);

    step.getData = () => ({
      stories: storiesInput.value.trim(),
      material: materialInput.value.trim()
    });

    return step;
  }

  function step3() {
    const step = document.createElement("div");
    step.className = "wizard-step";

    const { group: emailGroup, input: emailInput } = createInputGroup({
      label: "Email",
      name: "wiz_email",
      type: "email",
      placeholder: "you@example.com",
      variant: "light"
    });

    const { group: phoneGroup, input: phoneInput } = createInputGroup({
      label: "Mobile phone",
      name: "wiz_phone",
      type: "tel",
      placeholder: "555-123-4567",
      variant: "light"
    });

    step.append(emailGroup, phoneGroup);

    step.getData = () => ({
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim()
    });

    return step;
  }

  /* ---------------------------------------------
     Submit Wizard → AI Analysis
  --------------------------------------------- */

  async function submitWizard() {
    const data = Object.assign({}, ...steps.map((s) => s.getData()));

    if (!data.address) {
      alert("Please enter your address.");
      return;
    }

    try {
      const res = await fetch(
        `/api/roof-analysis?address=${encodeURIComponent(data.address)}`
      );
      if (!res.ok) throw new Error("Analysis failed");

      const analysis = await res.json();

      sessionStorage.setItem(
        "roofAnalysis",
        JSON.stringify({
          address: data.address,
          email: data.email,
          phone: data.phone,
          details: {
            stories: data.stories,
            material: data.material
          },
          analysis
        })
      );

      navigate("/analysis");
    } catch (err) {
      console.error(err);
      alert("We couldn’t analyze your roof. Please try again.");
    }
  }

  /* ---------------------------------------------
     Step Navigation Logic
  --------------------------------------------- */

  function showStep(i) {
    steps.forEach((s, idx) => (s.style.display = idx === i ? "block" : "none"));
    dots.forEach((d, idx) =>
      d.classList.toggle("active", idx === i)
    );

    prev.style.display = i === 0 ? "none" : "inline-flex";
    next.style.display = i === steps.length - 1 ? "none" : "inline-flex";
    submit.style.display = i === steps.length - 1 ? "inline-flex" : "none";

    current = i;
  }
}

export const renderView = renderIntakeWizardView;
