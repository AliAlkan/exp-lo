const tabs = document.querySelectorAll(".tab");
const segmentButtons = document.querySelectorAll(".segmented button");
const sidebarItems = document.querySelectorAll(".main-links .side-item");
const app = document.querySelector(".app");
const askButton = document.querySelector(".ask-button");
const aiPanel = document.querySelector("#ask-ai-panel");
const aiCloseButton = document.querySelector(".ai-close");
const promptInput = document.querySelector("#ask-input");
const previewRows = document.querySelectorAll(".table-row[data-href]");
const tableSearchInputs = document.querySelectorAll("[data-table-search]");
const typeFilters = document.querySelectorAll("[data-type-filter]");
const tableFilterStates = new Map();

const getTableFilterState = (selector) => {
  if (!tableFilterStates.has(selector)) {
    const table = document.querySelector(selector);

    tableFilterStates.set(selector, {
      table,
      rows: table ? Array.from(table.querySelectorAll(".table-row:not(.table-head)")) : [],
      query: "",
      type: ""
    });
  }

  return tableFilterStates.get(selector);
};

const applyTableFilters = (selector) => {
  const state = getTableFilterState(selector);

  state.rows.forEach((row) => {
    const matchesQuery = !state.query || row.textContent.toLowerCase().includes(state.query);
    const matchesType = !state.type || row.dataset.rowType === state.type;

    row.hidden = !matchesQuery || !matchesType;
  });
};

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

const setAskDrawerOpen = (isOpen, shouldFocusInput = false, shouldRestoreFocus = true) => {
  if (!app || !askButton || !aiPanel) {
    return;
  }

  app.classList.toggle("ai-drawer-closed", !isOpen);
  askButton.setAttribute("aria-expanded", String(isOpen));
  aiPanel.setAttribute("aria-hidden", String(!isOpen));
  setDrawerInert(!isOpen);

  if (!isOpen) {
    if (shouldRestoreFocus) {
      askButton.focus({ preventScroll: true });
    }
    return;
  }

  if (shouldFocusInput && promptInput) {
    window.setTimeout(() => {
      promptInput.focus({ preventScroll: true });
    }, 180);
  }
};

const shouldAskDrawerStartOpen = askButton?.getAttribute("aria-expanded") !== "false" && !app?.classList.contains("ai-drawer-closed");
setAskDrawerOpen(shouldAskDrawerStartOpen, false, false);

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

previewRows.forEach((row) => {
  const navigate = (event) => {
    if (event.target.closest("button")) {
      return;
    }

    window.location.href = row.dataset.href;
  };

  row.addEventListener("click", navigate);
  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    navigate(event);
  });
});

tableSearchInputs.forEach((input) => {
  const selector = input.dataset.tableSearch;
  const state = getTableFilterState(selector);

  input.addEventListener("input", () => {
    state.query = input.value.trim().toLowerCase();
    applyTableFilters(selector);
  });
});

typeFilters.forEach((filter) => {
  const selector = filter.dataset.typeFilter;
  const state = getTableFilterState(selector);
  const trigger = filter.querySelector(".type-filter-trigger");
  const menu = filter.querySelector(".type-filter-menu");
  const label = filter.querySelector("[data-type-filter-label]");
  const options = Array.from(filter.querySelectorAll("[data-filter-value]"));

  const setOpen = (isOpen) => {
    filter.classList.toggle("open", isOpen);
    trigger?.setAttribute("aria-expanded", String(isOpen));

    if (menu) {
      menu.hidden = !isOpen;
    }
  };

  trigger?.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!filter.classList.contains("open"));
  });

  trigger?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " " && event.key !== "ArrowDown") {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
    const selectedOption = options.find((option) => option.classList.contains("active")) || options[0];
    selectedOption?.focus({ preventScroll: true });
  });

  options.forEach((option) => {
    const selectOption = () => {
      state.type = option.dataset.filterValue;

      options.forEach((item) => {
        const isSelected = item === option;
        item.classList.toggle("active", isSelected);
        item.setAttribute("aria-selected", String(isSelected));
      });

      if (label) {
        label.textContent = state.type ? option.textContent.trim() : "Type";
      }

      setOpen(false);
      trigger?.focus({ preventScroll: true });
      applyTableFilters(selector);
    };

    option.addEventListener("click", () => {
      selectOption();
    });

    option.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        trigger?.focus({ preventScroll: true });
        return;
      }

      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      event.preventDefault();
      selectOption();
    });
  });
});

document.addEventListener("click", (event) => {
  typeFilters.forEach((filter) => {
    if (!filter.contains(event.target)) {
      filter.classList.remove("open");
      filter.querySelector(".type-filter-trigger")?.setAttribute("aria-expanded", "false");
      const menu = filter.querySelector(".type-filter-menu");

      if (menu) {
        menu.hidden = true;
      }
    }
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

document.querySelector(".prompt-field")?.addEventListener("submit", (event) => {
  event.preventDefault();
});
