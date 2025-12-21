const nameInputField = document.querySelector("#item-name");
const quantityInputField = document.querySelector(".item-quantity");
const form = document.querySelector(".item-submission");
const list = document.querySelector(".list");
const inputError = document.querySelector("small");

let listArray = [
  {
    id: 1,
    name: "Apples",
    quantity: 5,
    completed: false,
  },
  {
    id: 2,
    name: "Carrots",
    quantity: 8,
    completed: false,
  },
];

let nextId = listArray.length + 1;

// Render list (for initial load and updates - add, delete and edit items)

const renderList = () => {
  list.innerHTML = "";

  listArray.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.id = `${item.id}`;
    const listElementInfo = `
    <div class="list-element-info">        
      <label for="${item.id}"><input type="checkbox" id="${item.id}" name="${item.id}"/>${item.name}</label>
      <p>${item.quantity}</p>      
      <div class="dropdown">
        <button class="dropdown-trigger" aria-expanded="false">
          <img src="./icons/more.svg" alt="More actions for ${item.name}">      
        </button>
        <div class="dropdown-menu">
          <button data-action="edit">
            <img src="./icons/edit.svg" alt="Edit ${item.name} item"> 
            <p>Edit</p>
          </button>
          <button data-action="delete">
            <img src="./icons/delete.svg" alt="Delete ${item.name} item"> 
            <p>Delete</p>
          </button>
        </div>
      </div>
    </div>
    `;

    listElement.innerHTML = listElementInfo;

    list.append(listElement);
  });
};

// Load list on initial load

window.addEventListener("load", () => {
  renderList();
});

// Add items to the list

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameValue = nameInputField.value.trim();
  const quantityValue = quantityInputField.value.trim();

  if (nameValue === "") {
    inputError.style.display = "block";
    nameInputField.classList.add("error");
    nameInputField.value = "";
    return;
  }

  listArray.push({
    id: nextId,
    name: nameValue,
    quantity: quantityValue || "-",
    completed: false,
  });

  inputError.style.display = "none";
  nameInputField.classList.remove("error");
  form.reset();

  nextId++;
  renderList();
});

// Expand actions - events

document.addEventListener("click", (e) => {
  const trigger = e.target.closest(".dropdown-trigger");
  const dropdowns = document.querySelectorAll(".dropdown");

  const closeAllDropdowns = () => {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-menu");
      const trigger = dropdown.querySelector(".dropdown-trigger");

      menu.classList.remove("active");
      trigger.setAttribute("aria-expanded", "false");
    });
  };

  if (!trigger) {
    closeAllDropdowns();
    return;
  }

  const dropdown = trigger.closest(".dropdown");
  const menu = dropdown.querySelector(".dropdown-menu");

  const isOpen = menu.classList.contains("active");

  closeAllDropdowns();

  if (!isOpen) {
    menu.classList.add("active");
    trigger.setAttribute("aria-expanded", "true");
  }
});

// Edit item details

// Remove an item from the list

list.addEventListener("click", (e) => {
  if (e.target.closest("button[data-action='delete']")) {
    const itemToDelete = e.target.closest("li").id;

    listArray = listArray.filter(
      (elementToDelete) => elementToDelete.id.toString() !== itemToDelete
    );

    renderList();
  }
});
