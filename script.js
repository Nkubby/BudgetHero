const amountInput = document.getElementById("amount");
const weeklyInput = document.getElementById("weekly");
const weeksInput = document.getElementById("weeks");
const planTypeInputs = document.getElementsByName("planType");
const weeklyInputDiv = document.getElementById("weeklyInput");
const timeframeInputDiv = document.getElementById("timeframeInput");
const resultDiv = document.getElementById("result");
const frequencyDropdown = document.getElementById("frequency");

// Show/hide input fields based on plan type
planTypeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.value === "weekly" && input.checked) {
      weeklyInputDiv.style.display = "block";
      timeframeInputDiv.style.display = "none";
    } else if (input.value === "timeframe" && input.checked) {
      weeklyInputDiv.style.display = "none";
      timeframeInputDiv.style.display = "block";
    }
    resultDiv.innerText = ""; // Clear result when toggling
  });
});

function calculatePlan() {
  // Clear previous message
  resultDiv.innerText = "";
  resultDiv.style.color = "#2b6653";

  const goal = document.getElementById("goal").value.trim();
  const total = parseFloat(amountInput.value);
  const planType = document.querySelector('input[name="planType"]:checked').value;
  const frequency = frequencyDropdown.value;

  if (!goal || isNaN(total) || total <= 0) {
    resultDiv.innerText = "⚠️ Please enter a valid goal and amount.";
    resultDiv.style.color = "red";
    return;
  }

  let message = "";

  if (planType === "weekly") {
    const amountPerPeriod = parseFloat(weeklyInput.value);
    if (isNaN(amountPerPeriod) || amountPerPeriod <= 0) {
      resultDiv.innerText = "⚠️ Please enter a valid amount you can save.";
      resultDiv.style.color = "red";
      return;
    }

    const weeks = total / amountPerPeriod;
    const periods = Math.ceil(weeks / getDivisor(frequency));
    const label = getLabel(frequency);

    message = `To save $${formatMoney(total)} for "${goal}", you need to save $${formatMoney(amountPerPeriod)} ${label}, for approximately ${periods} ${label === "per month" ? "months" : "periods"}.`;

  } else if (planType === "timeframe") {
    const numPeriods = parseFloat(weeksInput.value);
    if (isNaN(numPeriods) || numPeriods <= 0) {
      resultDiv.innerText = "⚠️ Please enter a valid number of periods.";
      resultDiv.style.color = "red";
      return;
    }

    const amountPerPeriod = total / (numPeriods * getDivisor(frequency));
    const label = getLabel(frequency);

    message = `To save $${formatMoney(total)} for "${goal}" in ${numPeriods} ${label === "per month" ? "months" : "periods"}, you need to save about $${formatMoney(amountPerPeriod)} ${label}.`;
  }

  resultDiv.innerText = message;
  resultDiv.style.color = "#2b6653";
}

// Helper to handle money formatting
function formatMoney(amount) {
  return amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Converts saving frequency to weekly divisor
function getDivisor(frequency) {
  if (frequency === "weekly") return 1;
  if (frequency === "biweekly") return 0.5;
  if (frequency === "monthly") return 1 / 4.33; // approx. 0.231
  return 1;
}

// Label for human-friendly message
function getLabel(frequency) {
  if (frequency === "weekly") return "per week";
  if (frequency === "biweekly") return "every 2 weeks";
  if (frequency === "monthly") return "per month";
  return "";
}

// Trigger calculate on Enter key
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculatePlan();
  }
});
