import { getState, setRole, updateIntake } from "../state.js";
import { handleIntakeSubmit } from "../controllers/intakeController.js";

export function renderIntakeView(root) {
  const state = getState();

  root.innerHTML = `
    <section class="intake">
      <h2>Roof Intake Form</h2>

      <label for="intake-address">Property address</label>
      <input
        id="intake-address"
        type="text"
        placeholder="123 Maple St, St. Augustine, FL"
        value="${state.intake.address || ""}"
      />

      <label for="intake-role">I am a...</label>
      <select id="intake-role">
        <option value="homeowner" ${state.role === "homeowner" ? "selected" : ""}>Homeowner</option>
        <option value="roofer" ${state.role === "roofer" ? "selected" : ""}>Roofer</option>
      </select>

      <button class="btn-primary" id="intake-submit">Analyze Roof</button>

      <div id="intake-status"></div>
    </section>
  `;

  document.getElementById("intake-address").addEventListener("input", (e) => {
    updateIntake({ address: e.target.value });
  });

  document.getElementById("intake-role").addEventListener("change", (e) => {
    setRole(e.target.value);
  });

  document.getElementById("intake-submit").addEventListener("click", handleIntakeSubmit);
}
