function tableClose() {
    document.getElementById("table").style.visibility = "hidden";
}

window.addEventListener('load', () => {
    setTimeout(() => {
        const tableElement = document.querySelector('#table');

        tableElement.style.visibility = 'visible';
        tableElement.style.animation = "tableFadeIn 2s"
    }, 3000)
});