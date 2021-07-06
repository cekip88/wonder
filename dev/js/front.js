import { MainEventBus } from "./libs/MainEventBus.lib.js";
import { _front } from "./libs/_front.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    MainEventBus.add(_.componentName,'createOrderSuccess',_.createOrderSuccess.bind(_));
    MainEventBus.add(_.componentName,'createOrderFail',_.createOrderFail.bind(_));
    MainEventBus.add(_.componentName,'burgerClick',_.burgerClick.bind(_));
    MainEventBus.add(_.componentName,'sliderClick',_.sliderClick.bind(_));
    MainEventBus.add(_.componentName,'changeScreen',_.changeScreen.bind(_));

    _.currentSlide = document.querySelector('.slide.active');
  }
  createOrderSuccess(orderData){}
  createOrderFail(orderData){}

  burgerClick(clickData){
    let btn = clickData.item;
    let head = btn.closest('.head');
    head.classList.toggle('active')
  }


  sliderAutoSwitch(){
    const _ = this;
    setTimeout(function (){
      let dot = document.querySelector('.slider-dots .active');
      let next = dot.nextElementSibling;
      if (!next) next = dot.parentElement.firstElementChild;
      _.sliderClick({item:next});
      _.sliderAutoSwitch()
    },7000)
  }
  sliderClick(clickData){
    const _ = this;
    let dot = clickData.item;
    let dots = dot.parentElement.children;
    for (let btn of dots) {
      btn.classList.remove('active');
    }
    dot.classList.add('active');

    let slides = document.querySelector('.slider-cont');
    let shift = parseInt(dot.getAttribute('data-pos'));
    _.currentSlide.classList.remove('active');
    _.currentSlide = slides.children[shift];
    _.currentSlide.classList.add('active');
  }

  changeScreen(clickData){
    const _ = this;
    let btn = clickData.item;
    let btns = document.querySelectorAll('.screen-btn');
    for (let btn of btns) {
      btn.classList.remove('active');
    }
    btn.classList.add('active');

    let screens = document.querySelectorAll('.screen');
    let shift = parseInt(btn.getAttribute('data-pos'));
    let widget = document.querySelector('body .yWidgetShow.right');
    if(widget) {
      widget.setAttribute('style',`transform:translateX(300%)`)
      if (shift == 3) widget.setAttribute('style',`transform:translateX(0)`)
    }
    for (let screen of screens) {
      screen.setAttribute('style',`transform:translateX(-${shift * 100}%)`);
    }
    if (window.innerWidth < 768) {
      if (!btn.classList.contains('foot-link')) _.burgerClick({item:document.querySelector('.head-burger')})
    }
  }


  init(){
    const _ = this;
    _.sliderAutoSwitch();
  }
}
new Front();

$("body").append("<canvas id='particle-canvas'></canvas>");

function normalPool(o) {
  var r = 0;
  do {
    var a = Math.round(normal({mean: o.mean, dev: o.dev}));
    if (a < o.pool.length && a >= 0) return o.pool[a];
    r++
  } while (r < 100)
}

function randomNormal(o) {
  if (o = Object.assign({
    mean: 0,
    dev: 1,
    pool: []
  }, o), Array.isArray(o.pool) && o.pool.length > 0) return normalPool(o);
  var r, a, n, e, l = o.mean, t = o.dev;
  do {
    r = (a = 2 * Math.random() - 1) * a + (n = 2 * Math.random() - 1) * n
  } while (r >= 1);
  return e = a * Math.sqrt(-2 * Math.log(r) / r), t * e + l
}

const NUM_PARTICLES = 24;
const PARTICLE_SIZE = 8; // View heights
const SPEED = 200000; // Milliseconds

let particles = [];

function rand(low, high) {
  return Math.random() * (high - low) + low;
}

function createParticle(canvas) {
  const colour = {
    r: 4,
    g: 2, //randomNormal({mean: 8, dev: 10}),
    b: 4,
    a: rand(0, 0.1),
  };
  return {
    x: -12,
    y: -24,
    diameter: Math.max(0, randomNormal({mean: PARTICLE_SIZE, dev: PARTICLE_SIZE / 2})),
    duration: randomNormal({mean: SPEED, dev: SPEED * 0.1}),
    amplitude: randomNormal({mean: 38, dev: 52}),
    offsetY: randomNormal({mean: 0, dev: 14}),
    arc: Math.PI * 2,
    startTime: performance.now() - rand(0, SPEED),
    colour: `rgba(${colour.r}, ${colour.g}, ${colour.b}, ${colour.a})`,
  }
}

function moveParticle(particle, canvas, time) {
  const progress = ((time - particle.startTime) % particle.duration) / particle.duration;
  return {
    ...particle,
    x: progress,
    y: ((Math.sin(progress * particle.arc) * particle.amplitude) + particle.offsetY),
  };
}

function drawParticle(particle, canvas, ctx) {
  canvas = document.getElementById('particle-canvas');
  const vh = canvas.height / 100;

  ctx.fillStyle = particle.colour;
  ctx.beginPath();
  ctx.ellipse(
    particle.x * canvas.width,
    particle.y * vh + (canvas.height / 2),
    particle.diameter * vh,
    particle.diameter * vh,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
}

function draw(time, canvas, ctx) {
  particles.forEach((particle, index) => {
    particles[index] = moveParticle(particle, canvas, time);
  })

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    drawParticle(particle, canvas, ctx);
  })

  requestAnimationFrame((time) => draw(time, canvas, ctx));
}

function initializeCanvas() {
  let canvas = document.getElementById('particle-canvas');
  canvas.width = canvas.offsetWidth * window.devicePixelRatio;
  canvas.height = canvas.offsetHeight * window.devicePixelRatio;
  let ctx = canvas.getContext("2d");

  window.addEventListener('resize', () => {
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx = canvas.getContext("2d");
  })

  return [canvas, ctx];
}

function startAnimation() {
  const [canvas, ctx] = initializeCanvas();

  // Create a bunch of particles
  for (let i = 0; i < NUM_PARTICLES; i++) {
    particles.push(createParticle(canvas));
  }

  requestAnimationFrame((time) => draw(time, canvas, ctx));
};

(function () {
  if (document.readystate !== 'loading') {
    startAnimation();
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      startAnimation();
    })
  }
}());