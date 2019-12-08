// DOM elements
const guideList = document.querySelector('.guides');
const usersList = document.querySelector('.users');
const usersListByCity = document.querySelector('.usersbc');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const adminItems = document.querySelectorAll('.admin');

const setupUI = (user) => {
  if (user) {
    if (user.admin) {
      adminItems.forEach(item => item.style.display = 'block');
    }
    // account info
    db.collection('users').doc(user.uid).get().then(doc => {
      const html = `
        <div>Nome : ${doc.data().nome}</div><br>
        <div>Email : ${user.email}</div><br>
        <form id ="update-user">
        <p>Descrição: </p>
        <div><div class="input-field">
        <textarea id="input-bio" class="materialize-textarea" data-length="120" style="height: 150px;">
        ${doc.data().bio}
        </textarea><br>
    </div></div><br>
        <p>Tags : </p>
        <div><div class="input-field">
        <input type="text" id="input-tag" value="${doc.data().tag}"/>
        <label for="input-tag"></label>
      </div></div><br>
      <p>Cidade :</p>
      <div><div class="input-field">
      <input type="text" id="input-cidade" value="${doc.data().cidade}"/>
      <label for="input-cidade"></label>
    </div></div><br>
    <div class="center-align"><button class="btn waves-effect waves-light center-align" 
    onclick="updateUser(event, document.getElementById('input-bio').value,document.getElementById('input-tag').value,document.getElementById('input-cidade').value )" name="action"> Atualizar Dados</div>
    </form>
      `;
      accountDetails.innerHTML = html;
    });
    // toggle user UI elements
    loggedInLinks.forEach(item => item.style.display = 'block');
    loggedOutLinks.forEach(item => item.style.display = 'none');
  } else {
    // clear account info
    accountDetails.innerHTML = '';
    // toggle user elements
    adminItems.forEach(item => item.style.display = 'none');
    loggedInLinks.forEach(item => item.style.display = 'none');
    loggedOutLinks.forEach(item => item.style.display = 'block');
  }
};


// setup guides
const setupGuides = (data) => {
  if (data.length) {
    let html = '';
    data.forEach(doc => {
      const guide = doc.data();
      const li = `
        <li>
          <div class="collapsible-header grey lighten-4"> ${guide.nome} </div>
          <div class="collapsible-body white"> ${guide.bio} </div>
        </li>
      `;
      html += li;
    });
    
    guideList.innerHTML = html
  }
  
};

const setupUsers = (data) => {
  if (data.length) {
    var cidades = [""];
    cidades[0] =  "Escolha uma cidade...";
    var i = 1;
    var entrou = false;
    
    const opt =` ` ;
    data.forEach(doc => {
      const user = doc.data();
      for(var a = (cidades.length - 1  );  a >= 0; a--){
        if((cidades[a] == user.cidade)||(user.tipo === "Cliente")) {
          entrou = true;
          break;
        } else entrou = false;
      }
      if((!entrou)){
        cidades[i] = user.cidade;
        i++;
      }
    });
    let html = `<option value="" disabled selected>${cidades[0]}</option>`;
    for(var a = 1;  a < cidades.length ; a++){
      html += ` <option value="${cidades[a]}" >${cidades[a]}</option>`;
     
    }

    usersList.innerHTML = html
  }
  
};

const setupUsersByCity = (data,cidade) => {
  if (data.length) {
    let html = ``;
    data.forEach(doc => {
      const user = doc.data();

      var icone;
      if(user.area === "Pedreiro"){
        icone = 'gavel';
      }else if(user.area === "Pintor"){
        icone = 'format_paint';
      }else if(user.area === "Bombeiro"){
        icone = 'format_color_reset';
      }else if(user.area === "Eletricista"){
        icone = 'flash_on';
      }else{ 
        icone = 'person';
      }

        if((user.cidade.valueOf() === cidade.valueOf()) && (user.tipo === "Prestador")) {
          html += ` <li>
          <div class="collapsible-header blue-grey lighten-2 " onclick="checarLogado()">
          <i class="medium material-icons">${icone}</i><p class="flow-text">${user.nome}  É  ${user.area} e tem experiencia com ${user.tag}</p>
          </div>
          <div class="collapsible-body white"><br>
           <p class="flow-text">${user.bio} <p><br>
           <form id="form-contato">
           <br><br>
           <br><br>
           <div class="center-align"><button id ="contato"  onclick="contatoPrestador(event,${user.telefone});" class="btn-small blue-grey z-depth-0">Contato</button><div>
           </form>
           </div>
          </li>
          <br>`;
          console.log(user.cidade);
        }
    });
   usersListByCity.innerHTML = html
  } 
  
};

const setupUsersByTag  = (data,cidade,tag) => {
  if (data.length) {
    let html = ``;
    data.forEach(doc => {
      const user = doc.data();

      var icone;
      if(user.area === "Pedreiro"){
        icone = 'gavel';
      }else if(user.area === "Pintor"){
        icone = 'format_paint';
      }else if(user.area === "Bombeiro"){
        icone = 'format_color_reset';
      }else if(user.area === "Eletricista"){
        icone = 'flash_on';
      }else{ 
        icone = 'person';
      }

      console.log(user.tag  +" - " + tag);
        if((user.cidade.valueOf() === cidade.valueOf()) && (user.tag.includes(tag))&& (user.tipo === "Prestador") ) {
          html += `<li>
          <div class="collapsible-header blue-grey lighten-2 ">
          <i class="medium material-icons">${icone}</i><p class="flow-text">${user.nome}  É  ${user.area} e tem experiencia com ${user.tag}</p>
          </div>
          <div class="collapsible-body white"><br>
           <p class="flow-text">${user.bio} <p><br>
           <form id="form-contato">
           <br><br>
           <br><br>
           <div class="center-align"><button id = "contato"  onclick="contatoPrestador(event,${user.telefone});" class="btn-small blue-grey z-depth-0">Contato</button><div>
           </form>
           </div>
          </li>
          <br>`;
          console.log(user.cidade);
        }
    });
   usersListByCity.innerHTML = html
  } 
  
};

const setupUsersByArea  = (data,cidade,area) => {
  if (data.length) {
    let html = ``;
    data.forEach(doc => {
      const user = doc.data();

      var icone;
      if(user.area === "Pedreiro"){
        icone = 'gavel';
      }else if(user.area === "Pintor"){
        icone = 'format_paint';
      }else if(user.area === "Bombeiro"){
        icone = 'format_color_reset';
      }else if(user.area === "Eletricista"){
        icone = 'flash_on';
      }else{ 
        icone = 'person';
      }

      console.log(user.area  +" - " + area);
        if((user.cidade.valueOf() === cidade.valueOf()) && (user.area.includes(area))&& (user.tipo === "Prestador") ) {
          html += ` 
          <li>
          <div class="collapsible-header blue-grey lighten-2 ">
          <i class="medium material-icons">${icone}</i><p class="flow-text">${user.nome}  É  ${user.area} e tem experiencia com ${user.tag}</p>
          </div>
          <div class="collapsible-body white"><br>
           <p class="flow-text">${user.bio} <p><br>
           <form id="form-contato">
           <br><br>
           <br><br>
           <div class="center-align"><button id = "contato${user.id}" onclick="contatoPrestador(event,${user.telefone});" class="btn-small blue-grey z-depth-0">Contato</button><div>
           </form>
           </div>
          </li>
          <br>`;
          console.log(user.cidade);
        }
    });
    if(html === ``){ 
      html += `
      <div class="center-align"><i class="large material-icons">mood_bad</i></div>
      <p class="center-align flow-text">Vish, nenhum prestador foi encontrado</p>`
    }
   usersListByCity.innerHTML = html
  } 
  
};

function contatoPrestador(e,telefone){ 
  e.preventDefault();
    var win = window.open("http://api.whatsapp.com/send?1=pt_BR&phone=55"+telefone, '_blank');
    win.focus();
  console.log(telefone);
  }

function checarLogado(){
  var user = firebase.auth().currentUser;
  console.log(user);
  var x = document.getElementsByClassName("btn-small blue-grey z-depth-0");
  if(user === null){
   
    for(var i = 0; i < x.length;i++){
      x[i].style = "display:none"
    }
  }else{
/*
    for(var i = 0; i < x.length;i++){
      x[i].style = "display:block"
    }*/
  }
}



function setTxt(){
  db.collection('users').onSnapshot(snapshot => {
    setupUsers(snapshot.docs);
  }, err => console.log(err.message));
}

function prestaSelect(){ 
var a = document.getElementById("signup-select").value;
if(a === "Prestador"){ 
  document.getElementById("prestador-ex").style = "display:block";
}else{
  document.getElementById("prestador-ex").style = "display:none";

}
}


function home(){
  document.getElementById("div-inicio").style = "display:block;";
  document.getElementById("div-display").style = "display:none";
  document.getElementById("cidade-atual").value = "";
  //console.log("shazamCarai");
}


// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

  var modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  var items = document.querySelectorAll('.collapsible');
  M.Collapsible.init(items);

  var elems = document.querySelectorAll('.select');
  M.FormSelect.init(elems);

});
