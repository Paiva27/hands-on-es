// add admin cloud function
const adminForm = document.querySelector('.admin-actions');
adminForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const adminEmail = document.querySelector('#admin-email').value;
  const addAdminRole = functions.httpsCallable('addAdminRole');
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result);
  });
});

// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    user.getIdTokenResult().then(idTokenResult => {
      user.admin = idTokenResult.claims.admin;
      setupUI(user);
      var x = document.getElementsByClassName("btn-small blue-grey z-depth-0");
    for(var i = 0; i < x.length;i++){
      x[i].style = "display:block;"
    }
    });
    document.getElementById('usuario-logado').value = "sim";
    db.collection('users').onSnapshot(snapshot => {
      setupUsers(snapshot.docs);
    }, err => console.log(err.message));
  } else {
   setupUI();
   setupUsers([]);
  }
});




// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    title: createForm.title.value,
    content: createForm.content.value
  }).then(() => {
    // close the create modal & reset form
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message);
  });
});

// signup
const signupForm = document.querySelector('#signup-form');
signupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // sign up the user & add firestore data
  auth.createUserWithEmailAndPassword(email, password).then(cred => {
    return db.collection('users').doc(cred.user.uid).set({
      bio: signupForm['signup-bio'].value,
      nome: signupForm['signup-name'].value,
      tag: signupForm['signup-tag'].value,
      cidade: signupForm['signup-city'].value,
      data: signupForm['signup-data'].value,
      area: signupForm['signup-profissa'].value,
      tipo: signupForm['signup-select'].value,
      rg: signupForm['signup-RG'].value,
      cpf: signupForm['signup-CPF'].value,
      telefone: signupForm['signup-telefone'].value,


    });
  }).then(() => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupForm.reset();
    signupForm.querySelector('.error').innerHTML = ''
  }).catch(err => {
    signupForm.querySelector('.error').innerHTML = err.message;
  });
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
  document.getElementById('usuario-logado').value = "nao";
});

// login
const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // get user info
  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  // log the user in
  auth.signInWithEmailAndPassword(email, password).then((cred) => {
    // close the signup modal & reset form
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginForm.reset();
    loginForm.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginForm.querySelector('.error').innerHTML = err.message;
  });

});

const cidadeSelec = document.querySelector('#cidade-form');
cidadeSelec.addEventListener('submit', (e) => {
  e.preventDefault();
  const cidade = cidadeSelec['cidade-select'].value;
  db.collection('users').onSnapshot(snapshot => {
    setupUsersByCity(snapshot.docs,cidade);
  });
  document.getElementById("div-inicio").style = "display:none;";
  document.getElementById("div-display").style = "display:block";
  document.getElementById("cidade-atual").value = cidade;

});


const tagSelect = document.querySelector('#form-procura');
tagSelect.addEventListener('search', (e) => {
  e.preventDefault();
  const pesquisa = tagSelect['search'].value;
  cidade = document.getElementById("cidade-atual").value;
  console.log(pesquisa);
  console.log(cidade);
  db.collection('users').onSnapshot(snapshot => {
    setupUsersByTag(snapshot.docs,cidade,pesquisa);
  });
});

const pesquisaSelect = document.querySelector('#select-procura');
pesquisaSelect.addEventListener('submit', (e) => {
  e.preventDefault();
  const pesquisa = pesquisaSelect['signup-profissa'].value;
  cidade = document.getElementById("cidade-atual").value;
  console.log(pesquisa);
  console.log(cidade);
  db.collection('users').onSnapshot(snapshot => {
    setupUsersByArea(snapshot.docs,cidade,pesquisa);
  });
});

function updateUser(e,bio,tag,cidade){ 
  e.preventDefault();
  var user = firebase.auth().currentUser;
  return db.collection('users').doc(user.uid).update({
    bio: bio,
    cidade: cidade,
    tag: tag,
  });
  }


/*const updateUserSelect = document.querySelector('#update-user');
updateUserSelect.addEventListener('submit', (e) => {
  e.preventDefault();
 
  console.log(cred.user.uid);
  })*/



