// gsap.registerPlugin(ScrollTrigger);


// const paths = [...document.querySelectorAll("#barsSvg path")];
// const TOTAL_STEPS = 6;
// const STEP = 1 / TOTAL_STEPS;

// const blocks = document.querySelectorAll('.graph-path-block');

// console.log(blocks);

// const tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".section_how_we_build",
//     start: "top top",
//     end: "bottom bottom",
//     scrub: true,
//     pin: ".how-we-build-section-wrapper",
//     anticipatePin: 1,
//     markers: true,
//     //   snap: {
//     //   snapTo: 1/6,
//     //   duration: 0.4,
//     //   ease: "power2.out",
//     //   delay: 0
//     // },
//   }
// });

// // tl.to(".svg-progress-bar",
// //     {
// //          width: "100%",
// //          ease: "none",

// //     }, 0
// // );

// blocks.forEach((block, blockNumber) => {

//   const paths = block.querySelectorAll('path');

//   paths.forEach((path, i) => {
//     const stroke = path.getAttribute("stroke");
//     if (!stroke || !stroke.startsWith("url")) return;

//     const gradientId = stroke.match(/#([^)]+)/)?.[1];
//     if (!gradientId) return;

//     const gradient = document.getElementById(gradientId);
//     if (!gradient) return;

//     const stops = gradient.querySelectorAll("stop");
//     if (stops.length < 2) return;

//     const [topStop, bottomStop] = stops;

//     // Initial state
//     gsap.set(topStop, { stopOpacity: 0.2 });
//     gsap.set(bottomStop, { stopOpacity: 0.05 });

//     // 👇 one path per scroll segment
//     tl.to(topStop, {
//       stopOpacity: 1,
//       ease: "none",
//       duration: 1
//     });

//     tl.to(bottomStop, {
//       stopOpacity: 0,
//       ease: "none",
//       duration: 1
//     }, "<"); // run together with topStop
//   });

// });
// // ✅ Add progress bar synced to full timeline
// tl.to(".svg-progress-bar", {
//   width: "100%",
//   ease: "none",
//   duration: tl.duration() // match entire timeline
// }, 0)
gsap.registerPlugin(ScrollTrigger);

const blocks = document.querySelectorAll(".graph-path-block");

const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".section_how_we_build",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        pin: ".how-we-build-section-wrapper",
        anticipatePin: 1,
        markers: true
    }
});

/* ----------------------------------------
   1️⃣ FILL BLOCK 1 IMMEDIATELY (NO ANIMATION)
----------------------------------------- */
(() => {
    const firstBlock = blocks[0];
    if (!firstBlock) return;

    firstBlock.querySelectorAll("path").forEach(path => {
        const stroke = path.getAttribute("stroke");
        if (!stroke?.startsWith("url")) return;

        const gradientId = stroke.match(/#([^)]+)/)?.[1];
        const gradient = document.getElementById(gradientId);
        if (!gradient) return;

        const stops = gradient.querySelectorAll("stop");
        if (stops.length < 2) return;

        const [topStop, bottomStop] = stops;

        gsap.set(topStop, { stopOpacity: 1 });
        gsap.set(bottomStop, { stopOpacity: 0 });
    });
})();

/* ----------------------------------------
   2️⃣ ANIMATE FROM BLOCK 2 ONWARDS
----------------------------------------- */
blocks.forEach((block, blockIndex) => {
    if (blockIndex === 0) return; // 👈 skip block 1

    block.querySelectorAll("path").forEach(path => {
        const stroke = path.getAttribute("stroke");
        if (!stroke?.startsWith("url")) return;

        const gradientId = stroke.match(/#([^)]+)/)?.[1];
        const gradient = document.getElementById(gradientId);
        if (!gradient) return;

        const stops = gradient.querySelectorAll("stop");
        if (stops.length < 2) return;

        const [topStop, bottomStop] = stops;

        // Initial (empty) state for animated blocks
        gsap.set(topStop, { stopOpacity: 0.2 });
        gsap.set(bottomStop, { stopOpacity: 0.05 });

        // Animate fill
        tl.to(topStop, {
            stopOpacity: 1,
            ease: "none",
            duration: 1
        });

        tl.to(bottomStop, {
            stopOpacity: 0,
            ease: "none",
            duration: 1
        }, "<");
    });
});

/* ----------------------------------------
   3️⃣ PROGRESS BAR (SYNCED)
----------------------------------------- */
tl.to(".svg-progress-bar", {
    width: "100%",
    ease: "none",
    duration: tl.duration()
}, 0);
