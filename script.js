const clockCanvas = document.querySelector("#clockCanvas");
const clockContext = clockCanvas.getContext("2d");
const dateLabel = document.querySelector("#dateLabel");

function pad(value) {
  return String(value).padStart(2, "0");
}

function drawSlice(radius, angle, color) {
  clockContext.fillStyle = color;
  clockContext.beginPath();
  clockContext.moveTo(230, 230);
  clockContext.lineTo(230, 230 - radius);
  clockContext.arc(230, 230, radius, -Math.PI / 2, (Math.PI / 180) * (angle - 90));
  clockContext.closePath();
  clockContext.shadowColor = "rgba(0, 0, 0, 0.28)";
  clockContext.shadowBlur = 14;
  clockContext.shadowOffsetX = 10;
  clockContext.shadowOffsetY = 10;
  clockContext.fill();
}

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const milliseconds = now.getMilliseconds();
  const minutes = now.getMinutes();
  let hours = now.getHours();

  hours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

  const gradient = clockContext.createRadialGradient(230, 230, 2, 230, 230, 230);
  gradient.addColorStop(0, "#102a2b");
  gradient.addColorStop(1, "#0f766e");
  clockContext.fillStyle = gradient;
  clockContext.fillRect(0, 0, clockCanvas.width, clockCanvas.height);

  drawSlice(188, 0.006 * (seconds * 1000 + milliseconds), "rgba(5, 31, 33, 0.72)");
  drawSlice(140, 0.1 * (minutes * 60 + seconds + milliseconds / 1000), "#0f766e");
  drawSlice(92, 30 * (hours + minutes / 60 + seconds / 3600), "#1d9a8d");

  const time = `${hours}:${pad(minutes)}:${pad(seconds)}`;
  clockContext.shadowColor = "rgba(0, 0, 0, 0.55)";
  clockContext.shadowBlur = 28;
  clockContext.shadowOffsetX = 5;
  clockContext.shadowOffsetY = 6;
  clockContext.fillStyle = "rgba(255, 255, 255, 0.88)";
  clockContext.font = "800 54px Georgia, serif";
  clockContext.textAlign = "center";
  clockContext.fillText(time, 230, 248);

  dateLabel.textContent = now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

setInterval(updateClock, 50);
updateClock();

const tipForm = document.querySelector("#tipForm");
const billAmount = document.querySelector("#billAmount");
const customTip = document.querySelector("#customTip");
const tipPercentLabel = document.querySelector("#tipPercentLabel");
const tipButtons = document.querySelectorAll(".tip-button");
const peopleCount = document.querySelector("#peopleCount");
const decreasePeople = document.querySelector("#decreasePeople");
const increasePeople = document.querySelector("#increasePeople");
const tipResetBtn = document.querySelector("#tipResetBtn");
const tipError = document.querySelector("#tipError");
const billOutput = document.querySelector("#billOutput");
const tipOutput = document.querySelector("#tipOutput");
const totalOutput = document.querySelector("#totalOutput");
const perPerson = document.querySelector("#perPerson");
let tipPercent = 15;

function money(value) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function numberFrom(input) {
  const value = Number(input.value);
  return Number.isFinite(value) ? value : 0;
}

function setTipPercent(value) {
  tipPercent = Math.max(0, Math.min(50, Number(value) || 0));
  customTip.value = String(tipPercent);
  tipPercentLabel.textContent = `${tipPercent}%`;
  tipButtons.forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.tip) === tipPercent);
  });
}

function setPeople(value) {
  peopleCount.value = String(Math.max(1, Math.min(99, Math.round(Number(value) || 1))));
}

function resetTipResult() {
  billOutput.textContent = "$0.00";
  tipOutput.textContent = "$0.00";
  totalOutput.textContent = "$0.00";
  perPerson.textContent = "$0.00";
}

function calculateTip() {
  const bill = numberFrom(billAmount);
  const people = numberFrom(peopleCount);

  if (bill <= 0) {
    tipError.textContent = "Please enter a valid bill amount.";
    return;
  }

  const tip = bill * (tipPercent / 100);
  const total = bill + tip;
  tipError.textContent = "";
  billOutput.textContent = money(bill);
  tipOutput.textContent = money(tip);
  totalOutput.textContent = money(total);
  perPerson.textContent = money(total / people);
}

tipButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setTipPercent(button.dataset.tip);
    if (numberFrom(billAmount) > 0) calculateTip();
  });
});

customTip.addEventListener("input", () => {
  setTipPercent(customTip.value);
  if (numberFrom(billAmount) > 0) calculateTip();
});

decreasePeople.addEventListener("click", () => {
  setPeople(numberFrom(peopleCount) - 1);
  if (numberFrom(billAmount) > 0) calculateTip();
});

increasePeople.addEventListener("click", () => {
  setPeople(numberFrom(peopleCount) + 1);
  if (numberFrom(billAmount) > 0) calculateTip();
});

peopleCount.addEventListener("input", () => setPeople(peopleCount.value));
billAmount.addEventListener("input", () => {
  tipError.textContent = "";
});

tipForm.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateTip();
});

tipResetBtn.addEventListener("click", () => {
  tipForm.reset();
  setTipPercent(15);
  setPeople(1);
  tipError.textContent = "";
  resetTipResult();
});

setTipPercent(15);
resetTipResult();

const metricBtn = document.querySelector("#metricBtn");
const imperialBtn = document.querySelector("#imperialBtn");
const metricFields = document.querySelector("#metricFields");
const imperialFields = document.querySelector("#imperialFields");
const bmiForm = document.querySelector("#bmiForm");
const bmiResetBtn = document.querySelector("#bmiResetBtn");
const bmiError = document.querySelector("#bmiError");
const bmiValue = document.querySelector("#bmiValue");
const bmiCategory = document.querySelector("#bmiCategory");
const bmiMessage = document.querySelector("#bmiMessage");
const healthyRange = document.querySelector("#healthyRange");
const bmiStatusText = document.querySelector("#bmiStatusText");
const meterMarker = document.querySelector("#meterMarker");
const bmiFields = {
  heightCm: document.querySelector("#heightCm"),
  weightKg: document.querySelector("#weightKg"),
  heightFt: document.querySelector("#heightFt"),
  heightIn: document.querySelector("#heightIn"),
  weightLb: document.querySelector("#weightLb"),
};
let unit = "metric";

function setUnit(nextUnit) {
  unit = nextUnit;
  const isMetric = unit === "metric";
  metricBtn.classList.toggle("active", isMetric);
  imperialBtn.classList.toggle("active", !isMetric);
  metricBtn.setAttribute("aria-pressed", String(isMetric));
  imperialBtn.setAttribute("aria-pressed", String(!isMetric));
  metricFields.classList.toggle("hidden", !isMetric);
  imperialFields.classList.toggle("hidden", isMetric);
  bmiError.textContent = "";
  resetBmiResult();
}

function getBmiInputs() {
  if (unit === "metric") {
    const heightCm = numberFrom(bmiFields.heightCm);
    const weightKg = numberFrom(bmiFields.weightKg);
    if (heightCm <= 0 || weightKg <= 0) return { error: "Please enter both height and weight." };
    return { heightM: heightCm / 100, weightKg };
  }

  const totalInches = numberFrom(bmiFields.heightFt) * 12 + numberFrom(bmiFields.heightIn);
  const pounds = numberFrom(bmiFields.weightLb);
  if (totalInches <= 0 || pounds <= 0) return { error: "Please enter height and weight." };
  return { heightM: totalInches * 0.0254, weightKg: pounds * 0.45359237 };
}

function getCategory(bmi) {
  if (bmi < 18.5) {
    return ["Underweight", "Below range", "Your BMI is below the standard healthy range.", "#2563eb"];
  }
  if (bmi < 25) {
    return ["Normal weight", "Healthy", "Your BMI is within the standard healthy range.", "#0f766e"];
  }
  if (bmi < 30) {
    return ["Overweight", "Above range", "Your BMI is above the standard healthy range.", "#d99a12"];
  }
  return ["Obesity", "High range", "Your BMI is in a high range. Consider personal medical guidance.", "#dc2626"];
}

function formatHealthyRange(heightM) {
  const lowKg = 18.5 * heightM * heightM;
  const highKg = 24.9 * heightM * heightM;
  if (unit === "imperial") {
    return `${(lowKg * 2.20462262).toFixed(0)}-${(highKg * 2.20462262).toFixed(0)} lb`;
  }
  return `${lowKg.toFixed(1)}-${highKg.toFixed(1)} kg`;
}

function resetBmiResult() {
  bmiValue.textContent = "--";
  bmiCategory.textContent = "Enter your details";
  bmiMessage.textContent = "Your BMI result and category will appear here.";
  healthyRange.textContent = "--";
  bmiStatusText.textContent = "Waiting";
  bmiValue.style.color = "#0f766e";
  meterMarker.style.left = "0%";
}

function calculateBmi() {
  const values = getBmiInputs();
  if (values.error) {
    bmiError.textContent = values.error;
    return;
  }

  const bmi = values.weightKg / (values.heightM * values.heightM);
  const [label, status, message, color] = getCategory(bmi);
  const markerPercent = ((Math.max(12, Math.min(40, bmi)) - 12) / 28) * 100;

  bmiError.textContent = "";
  bmiValue.textContent = bmi.toFixed(1);
  bmiCategory.textContent = label;
  bmiMessage.textContent = message;
  healthyRange.textContent = formatHealthyRange(values.heightM);
  bmiStatusText.textContent = status;
  bmiValue.style.color = color;
  meterMarker.style.left = `${markerPercent}%`;
}

metricBtn.addEventListener("click", () => setUnit("metric"));
imperialBtn.addEventListener("click", () => setUnit("imperial"));
bmiResetBtn.addEventListener("click", () => {
  bmiForm.reset();
  bmiError.textContent = "";
  resetBmiResult();
});

bmiForm.addEventListener("submit", (event) => {
  event.preventDefault();
  calculateBmi();
});

Object.values(bmiFields).forEach((field) => {
  field.addEventListener("input", () => {
    if (bmiError.textContent) bmiError.textContent = "";
  });
});

resetBmiResult();
