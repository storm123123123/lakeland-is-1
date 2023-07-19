$(document).ready(function () {
    const sections = $("section");
    const images = $(".bg");
    const headings = $(".section-heading");
    const outerWrappers = $(".outer");
    const innerWrappers = $(".inner");
    let currentIndex = -1;
    let animating = false;
  
    gsap.set(outerWrappers, { yPercent: 100 });
    gsap.set(innerWrappers, { yPercent: -100 });
  
    function gotoSection(index, direction) {
      index = (index + sections.length) % sections.length;
      if (animating) return;
      animating = true;
      const fromTop = direction === -1;
      const dFactor = fromTop ? -1 : 1;
      const tl = gsap.timeline({
        defaults: { duration: 1.25, ease: "power1.inOut" },
        onComplete: () => (animating = false),
      });
  
      if (currentIndex >= 0) {
        gsap.set(sections.eq(currentIndex), { zIndex: 0 });
        tl.to(images.eq(currentIndex), { yPercent: -15 * dFactor }).set(
          sections.eq(currentIndex),
          { autoAlpha: 0 }
        );
      }
  
      gsap.set(sections.eq(index), { autoAlpha: 1, zIndex: 1 });
      tl.fromTo(
        [outerWrappers.eq(index), innerWrappers.eq(index)],
        {
          yPercent: (i) => (i ? -100 * dFactor : 100 * dFactor),
        },
        {
          yPercent: 0,
        },
        0
      )
        .fromTo(images.eq(index), { yPercent: 15 * dFactor }, { yPercent: 0 }, 0)
        .fromTo(
          headings.eq(index).find(".clip-text > *"),
          {
            autoAlpha: 0,
            yPercent: 150 * dFactor,
          },
          {
            autoAlpha: 1,
            yPercent: 0,
            duration: 1,
            ease: "power2",
            stagger: {
              each: 0.02,
              from: "random",
            },
          },
          0.2
        );
      currentIndex = index;
    }
  
    function handleScroll(event) {
      if (event.originalEvent.deltaY > 0) {
        gotoSection(currentIndex + 1, 1);
      } else {
        gotoSection(currentIndex - 1, -1);
      }
    }
  
    $(window).on("wheel touchstart touchend pointerdown", handleScroll);
  
    gotoSection(0, 1);
  });