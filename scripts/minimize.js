let buttons = document.querySelectorAll("button");

buttons.forEach(button => {
    button.addEventListener("click", () =>{
        minMaxElement(button, button.parentElement.parentElement)
    })
})

function minMaxElement(button, el) {
    // The section's content, excluding the div containing
    // the button and date.
    const content = el.children;

    // Create a fragment to store removed elements.
    if (!el._savedContent) {
        el._savedContent = document.createDocumentFragment();
    }

    const savedContent = el._savedContent;

    // If the entry is currently minimized, restore it.
    if (button.dataset.state === "max") {
        el.appendChild(savedContent);
        button.dataset.state = "min";
        button.innerText = "-[min]";
    } else {
        // Move every child except the button/date container
        // into the fragment.
        while (el.children.length > 1) {
            savedContent.appendChild(el.children[1]);
        }

        button.dataset.state = "max";
        button.innerText = "v[max]";
    }
}
