const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");



loginButton.addEventListener("click", (e) => {


  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  console.log("loginForm");


  let data = {
    email: email,
    password: password,
  }; 

  fetch("http://localhost:3003/login", {
    method: "post",
    body: JSON.stringify(data),
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data1) {
    console.log(data1)
      if(data1.status === 'success'){
 
        window.location.href = "/page.html";
      }
      else{
        alert(JSON.stringify(data1));
      }

    })
    .catch((error) => {
      console.log(error);
      alert("erro ao logar");
    });
});


