import { MainEventBus } from "./libs/MainEventBus.lib.js";
import { _front } from "./libs/_front.js";
class Front extends _front{
  constructor(){
    super();
    const _ = this;
    _.sliderAutoSwitch();
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
    for (let screen of screens) {
      screen.setAttribute('style',`transform:translateX(-${shift * 100}%)`);
    }
    if (window.innerWidth < 768) {
      if (!btn.classList.contains('foot-link')) _.burgerClick({item:document.querySelector('.head-burger')})
    }
  }
}
new Front();
