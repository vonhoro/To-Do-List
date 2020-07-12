import _ from 'lodash';
import {format, formatDistanceToNow} from 'date-fns';

//facorries
const createElement = (element)=>{
   let Ele = element;
   const Element = ((Ele)=>{return document.createElement(element)})();
   const setId = (Id)=>{Element.setAttribute('id',Id)};
   const addClass = (Class) =>{ Element.classList.add(Class)}
   
   return {Element,setId,addClass};
   
};

const listElement = (T,DL,R,I,N)=>{
   let Thing      = T;   
   let deadLine   = DL;  
   let Reason     = R;   
   let Importance = I;   
   let Notes      = N;   
   let toString = T+ '  N  n  N  n  N  ' + DL + '  N  n  N  n  N  ' + R+  '  N  n  N  n  N  ' + I+  '  N  n  N  n  N  ' + N;
    return{Thing,deadLine,Reason,Importance,Notes,toString}   
   
}
//toggles funcion for tabs
function Toggle(e){
   e.target.classList.add('tab-toggled');
   switch(e.target.id){
      case 'high':
      document.getElementById('ListaH').style.display = 'grid';
      document.getElementById('ListaM').style.display = 'none';
      document.getElementById('med').classList.remove('tab-toggled');
      document.getElementById('ListaL').style.display = 'none';
      document.getElementById('low').classList.remove('tab-toggled');
      
      break;
      case 'med':
      document.getElementById('ListaH').style.display = 'none';
      document.getElementById('high').classList.remove('tab-toggled');
      document.getElementById('ListaM').style.display = 'grid';
      document.getElementById('ListaL').style.display = 'none';
      document.getElementById('low').classList.remove('tab-toggled');
      
      break;
      default:
      document.getElementById('ListaH').style.display = 'none';
      document.getElementById('high').classList.remove('tab-toggled');
      document.getElementById('ListaM').style.display = 'none';
      document.getElementById('med').classList.remove('tab-toggled');
      document.getElementById('ListaL').style.display = 'grid';
   }
   
}

//Mini Card Dom
function miniCardColor(Importance,miniCard){

   switch(Importance){
      case 'High':
      miniCard.style.backgroundColor = '#f96e23';
      document.getElementById('ListaH').appendChild(miniCard);
      break;
      case 'Medium':
      miniCard.style.backgroundColor = '#f1df76';
      document.getElementById('ListaM').appendChild(miniCard);
      break;
      default:
      miniCard.style.backgroundColor = '#0477c5';
      document.getElementById('ListaL').appendChild(miniCard);
   }      
}
function miniCardDeadLine (deadLine){   
   let timeToDate;
   if(deadLine == ""){
      timeToDate = 'No Dead Line'
   }else{  
      let Year  = parseInt(deadLine.slice(0,4)) 
      let Month = parseInt(deadLine.slice(5,7)) - 1; 
      let Day   = parseInt(deadLine.slice(8,10))
      
      timeToDate = formatDistanceToNow(
      new Date(Year,Month,Day),
      {addSuffix: true}
      )
   }
   return timeToDate;
} 
//2 card dom

function removeCard(Card){
  Card.parentElement.removeChild(Card);
   
}

//Big Card Dom
function bigCardStructure(Thing,deadLine,Reason,Importance,Notes,m){
 return `       
      <div class="line">          
      <div class="col-label">
         <h4>Thing to Do:</h4>
      </div>                      
      <div class="col-input" id="thing`+ m +`">
      <input type="text" name="thing"  id="THING`+ m +`" class="card-form" style="display:none">
         <h5>`+ Thing+`</h5>
      </div> 
      <button class="botona">Edit</button>       
      </div>
      
      <div class="line">          
      <div class="col-label">
         <h4>Dead Line:</h4>
      </div>                      
      <div class="col-input" id="deadLine`+ m +`">
       <input type="date" id="DEADLINE`+ m +`" name="dead-line" style="display:none" class="card-form">
         <h5>`+ deadLine+`</h5>
      </div>                     
      <button class="botona">Edit</button> 
      </div>
      
      <div class="line">          
      <div class="col-label">
         <h4>Reason?:</h4>
       </div>                      
      <div class="col-input" id="reason`+ m +`">     
         <input type="text" autofocus name="reason" id="REASON`+ m +`" style="display:none" class="card-form">      
         <h5>`+ Reason+`</h5>
      </div>  
      <button class="botona">Edit</button>  
      </div>        
      
      <div class="line">          
      <div class="col-label">
      <h4>Importance:</h4>
      </div>                      
      <div class="col-input" id="importance`+ m +`">
        <select type="text" id="IMPORTANCE`+ m +`" name="importance" style="display:none" class="card-form">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
         </select>
         <h5>`+ Importance+`</h5>
      </div>  
      <button class="botona">Edit</button>        
      </div>   
      
      <div class="line">          
      <div class="col-label">
         <h4>Notes:</h4>
      </div>                      
      <div class="col-input" id="notes`+ m +`">
         <textarea id="NOTES`+ m +`" name="notes" style="height:auto; display:none" class="card-form"></textarea>
         <h5>`+ Notes+ `</h5>
        
      </div> 
       <button class="botona">Edit</button>      
      </div>   
      <div class="boton-container">
         <button id="save" class="botonb">Save</button>        
         <button id="close" class="botonb">Close</button>
      </div>
     
   </form>
   `;
}
function bigCardColor(Importance,bigCard){
   switch(Importance){
      case 'High':
      bigCard.style.backgroundColor = '#e95106';
      document.getElementById('ListaH').appendChild(bigCard);
      break;
      case 'Medium':
      bigCard.style.backgroundColor = '#d4c25c';
      document.getElementById('ListaM').appendChild(bigCard);
      break;
      default:
      bigCard.style.backgroundColor = '#0364a7';
      document.getElementById('ListaL').appendChild(bigCard);
   }
}

export {createElement,listElement,bigCardStructure,miniCardColor,miniCardDeadLine,bigCardColor,removeCard,Toggle}

