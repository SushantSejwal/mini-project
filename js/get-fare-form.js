const formToggle = document.getElementById("form-activating-button");
const formContainer = document.getElementById("get-fare-form-container");
if (formToggle && formContainer)
    formToggle.addEventListener("click", () =>
        formContainer.classList.add("active")
    );

const closingBtn = document.querySelector(".get-fare-form-container .closing-btn");
const closingBtnLines = document.querySelectorAll(".get-fare-form-container .closing-btn .line");
if (closingBtn && closingBtnLines.length) {
    closingBtn.addEventListener("click", () => {
        closingBtnLines.forEach((line) => line.classList.toggle("active"));
        formContainer?.classList.remove("active");
    });
}

if (formContainer)
    formContainer.addEventListener("transitionend", () => {
        if (!formContainer.classList.contains("active")) {
            formContainer.querySelectorAll("input").forEach((i) => (i.value = ""));
        }
    });

document.addEventListener("cabme:see-prices", (e) => {
    if (formContainer) formContainer.classList.add("active");
    console.log("Fare form activated with data:", e.detail);
});