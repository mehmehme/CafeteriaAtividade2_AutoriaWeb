// Inicialização
// o coffe hot estava em russo por algum motivo
const apiEndpoint = "https://api.sampleapis.com/coffee/iced"; // Substitua pelo URL da API desejada
const jsonData = [];
const cart = []; // Estado do carrinho

document.addEventListener("DOMContentLoaded", () => {
  // Criação da Navbar
  const navbar = document.createElement("div");
  navbar.className = "navbar";
  navbar.innerHTML = `
    <div class="nav-title">Cafeteria Tudo Frio</div>
    <div class="nav-links">
      <a href="#section1" id="link-products">Cafés</a>
      <a href="#section2" id="link-cart">Carrinho</a>
    </div>
  `;
  document.body.prepend(navbar);

  // Criação das seções de produtos e carrinho
  const productsSection = document.createElement("div");
  productsSection.id = "section1";
  productsSection.className = "products-section";
  document.body.appendChild(productsSection);

  const cartSection = document.createElement("div");
  cartSection.id = "section2";
  cartSection.className = "cart-section";
  cartSection.style.display = "none"; // Oculto inicialmente
  document.body.appendChild(cartSection);

  const cartContainer = document.createElement("div");
  cartContainer.className = "cart-container";
  cartSection.appendChild(cartContainer);

  // Alternar entre seções
  document.getElementById("link-products").addEventListener("click", (event) => {
    event.preventDefault();
    productsSection.style.display = "block";
    cartSection.style.display = "none";
  });

  document.getElementById("link-cart").addEventListener("click", (event) => {
    event.preventDefault();
    productsSection.style.display = "none";
    cartSection.style.display = "block";
    updateCart(cartContainer, cart);
  });

  // Função para buscar dados da API
  async function fetchData(apiUrl) {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      return [];
    }
  }

  // Função para criar cards na seção de produtos
  function createCard(data) {
    const card = document.createElement("div");
    card.className = "card-style";

    const image = document.createElement("img");
    image.src = data.image || "https://via.placeholder.com/150";
    image.alt = data.title;
    image.className = "image-style";
    card.appendChild(image);

    const title = document.createElement("h1");
    title.textContent = data.title;
    title.className = "title-style";
    card.appendChild(title);

    const description = document.createElement("p");
    description.textContent = data.description || "Descrição indisponível";
    description.className = "description-style";
    card.appendChild(description);

    //coisas para fazer cafe
    const ingredientsTitle = document.createElement("h4");
      ingredientsTitle.textContent = "Ingredients:";
      ingredientsTitle.className = "ingredients-title-style";
      card.appendChild(ingredientsTitle);
  
      const ingredientsList = document.createElement("ul");
      ingredientsList.className = "ingredients-list-style";
    if (data.ingredients && data.ingredients.length > 0) {  
      data.ingredients.forEach((ingredient) => {
        const ingredientItem = document.createElement("li");
        ingredientItem.textContent = ingredient;
        ingredientItem.className = "ingredient-item-style";
        ingredientsList.appendChild(ingredientItem);
      });
    }

    const button = document.createElement("button");
    button.className = "button-style";
    button.textContent = "Adicionar ao Carrinho";
    button.onclick = () => {
      const existingItem = cart.find((item) => item.name === data.title);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name: data.title, price: 10, quantity: 1 });
      }
      updateCart(cartContainer, cart);
    };
    card.appendChild(ingredientsList);
    card.appendChild(button);

    productsSection.appendChild(card);
  }

  // Função para atualizar o carrinho
  function updateCart(cartContainer, cart) {
    cartContainer.innerHTML = ""; // Limpa o carrinho

    if (cart.length === 0) {
      cartContainer.innerHTML = "<p>O carrinho está vazio!</p>";
      return;
    }

    cart.forEach((item, index) => {
      const cartItem = document.createElement("div");
      cartItem.className = "cart-item";

      cartItem.innerHTML = `
        <span>${item.name}</span>
        <span>R$${item.price.toFixed(2)}</span>
        <span>Qtd: ${item.quantity}</span>
      `;

      const decreaseButton = document.createElement("button");
      decreaseButton.textContent = "-";
      decreaseButton.onclick = () => {
        item.quantity--;
        if (item.quantity === 0) cart.splice(index, 1);
        updateCart(cartContainer, cart);
      };

      const increaseButton = document.createElement("button");
      increaseButton.textContent = "+";
      increaseButton.onclick = () => {
        item.quantity++;
        updateCart(cartContainer, cart);
      };

      cartItem.appendChild(decreaseButton);
      cartItem.appendChild(increaseButton);
      cartContainer.appendChild(cartItem);
    });

    const finalizeButton = document.createElement("button");
    finalizeButton.className = "finalize-button";
    finalizeButton.textContent = "Finalizar Compra";
    finalizeButton.onclick = () => showPaymentScreen();
    cartContainer.appendChild(finalizeButton);
  }

// Função para mostrar a tela de pagamento-----------------------
function showPaymentScreen() {
  const cartContainer = document.querySelector(".cart-container");
  
  // Limpar o conteúdo do carrinho (se necessário)
  cartContainer.innerHTML = "";

  // Criar a interface de pagamento
  const paymentForm = document.createElement("div");
  paymentForm.className = "payment-form";
  
  const cartItems = cart; // Agora estamos passando diretamente o carrinho
  const cartItemsList = document.createElement("ul");
  
  if (cartItems.length > 0) {
    cartItems.forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} - R$${item.price.toFixed(2)} x ${item.quantity}`;
      cartItemsList.appendChild(listItem);
    });
  } else {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Carrinho vazio!";
    cartItemsList.appendChild(emptyMessage);
  }
  
  paymentForm.appendChild(cartItemsList);

  // Criar campo para o endereço
  const addressInput = document.createElement("input");
  addressInput.type = "text";
  addressInput.placeholder = "Digite o endereço";
  addressInput.className = "address-input";
  paymentForm.appendChild(addressInput);

  // Criar campo para selecionar a forma de pagamento
  const paymentSelect = document.createElement("select");
  paymentSelect.className = "payment-select";
  const paymentOption = document.createElement("option");
  paymentOption.value = "";
  paymentOption.textContent = "Selecione uma forma de pagamento";
  paymentSelect.appendChild(paymentOption);

  // Adicionar uma opção de pagamento (pode ser expandido com mais opções)
  const option1 = document.createElement("option");
  option1.value = "cartao";
  option1.textContent = "Cartão de Crédito";
  paymentSelect.appendChild(option1);

  const option2 = document.createElement("option");
  option2.value = "boleto";
  option2.textContent = "Boleto";
  paymentSelect.appendChild(option2);

  const option3 = document.createElement("option");
  option3.value = "pix";
  option3.textContent = "Pix";
  paymentSelect.appendChild(option3);
  
  paymentForm.appendChild(paymentSelect);

  // Criar botão de finalizar compra
  const finalizeButton = document.createElement("button");
  finalizeButton.className = "finalize-button";
  finalizeButton.textContent = "Finalizar Compra";
  finalizeButton.onclick = () => validatePayment(addressInput.value, paymentSelect.value, cartItems);

  paymentForm.appendChild(finalizeButton);

  // Adicionar a tela de pagamento no carrinho
  cartContainer.appendChild(paymentForm);
}

// Função para validar o pagamento
function validatePayment(address, paymentMethod, cartItems) {
  // Validação do endereço
  const addressRegex = /^[A-Za-z\s]+$/; // Regex para validar endereço com letras e espaços
  if (!address || !addressRegex.test(address)) {
    alert("Por favor, insira um endereço válido (apenas letras).");
    return;
  }

  // Validação do método de pagamento
  if (!paymentMethod) {
    alert("Por favor, selecione uma forma de pagamento.");
    return;
  }

  // Se tudo estiver correto, finalizar a compra
  alert("Compra finalizada com sucesso!");
  
  // Limpar o carrinho
  clearCart();

}

// Função para limpar o carrinho
function clearCart() {
  cart.length=0;
  //console.log("Carrinho limpo!");
}

  // Buscar dados da API e criar os cards
  fetchData(apiEndpoint)
    .then((data) => {
      data.forEach((item) => {
        jsonData.push({
          id: item.id,
          title: item.title,
          ingredients: item.ingredients,
          description: item.description,
          image: item.image,
        });
      });

      jsonData.forEach((cardData) => createCard(cardData));
    })
    .catch((error) => console.error("Erro ao obter os dados:", error));
});
