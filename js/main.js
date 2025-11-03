const hamMenuBtn = document.getElementById("ham-menu");
const hamMenuLines = document.querySelectorAll(".line");
hamMenuBtn.addEventListener("click", () => {
    //  hamMenuLines
    hamMenuLines.forEach( ele => {
        ele.classList.toggle("clicked");
    });
})