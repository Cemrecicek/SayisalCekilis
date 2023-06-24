//önce sayıların hepsini ekrana yazdıralım
const piyango=document.querySelector(".piyango")
for (let i = 1; i < 50; i++) {
    const div = document.createElement('div');
    div.classList.add('top');
    div.innerHTML = i;
    piyango.appendChild(div);
  }
 //şanslı sayıları belirleyelim
let toplar = []
let sayi=0
for(let i=0 ;i<6;i++){
    sayi=Math.floor(Math.random()*49)+1
    if(toplar.indexOf(sayi)==-1){
        toplar.push(sayi)
    }

}
//fonksiyonu oluşturalım
function highlightElements() {
    const elements = document.querySelectorAll('.top')
    elements.forEach(function(element) {
      var kutuSayi = Number(element.innerHTML)
      if (toplar.indexOf(kutuSayi) >= 0) {
        element.style.background = 'red'
      }
    });
  }
  
//butona basıldığında fonksiyonu çalıştıralım
let myButton = document.getElementById('myButton');
myButton.addEventListener('click', function() {
  highlightElements()  
    console.log('Butona tıklandı!');
  });

