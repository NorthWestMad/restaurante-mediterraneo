import './style.css'

const dishes = [
  {
    name: 'Ensalada Griega de Quinoa',
    description: 'Quinoa, pepino, tomate, aceitunas Kalamata, queso feta y aliño de limón y hierbas frescas.',
    price: '14€',
    tag: 'Fresco',
    img: 'https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg'
  },
  {
    name: 'Garides Saganaki',
    description: 'Langostinos salteados en salsa de tomate especiada con feta fundido y un toque de ouzo.',
    price: '18€',
    tag: 'Especialidad',
    img: 'https://www.themealdb.com/images/media/meals/wuvryu1468232995.jpg'
  },
  {
    name: 'Lamb Tagine Marroquí',
    description: 'Cordero cocinado a fuego lento con albaricoques, especias dulces y cuscús esponjoso.',
    price: '22€',
    tag: 'De la casa',
    img: 'https://www.themealdb.com/images/media/meals/yuwtuu1511295751.jpg'
  },
  {
    name: 'Fettuccine Alfredo',
    description: 'Pasta fresca artesanal con crema de parmesano, mantequilla y pimienta negra recién molida.',
    price: '16€',
    tag: 'Clásico',
    img: 'https://www.themealdb.com/images/media/meals/0jv5gx1661040802.jpg'
  },
  {
    name: 'Gigantes Plaki',
    description: 'Alubias gigantes al horno en salsa de tomate, eneldo y aceite de oliva virgen extra.',
    price: '15€',
    tag: 'Vegetariano',
    img: 'https://www.themealdb.com/images/media/meals/b79r6f1585566277.jpg'
  },
  {
    name: 'Honey Yogurt Cheesecake',
    description: 'Tarta cremosa de yogur griego con miel de tomillo, nueces y base crujiente.',
    price: '9€',
    tag: 'Postre',
    img: 'https://www.themealdb.com/images/media/meals/y2irzl1585563479.jpg'
  }
]

const app = document.querySelector('#app')

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
      <div class="menu-grid">
        ${dishes.map((d, i) => `
          <article class="dish-card reveal" style="--delay:${i * 0.08}s">
            <div class="dish-img">
              <img src="${d.img}" alt="${d.name}" loading="lazy" />
              <span class="dish-tag">${d.tag}</span>
            </div>
            <div class="dish-body">
              <div class="dish-top">
                <h3>${d.name}</h3>
                <span class="dish-price">${d.price}</span>
              </div>
              <p>${d.description}</p>
            </div>
          </article>
        `).join('')}
      </div>
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
`

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
