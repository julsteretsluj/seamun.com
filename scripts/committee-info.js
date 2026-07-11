/**
 * Committee info popover (hover / click) for committee cards.
 */
(function (global) {
  var COMMITTEE_INFO = {
    ecosoc: {
      grades: "Grades 7–12 & university",
      difficulty: "Beginner",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 20,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
    press: {
      grades: "Grades 7–12 & university",
      difficulty: "Beginner",
      chairs: 2,
      chairsLabel: "Editors",
      delegates: 15,
      rop: "Special",
      crisis: false,
      esl: false,
    },
    unhrc: {
      grades: "Grades 9–12 & university",
      difficulty: "Intermediate",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 30,
      rop: "Traditional",
      crisis: false,
      esl: true,
    },
    unodc: {
      grades: "Grades 9–12 & university",
      difficulty: "Intermediate",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 20,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
    unsc: {
      grades: "Grades 7–12 & university",
      difficulty: "Intermediate",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 15,
      rop: "Special",
      crisis: true,
      esl: false,
    },
    unwomen: {
      grades: "Grades 9–12 & university",
      difficulty: "Intermediate",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 20,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
    disec: {
      grades: "Grades 7–12 & university",
      difficulty: "Advanced",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 20,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
    fwc: {
      grades: "Grades 9–12 & university",
      difficulty: "Advanced",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 10,
      rop: "Special",
      crisis: true,
      esl: false,
    },
    interpol: {
      grades: "Grades 9–12 & university",
      difficulty: "Advanced",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 20,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
    who: {
      grades: "Grades 9–12 & university",
      difficulty: "Advanced",
      chairs: 2,
      chairsLabel: "Chairs",
      delegates: 30,
      rop: "Traditional",
      crisis: false,
      esl: false,
    },
  };

  if (global.SEAMUNCommitteeData) {
    Object.keys(COMMITTEE_INFO).forEach(function (key) {
      var data = global.SEAMUNCommitteeData[key];
      if (!data) return;
      if (data.delegates != null) COMMITTEE_INFO[key].delegates = data.delegates;
      if (data.chairs != null) COMMITTEE_INFO[key].chairs = data.chairs;
    });
  }

  var popover = null;
  var activeBtn = null;
  var pinned = false;
  var hoverTimer = null;

  function ensurePopover() {
    if (popover) return popover;
    popover = document.createElement("div");
    popover.id = "committee-info-popover";
    popover.className = "committee-info-popover";
    popover.setAttribute("role", "tooltip");
    popover.hidden = true;
    document.body.appendChild(popover);
    return popover;
  }

  function tagHtml(label, value, extraClass) {
    var cls = "committee-info-tag" + (extraClass ? " " + extraClass : "");
    return '<span class="' + cls + '"><span class="committee-info-tag-label">' + label + "</span> " + value + "</span>";
  }

  function buildPopoverContent(info) {
    var difficultyClass =
      "committee-info-tag--" + info.difficulty.toLowerCase().replace(/\s+/g, "-");
    var html = '<p class="committee-info-popover-title">Committee info</p><div class="committee-info-tags">';
    html += tagHtml("Age", info.grades);
    html += tagHtml("Difficulty", info.difficulty, difficultyClass);
    html += tagHtml(info.chairsLabel, String(info.chairs));
    html += tagHtml("Delegates", String(info.delegates));
    html += tagHtml("RoP", info.rop);
    html += tagHtml("Crisis", info.crisis ? "Yes" : "No", info.crisis ? "committee-info-tag--crisis" : "");
    html += tagHtml("Language", info.esl ? "ESL" : "Normal", info.esl ? "committee-info-tag--esl" : "");
    html += "</div>";
    return html;
  }

  function positionPopover(btn) {
    if (!popover || !btn) return;
    var rect = btn.getBoundingClientRect();
    popover.style.position = "fixed";
    var width = popover.offsetWidth || 280;
    var left = Math.min(rect.right - width, window.innerWidth - width - 12);
    left = Math.max(12, left);
    var top = rect.bottom + 8;
    if (top + popover.offsetHeight > window.innerHeight - 12) {
      top = rect.top - popover.offsetHeight - 8;
    }
    popover.style.left = left + "px";
    popover.style.top = Math.max(12, top) + "px";
  }

  function showPopover(btn, id) {
    var info = COMMITTEE_INFO[id];
    if (!info || !btn) return;
    ensurePopover();
    popover.innerHTML = buildPopoverContent(info);
    popover.hidden = false;
    activeBtn = btn;
    btn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      positionPopover(btn);
    });
  }

  function hidePopover() {
    if (!popover) return;
    popover.hidden = true;
    if (activeBtn) {
      activeBtn.setAttribute("aria-expanded", "false");
      activeBtn = null;
    }
    pinned = false;
  }

  function createInfoButton(id) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "committee-info-btn";
    btn.setAttribute("aria-label", "Committee information");
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("data-committee-info", id);
    btn.innerHTML =
      '<span class="committee-info-btn-icon" aria-hidden="true">i</span>';

    btn.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(function () {
        if (!pinned) showPopover(btn, id);
      }, 120);
    });

    btn.addEventListener("mouseleave", function () {
      clearTimeout(hoverTimer);
      if (!pinned) hidePopover();
    });

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (pinned && activeBtn === btn) {
        hidePopover();
        return;
      }
      pinned = true;
      showPopover(btn, id);
    });

    btn.addEventListener("focus", function () {
      showPopover(btn, id);
    });

    btn.addEventListener("blur", function () {
      setTimeout(function () {
        if (!popover || popover.hidden) return;
        if (popover.matches(":hover") || btn.matches(":hover")) return;
        if (!pinned) hidePopover();
      }, 150);
    });

    return btn;
  }

  function attachToCard(card, id) {
    if (!COMMITTEE_INFO[id] || card.querySelector(".committee-info-btn")) return;
    card.classList.add("has-committee-info");
    card.appendChild(createInfoButton(id));
  }

  function applyCommitteeLogos() {
    var logos = global.SEAMUNCommitteeLogos;
    if (!logos) return;
    document.querySelectorAll(".committee-card[data-committee] .committee-card-emblem img, a.home-committee-card[href*='committee.html'] img").forEach(function (img) {
      var root = img.closest("[data-committee]") || img.closest("a.home-committee-card");
      var id = root && (root.getAttribute("data-committee") || (root.getAttribute("href") || "").match(/[?&]c=([^&]+)/i));
      id = id ? (Array.isArray(id) ? id[1] : id).toLowerCase() : null;
      if (id && logos[id]) {
        img.src = logos[id];
        img.classList.add("committee-card-emblem-full", "home-committee-logo-full");
      }
    });
  }

  function init() {
    ensurePopover();
    applyCommitteeLogos();

    document.querySelectorAll(".committee-card[data-committee]").forEach(function (card) {
      attachToCard(card, card.getAttribute("data-committee"));
    });

    document.querySelectorAll("a.home-committee-card[href*='committee.html']").forEach(function (link) {
      var match = link.getAttribute("href").match(/[?&]c=([^&]+)/i);
      if (match) attachToCard(link, match[1].toLowerCase());
    });

    popover.addEventListener("mouseenter", function () {
      clearTimeout(hoverTimer);
    });

    popover.addEventListener("mouseleave", function () {
      if (!pinned) hidePopover();
    });

    document.addEventListener("click", function (e) {
      if (
        !popover ||
        popover.hidden ||
        popover.contains(e.target) ||
        e.target.closest(".committee-info-btn")
      ) {
        return;
      }
      hidePopover();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") hidePopover();
    });

    window.addEventListener(
      "resize",
      function () {
        if (activeBtn && !popover.hidden) positionPopover(activeBtn);
      },
      { passive: true }
    );
  }

  global.SEAMUN_COMMITTEE_INFO = COMMITTEE_INFO;
  global.SEAMUNCommitteeInfo = { init: init, attachToCard: attachToCard };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(typeof window !== "undefined" ? window : globalThis);
