const form = document.querySelector(".item-submission");

const floatingMessageElement = document.querySelector(".floating-message");

const nameInputField = document.querySelector("#item-name");
const inputError = document.querySelector("small");

const quantityInputField = document.querySelector("#item-quantity");
const selectUnit = document.querySelector("#select-unit");

const list = document.querySelector(".list");

const clearListBtn = document.querySelector(".clear-list");

let setTimeoutId;

const UNIT_CATALOG = {
  count: {
    label: "Count-based",
    units: ["pcs", "pack", "bunch"],
  },
  weight: {
    label: "Weight",
    units: ["g", "kg"],
  },
  volume: {
    label: "Volume",
    units: ["ml", "l"],
  },
  container: {
    label: "Container",
    units: ["bottle", "can", "jar", "bag"],
  },
};

let listArray = JSON.parse(localStorage.getItem("list")) || [];

let nextId = listArray.length + 1;

let populateUnits = (parent) => {
  for (let category in UNIT_CATALOG) {
    const unitSection = document.createElement("optgroup");
    unitSection.label = `${UNIT_CATALOG[category].label}`;

    UNIT_CATALOG[category].units.forEach((unit) => {
      const unitOption = document.createElement("option");
      unitOption.textContent = `${unit}`;

      unitSection.append(unitOption);
    });

    parent.append(unitSection);
  }
};

populateUnits(selectUnit);

// Floating Error/ Success

const setFloatingMessage = (type, message) => {
  if (setTimeoutId) {
    clearTimeout(setTimeoutId);
  }

  floatingMessageElement.classList.add(type);
  floatingMessageElement.textContent = message;

  setTimeoutId = setTimeout(() => {
    floatingMessageElement.classList.remove("error", "success");
    floatingMessageElement.textContent = "";
    setTimeoutId = null;
  }, 5000);
};

// Render list (for initial load and updates - add, delete and edit items)

const renderList = () => {
  list.innerHTML = "";

  if (listArray.length === 0) {
    const emptyList = document.createElement("img");
    emptyList.classList.add("empty-list");
    emptyList.src = "./icons/empty.jpg";
    emptyList.alt = "List is empty";

    list.append(emptyList);
  }

  listArray.forEach((item) => {
    const listElement = document.createElement("li");
    listElement.id = `${item.id}`;
    const listElementInfo = `
    <div class="list-element-info">     
      <div class="list-name-container">
        <input type="checkbox" id="item-${item.id}" name="item-${item.id}" ${
          item.completed ? "checked" : ""
        }/>
        <label for="item-${item.id}" class="item-name">${item.name}</label>
      </div>   
      <input
        type="text"
        name="edit-item-name"
        id="edit-item-${item.id}-name"
        class="edit-item-name"
        value="${item.name}"
      />
      <p class="item-quantity">${item.quantity}</p> 
      <input
      type="number"
      name="edit-item-quantity"
      id="edit-item-${item.id}-quantity"
      class="edit-item-quantity"
      value="${item.quantity}"
      />     
      <p class="item-unit">${item.unit}</p> 
      <select class="edit-item-unit" id="edit-item-${item.id}-unit">
      <option value=${item.unit} selected disabled hidden>${item.unit}</option>
      </select>
      <div class="dropdown">
        <button class="dropdown-trigger" aria-expanded="false">
          <img src=${item.completed ? "./icons/more-grey.svg" : "./icons/more.svg"} alt="More actions for ${item.name}">      
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
      <button data-action="save">
        <img src="./icons/done.svg" alt="Save edits for ${item.name}">      
      </button>
    </div>
    `;

    listElement.innerHTML = listElementInfo;

    const inlineSelectUnit = listElement.querySelector(".edit-item-unit");

    populateUnits(inlineSelectUnit);

    if (item.completed) {
      listElement.classList.add("checked");
    } else {
      listElement.classList.remove("checked");
    }

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
  const unitValue = selectUnit.value;

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
    unit: unitValue || "-",
    completed: false,
  });

  inputError.style.display = "none";
  nameInputField.classList.remove("error");
  form.reset();

  localStorage.setItem("list", JSON.stringify(listArray));
  setFloatingMessage("success", "Item added to the list.");

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

// Remove an item from the list

list.addEventListener("click", (e) => {
  if (e.target.closest("button[data-action='delete']")) {
    const itemToDelete = e.target.closest("li").id;

    listArray = listArray.filter(
      (elementToDelete) => elementToDelete.id.toString() !== itemToDelete,
    );

    localStorage.setItem("list", JSON.stringify(listArray));
    setFloatingMessage("success", "Item deleted.");

    renderList();
  }
});

// Edit item

list.addEventListener("click", (e) => {
  if (e.target.closest("button[data-action='edit']")) {
    const itemToEdit = e.target.closest("li");

    itemToEdit.classList.add("is-editing");
  }
});

// Close edit mode when clicking outside the element/ on another item

document.addEventListener("click", (e) => {
  const editingItem = document.querySelector(".is-editing");

  if (!editingItem || editingItem.contains(e.target)) {
    return;
  }

  editingItem.classList.remove("is-editing");
});

// Save edits

list.addEventListener("click", (e) => {
  if (e.target.closest("button[data-action='save']")) {
    const itemToSave = e.target.closest("li");

    let itemFound = listArray.find(
      (item) => item.id.toString() === itemToSave.id,
    );

    const inputNameValue = itemToSave
      .querySelector(".edit-item-name")
      .value.trim();
    const inputQuantityValue = itemToSave
      .querySelector(".edit-item-quantity")
      .value.trim();
    const inputUnitValue = itemToSave
      .querySelector(".edit-item-unit")
      .value.trim();

    const isItemUpdated =
      itemFound.name !== inputNameValue ||
      itemFound.quantity != inputQuantityValue ||
      itemFound.unit !== inputUnitValue;

    if (!isItemUpdated) {
      itemToSave.classList.remove("is-editing");

      return;
    }

    if (inputNameValue === "") {
      setFloatingMessage("error", "Name field cannot be empty.");
      return;
    }

    itemFound.name = inputNameValue;
    itemFound.quantity = inputQuantityValue || "-";
    itemFound.unit = inputUnitValue || "-";

    localStorage.setItem("list", JSON.stringify(listArray));
    setFloatingMessage("success", "Item info successfully updated.");
    itemToSave.classList.remove("is-editing");

    renderList();
  }
});

// Cross item if checked

list.addEventListener("click", (e) => {
  if (e.target.closest("input[type='checkbox']")) {
    const itemChecked = e.target.closest("li");
    const checkboxValue = e.target.checked;

    let itemFound = listArray.find(
      (item) => item.id.toString() === itemChecked.id,
    );

    itemFound.completed = checkboxValue;

    localStorage.setItem("list", JSON.stringify(listArray));

    renderList();
  }
});

// Clear list

clearListBtn.addEventListener("click", (e) => {
  if (confirm("Are you sure you want to delete all items?") == true) {
    listArray = [];

    localStorage.setItem("list", JSON.stringify(listArray));

    renderList();
  } else {
    return;
  }
});
