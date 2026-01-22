export function setupQuoteSubmission(buttonId, priceId, notesId, onSubmit) {
  const button = document.getElementById(buttonId);
  const priceInput = document.getElementById(priceId);
  const notesInput = document.getElementById(notesId);

  if (!button || !priceInput || !notesInput) return;

  button.addEventListener("click", async () => {
    const price = priceInput.value.trim();
    const notes = notesInput.value.trim();

    if (!price) {
      alert("Please enter a price before submitting.");
      return;
    }

    button.disabled = true;
    button.textContent = "Submitting...";

    try {
      await onSubmit({ price, notes });
      alert("Quote submitted successfully.");
      priceInput.value = "";
      notesInput.value = "";
    } catch (err) {
      console.error(err);
      alert("Error submitting quote.");
    }

    button.disabled = false;
    button.textContent = "Submit Quote";
  });
}
