function tableClose() {
    document.getElementById("table").style.visibility = "hidden";
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const tableElement = document.querySelector('#table');
        const tableStyle = getComputedStyle(tableElement);
        const tableOpacity = parseFloat(tableStyle.opacity);

        startTableOpacityIncrease(tableElement, tableOpacity);
    }, 3000)

    function startTableOpacityIncrease(element, opacity) {
        const opacityInterval = setInterval(() => {
            opacity += 0.015;
            console.log(opacity);
            element.style.opacity = String(opacity);

            if (opacity >= 1) {
                clearInterval(opacityInterval)
            }
        }, 15);
    }
});
