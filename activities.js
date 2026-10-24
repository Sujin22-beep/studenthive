/* StudentHive — Explore Activities page
   Cards HTML-la irukku (img src direct). JS filter, search, image warning mattum. */

const state = {
  filter: "all",
  query: ""
}

document.addEventListener("DOMContentLoaded", () => {
  setupNavbar()
  setupNavbarShadow()
  setupFilters()
  setupSearch()
  checkImages()
  applyFilters()
})

/* ---------- Missing image warning (console) ---------- */
function checkImages() {
  document.querySelectorAll(".card__media img").forEach(img => {
    const warn = () => console.warn(`Image not found: ${img.getAttribute("src")}  (${img.alt})`)

    if (img.complete && img.naturalWidth === 0) {
      warn()
    } else {
      img.addEventListener("error", warn)
    }
  })
}

/* ---------- Filter + search together ---------- */
function applyFilters() {
  const cards = document.querySelectorAll("#activityGrid .card")
  const emptyState = document.getElementById("emptyState")
  let visibleCount = 0

  cards.forEach(card => {
    const matchesCategory = state.filter === "all" || card.dataset.category === state.filter
    const text = card.textContent.toLowerCase()
    const matchesSearch = state.query === "" || text.includes(state.query)

    const show = matchesCategory && matchesSearch
    card.hidden = !show
    if (show) visibleCount++
  })

  emptyState.hidden = visibleCount > 0
}

/* ---------- Category chips ---------- */
function setupFilters() {
  const chips = document.querySelectorAll(".chip")

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      state.filter = chip.dataset.filter

      chips.forEach(c => {
        const active = c === chip
        c.classList.toggle("is-active", active)
        c.setAttribute("aria-pressed", String(active))
      })

      applyFilters()
    })
  })
}

/* ---------- Search ---------- */
function setupSearch() {
  const input = document.getElementById("searchInput")
  if (!input) return

  input.addEventListener("input", () => {
    state.query = input.value.trim().toLowerCase()
    applyFilters()
  })
}

/* ---------- Navbar dropdown (mobile / tablet) ---------- */
function setupNavbar() {
  const toggle = document.getElementById("menuToggle")
  const navLinks = document.getElementById("navLinks")
  if (!toggle || !navLinks) return

  const setOpen = open => {
    navLinks.classList.toggle("open", open)
    toggle.setAttribute("aria-expanded", String(open))
    toggle.querySelector("i").className = open ? "fa-solid fa-xmark" : "fa-solid fa-bars"
  }

  toggle.addEventListener("click", () => {
    setOpen(!navLinks.classList.contains("open"))
  })

  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setOpen(false))
  })

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setOpen(false)
  })

  window.matchMedia("(min-width: 901px)").addEventListener("change", event => {
    if (event.matches) setOpen(false)
  })
}

/* ---------- Navbar shadow on scroll (same as home) ---------- */
function setupNavbarShadow() {
  const navbar = document.getElementById("navbar")
  if (!navbar) return

  window.addEventListener("scroll", () => {
    navbar.style.boxShadow =
      window.scrollY > 10 ? "0 4px 16px rgba(0,0,0,0.08)" : "0 2px 10px rgba(0,0,0,0.05)"
  })
}