const registButton = document.getElementById("regist-form-submit");
const registForm = document.getElementById("regist-form");
const registErrorMsg = document.getElementById("regist-error-msg");


registButton.addEventListener("click", (e) => {
  e.preventDefault();
  const email = registForm.email.value;
  const password = registForm.password.value;
  const confirmPassword = registForm.confirmPassword.value;

  let data = {
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  };

  fetch("http://localhost:3003/register", {
    method: "post",
    body: JSON.stringify(data),
    headers: { Accept: "application/json", "Content-Type": "application/json" },
  })
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if(data.status=== 'success'){
        window.location.href = "/login-page.html";
      }
      else{
        alert(JSON.stringify(data));
      }


 
    })
    .catch((error) => {
      console.log(error);
      alert("erro ao registar user");
    });
});
