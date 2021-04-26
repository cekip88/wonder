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
  }
  createOrderSuccess(orderData){}
  createOrderFail(orderData){}

  burgerClick(clickData){
    let btn = clickData.item;
    let head = btn.closest('.head');
    head.classList.toggle('active')
  }

  sliderClick(clickData){
    const _ = this;
    let dot = clickData.item;
    let dots = dot.parentElement.children;
    for (let btn of dots) {
      btn.classList.remove('active');
    }
    dot.classList.add('active');

    let slides = document.querySelectorAll('.slide');
    let shift = parseInt(dot.getAttribute('data-pos'));
    for (let slide of slides) {
      slide.setAttribute('style',`transform:translateX(-${shift * 100}%)`);
    }
  }
}
new Front();
