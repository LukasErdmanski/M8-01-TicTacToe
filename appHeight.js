/**
 * Set the application height to the height of the device windows innerHeight at the beginning before the html body is build
 * ("solution for the the safari browser in order no y-overflow arises because of the adress bar).
 */
const windowHeight = window.innerHeight;
document.documentElement.style.setProperty('height', `${windowHeight}px`, 'important');

window.addEventListener("resize", function () {
    const windowHeight = window.innerHeight;
    document.documentElement.style.setProperty('height', `${windowHeight}px`, 'important');
}
);