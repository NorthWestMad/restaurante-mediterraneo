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
const BOOKINGS_KEY = 'northwestmad_bookings'
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
const loadBookings = () => {
  try {
    const raw = localStorage.getItem(BOOKINGS_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(b => b && b.date && b.time) : []
  } catch { return [] }
}
const saveBookings = (list) => localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list))
const toISO = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const todayISO = () => toISO(new Date())
const startOfWeek = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - (d.getDay() + 6) % 7)
  return d
}
const WEEKDAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']

let dishes = loadDishes()
let bookings = loadBookings()
let calendarWeek = startOfWeek(new Date())
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

  <section class="admin-app" id="adminApp" aria-hidden="true">
    <div class="admin-login" id="adminAuth">
      <div class="admin-login-card">
        <span class="brand-mark">A</span>
        <p class="eyebrow">Área privada</p>
        <h2>Acceso a <em>gestión</em></h2>
        <p class="admin-copy">Introduce la contraseña para administrar la carta y las reservas del restaurante.</p>
        <form id="adminLoginForm" class="admin-form">
          <label><span>Contraseña</span><input type="password" name="password" required placeholder="Contraseña" autocomplete="current-password" /></label>
          <button type="submit" class="btn btn-primary btn-full">Entrar al panel</button>
          <p class="form-note" id="adminLoginNote"></p>
        </form>
        <button type="button" class="admin-back-link" id="adminBackLogin">← Volver a la web</button>
      </div>
    </div>

    <div class="admin-shell admin-hidden" id="adminDashboard">
      <aside class="admin-sidebar">
        <div class="brand"><span class="brand-mark">A</span><span class="brand-name">Northwestmad</span></div>
        <p class="admin-side-label">Panel</p>
        <div class="admin-nav">
          <button type="button" class="admin-nav-item active" id="navCarta">Carta <span id="dishCount">0</span></button>
          <button type="button" class="admin-nav-item" id="navReservas">Reservas <span id="bookingCount">0</span></button>
          <button type="button" class="admin-nav-item" id="newDishNav">+ Nuevo plato</button>
        </div>
        <div class="admin-sidebar-foot">
          <button type="button" class="admin-nav-item" id="adminBackSite">← Volver a la web</button>
          <button type="button" class="admin-nav-item" id="adminLogout">Cerrar sesión</button>
        </div>
      </aside>

      <main class="admin-main">
        <header class="admin-main-head">
          <div>
            <p class="eyebrow" id="adminEyebrow">Gestión de carta</p>
            <h2 id="adminSectionTitle">Tu <em>carta</em></h2>
          </div>
          <button type="button" class="btn btn-primary" id="newDishTop">+ Nuevo plato</button>
        </header>

        <div class="admin-workspace" id="sectionCarta">
          <section class="admin-list-wrap">
            <div class="admin-list-head">
              <h3>Platos <span id="listCount">0</span></h3>
              <label class="admin-search">
                <span aria-hidden="true">⌕</span>
                <input type="search" id="dishSearch" placeholder="Buscar plato, ingrediente o alergia..." />
              </label>
            </div>
            <div id="adminList" class="admin-list"></div>
          </section>

          <section class="admin-editor-wrap">
            <form id="dishForm" class="admin-form admin-add">
              <div class="admin-editor-head">
                <h3 id="editorTitle">Añadir plato</h3>
                <button type="button" class="btn-muted btn-small admin-hidden" id="cancelEdit">Cancelar edición</button>
              </div>
              <div class="admin-img-preview">
                <img id="imgPreview" src="${FALLBACK_IMG}" alt="Vista previa del plato" onerror="this.src='${FALLBACK_IMG}'" />
                <span id="previewLabel">Vista previa</span>
              </div>
              <p class="admin-file-hint">JPG, PNG o WebP · la foto se comprime automáticamente</p>
              <div class="form-row">
                <label><span>Nombre</span><input name="name" required placeholder="Nombre del plato" /></label>
                <label><span>Precio</span><input name="price" required placeholder="18€" /></label>
              </div>
              <div class="form-row">
                <label><span>Etiqueta</span><input name="tag" placeholder="Especialidad" /></label>
                <label class="admin-file-field"><span>Foto del plato</span><input type="file" name="imageFile" id="imageFile" accept="image/*" /></label>
              </div>
              <label><span>Descripción</span><textarea name="description" required rows="3" placeholder="Descripción del plato"></textarea></label>
              <label><span>Ingredientes <small>(separados por comas)</small></span><textarea name="ingredients" rows="2" placeholder="Tomate, aceite de oliva, albahaca"></textarea></label>
              <label><span>Alergias <small>(separadas por comas)</small></span><input name="allergens" placeholder="Gluten, lácteos, frutos secos" /></label>
              <div class="admin-actions">
                <button type="submit" class="btn btn-primary" id="saveDish">Añadir plato</button>
                <button type="button" class="btn-danger admin-hidden" id="deleteCurrent">Eliminar plato</button>
              </div>
              <p class="form-note" id="adminDishNote"></p>
            </form>
          </section>
        </div>

        <div class="admin-workspace admin-reservas admin-hidden" id="sectionReservas">
          <section class="admin-calendar-wrap">
            <div class="cal-head">
              <div>
                <h3 id="weekLabel">Semana</h3>
                <p class="cal-sub" id="weekCount">0 reservas esta semana</p>
              </div>
              <div class="cal-nav">
                <button type="button" class="cal-btn" id="prevWeek" aria-label="Semana anterior">←</button>
                <button type="button" class="cal-btn" id="thisWeek">Hoy</button>
                <button type="button" class="cal-btn" id="nextWeek" aria-label="Semana siguiente">→</button>
              </div>
            </div>
            <div class="cal-grid" id="calendarGrid"></div>
            <p class="cal-legend">
              <span class="legend-dot pending"></span> Pendiente
              <span class="legend-dot confirmed"></span> Confirmada
              <span class="legend-dot cancelled"></span> Cancelada
            </p>
          </section>

          <section class="admin-booking-wrap">
            <div class="booking-empty" id="bookingEmpty">
              <span aria-hidden="true">⌕</span>
              <h3>Selecciona una reserva</h3>
              <p>Pulsa sobre cualquier reserva del calendario para ver sus detalles.</p>
            </div>
            <div class="admin-hidden" id="bookingDetail">
              <div class="admin-editor-head">
                <h3 id="bookingDetailTitle">Detalle</h3>
                <button type="button" class="btn-muted btn-small" id="closeBooking">Cerrar</button>
              </div>
              <p class="booking-status" id="bookingStatus"></p>
              <div class="booking-data" id="bookingData"></div>
              <div class="admin-actions">
                <button type="button" class="btn btn-primary" id="confirmBooking">Confirmar</button>
                <button type="button" class="btn-muted" id="cancelBooking">Cancelar</button>
                <button type="button" class="btn-danger" id="deleteBooking">Eliminar</button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  </section>
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
  const search = document.getElementById('dishSearch')
  const q = (search?.value || '').trim().toLowerCase()
  const filtered = dishes.map((d, i) => ({ d, i })).filter(({ d }) => !q ||
    [d.name, d.tag, d.description, ...d.ingredients, ...d.allergens].join(' ').toLowerCase().includes(q))
  document.getElementById('dishCount').textContent = dishes.length
  document.getElementById('listCount').textContent = filtered.length
  list.innerHTML = filtered.length ? filtered.map(({ d, i }) => `
    <div class="admin-item ${editingIndex === i ? 'selected' : ''}">
      <button type="button" class="admin-item-main" data-index="${i}">
        <span class="admin-item-thumb"><img src="${esc(d.img)}" alt="" loading="lazy" onerror="this.src='${FALLBACK_IMG}'" /></span>
        <span class="admin-item-copy">
          <strong>${esc(d.name)}</strong>
          <span>${esc(d.price)} · ${esc(d.tag)}</span>
          <span class="admin-item-detail">${d.allergens.length ? `Alergias: ${esc(d.allergens.join(', '))}` : 'Sin alérgenos declarados'}</span>
        </span>
      </button>
      <div class="admin-item-actions">
        <button type="button" class="admin-edit" data-index="${i}">Editar</button>
        <button type="button" class="admin-del" data-index="${i}">Eliminar</button>
      </div>
    </div>
  `).join('') : '<p class="admin-empty">No se encontraron platos.</p>'
  list.querySelectorAll('.admin-item-main, .admin-edit').forEach(btn => btn.addEventListener('click', () => openDishEditor(Number(btn.dataset.index))))
  list.querySelectorAll('.admin-del').forEach(btn => btn.addEventListener('click', () => deleteDish(Number(btn.dataset.index))))
}

// Admin
const adminApp = document.getElementById('adminApp')
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
const adminBackSite = document.getElementById('adminBackSite')
const adminBackLogin = document.getElementById('adminBackLogin')
const newDishTop = document.getElementById('newDishTop')
const newDishNav = document.getElementById('newDishNav')
const dishSearch = document.getElementById('dishSearch')
const imgPreview = document.getElementById('imgPreview')
const previewLabel = document.getElementById('previewLabel')
const imageFile = document.getElementById('imageFile')
const navCarta = document.getElementById('navCarta')
const navReservas = document.getElementById('navReservas')
const sectionCarta = document.getElementById('sectionCarta')
const sectionReservas = document.getElementById('sectionReservas')
const adminEyebrow = document.getElementById('adminEyebrow')
const adminSectionTitle = document.getElementById('adminSectionTitle')
const weekLabel = document.getElementById('weekLabel')
const weekCount = document.getElementById('weekCount')
const calendarGrid = document.getElementById('calendarGrid')
const bookingCount = document.getElementById('bookingCount')
const bookingEmpty = document.getElementById('bookingEmpty')
const bookingDetail = document.getElementById('bookingDetail')
const bookingDetailTitle = document.getElementById('bookingDetailTitle')
const bookingStatus = document.getElementById('bookingStatus')
const bookingData = document.getElementById('bookingData')
const field = (name) => dishForm.elements.namedItem(name)

let editingIndex = null
let currentImage = ''
let currentSection = 'carta'
let selectedBookingId = null

const syncPreview = () => { imgPreview.src = currentImage || FALLBACK_IMG }

const setNote = (message, type = '') => {
  adminDishNote.textContent = message
  adminDishNote.className = `form-note${type ? ` ${type}` : ''}`
}

const statusLabel = (status) => ({ pendiente: 'Pendiente', confirmada: 'Confirmada', cancelada: 'Cancelada' }[status] || 'Pendiente')

const showSection = (name) => {
  currentSection = name
  sectionCarta.classList.toggle('admin-hidden', name !== 'carta')
  sectionReservas.classList.toggle('admin-hidden', name !== 'reservas')
  navCarta.classList.toggle('active', name === 'carta')
  navReservas.classList.toggle('active', name === 'reservas')
  newDishNav.classList.toggle('admin-hidden', name !== 'carta')
  newDishTop.classList.toggle('admin-hidden', name !== 'carta')
  adminEyebrow.textContent = name === 'carta' ? 'Gestión de carta' : 'Gestión de reservas'
  adminSectionTitle.innerHTML = name === 'carta' ? 'Tu <em>carta</em>' : 'Tus <em>reservas</em>'
  if (name === 'reservas') renderCalendar()
}

const renderCalendar = () => {
  const days = Array.from({ length: 7 }, (_, i) => new Date(calendarWeek.getFullYear(), calendarWeek.getMonth(), calendarWeek.getDate() + i))
  const last = days[6]
  weekLabel.textContent = `${days[0].getDate()} ${MONTHS[days[0].getMonth()]} – ${last.getDate()} ${MONTHS[last.getMonth()]} ${last.getFullYear()}`
  const inWeek = bookings.filter(b => b.date >= toISO(days[0]) && b.date <= toISO(last))
  weekCount.textContent = `${inWeek.length} ${inWeek.length === 1 ? 'reserva' : 'reservas'} esta semana`
  bookingCount.textContent = bookings.length
  calendarGrid.innerHTML = days.map((d) => {
    const iso = toISO(d)
    const items = inWeek.filter(b => b.date === iso).sort((a, b) => a.time.localeCompare(b.time))
    return `<div class="cal-day${iso === todayISO() ? ' is-today' : ''}">
      <div class="cal-day-head"><span>${WEEKDAYS[d.getDay()]}</span><strong>${d.getDate()}</strong></div>
      <div class="cal-day-body">
        ${items.length ? items.map(b => `
          <button type="button" class="cal-booking status-${esc(b.status || 'pendiente')}${b.id === selectedBookingId ? ' selected' : ''}" data-id="${esc(b.id)}">
            <strong>${esc(b.time)}</strong>
            <span>${esc(b.name)}</span>
            <small>${esc(b.guests)} pers. · ${esc(b.phone)}</small>
          </button>
        `).join('') : '<span class="cal-empty">Sin reservas</span>'}
      </div>
    </div>`
  }).join('')
  calendarGrid.querySelectorAll('.cal-booking').forEach(btn => btn.addEventListener('click', () => showBookingDetail(btn.dataset.id)))
}

const showBookingDetail = (id) => {
  const b = bookings.find(x => x.id === id)
  if (!b) return
  selectedBookingId = id
  bookingEmpty.classList.add('admin-hidden')
  bookingDetail.classList.remove('admin-hidden')
  bookingDetailTitle.textContent = `${b.time} · ${b.name}`
  bookingStatus.textContent = statusLabel(b.status)
  bookingStatus.className = `booking-status status-${esc(b.status || 'pendiente')}`
  bookingData.innerHTML = `
    <div class="booking-data-row"><span>Nombre</span><strong>${esc(b.name)}</strong></div>
    <div class="booking-data-row"><span>Teléfono</span><strong>${esc(b.phone)}</strong></div>
    <div class="booking-data-row"><span>Fecha</span><strong>${esc(b.date)}</strong></div>
    <div class="booking-data-row"><span>Hora</span><strong>${esc(b.time)}</strong></div>
    <div class="booking-data-row"><span>Comensales</span><strong>${esc(b.guests)}</strong></div>
    <div class="booking-data-row"><span>Ocasión</span><strong>${esc(b.occasion || '—')}</strong></div>
  `
  renderCalendar()
}

const hideBookingDetail = () => {
  selectedBookingId = null
  bookingDetail.classList.add('admin-hidden')
  bookingEmpty.classList.remove('admin-hidden')
  renderCalendar()
}

const setBookingStatus = (status) => {
  const b = bookings.find(x => x.id === selectedBookingId)
  if (!b) return
  const next = bookings.map(x => x.id === b.id ? { ...x, status } : x)
  try { saveBookings(next) } catch { return }
  bookings = next
  showBookingDetail(b.id)
}

const removeBooking = () => {
  const b = bookings.find(x => x.id === selectedBookingId)
  if (!b || !window.confirm(`¿Eliminar la reserva de ${b.name}?`)) return
  const next = bookings.filter(x => x.id !== b.id)
  try { saveBookings(next) } catch { return }
  bookings = next
  hideBookingDetail()
}

const compressImage = (file) => new Promise((resolve, reject) => {
  if (!file.type.startsWith('image/')) { reject(new Error('El archivo debe ser una imagen.')); return }
  const reader = new FileReader()
  reader.onerror = () => reject(new Error('No se pudo leer el archivo.'))
  reader.onload = () => {
    const img = new Image()
    img.onerror = () => reject(new Error('No se pudo abrir la imagen.'))
    img.onload = () => {
      const scale = Math.min(1, 1200 / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.max(1, Math.round(img.width * scale))
      canvas.height = Math.max(1, Math.round(img.height * scale))
      const ctx = canvas.getContext('2d')
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.8))
    }
    img.src = reader.result
  }
  reader.readAsDataURL(file)
})

imageFile.addEventListener('change', async () => {
  const file = imageFile.files?.[0]
  if (!file) return
  if (file.size > 20 * 1024 * 1024) { setNote('La imagen es demasiado grande (máx. 20 MB).', 'error'); return }
  setNote('Procesando imagen...')
  try {
    currentImage = await compressImage(file)
    syncPreview()
    previewLabel.textContent = file.name
    setNote('Foto lista. Guarda el plato para aplicarla.', 'success')
  } catch (err) {
    setNote(err.message, 'error')
  }
})

const resetEditor = () => {
  editingIndex = null
  currentImage = ''
  dishForm.reset()
  editorTitle.textContent = 'Añadir plato'
  saveDishBtn.textContent = 'Añadir plato'
  cancelEdit.classList.add('admin-hidden')
  deleteCurrent.classList.add('admin-hidden')
  previewLabel.textContent = 'Vista previa'
  syncPreview()
  setNote('')
  renderAdminList()
}

const openDishEditor = (index) => {
  if (!isAdmin) return
  const d = dishes[index]
  if (!d) return
  editingIndex = index
  field('name').value = d.name || ''
  field('price').value = d.price || ''
  field('tag').value = d.tag || ''
  currentImage = d.img || FALLBACK_IMG
  imageFile.value = ''
  previewLabel.textContent = 'Foto actual'
  field('description').value = d.description || ''
  field('ingredients').value = d.ingredients.join(', ')
  field('allergens').value = d.allergens.join(', ')
  editorTitle.textContent = `Editar: ${d.name}`
  saveDishBtn.textContent = 'Guardar cambios'
  cancelEdit.classList.remove('admin-hidden')
  deleteCurrent.classList.remove('admin-hidden')
  setNote('')
  syncPreview()
  if (window.location.hash !== '#admin') window.location.hash = '#admin'
  else syncAdmin()
  renderAdminList()
  requestAnimationFrame(() => {
    document.querySelector(`#adminList [data-index="${index}"]`)?.scrollIntoView({ block: 'nearest' })
    field('name').focus({ preventScroll: true })
  })
}

const deleteDish = (index) => {
  const d = dishes[index]
  if (!d || !isAdmin) return
  if (!window.confirm(`¿Eliminar "${d.name}" de la carta?`)) return
  dishes.splice(index, 1)
  saveDishes(dishes)
  if (editingIndex === index) resetEditor()
  else if (editingIndex !== null && index < editingIndex) editingIndex -= 1
  setNote('Plato eliminado.', 'success')
  renderMenu()
  renderAdminList()
}

const syncAdmin = () => {
  const active = window.location.hash === '#admin'
  adminApp.classList.toggle('open', active)
  adminApp.setAttribute('aria-hidden', String(!active))
  document.body.classList.toggle('admin-open', active)
  adminAuth.classList.toggle('admin-hidden', isAdmin)
  adminDashboard.classList.toggle('admin-hidden', !isAdmin)
  showSection(currentSection)
  if (!isAdmin) resetEditor()
  if (active) adminApp.scrollTop = 0
  else closeDishDetail()
  renderMenu()
  renderAdminList()
}

const exitAdmin = () => {
  if (window.location.hash === '#admin') history.replaceState(null, '', location.pathname + location.search)
  syncAdmin()
}

window.addEventListener('hashchange', syncAdmin)
syncAdmin()

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
    img: currentImage || FALLBACK_IMG,
    description: fd.get('description').trim(),
    ingredients: splitList(fd.get('ingredients')),
    allergens: splitList(fd.get('allergens'))
  })
  const wasEditing = editingIndex !== null
  const previousDish = wasEditing ? dishes[editingIndex] : null
  if (wasEditing) dishes[editingIndex] = dish
  else dishes.unshift(dish)
  try {
    saveDishes(dishes)
  } catch {
    if (wasEditing) dishes[editingIndex] = previousDish
    else dishes.shift()
    setNote('No hay espacio para guardar la foto. Prueba con una imagen más pequeña.', 'error')
    renderMenu()
    return
  }
  resetEditor()
  setNote(wasEditing ? 'Cambios guardados.' : 'Plato añadido a la carta.', 'success')
  renderMenu()
})

dishSearch.addEventListener('input', renderAdminList)
cancelEdit.addEventListener('click', resetEditor)
newDishTop.addEventListener('click', () => { showSection('carta'); resetEditor() })
newDishNav.addEventListener('click', () => { showSection('carta'); resetEditor() })
navCarta.addEventListener('click', () => showSection('carta'))
navReservas.addEventListener('click', () => showSection('reservas'))
document.getElementById('prevWeek').addEventListener('click', () => { calendarWeek.setDate(calendarWeek.getDate() - 7); renderCalendar() })
document.getElementById('thisWeek').addEventListener('click', () => { calendarWeek = startOfWeek(new Date()); renderCalendar() })
document.getElementById('nextWeek').addEventListener('click', () => { calendarWeek.setDate(calendarWeek.getDate() + 7); renderCalendar() })
document.getElementById('closeBooking').addEventListener('click', hideBookingDetail)
document.getElementById('confirmBooking').addEventListener('click', () => setBookingStatus('confirmada'))
document.getElementById('cancelBooking').addEventListener('click', () => setBookingStatus('cancelada'))
document.getElementById('deleteBooking').addEventListener('click', removeBooking)
deleteCurrent.addEventListener('click', () => { if (editingIndex !== null) deleteDish(editingIndex) })
adminBackSite.addEventListener('click', exitAdmin)
adminBackLogin.addEventListener('click', exitAdmin)

adminLogout.addEventListener('click', () => {
  isAdmin = false
  sessionStorage.removeItem(ADMIN_KEY)
  syncAdmin()
})

document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return
  if (dishModal.classList.contains('open')) closeDishDetail()
  else if (adminApp.classList.contains('open')) exitAdmin()
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
dateInput.min = todayISO()

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const data = new FormData(form)
  const name = data.get('name').trim()
  const date = data.get('date')
  if (!date || date < todayISO()) {
    note.textContent = 'Elige una fecha válida para la reserva.'
    note.className = 'form-note error'
    return
  }
  const booking = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name,
    phone: data.get('phone').trim(),
    date,
    time: data.get('time'),
    guests: data.get('guests'),
    occasion: data.get('occasion'),
    status: 'pendiente',
    createdAt: new Date().toISOString()
  }
  try {
    saveBookings([booking, ...bookings])
  } catch {
    note.textContent = 'No se pudo guardar la reserva. Inténtalo de nuevo.'
    note.className = 'form-note error'
    return
  }
  bookings.unshift(booking)
  note.textContent = `Gracias, ${name}. Hemos recibido tu solicitud de reserva. Te contactaremos pronto para confirmarla.`
  note.className = 'form-note success'
  form.reset()
  dateInput.min = todayISO()
  renderCalendar()
})
