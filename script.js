const amountInput = document.getElementById("amount");
const weeklyInput = document.getElementById("weekly");
const weeksInput = document.getElementById("weeks");
const planTypeInputs = document.getElementsByName("planType");
const weeklyInputDiv = document.getElementById("weeklyInput");
const timeframeInputDiv = document.getElementById("timeframeInput");
const resultDiv = document.getElementById("result");
const frequencyDropdown = document.getElementById("frequency");

// Show/hide inputs based on selected plan type
planTypeInputs.forEach(input => {
  input.addEventListener("change", () => {
    if (input.value === "weekly" && input.checked) {
      weeklyInputDiv.style.display = "block";
      timeframeInputDiv.style.display = "none";
    } else if (input.value === "timeframe" && input.checked) {
      weeklyInputDiv.style.display = "none";
      timeframeInputDiv.style.display = "block";
    }
  });
});

function calculatePlan() {
  const goal = document.getElementById("goal").value;
  const total = parseFloat(amountInput.value);
  const planType = document.querySelector('input[name="planType"]:checked').value;
  const frequency = frequencyDropdown.value;

  if (!goal || isNaN(total) || total <= 0) {
    resultDiv.innerText = "Please enter a valid goal and amount.";
    return;
  }

  let message = "";

  if (planType === "weekly") {
    const amountPerPeriod = parseFloat(weeklyInput.value);
    if (isNaN(amountPerPeriod) || amountPerPeriod <= 0) {
      resultDiv.innerText = "Please enter a valid amount you can save.";
      return;
    }

    const weeks = total / amountPerPeriod;
    const periods = Math.ceil(weeks / getDivisor(frequency));
    const label = getLabel(frequency);

    message = `To save $${total.toFixed(2)} for "${goal}", you need to save $${amountPerPeriod.toFixed(2)} ${label}, for approximately ${periods} ${label === "per month" ? "months" : "periods"}.`;

  } else if (planType === "timeframe") {
    const numPeriods = parseFloat(weeksInput.value);
    if (isNaN(numPeriods) || numPeriods <= 0) {
      resultDiv.innerText = "Please enter a valid number of periods.";
      return;
    }

    const amountPerPeriod = total / (numPeriods * getDivisor(frequency));
    const label = getLabel(frequency);

    message = `To save $${total.toFixed(2)} for "${goal}" in ${numPeriods} ${label === "per month" ? "months" : "periods"}, you need to save about $${amountPerPeriod.toFixed(2)} ${label}.`;
  }

  resultDiv.innerText = message;
}

function getDivisor(frequency) {
  if (frequency === "weekly") return 1;
  if (frequency === "biweekly") return 0.5;
  if (frequency === "monthly") return 0.23; // approx. 4.33 weeks per month
  return 1;
}

function getLabel(frequency) {
  if (frequency === "weekly") return "per week";
  if (frequency === "biweekly") return "every 2 weeks";
  if (frequency === "monthly") return "per month";
  return "";
}