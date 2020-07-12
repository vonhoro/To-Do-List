import _ from 'lodash';
import {createElement,listElement,bigCardStructure,miniCardColor,miniCardDeadLine,bigCardColor,removeCard,Toggle}
 from './domSupport.js';
//----------------------------------------------------------------------------//
//adding some dom,creating elements and adding basic events
const Content =  document.getElementById('content');

const Todo =  document.getElementById('add-todo');
Todo.addEventListener('submit',Formula);

const Boton = document.getElementsByClassName('botonc')[0];
Boton.addEventListener('click',()=>{
   Todo.style.display = 'block';
});

const ListaH = createElement('div');
ListaH.setId('ListaH');
Content.appendChild(ListaH.Element);

const ListaM = createElement('div');
ListaM.setId('ListaM');
ListaM.Element.style.display = 'none';
Content.appendChild(ListaM.Element);

const ListaL = createElement('div');
ListaL.setId('ListaL');
ListaL.Element.style.display = 'none';
Content.appendChild(ListaL.Element);

const High = document.getElementById('high');
High.addEventListener('click',Toggle);

const Med = document.getElementById('med');
Med.addEventListener('click',Toggle);

const Low = document.getElementById('low');
Low.addEventListener('click',Toggle);
//----------------------------------------------------------------------------//
//first checks storages
let allItems = [];
let fix = '' ;  
let forStorage = '';
let oldItems = localStorage.getItem('Items');

if(oldItems != null){//manages data if there is some storage
   forStorage = oldItems;
   oldItems = oldItems.split('  RAD  RAD  RAD  RAD  ');
   oldItems = oldItems.filter((value) =>{return value != ''});

   for (let i = 0; i < oldItems.length; i++){
      fix = oldItems[i].split('  N  n  N  n  N  ');
      const Item = listElement(fix[0],fix[1],fix[2],fix[3],fix[4]);
      allItems.push(Item);
      addItem(Item);

   }
}
//form module
function Formula(Form){
   Form.preventDefault();
   if(Form.submitter.id == 'cancel'){
      Todo.reset();
      Form.target[0].placeholder ='';
      Form.target[0].style.backgroundColor ='white';
      Todo.style.display = 'none';
      return;     
   }
   let formValues =[]
   for( let i = 0; i < 5; i++ ){
      if(Form.target[0].value == ''){//at least you need to add Thing
         Form.target[0].placeholder = 'Add Something'
         Form.target[0].style.backgroundColor ='#b54bd4';
      }else{
      formValues.push(Form.target[i].value.trim());
      Form.target[i].style.backgroundColor ='white';
      }
   }
   if(formValues.length < 5){return};//ant this actually checks
   Form.target[0].placeholder ='';
   Form.target[0].style.backgroundColor ='white';
   let Item = listElement(formValues[0],formValues[1],formValues[2],formValues[3],formValues[4]);//we make the object
   Todo.style.display ='none';
   allItems.push(Item);//sets storages
   forStorage = Item.toString + '  RAD  RAD  RAD  RAD  ' + forStorage;
   localStorage.setItem('Items',forStorage);
   
   addItem(Item);
   Todo.reset();
}

function addItem(Item){
   //small card
   let miniCard = createElement('div');
   miniCard.addClass('mini-card');
   miniCard.addClass(allItems.length);
   miniCard.setId(allItems.length);
  
   miniCard.Element.addEventListener('click',miniCardEvents); 
   let miniCardDL = miniCardDeadLine(Item.deadLine);
   miniCard.Element.innerHTML =   `
    <p class="minicard-text">`+Item.Thing+`</p>
    <p class="minicard-text">`+miniCardDL+`</p>
    <button class="botond">Delete</button>
    `
   miniCardColor(Item.Importance,miniCard.Element);
   //Big Card
   let bigCard = createElement('div');
   bigCard.addClass('big-card');  
   bigCard.addClass(allItems.length);  
   bigCard.setId(allItems.length);
   bigCard.Element.innerHTML = bigCardStructure(Item.Thing,Item.deadLine,Item.Reason,Item.Importance,Item.Notes,allItems.length);
  
   bigCard.Element.style.display = 'none';
   
   let closeBoton = bigCard.Element.querySelector('#close');
   closeBoton.addEventListener('click',Close);
   let editBoton = bigCard.Element.querySelectorAll('.botona');
   for(let i = 0; i < 5; i++){
      editBoton[i].addEventListener('click',Edit);     
   }      
   let saveEdit = bigCard.Element.querySelector('#save')
   saveEdit.addEventListener('click',saveChanges);
   bigCardColor(Item.Importance,bigCard.Element);

}

function miniCardEvents(e){
   //Delete cards
        if(e.target.textContent == 'Delete'){
         if(confirm('Press ok to Delete the entry')){
            let Location = parseInt(e.target.parentElement.id) - 1;
            forStorage = forStorage.replace(allItems[Location].toString,'');
            localStorage.setItem('Items',forStorage);
            e.target.parentElement.parentElement.removeChild(e.target.parentElement.nextElementSibling);         
            e.target.parentElement.parentElement.removeChild(e.target.parentElement);
            
            return;
         }else{return;};
      }//removes card clicked, makes appear the bigger that correspondes, close all others in the same tab.
      if (e.target.parentElement.id == 'ListaH' || e.target.parentElement.id == 'ListaM' || e.target.parentElement.id == 'ListaL'){
         for(let i = 0; i < e.target.parentElement.children.length; i = i + 2){
            e.target.parentElement.children[i].style.display = 'block';
         } 
         e.target.style.display = 'none';
         for(let i = 1; i < e.target.parentElement.children.length; i = i + 2){
            e.target.parentElement.children[i].style.display = 'none';       
         } 
         e.target.nextElementSibling.style.display = 'block';
      }else{
         for(let i = 0; i < e.target.parentElement.parentElement.children.length; i = i + 2){
          e.target.parentElement.parentElement.children[i].style.display = 'block'
         } 
         e.target.parentElement.style.display = 'none';
         
         for(let i = 1; i < e.target.parentElement.parentElement.children.length; i = i + 2){
          e.target.parentElement.parentElement.children[i].style.display = 'none';
            console.log(e.target.parentElement.parentElement.children[i]);
         } 
         e.target.parentElement.nextElementSibling.style.display='block';   
      }
}  
   
function Edit(e){
//Finds the Element with the thing and changes it for a formulary
   e.target.textContent  = 'Reset';
   let ReplacedId = e.target.previousElementSibling.id;
   let ReplacementId = ReplacedId.toUpperCase();
   let Replaced = document.getElementById(ReplacedId);
   let Replacement = document.getElementById(ReplacementId);
   Replaced.lastElementChild.style.display = 'none';
   Replacement.value = Replaced.lastElementChild.textContent;
   Replacement.style.marginTop = '2.5em';
   Replacement.style.display = 'inline';
   Replacement.focus();
}

function saveChanges(e){
//to Save changes
  let Location = parseInt(e.target.parentElement.parentElement.id);
  let Item = allItems[Location - 1];
  let cardClass = 'big-card ' + Location;
  let miniCardClass = 'mini-card ' + Location; 
  let cardNewContent = document.getElementsByClassName(cardClass)[0].children;
//check the moved thing

  if(cardNewContent[0].children[1].firstElementChild.style.display == 'inline'){
     Item.Thing = cardNewContent[0].children[1].firstElementChild.value 
  }
  if(cardNewContent[1].children[1].firstElementChild.style.display == 'inline'){
     Item.deadLine = cardNewContent[1].children[1].firstElementChild.value 
  }
  if(cardNewContent[2].children[1].firstElementChild.style.display == 'inline'){
     Item.Reason = cardNewContent[2].children[1].firstElementChild.value 
  }
  if(cardNewContent[3].children[1].firstElementChild.style.display == 'inline'){
     Item.Importance = cardNewContent[3].children[1].firstElementChild.value 
  }
  if(cardNewContent[4].children[1].firstElementChild.style.display == 'inline'){
     Item.Notes = cardNewContent[4].children[1].firstElementChild.value 
  }
  //sets minicard
  Item = listElement(Item.Thing,Item.deadLine,Item.Reason,Item.Importance,Item.Notes);
   let miniCard = document.getElementsByClassName(miniCardClass)[0];
   
   let miniCardDL = miniCardDeadLine(Item.deadLine);
   miniCard.innerHTML = `
    <p class="minicard-text">`+Item.Thing+`</p>
    <p class="minicard-text">`+miniCardDL+`</p>
    <button class="botond">Delete</button>
    `;
    removeCard(miniCard);
    miniCard.style.display = 'block';
    miniCardColor(Item.Importance,miniCard)
   //sets big card
  let currentCard = document.getElementsByClassName(cardClass)[0];
  currentCard.innerHTML = bigCardStructure(Item.Thing,Item.deadLine,Item.Reason,Item.Importance,Item.Notes,Location);
  currentCard.style.display = 'none'; 
  
  let editBoton = currentCard.querySelectorAll('.botona');

   for(let i = 0; i < 5; i++){
      editBoton[i].addEventListener('click',Edit);
   } 
   let saveEdit = currentCard.querySelector('#save')
  saveEdit.addEventListener('click',saveChanges);
   let closeBoton = currentCard.querySelector('#close');
  closeBoton.addEventListener('click',Close);
    removeCard(currentCard);
 
  bigCardColor(Item.Importance,currentCard);
 //sets Storages
  forStorage = forStorage.replace(allItems[Location-1].toString,Item.toString);
  localStorage.setItem('Items',forStorage);
  allItems[Location - 1] = Item;
}


function Close(e){
   //makes it invisible
   e.target.parentElement.parentElement.previousElementSibling.style.display = 'block';
   e.target.parentElement.parentElement.style.display = 'none';
   //checks if an edit boton had being oprresed
   let Location = parseInt(e.target.parentElement.parentElement.id);
   let Item = allItems[Location - 1]
   let cardClass = 'big-card ' + Location;
   let cardNewContent = document.getElementsByClassName(cardClass)[0].children
   if(cardNewContent[0].children[1].firstElementChild.style.display == 'inline'){
     cardNewContent[0].children[1].firstElementChild.style.display = 'none';
     cardNewContent[0].children[1].firstElementChild.nextElementSibling.style.display = 'inline-block';
     cardNewContent[0].children[2].textContent = 'EEit';
   }
   if(cardNewContent[1].children[1].firstElementChild.style.display == 'inline'){
     cardNewContent[1].children[1].firstElementChild.style.display = 'none';
     cardNewContent[1].children[1].firstElementChild.nextElementSibling.style.display = 'inline-block';
     cardNewContent[1].children[2].textContent = 'Edit';
   }
   if(cardNewContent[2].children[1].firstElementChild.style.display == 'inline'){
     cardNewContent[2].children[1].firstElementChild.style.display = 'none';
     cardNewContent[2].children[1].firstElementChild.nextElementSibling.style.display = 'inline-block';
     cardNewContent[2].children[2].textContent = 'Edit';
   }
   if(cardNewContent[3].children[1].firstElementChild.style.display == 'inline'){
     cardNewContent[3].children[1].firstElementChild.style.display = 'none';
     cardNewContent[3].children[1].firstElementChild.nextElementSibling.style.display = 'inline-block';
     cardNewContent[3].children[2].textContent = 'Edit';
   }
   if(cardNewContent[4].children[1].firstElementChild.style.display == 'inline'){
     cardNewContent[4].children[1].firstElementChild.style.display = 'none';
     cardNewContent[4].children[1].firstElementChild.nextElementSibling.style.display = 'inline-block';
     cardNewContent[4].children[2].textContent = 'Edit';
   }
}

