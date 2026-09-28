'use strict';
const config = window.STORE_CONFIG || {price:119.90};
const money = value => value.toLocaleString('pt-BR', {style:'currency',currency:'BRL'});
document.querySelectorAll('[data-price]').forEach(el => el.textContent = money(config.price));
const paths = {
  menu:'<path d="M4 5h16M4 12h16M4 19h16"/>',
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2 2h2l2.7 12.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6L22 7H5"/>',
  drop:'<path d="M12 3C9 7 5 11 5 15a7 7 0 0 0 14 0c0-4-4-8-7-12Z"/><path d="M8 15a4 4 0 0 0 4 4"/>',
  zoom:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5M7 10h6M10 7v6"/>',
  search:'<circle cx="10.5" cy="10.5" r="7.5"/><path d="m16 16 5 5"/>',
  package:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5V15"/>',
  user:'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2"/>',
  tag:'<path d="M3 3h8l10 10-8 8L3 11V3Z"/><circle cx="7.5" cy="7.5" r="1"/>',
  chevron:'<path d="m6 9 6 6 6-6"/>',
  file:'<path d="M14 2H5v20h14V7l-5-5ZM14 2v5h5M8 12h8M8 16h8"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>'
};
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true">${paths[el.dataset.icon] || ''}</svg>`);

// Product gallery: thumbnails, touch gestures, keyboard and enlarged view.
const thumbs=[...document.querySelectorAll('[data-image]')];
const mainImage=document.querySelector('#product-image');
const zoomDialog=document.querySelector('#zoom-dialog');
let selectedImage=0;
function selectImage(index){
  selectedImage=(index+thumbs.length)%thumbs.length;
  const chosen=thumbs[selectedImage];
  mainImage.src=`assets/${chosen.dataset.image}`;
  mainImage.alt=chosen.dataset.alt;
  document.querySelector('#zoom-image').src=mainImage.src;
  document.querySelector('#zoom-image').alt=mainImage.alt;
  document.querySelector('.gallery-count').textContent=`${selectedImage+1} / ${thumbs.length}`;
  document.querySelector('#zoom-counter').textContent=`${selectedImage+1} / ${thumbs.length}`;
  thumbs.forEach((el,i)=>{el.classList.toggle('selected',i===selectedImage);el.setAttribute('aria-pressed',String(i===selectedImage));});
  const strip=document.querySelector('.thumbnails');
  strip.scrollTo({left:chosen.offsetLeft-strip.offsetLeft-(strip.clientWidth-chosen.clientWidth)/2,behavior:'smooth'});
}
thumbs.forEach((el,i)=>el.addEventListener('click',()=>selectImage(i)));
document.querySelector('#zoom-prev').addEventListener('click',()=>selectImage(selectedImage-1));
document.querySelector('#zoom-next').addEventListener('click',()=>selectImage(selectedImage+1));
document.querySelector('.zoom-close').addEventListener('click',()=>zoomDialog.close());
document.querySelector('.main-image').addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();selectImage(selectedImage+1);}if(e.key==='ArrowLeft'){e.preventDefault();selectImage(selectedImage-1);}});
zoomDialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight')selectImage(selectedImage+1);if(e.key==='ArrowLeft')selectImage(selectedImage-1);});
let touchX=0,swiped=false;
document.querySelector('.main-image').addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;swiped=false;},{passive:true});
document.querySelector('.main-image').addEventListener('touchend',e=>{const distance=e.changedTouches[0].clientX-touchX;if(Math.abs(distance)>45){swiped=true;selectImage(selectedImage+(distance<0?1:-1));}},{passive:true});

// Product highlights use factual content, without store promises.
const highlights=[['Água do seu jeito','Natural, fria e gelada'],['Filtro Acqua Pure','Cuidado em cada etapa'],['Compacto e bivolt','Praticidade para a sua casa']];
const dots=[...document.querySelectorAll('.benefit-dots button')];
let activeHighlight=0;
function setHighlight(i){activeHighlight=i;document.querySelector('#benefit-title').textContent=highlights[i][0];document.querySelector('#benefit-subtitle').textContent=highlights[i][1];dots.forEach((el,n)=>{el.classList.toggle('active',n===i);el.setAttribute('aria-pressed',String(n===i));});}
dots.forEach((el,i)=>el.addEventListener('click',()=>setHighlight(i)));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{if(!document.hidden && !document.querySelector('.benefits').contains(document.activeElement))setHighlight((activeHighlight+1)%3);},5000);

const dialog=document.querySelector('#store-dialog');
const content=document.querySelector('#dialog-content');
function openDialog(title,html){document.querySelector('#dialog-title').textContent=title;content.innerHTML=html;if(!dialog.open)dialog.showModal();}
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
[dialog,zoomDialog].forEach(el=>el.addEventListener('click',e=>{const box=el.getBoundingClientRect();if(e.target===el&&(e.clientX<box.left||e.clientX>box.right||e.clientY<box.top||e.clientY>box.bottom))el.close();}));
function navigateTo(id){dialog.close();const target=document.querySelector(id);const details=target?.closest('details');if(details)details.open=true;target?.scrollIntoView({behavior:'smooth'});}
document.querySelectorAll('a[href="#ficha"],a[href="#avaliacoes"]').forEach(a=>a.addEventListener('click',()=>{const el=document.querySelector(a.hash)?.closest('details');if(el)el.open=true;}));

let quantity=0;
try{quantity=Math.max(0,Math.min(99,Number(localStorage.getItem('pe15x-cart'))||0));}catch{}
function saveCart(){document.querySelectorAll('.cart-count').forEach(el=>{el.textContent=quantity;el.hidden=!quantity;});try{localStorage.setItem('pe15x-cart',String(quantity));}catch{}}
saveCart();
function cart(){
  if(!quantity){openDialog('Seu carrinho','<p>Seu carrinho está vazio.</p><button class="primary" data-action="back-product">VER PRODUTO</button>');return;}
  openDialog('Seu carrinho',`<div class="cart-product"><img src="assets/purificador.png" alt="Purificador Electrolux PE15X"><div><p><strong>Purificador Electrolux Efficient PE15X</strong></p><p>Cinza · Bivolt</p><p>${money(config.price)}</p></div></div><div class="quantity"><button data-action="minus" aria-label="Diminuir quantidade">−</button><span aria-live="polite">${quantity}</span><button data-action="plus" aria-label="Aumentar quantidade">+</button><button class="remove-button" data-action="remove">Remover</button></div><div class="cart-total"><strong>Subtotal</strong><strong>${money(quantity*config.price)}</strong></div><p class="muted">Frete e condições de pagamento na finalização.</p><button class="primary" data-action="checkout">FINALIZAR COMPRA</button>`);
}
function safeLink(value){try{const url=new URL(value);return url.protocol==='https:'?url.href:null;}catch{return null;}}
function checkout(){const url=safeLink(config.checkoutUrl);if(url){location.assign(url);return;}openDialog('Compra ainda indisponível','<p>A finalização da compra ainda não está disponível nesta página. Volte em breve.</p><button class="primary" data-action="cart">VOLTAR AO CARRINHO</button>');}
function search(){openDialog('Buscar produto','<input class="search-input" id="product-search" type="search" placeholder="O que você procura?" aria-label="Buscar produto"><div class="search-result" aria-live="polite"></div>');const input=document.querySelector('#product-search');const result=document.querySelector('.search-result');function update(){const term=input.value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();const found=!term||term.split(/\s+/).every(t=>'purificador electrolux efficient pe15x agua cinza bivolt filtro'.includes(t));result.innerHTML=found?`<a href="#produto" data-action="back-product"><img src="assets/purificador.png" alt="Purificador Electrolux PE15X"><span>Purificador Electrolux Efficient PE15X<br><strong>${money(config.price)}</strong></span></a>`:'<p>Nenhum produto encontrado. Tente “purificador” ou “PE15X”.</p>';}input.addEventListener('input',update);update();input.focus();}
document.addEventListener('click',e=>{
  const trigger=e.target.closest('[data-action]');if(!trigger)return;
  const action=trigger.dataset.action;
  if(action==='menu')openDialog('Menu','<div class="menu-links"><a href="#inicio">Início</a><a href="#produto">Purificador Electrolux</a><a href="#sobre">Sobre o produto</a><a href="#ficha">Ficha técnica</a><a href="#avaliacoes">Avaliações</a></div>');
  if(action==='search')search();
  if(action==='zoom'){if(swiped){swiped=false;return;}selectImage(selectedImage);zoomDialog.showModal();}
  if(action==='buy'){quantity=Math.max(1,quantity);saveCart();cart();}
  if(action==='cart')cart();
  if(action==='plus'){quantity=Math.min(99,quantity+1);saveCart();cart();}
  if(action==='minus'){quantity=Math.max(0,quantity-1);saveCart();cart();}
  if(action==='remove'){quantity=0;saveCart();cart();}
  if(action==='checkout')checkout();
  if(action==='back-product'){e.preventDefault();navigateTo('#produto');}
  if(action==='orders')openDialog('Meus pedidos','<p>A consulta de pedidos ainda não está disponível nesta página.</p><p>Para uma compra já realizada, consulte a confirmação enviada pela loja.</p>');
  if(action==='account')openDialog('Minha conta','<p>A área de clientes ainda não está disponível. Você pode consultar as informações do produto sem fazer cadastro.</p><button class="primary" data-action="back-product">VER PRODUTO</button>');
  if(action==='support'){const url=safeLink(config.supportUrl);if(url)location.assign(url);else openDialog('Atendimento','<p>O canal de atendimento da loja ainda não está disponível nesta página.</p><a class="text-button" href="#sobre">Consultar informações do produto</a>');}
});
content.addEventListener('click',e=>{const link=e.target.closest('a[href^="#"]');if(link){e.preventDefault();navigateTo(link.getAttribute('href'));}});
const cep=document.querySelector('#cep');
const shippingResult=document.querySelector('#shipping-result');
cep.addEventListener('input',()=>{
  cep.value=cep.value.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2');
  shippingResult.textContent='';
  shippingResult.classList.remove('shipping-success');
  cep.removeAttribute('aria-invalid');
});
document.querySelector('#shipping-form').addEventListener('submit',e=>{
  e.preventDefault();
  const complete=cep.value.replace(/\D/g,'').length===8;
  shippingResult.classList.toggle('shipping-success',complete);
  cep.setAttribute('aria-invalid',String(!complete));
  shippingResult.textContent=complete?'FRETE GRÁTIS · chega em 3 a 7 dias úteis':'Informe um CEP válido com 8 dígitos.';
});
document.querySelector('#newsletter-form').addEventListener('submit',e=>{e.preventDefault();const url=safeLink(config.newsletterUrl);if(url){location.assign(url);return;}document.querySelector('#newsletter-result').textContent='O cadastro de novidades ainda não está disponível. Nenhum dado foi enviado.';});
