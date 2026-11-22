import './style.css'

const DEFAULT_DISHES = [
  {
    name: 'Ensalada Griega de Quinoa',
    description: 'Quinoa, pepino, tomate, aceitunas Kalamata, queso feta y aliño de limón y hierbas frescas.',
    price: '14€',
    tag: 'Fresco',
    img: 'https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg',
    ingredients: ['Quinoa', 'Pepino', 'Tomate', 'Aceitunas Kalamata', 'Queso feta', 'Limón', 'Hierbas frescas'],
    allergens: ['Lácteos']
  },
  {
    name: 'Garides Saganaki',
    description: 'Langostinos salteados en salsa de tomate especiada con feta fundido y un toque de ouzo.',
    price: '18€',
    tag: 'Especialidad',
    img: 'https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg',
    ingredients: ['Langostinos', 'Tomate', 'Queso feta', 'Ouzo', 'Especias', 'Aceite de oliva'],
    allergens: ['Crustáceos', 'Lácteos', 'Sulfitos']
  },
  {
    name: 'Lamb Tagine Marroquí',
    description: 'Cordero cocinado a fuego lento con albaricoques, especias dulces y cuscús esponjoso.',
    price: '22€',
    tag: 'De la casa',
    img: 'https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg',
    ingredients: ['Cordero', 'Albaricoques', 'Cuscús', 'Comino', 'Canela', 'Cúrcuma'],
    allergens: ['Gluten']
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Pasta fresca artesanal con crema de parmesano, mantequilla y pimienta negra recién molida.',
    price: '16€',
    tag: 'Clásico',
    img: 'https://www.themealdb.com/images/media/meals/0jv5gx1661040802.jpg',
    ingredients: ['Pasta fresca', 'Parmesano', 'Mantequilla', 'Nata', 'Pimienta negra'],
    allergens: ['Gluten', 'Lácteos', 'Huevo']
  },
  {
    name: 'Gigantes Plaki',
    description: 'Alubias gigantes al horno en salsa de tomate, eneldo y aceite de oliva virgen extra.',
    price: '15€',
    tag: 'Vegetariano',
    img: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg',
    ingredients: ['Alubias gigantes', 'Tomate', 'Eneldo', 'Cebolla', 'Aceite de oliva virgen extra'],
    allergens: []
  },
  {
    name: 'Honey Yogurt Cheesecake',
    description: 'Tarta cremosa de yogur griego con miel de tomillo, nueces y base crujiente.',
    price: '9€',
    tag: 'Postre',
    img: 'https://www.themealdb.com/images/media/meals/y2irzl1585563479.jpg',
    ingredients: ['Yogur griego', 'Miel de tomillo', 'Nueces', 'Base de galleta', 'Huevo'],
    allergens: ['Lácteos', 'Frutos secos', 'Gluten', 'Huevo']
  }
]

const STORAGE_KEY = 'northwestmad_dishes'
const ADMIN_KEY = 'northwestmad_admin'
const ADMIN_PASS = 'northwestmad2026'
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80'
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const splitList = (value) => Array.isArray(value)
  ? value
  : typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(Boolean) : []
const normalizeDish = (d) => ({
  ...d,
  tag: d.tag || 'Mediterráneo',
  ingredients: splitList(d.ingredients),
  allergens: splitList(d.allergens)
})

const loadDishes = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DISHES.map(normalizeDish)
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed.map(normalizeDish) : DEFAULT_DISHES.map(normalizeDish)
  } catch { return DEFAULT_DISHES.map(normalizeDish) }
}
const saveDishes = (dishes) => localStorage.setItem(STORAGE_KEY, JSON.stringify(dishes))
let dishes = loadDishes()
let isAdmin = sessionStorage.getItem(ADMIN_KEY) === '1'

const app = document.querySelector('#app')

const renderDishCard = (d, i) => `
  <article class="dish-card reveal visible" data-index="${i}" role="button" tabindex="0" aria-label="Ver ficha de ${esc(d.name)}" style="--delay:${i * 0.05}s">
    <div class="dish-img">
      <img src="${esc(d.img)}" alt="${esc(d.name)}" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" />
      <span class="dish-tag">${esc(d.tag)}</span>
      ${isAdmin ? `
        <div class="dish-tools">
          <button class="dish-tool dish-edit" data-index="${i}" aria-label="Editar ${esc(d.name)}" title="Editar plato">✎</button>
          <button class="dish-tool dish-delete" data-index="${i}" aria-label="Eliminar ${esc(d.name)}" title="Eliminar plato">×</button>
        </div>` : ''}
    </div>
    <div class="dish-body">
      <div class="dish-top">
        <h3>${esc(d.name)}</h3>
        <span class="dish-price">${esc(d.price)}</span>
      </div>
      <p>${esc(d.description)}</p>
      ${d.ingredients.length ? `<p class="dish-ingredients"><span>Ingredientes</span> ${esc(d.ingredients.slice(0, 4).join(' · '))}${d.ingredients.length > 4 ? ' · …' : ''}</p>` : ''}
      <span class="dish-view">Ver ficha <span aria-hidden="true">→</span></span>
    </div>
  </article>
`

const renderMenu = () => {
  const grid = document.getElementById('menuGrid')
  if (!grid) return
  grid.innerHTML = dishes.map(renderDishCard).join('')
  grid.querySelectorAll('.dish-card').forEach(card => {
    const open = () => isAdmin ? openDishEditor(Number(card.dataset.index)) : openDishDetail(Number(card.dataset.index))
    card.addEventListener('click', open)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open() }
    })
  })
  grid.querySelectorAll('.dish-edit').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation()
    openDishEditor(Number(btn.dataset.index))
  }))
  grid.querySelectorAll('.dish-delete').forEach(btn => btn.addEventListener('click', (e) => {
    e.stopPropagation()
    deleteDish(Number(btn.dataset.index))
  }))
}

app.innerHTML = `
  <div class="cursor-glow" aria-hidden="true"></div>
  <nav class="nav" id="nav">
    <a class="brand" href="#inicio" aria-label="Northwestmad inicio">
      <span class="brand-mark">A</span>
      <span class="brand-name">Northwestmad</span>
    </a>
    <button class="nav-toggle" id="navToggle" aria-label="Abrir menú" aria-expanded="false">
      <span></span><span></span>
    </button>
    <div class="nav-links" id="navLinks">
      <a href="#nosotros">Nosotros</a>
      <a href="#carta">Carta</a>
      <a href="#experiencia">Experiencia</a>
      <a href="#reservas" class="nav-cta">Reservar</a>
    </div>
  </nav>

  <header class="hero" id="inicio">
    <div class="hero-bg">
      <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80" alt="" class="hero-img" />
      <div class="hero-overlay"></div>
    </div>
    <div class="hero-content reveal">
      <p class="eyebrow">Cocina Mediterránea · Madrid</p>
      <h1>El sabor del<br><em>Mediterráneo</em></h1>
      <p class="hero-lead">Ingredientes frescos, recetas con alma y una atmósfera pensada para disfrutar cada momento.</p>
      <div class="hero-actions">
        <a href="#reservas" class="btn btn-primary">Reservar mesa</a>
        <a href="#carta" class="btn btn-ghost">Ver carta</a>
      </div>
    </div>
    <div class="hero-scroll" aria-hidden="true">
      <span>Descubre</span>
      <div class="scroll-line"></div>
    </div>
  </header>

  <section class="section about" id="nosotros">
    <div class="container about-grid">
      <div class="about-images reveal">
        <div class="about-img-main">
          <img src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80" alt="Interior del restaurante Northwestmad" loading="lazy" />
        </div>
        <div class="about-img-float">
          <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=600&q=80" alt="Plato mediterráneo" loading="lazy" />
        </div>
        <div class="about-badge">
          <strong>15+</strong>
          <span>Años de<br>tradición</span>
        </div>
      </div>
      <div class="about-copy reveal">
        <p class="eyebrow">Nuestra esencia</p>
        <h2>Tradición mediterránea,<br><em>espíritu contemporáneo</em></h2>
        <p>En Northwestmad celebramos la riqueza culinaria del Mediterráneo. Desde las costas griegas hasta los mercados marroquíes, cada plato cuenta una historia de origen, producto y pasión.</p>
        <p>Trabajamos con productores locales y aceite de oliva virgen extra para crear una cocina honesta, luminosa y llena de matices.</p>
        <div class="about-stats">
          <div><strong data-count="100">0</strong><span>% Producto fresco</span></div>
          <div><strong data-count="40">0</strong><span>Recetas artesanales</span></div>
          <div><strong data-count="4.9">0</strong><span>Valoración media</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section menu" id="carta">
    <div class="container">
      <div class="section-head reveal">
        <p class="eyebrow">Nuestra carta</p>
        <h2>Platos con <em>carácter</em></h2>
        <p class="section-lead">Una selección de sabores mediterráneos elaborados con técnica, respeto por el producto y un toque contemporáneo.</p>
      </div>
      <div class="menu-grid" id="menuGrid"></div>
    </div>
  </section>

  <section class="section experience" id="experiencia">
    <div class="container experience-grid">
      <div class="experience-copy reveal">
        <p class="eyebrow">La experiencia</p>
        <h2>Más que una cena,<br><em>un recuerdo</em></h2>
        <p>Cada detalle en Northwestmad está cuidado: la luz, la música, el servicio y, por supuesto, el sabor. Creamos espacios donde las conversaciones fluyen y los momentos se quedan.</p>
        <ul class="experience-list">
          <li><span class="exp-icon">✦</span><div><strong>Producto de temporada</strong><span>Seleccionamos ingredientes en su mejor momento.</span></div></li>
          <li><span class="exp-icon">✦</span><div><strong>Bodega mediterránea</strong><span>Vinos seleccionados para acompañar cada plato.</span></div></li>
          <li><span class="exp-icon">✦</span><div><strong>Ambiente cuidado</strong><span>Un espacio cálido, elegante y acogedor.</span></div></li>
        </ul>
      </div>
      <div class="experience-visual reveal">
        <div class="exp-img exp-img-a"><img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80" alt="Ambiente del restaurante" loading="lazy" /></div>
        <div class="exp-img exp-img-b"><img src="https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=700&q=80" alt="Plato servido en mesa" loading="lazy" /></div>
      </div>
    </div>
  </section>

  <section class="section reservation" id="reservas">
    <div class="reservation-bg">
      <img src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1600&q=80" alt="" loading="lazy" />
      <div class="reservation-overlay"></div>
    </div>
    <div class="container reservation-grid">
      <div class="reservation-copy reveal">
        <p class="eyebrow">Reservas</p>
        <h2>Tu mesa te <em>espera</em></h2>
        <p>Reserva en pocos segundos y déjanos preparar una experiencia mediterránea inolvidable para ti y los tuyos.</p>
        <div class="reservation-info">
          <div><span class="info-label">Dirección</span><span>Calle del Olivo 27, Madrid</span></div>
          <div><span class="info-label">Horario</span><span>Mar–Dom · 13:00–23:30</span></div>
          <div><span class="info-label">Teléfono</span><span>+34 910 000 000</span></div>
        </div>
      </div>
      <form class="reservation-form reveal" id="reserveForm">
        <div class="form-row">
          <label><span>Nombre</span><input type="text" name="name" required placeholder="Tu nombre" /></label>
          <label><span>Teléfono</span><input type="tel" name="phone" required placeholder="+34 600 000 000" /></label>
        </div>
        <div class="form-row">
          <label><span>Fecha</span><input type="date" name="date" required /></label>
          <label><span>Hora</span><input type="time" name="time" required /></label>
        </div>
        <div class="form-row">
          <label><span>Personas</span>
            <select name="guests">
              <option>2 personas</option><option>3 personas</option><option>4 personas</option>
              <option>5 personas</option><option>6+ personas</option>
            </select>
          </label>
          <label><span>Ocasión</span>
            <select name="occasion">
              <option>Cena casual</option><option>Celebración</option><option>Cita especial</option><option>Comida de empresa</option>
            </select>
          </label>
        </div>
        <button type="submit" class="btn btn-primary btn-full">Confirmar reserva</button>
        <p class="form-note" id="formNote">Te confirmaremos la reserva por teléfono o email.</p>
      </form>
    </div>
  </section>

  <footer class="footer">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="#inicio"><span class="brand-mark">A</span><span class="brand-name">Northwestmad</span></a>
        <p class="footer-tagline">Cocina mediterránea con alma.</p>
      </div>
      <div class="footer-links">
        <a href="#nosotros">Nosotros</a>
        <a href="#carta">Carta</a>
        <a href="#experiencia">Experiencia</a>
        <a href="#reservas">Reservas</a>
      </div>
      <div class="footer-meta">
        <span>Calle del Olivo 27, Madrid</span>
        <span>+34 910 000 000</span>
        <span>hola@northwestmadrestaurante.com</span>
      </div>
    </div>
    <div class="container footer-bottom">
      <span>© ${new Date().getFullYear()} Northwestmad. Todos los derechos reservados.</span>
    </div>
  </footer>

  <div class="detail-modal" id="dishModal" aria-hidden="true">
    <div class="detail-panel" id="dishDetail"></div>
  </div>

  <div class="admin-modal" id="adminModal" aria-hidden="true">
    <div class="admin-panel">
      <div class="admin-head">
        <div>
          <p class="eyebrow">Administración</p>
          <h2>Gestionar <em>carta</em></h2>
        </div>
        <button class="admin-close" id="adminClose" aria-label="Cerrar">×</button>
      </div>

      <div id="adminAuth">
        <p class="admin-copy">Introduce la contraseña de administrador para añadir o eliminar platos.</p>
        <form id="adminLoginForm" class="admin-form">
          <label><span>Contraseña</span><input type="password" name="password" required placeholder="Contraseña" /></label>
          <button type="submit" class="btn btn-primary btn-full">Entrar</button>
          <p class="form-note" id="adminLoginNote"></p>
        </form>
      </div>

      <div id="adminDashboard" class="admin-hidden">
        <form id="dishForm" class="admin-form admin-add">
          <div class="admin-editor-head">
            <h3 id="editorTitle">Añadir plato</h3>
            <button type="button" class="btn-muted btn-small admin-hidden" id="cancelEdit">Cancelar edición</button>
          </div>
          <div class="admin-img-preview">
            <img id="imgPreview" src="${FALLBACK_IMG}" alt="Vista previa del plato" onerror="this.src='${FALLBACK_IMG}'" />
            <span>Vista previa</span>
          </div>
          <div class="form-row">
            <label><span>Nombre</span><input name="name" required placeholder="Nombre del plato" /></label>
            <label><span>Precio</span><input name="price" required placeholder="18€" /></label>
          </div>
          <div class="form-row">
            <label><span>Etiqueta</span><input name="tag" placeholder="Especialidad" /></label>
            <label><span>Imagen URL</span><input name="img" required placeholder="https://..." /></label>
          </div>
          <label><span>Descripción</span><textarea name="description" required rows="3" placeholder="Descripción del plato"></textarea></label>
          <label><span>Ingredientes <small>(separados por comas)</small></span><textarea name="ingredients" rows="2" placeholder="Tomate, aceite de oliva, albahaca"></textarea></label>
          <label><span>Alergias <small>(separadas por comas)</small></span><input name="allergens" placeholder="Gluten, lácteos, frutos secos" /></label>
          <div class="admin-actions">
            <button type="submit" class="btn btn-primary" id="saveDish">Añadir plato</button>
            <button type="button" class="btn-danger admin-hidden" id="deleteCurrent">Eliminar plato</button>
            <button type="button" class="btn btn-muted" id="adminLogout">Cerrar sesión</button>
          </div>
          <p class="form-note" id="adminDishNote"></p>
        </form>
        <div class="admin-list-wrap">
          <h3>Platos actuales <span class="admin-hint">Pulsa un plato para editarlo</span></h3>
          <div id="adminList" class="admin-list"></div>
        </div>
      </div>
    </div>
  </div>
`

// Dish detail
const dishModal = document.getElementById('dishModal')
const dishDetail = document.getElementById('dishDetail')
const chips = (items, cls) => items.map(item => `<span class="${cls}">${esc(item)}</span>`).join('')

const closeDishDetail = () => {
  dishModal.classList.remove('open')
  dishModal.setAttribute('aria-hidden', 'true')
}

const openDishDetail = (index) => {
  const d = dishes[index]
  if (!d) return
  dishDetail.innerHTML = `
    <button class="admin-close detail-close" id="detailClose" aria-label="Cerrar">×</button>
    <div class="detail-img"><img src="${esc(d.img)}" alt="${esc(d.name)}" onerror="this.src='${FALLBACK_IMG}'" /></div>
    <div class="detail-body">
      <p class="eyebrow">${esc(d.tag)}</p>
      <h2>${esc(d.name)}</h2>
      <div class="detail-price">${esc(d.price)}</div>
      <p class="detail-description">${esc(d.description)}</p>
      <div class="detail-section">
        <h3>Ingredientes</h3>
        <div class="chips">${d.ingredients.length ? chips(d.ingredients, 'chip') : '<p class="admin-empty">Sin ingredientes especificados.</p>'}</div>
      </div>
      <div class="detail-section">
        <h3>Alergias</h3>
        <div class="chips">${d.allergens.length ? chips(d.allergens, 'chip chip-alert') : '<span class="chip chip-ok">Sin alérgenos declarados</span>'}</div>
      </div>
      ${isAdmin ? '<button type="button" class="btn btn-primary" id="detailEdit">Editar plato</button>' : ''}
    </div>
  `
  dishModal.classList.add('open')
  dishModal.setAttribute('aria-hidden', 'false')
  document.getElementById('detailClose').addEventListener('click', closeDishDetail)
  const editBtn = document.getElementById('detailEdit')
  if (editBtn) editBtn.addEventListener('click', () => { closeDishDetail(); openDishEditor(index) })
}
dishModal.addEventListener('click', (e) => { if (e.target === dishModal) closeDishDetail() })

// Menu render
renderMenu()

const renderAdminList = () => {
  const list = document.getElementById('adminList')
  if (!list) return
  list.innerHTML = dishes.map((d, i) => `
    <div class="admin-item">
      <button type="button" class="admin-item-main" data-index="${i}">
        <strong>${esc(d.name)}</strong>
        <span>${esc(d.price)} · ${esc(d.tag)}</span>
        <span class="admin-item-detail">${d.allergens.length ? `Alergias: ${esc(d.allergens.join(', '))}` : 'Sin alérgenos declarados'}</span>
      </button>
      <div class="admin-item-actions">
        <button type="button" class="admin-edit" data-index="${i}">Editar</button>
        <button type="button" class="admin-del" data-index="${i}">Eliminar</button>
      </div>
    </div>
  `).join('') || '<p class="admin-empty">No hay platos en la carta.</p>'
  list.querySelectorAll('.admin-item-main, .admin-edit').forEach(btn => btn.addEventListener('click', () => openDishEditor(Number(btn.dataset.index))))
  list.querySelectorAll('.admin-del').forEach(btn => btn.addEventListener('click', () => deleteDish(Number(btn.dataset.index))))
}

// Admin
const adminModal = document.getElementById('adminModal')
const adminClose = document.getElementById('adminClose')
const adminAuth = document.getElementById('adminAuth')
const adminDashboard = document.getElementById('adminDashboard')
const adminLoginForm = document.getElementById('adminLoginForm')
const adminLoginNote = document.getElementById('adminLoginNote')
const dishForm = document.getElementById('dishForm')
const editorTitle = document.getElementById('editorTitle')
const saveDishBtn = document.getElementById('saveDish')
const cancelEdit = document.getElementById('cancelEdit')
const deleteCurrent = document.getElementById('deleteCurrent')
const adminDishNote = document.getElementById('adminDishNote')
const adminLogout = document.getElementById('adminLogout')
const imgPreview = document.getElementById('imgPreview')
const field = (name) => dishForm.elements.namedItem(name)

let editingIndex = null

const syncPreview = () => { imgPreview.src = field('img').value.trim() || FALLBACK_IMG }
field('img').addEventListener('input', syncPreview)

const setNote = (message, type = '') => {
  adminDishNote.textContent = message
  adminDishNote.className = `form-note${type ? ` ${type}` : ''}`
}

const resetEditor = () => {
  editingIndex = null
  dishForm.reset()
  editorTitle.textContent = 'Añadir plato'
  saveDishBtn.textContent = 'Añadir plato'
  cancelEdit.classList.add('admin-hidden')
  deleteCurrent.classList.add('admin-hidden')
  syncPreview()
  setNote('')
}

const openDishEditor = (index) => {
  if (!isAdmin) return
  const d = dishes[index]
  if (!d) return
  editingIndex = index
  field('name').value = d.name || ''
  field('price').value = d.price || ''
  field('tag').value = d.tag || ''
  field('img').value = d.img || ''
  field('description').value = d.description || ''
  field('ingredients').value = d.ingredients.join(', ')
  field('allergens').value = d.allergens.join(', ')
  editorTitle.textContent = `Editar: ${d.name}`
  saveDishBtn.textContent = 'Guardar cambios'
  cancelEdit.classList.remove('admin-hidden')
  deleteCurrent.classList.remove('admin-hidden')
  setNote('')
  syncPreview()
  if (!adminModal.classList.contains('open')) openAdmin()
  dishForm.scrollIntoView({ behavior: 'smooth', block: 'start' })
  field('name').focus({ preventScroll: true })
}

const deleteDish = (index) => {
  const d = dishes[index]
  if (!d || !isAdmin) return
  if (!window.confirm(`¿Eliminar "${d.name}" de la carta?`)) return
  dishes.splice(index, 1)
  saveDishes(dishes)
  if (editingIndex === index) {
    resetEditor()
    setNote('Plato eliminado.', 'success')
  } else {
    if (editingIndex !== null && index < editingIndex) editingIndex -= 1
    setNote('Plato eliminado.', 'success')
  }
  renderMenu()
  renderAdminList()
}

const syncAdmin = () => {
  adminAuth.classList.toggle('admin-hidden', isAdmin)
  adminDashboard.classList.toggle('admin-hidden', !isAdmin)
  if (!isAdmin) resetEditor()
  renderMenu()
  renderAdminList()
}
const openAdmin = () => { adminModal.classList.add('open'); adminModal.setAttribute('aria-hidden', 'false'); syncAdmin() }
const closeAdmin = () => {
  adminModal.classList.remove('open')
  adminModal.setAttribute('aria-hidden', 'true')
  if (window.location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search)
}

adminClose.addEventListener('click', closeAdmin)
adminModal.addEventListener('click', (e) => { if (e.target === adminModal) closeAdmin() })
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  if (dishModal.classList.contains('open')) closeDishDetail()
  else closeAdmin()
})

const syncAdminRoute = () => {
  if (window.location.hash === '#admin') openAdmin()
  else if (adminModal.classList.contains('open')) closeAdmin()
}
window.addEventListener('hashchange', syncAdminRoute)
syncAdminRoute()

adminLoginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const pass = new FormData(adminLoginForm).get('password')
  if (pass === ADMIN_PASS) {
    isAdmin = true
    sessionStorage.setItem(ADMIN_KEY, '1')
    adminLoginNote.textContent = ''
    adminLoginForm.reset()
    syncAdmin()
  } else {
    adminLoginNote.textContent = 'Contraseña incorrecta.'
    adminLoginNote.classList.add('error')
  }
})

dishForm.addEventListener('submit', (e) => {
  e.preventDefault()
  const fd = new FormData(dishForm)
  const dish = normalizeDish({
    name: fd.get('name').trim(),
    price: fd.get('price').trim(),
    tag: fd.get('tag').trim() || 'Mediterráneo',
    img: fd.get('img').trim(),
    description: fd.get('description').trim(),
    ingredients: splitList(fd.get('ingredients')),
    allergens: splitList(fd.get('allergens'))
  })
  const wasEditing = editingIndex !== null
  if (wasEditing) dishes[editingIndex] = dish
  else dishes.unshift(dish)
  saveDishes(dishes)
  resetEditor()
  setNote(wasEditing ? 'Cambios guardados.' : 'Plato añadido a la carta.', 'success')
  renderMenu()
  renderAdminList()
})

cancelEdit.addEventListener('click', () => { resetEditor(); dishForm.scrollIntoView({ behavior: 'smooth', block: 'start' }) })
deleteCurrent.addEventListener('click', () => { if (editingIndex !== null) deleteDish(editingIndex) })

adminLogout.addEventListener('click', () => {
  isAdmin = false
  sessionStorage.removeItem(ADMIN_KEY)
  syncAdmin()
})

// Navigation
const nav = document.getElementById('nav')
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40)
window.addEventListener('scroll', onScroll, { passive: true })
onScroll()

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open')
  navToggle.setAttribute('aria-expanded', open)
})
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open')
  navToggle.setAttribute('aria-expanded', 'false')
}))

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal')
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible')
      revealObs.unobserve(e.target)
    }
  })
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
revealEls.forEach(el => revealObs.observe(el))

// Counter animation
const counters = document.querySelectorAll('[data-count]')
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return
    const el = e.target
    const target = parseFloat(el.dataset.count)
    const isFloat = String(target).includes('.')
    const duration = 1600
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - p, 3)
      const val = target * ease
      el.textContent = isFloat ? val.toFixed(1) : Math.floor(val)
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
    counterObs.unobserve(el)
  })
}, { threshold: 0.6 })
counters.forEach(c => counterObs.observe(c))

// Cursor glow
const glow = document.querySelector('.cursor-glow')
let glowX = 0, glowY = 0, curX = 0, curY = 0
window.addEventListener('pointermove', (e) => { glowX = e.clientX; glowY = e.clientY }, { passive: true })
const animateGlow = () => {
  curX += (glowX - curX) * 0.08
  curY += (glowY - curY) * 0.08
  glow.style.transform = `translate(${curX}px, ${curY}px)`
  requestAnimationFrame(animateGlow)
}
if (window.matchMedia('(pointer:fine)').matches) animateGlow()

// Hero parallax
const heroImg = document.querySelector('.hero-img')
window.addEventListener('scroll', () => {
  const y = window.scrollY
  if (y < window.innerHeight) heroImg.style.transform = `scale(1.08) translateY(${y * 0.18}px)`
}, { passive: true })

// Reservation form
const form = document.getElementById('reserveForm')
const note = document.getElementById('formNote')
const dateInput = form.querySelector('input[name="date"]')
const today = new Date().toISOString().split('T')[0]
dateInput.min = today

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const name = data.get('name')
  note.textContent = `Gracias, ${name}. Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmarla.`
  note.classList.add('success')
  form.reset()
  dateInput.min = today
})
