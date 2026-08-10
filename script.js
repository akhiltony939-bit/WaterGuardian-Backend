// ==========================================
// WaterGuardian-X Professional Script
// ==========================================

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function(e){

        e.preventDefault();

        const target =
        document.querySelector(
            this.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

// ==========================================
// Scroll To Top Button
// ==========================================

const topBtn =
document.getElementById("topBtn");

window.addEventListener("scroll",()=>{

    if(window.scrollY>300){

        topBtn.style.display="block";

    }

    else{

        topBtn.style.display="none";

    }

});

topBtn.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ==========================================
// Header Shadow
// ==========================================

const header =
document.querySelector("header");

window.addEventListener("scroll",()=>{

    if(window.scrollY>50){

        header.style.boxShadow =
        "0 8px 20px rgba(0,0,0,.2)";

    }

    else{

        header.style.boxShadow =
        "none";

    }

});

// ==========================================
// Counter Animation
// ==========================================

const counters =
document.querySelectorAll(".stat-card h2");

const speed = 60;

counters.forEach(counter=>{

    const updateCounter=()=>{

        const targetText =
        counter.innerText;

        const target =
        parseInt(targetText.replace(/\D/g,""));

        let current =
        Number(counter.dataset.count || 0);

        const increment =
        Math.ceil(target/speed);

        if(current<target){

            current+=increment;

            if(current>target){

                current=target;

            }

            counter.dataset.count=current;

            if(targetText.includes("%")){

                counter.innerText=current+"%";

            }

            else if(targetText.includes("+")){

                counter.innerText=current+"+";

            }

            else{

                counter.innerText=current;

            }

            setTimeout(updateCounter,25);

        }

    };

    updateCounter();

});

// ==========================================
// Reveal Animation
// ==========================================

const revealItems =
document.querySelectorAll(

".card,.stat-card,.tech-grid div"

);

const reveal=()=>{

    revealItems.forEach(item=>{

        const top =
        item.getBoundingClientRect().top;

        if(top<window.innerHeight-80){

            item.style.opacity="1";

            item.style.transform=
            "translateY(0)";

        }

    });

};

revealItems.forEach(item=>{

    item.style.opacity="0";

    item.style.transform=
    "translateY(40px)";

    item.style.transition=
    "all .6s ease";

});

window.addEventListener("scroll",reveal);

reveal();

// ==========================================
// Welcome Message
// ==========================================

window.addEventListener("load",()=>{

    console.log(

        "🚰 WaterGuardian-X Loaded Successfully"

    );

});