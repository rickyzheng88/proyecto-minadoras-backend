let vel = document.getElementsByClassName('vel');
for (let element of vel) {
    let vel_dropdown;
    let vel_d;

    for (let i = 0; i < element.childNodes.length; i++) {
        if (element.childNodes[i].className == 'vel-dropdown') {
            vel_dropdown = element.childNodes[i];
        }
                
        if (element.childNodes[i].className == 'sec2-2-c vel-d') {
            vel_d = element.childNodes[i];
        }
    }

    vel_d.onclick = () => {
        if (window.getComputedStyle(vel_dropdown).display == "flex") {
            vel_dropdown.style.display = "none";
        } else {
            vel_dropdown.style.display = "flex";
        }
    }
}

