document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("followup-checkbox");
    const conditionalArea = document.getElementById("conditional-area");

    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            conditionalArea.style.display = "block";
        } else {
            conditionalArea.style.display = "none";
        }
    });
});
