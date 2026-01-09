gsap.registerPlugin(ScrollTrigger);

const blocks = document.querySelectorAll(".graph-path-block");

/* ----------------------------------------
   HELPERS
----------------------------------------- */
const getGradientStops = (path) => {
  const stroke = path.getAttribute("stroke");
  if (!stroke?.startsWith("url")) return null;

  const gradientId = stroke.match(/#([^)]+)/)?.[1];
  const gradient = document.getElementById(gradientId);
  if (!gradient) return null;

  const stops = gradient.querySelectorAll("stop");
  if (stops.length < 2) return null;

  return { top: stops[0], bottom: stops[1] };
};

const getLabel = (index) =>
  document.querySelector(`#block-label-${index + 1}`);

/* ----------------------------------------
   INITIAL STATE
----------------------------------------- */

// Hide all labels
blocks.forEach((_, i) => {
  const label = getLabel(i);
  if (label) gsap.set(label, { opacity: 0 });
});

// Pre-fill BLOCK 1
if (blocks[0]) {
  blocks[0].querySelectorAll("path").forEach(path => {
    const stops = getGradientStops(path);
    if (!stops) return;

    gsap.set(stops.top, { stopOpacity: 1 });
    gsap.set(stops.bottom, { stopOpacity: 0 });
  });
}

/* ----------------------------------------
   TIMELINE
----------------------------------------- */
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
   BLOCKS 2+ WITH WINDOWED LABELS
----------------------------------------- */
blocks.forEach((block, blockIndex) => {
  if (blockIndex === 0) return;

  const label = getLabel(blockIndex);

  /* ---- LABEL ON (ENTER BLOCK) ---- */
  tl.to(label, {
    opacity: 1,
    duration: 0.4,


  });

  /* ---- PATH FILL (BLOCK DURATION) ---- */
  block.querySelectorAll("path").forEach(path => {
    const stops = getGradientStops(path);
    if (!stops) return;

    gsap.set(stops.top, { stopOpacity: 0.2 });
    gsap.set(stops.bottom, { stopOpacity: 0.05 });

    tl.to(stops.top, {
      stopOpacity: 1,
      duration: 1,
      ease: "none"
    });

    tl.to(stops.bottom, {
      stopOpacity: 0,
      duration: 1,
      ease: "none"
    }, "<");
  });

  /* ---- LABEL OFF (EXIT BLOCK) ---- */
  tl.to(label, {
    opacity: 0,
    duration: 0.01,
    ease: "none"
  });
});

/* ----------------------------------------
   PROGRESS BAR
----------------------------------------- */
tl.to(".svg-progress-bar", {
  width: "100%",
  ease: "none",
  duration: tl.duration()
}, 0);
