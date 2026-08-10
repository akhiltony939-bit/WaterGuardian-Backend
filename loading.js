/* ==========================================
   WaterGuardian-X Professional Loading JS
========================================== */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    // Prevent page scrolling while loading
    document.body.style.overflow = "hidden";

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";

        setTimeout(() => {

            loader.style.display = "none";
            document.body.style.overflow = "auto";

        }, 600);

    }, 1500);

});