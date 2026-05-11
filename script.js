const heroScaleRoot = document.querySelector("[data-hero-scale-root]");
const heroFrame = document.querySelector(".hero-frame");
const experienceScaleRoot = document.querySelector("[data-experience-scale-root]");
const experienceFrame = document.querySelector(".experience-frame");
const caseScaleRoot = document.querySelector("[data-case-scale-root]");
const caseFrame = document.querySelector(".case-frame");
const caseHeader = document.querySelector(".case-header");
const scrollTopButton = document.querySelector("[data-scroll-top]");
const caseToc = document.querySelector(".case-toc");
const caseTocTrigger = document.querySelector(".case-toc-trigger");
const caseTocItems = Array.from(document.querySelectorAll("[data-case-section-target]"));
const caseTocLines = Array.from(document.querySelectorAll(".case-toc-line"));

function updateHeroScale() {
  if (!heroScaleRoot || !heroFrame) {
    return;
  }

  heroScaleRoot.style.setProperty("--hero-scale", "1");
  heroScaleRoot.style.height = `${heroFrame.offsetHeight}px`;
}

function updateExperienceScale() {
  if (!experienceScaleRoot || !experienceFrame) {
    return;
  }

  experienceScaleRoot.style.setProperty("--experience-scale", "1");
  experienceScaleRoot.style.height = `${experienceFrame.offsetHeight}px`;
}

function updateCaseScale() {
  if (!caseScaleRoot || !caseFrame) {
    return;
  }

  caseScaleRoot.style.setProperty("--case-scale", "1");
  caseScaleRoot.style.height = `${caseFrame.offsetHeight}px`;
}

window.addEventListener("resize", updateHeroScale);
window.addEventListener("resize", updateExperienceScale);
window.addEventListener("resize", updateCaseScale);
window.addEventListener("load", updateHeroScale);
window.addEventListener("load", updateExperienceScale);
window.addEventListener("load", updateCaseScale);

if ("ResizeObserver" in window && heroScaleRoot) {
  const observer = new ResizeObserver(() => {
    updateHeroScale();
    updateExperienceScale();
    updateCaseScale();
  });

  observer.observe(heroScaleRoot);

  if (experienceScaleRoot) {
    observer.observe(experienceScaleRoot);
  }

  if (caseScaleRoot) {
    observer.observe(caseScaleRoot);
  }
}

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function setActiveCaseToc(targetId) {
  caseTocItems.forEach((item, index) => {
    const isActive = item.dataset.caseSectionTarget === targetId;
    item.classList.toggle("is-active", isActive);

    if (caseTocLines[index]) {
      caseTocLines[index].classList.toggle("is-active", isActive);
    }
  });
}

function updateCaseTocActive() {
  if (!caseTocItems.length) {
    return;
  }

  const sections = caseTocItems
    .map((item) => document.getElementById(item.dataset.caseSectionTarget))
    .filter(Boolean);

  if (!sections.length) {
    return;
  }

  let activeId = sections[0].id;
  const viewportAnchor = window.innerHeight * 0.24;

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top <= viewportAnchor) {
      activeId = section.id;
    }
  });

  setActiveCaseToc(activeId);
}

if (caseTocItems.length) {
  caseTocItems.forEach((item) => {
    item.addEventListener("click", () => {
      const target = document.getElementById(item.dataset.caseSectionTarget);

      if (!target) {
        return;
      }

      const headerOffset = caseHeader ? caseHeader.offsetHeight + 24 : 40;
      const top = window.scrollY + target.getBoundingClientRect().top - headerOffset;
      window.scrollTo({ top, behavior: "smooth" });
      setActiveCaseToc(target.id);

      if (caseToc) {
        caseToc.classList.remove("is-open");
      }
    });
  });

  window.addEventListener("scroll", updateCaseTocActive, { passive: true });
  window.addEventListener("load", updateCaseTocActive);
}

if (caseToc && caseTocTrigger) {
  caseTocTrigger.addEventListener("click", () => {
    caseToc.classList.toggle("is-open");
  });

  document.addEventListener("click", (event) => {
    if (!caseToc.classList.contains("is-open")) {
      return;
    }

    if (caseToc.contains(event.target)) {
      return;
    }

    caseToc.classList.remove("is-open");
  });
}

updateHeroScale();
updateExperienceScale();
updateCaseScale();
updateCaseTocActive();
