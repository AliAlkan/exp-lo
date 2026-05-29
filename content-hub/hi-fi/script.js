const tabs = document.querySelectorAll(".tab");
const segmentButtons = document.querySelectorAll(".segmented button");
const sidebarItems = document.querySelectorAll(".main-links .side-item");
const app = document.querySelector(".app");
const askButton = document.querySelector(".ask-button");
const aiPanel = document.querySelector("#ask-ai-panel");
const aiCloseButton = document.querySelector(".ai-close");
const promptInput = document.querySelector("#ask-input");

const setDrawerInert = (isInert) => {
  if (!aiPanel) {
    return;
  }

  if ("inert" in aiPanel) {
    aiPanel.inert = isInert;
  }

  if (isInert) {
    aiPanel.setAttribute("inert", "");
  } else {
    aiPanel.removeAttribute("inert");
  }
};

const setAskDrawerOpen = (isOpen, shouldFocusInput = false) => {
  if (!app || !askButton || !aiPanel) {
    return;
  }

  app.classList.toggle("ai-drawer-closed", !isOpen);
  askButton.setAttribute("aria-expanded", String(isOpen));
  aiPanel.setAttribute("aria-hidden", String(!isOpen));
  setDrawerInert(!isOpen);

  if (!isOpen) {
    askButton.focus({ preventScroll: true });
    return;
  }

  if (shouldFocusInput && promptInput) {
    window.setTimeout(() => {
      promptInput.focus({ preventScroll: true });
    }, 180);
  }
};

setAskDrawerOpen(true);

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
  });
});

segmentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    segmentButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

sidebarItems.forEach((item) => {
  item.addEventListener("click", () => {
    sidebarItems.forEach((entry) => entry.classList.remove("selected"));
    item.classList.add("selected");
  });
});

askButton?.addEventListener("click", () => {
  const isOpen = askButton.getAttribute("aria-expanded") === "true";
  setAskDrawerOpen(!isOpen, !isOpen);
});

aiCloseButton?.addEventListener("click", () => {
  setAskDrawerOpen(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !aiPanel || askButton?.getAttribute("aria-expanded") !== "true") {
    return;
  }

  if (aiPanel.contains(document.activeElement)) {
    setAskDrawerOpen(false);
  }
});

document.querySelector(".prompt-field").addEventListener("submit", (event) => {
  event.preventDefault();
});
