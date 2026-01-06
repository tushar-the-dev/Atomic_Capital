gsap.registerPlugin(ScrollTrigger);


const paths = [...document.querySelectorAll("#barsSvg path")];
const TOTAL_STEPS = 6;
const STEP = 1 / TOTAL_STEPS;

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section_how_we_build",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    pin: ".how-we-build-section-wrapper",
    anticipatePin: 1,
    markers: true,
  //   snap: {
  //   snapTo: 1/6,
  //   duration: 0.4,
  //   ease: "power2.out",
  //   delay: 0
  // },
  }
});

// tl.to(".svg-progress-bar",
//     {
//          width: "100%",
//          ease: "none",

//     }, 0
// )

;

paths.forEach((path, i) => {
  const stroke = path.getAttribute("stroke");
  if (!stroke || !stroke.startsWith("url")) return;

  const gradientId = stroke.match(/#([^)]+)/)?.[1];
  if (!gradientId) return;

  const gradient = document.getElementById(gradientId);
  if (!gradient) return;

  const stops = gradient.querySelectorAll("stop");
  if (stops.length < 2) return;

  const [topStop, bottomStop] = stops;

  // Initial state
  gsap.set(topStop, { stopOpacity: 0.2 });
  gsap.set(bottomStop, { stopOpacity: 0.05 });

  // 👇 one path per scroll segment
  tl.to(topStop, {
    stopOpacity: 1,
    ease: "none",
    duration: 1
  });

  tl.to(bottomStop, {
    stopOpacity: 0,
    ease: "none",
    duration: 1
  }, "<"); // run together with topStop
});

// ✅ Add progress bar synced to full timeline
tl.to(".svg-progress-bar", {
  width: "100%",
  ease: "none",
  duration: tl.duration() // match entire timeline
}, 0)
