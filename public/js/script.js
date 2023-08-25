function AtributosJ(checkbox) {
  const atributosFisica = document.getElementById("atributosfisica");
  const atributosJuridica = document.getElementById("atributosjuridica");
  const campoCPF = document.getElementsByName("cpf")[0];
  const campoRG = document.getElementsByName("rg")[0];
  const campoDataNasc = document.getElementsByName("datanasc")[0];
  const campoCNPJ = document.getElementsByName("cnpj")[0];
  const campoInscricaoE = document.getElementsByName("inscricaoe")[0];
  const campoRazaoSocial = document.getElementsByName("razaosocial")[0];

  if (checkbox.checked) {
    atributosFisica.classList.add("d-none");
    atributosJuridica.classList.remove("d-none");
    campoCPF.removeAttribute("required");
    campoRG.removeAttribute("required");
    campoDataNasc.removeAttribute("required");
    campoCPF.disabled = true;
    campoRG.disabled = true;
    campoDataNasc.disabled = true;
    campoCNPJ.disabled = false;
    campoInscricaoE.disabled = false;
    campoRazaoSocial.disabled = false;
    campoCNPJ.setAttribute("required", "");
    campoInscricaoE.setAttribute("required", "");
    campoRazaoSocial.setAttribute("required", "");
  } else {
    atributosFisica.classList.remove("d-none");
    atributosJuridica.classList.add("d-none");
    campoCPF.setAttribute("required", "");
    campoRG.setAttribute("required", "");
    campoDataNasc.setAttribute("required", "");
    campoCPF.disabled = false;
    campoRG.disabled = false;
    campoDataNasc.disabled = false;
    campoCNPJ.disabled = true;
    campoInscricaoE.disabled = true;
    campoRazaoSocial.disabled = true;
    campoCNPJ.removeAttribute("required");
    campoInscricaoE.removeAttribute("required");
    campoRazaoSocial.removeAttribute("required");
  }
}




const closeButtons = document.querySelectorAll('.alert .close');

closeButtons.forEach((button) => {
  button.addEventListener('click', function() {
    const alert = this.parentNode;

    alert.style.opacity = '0';
    alert.style.transition = 'opacity 0.5s';

    setTimeout(() => {
      alert.parentNode.removeChild(alert);
    }, 250); // Tempo correspondente à duração da animação em milissegundos
  });
});

//Botao mais e menos
const menos = document.querySelector('.menos');
const mais = document.querySelector('.mais');
const numero = document.getElementById('numero');
const num = parseInt(numero.value);

menos.addEventListener('click',() => numero.value = 5);

mais.addEventListener('click',() => numero.value = 6 );