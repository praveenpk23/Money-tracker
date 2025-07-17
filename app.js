const StorageCtrl = (function () {
  return {
    localStorageData: function () {
      return localStorage.getItem("items")
        ? JSON.parse(localStorage.getItem("items"))
        : [];
    },
    getItemById: function (id) {
      const items = this.localStorageData();
      console.log(items, id);
      const item = [];
      items.forEach(function (element) {
        if (element.id == id) {
          console.log("Entered foreach");
          item.push(element);
        }
      });
      return item;
    },
  };
})();

const ItemCtrl = (function () {
  const Items = function (id, item, price) {
    this.id = id;
    this.item = item;
    this.price = price;
  };

  const data = {
    item: localStorage.getItem("items")
      ? JSON.parse(localStorage.getItem("items"))
      : [],
    currentItem: null,
    totalMoney: 0,
  };

  return {
    getItems: function () {
      console.log(data.item);
      return data.item;
    },
    addItem: function (newItem) {
      const items = localStorage.getItem("items")
        ? JSON.parse(localStorage.getItem("items"))
        : [];
      console.log(items);
      console.log(newItem);
      const id = [];
      if (items.length > 0) {
        items.forEach(function (item, index) {
          id.push(item.id);
        });
        const maxId = Math.max(...id.map(Number));
        newItem.id = maxId + 1;
        console.log(newItem);
        items.push(newItem);
        localStorage.setItem("items", JSON.stringify(items));

        UiCtrl.showItems();
        UiCtrl.clearFields();
        UiCtrl.alertShow("Item added successfully", "green");
      } else {
        console.log(newItem);
        items.push(newItem);
        localStorage.setItem("items", JSON.stringify(items));
        console.log("Created localstorage and added");
        UiCtrl.showItems();
        UiCtrl.clearFields();
        UiCtrl.alertShow("Item added successfully", "green");
      }
    },
    //    updateItem : function(){
    //           const id = Number(localStorage.getItem('ItemId'))
    //           console.log(typeof id)
    //     const items = StorageCtrl.localStorageData();
    //     const newItems = [];
    //     items.forEach(function(element){
    //       if(element.id !== id){
    //         newItems.push(element)
    //       }
    //     })
    //     console.log(newItems)
    //    const item =  document.querySelector('#item-name').value;
    //     const price =   document.querySelector('#item-money').value;

    //     newItems.push({id:id,item:item,price:price})
    //     localStorage.setItem('items',JSON.stringify(newItems))
    //     UiCtrl.showItems();
    //     localStorage.removeItem('ItemId')
    //           UiCtrl.showAddbtnAlone()

    // },
    updateItem: function () {
      const item = document.querySelector("#item-name").value;
      const price = document.querySelector("#item-money").value;

      if (!item || !price) {
        UiCtrl.alertShow("Input fields should not be empty !", "green");
      } else {
        const id = Number(localStorage.getItem("ItemId"));
        console.log(typeof id);
        const items = StorageCtrl.localStorageData();
        // const newItems = [];

        items.forEach(function (element) {
          if (element.id === id) {
            element.item = item;
            element.price = price;
          }
        });
        console.log(items);

        // newItems.push({id:id,item:item,price:price})
        localStorage.setItem("items", JSON.stringify(items));
        UiCtrl.showItems();
        localStorage.removeItem("ItemId");
        UiCtrl.showAddbtnAlone();
        UiCtrl.alertShow("Item Updated successfully", "green");
      }
    },
    deleteItem: function () {
      if (confirm("Are you sure , you want to delete")) {
        const id = Number(localStorage.getItem("ItemId"));
        console.log(typeof id);
        const items = StorageCtrl.localStorageData();
        const newItems = [];
        items.forEach(function (element) {
          if (element.id !== id) {
            newItems.push(element);
          }
        });
        console.log(newItems);
        localStorage.setItem("items", JSON.stringify(newItems));
        UiCtrl.showItems();
        localStorage.removeItem("ItemId");
        UiCtrl.showAddbtnAlone();
        UiCtrl.alertShow("Item deleted successfully", "red");
      }
    },
    totalMoney: function () {
      const field = document.querySelector(".center-align");
      const items = StorageCtrl.localStorageData();
      let totalMoney = 0;
      items.forEach(function (item) {
        totalMoney += Number(item.price);
      });

      field.textContent = "₹" + totalMoney;
    },

    Items: Items,
  };
})();

const UiCtrl = (function () {
  return {
    showItems: function () {
      let html = "";
      const item = StorageCtrl.localStorageData();
      console.log(item);
      if (item.length > 0 || item === null) {
        item.forEach(function (item) {
          html += `
                
                <li class="collection-item" id="${item.id}">
               <strong>${item.item}</strong> : <em>${item.price} rs</em>

               <a href="#" class="secondary-content">
                <i class="fa-solid fa-pencil edit-item"></i>
               </a>
            </li>
                
                `;
        });

        document.querySelector("#item-list").innerHTML = html;
        ItemCtrl.totalMoney();
      } else {
        html = `<div style="display: flex; justify-content: center; padding:20px;">
        <p style="color: red;">No items available</p>
        </div>`;
        document.querySelector("#item-list").innerHTML = html;
        ItemCtrl.totalMoney();
      }
    },
    clearFields: function () {
      document.querySelector("#item-name").value = "";
      document.querySelector("#item-money").value = "";
    },

    showAddbtnAlone: function () {
      document.querySelector(".add-btn").style.display = "inline";
      document.querySelector(".update-btn").style.display = "none";
      document.querySelector(".delete-btn").style.display = "none";
      document.querySelector(".back-btn").style.display = "none";
      UiCtrl.clearFields();
      localStorage.removeItem("ItemId");
    },

    editBtnClick: function (e) {
      if (e.target.classList.contains("edit-item")) {
        document.querySelector(".add-btn").style.display = "none";
        document.querySelector(".update-btn").style.display = "inline";
        document.querySelector(".delete-btn").style.display = "inline";
        document.querySelector(".back-btn").style.display = "inline";

        const item = StorageCtrl.getItemById(
          e.target.parentElement.parentElement.id
        );
        localStorage.setItem("ItemId", e.target.parentElement.parentElement.id);
        console.log(item[0].item);
        document.querySelector("#item-name").value = item[0].item;
        document.querySelector("#item-money").value = item[0].price;
      }
    },
    alertShow: function (msg, type) {
      // document.querySelector('.alert-container').innerHTML = ""

      // const div = document.querySelector('.alert-container')
      // div.innerHTML = `
      //                   <p class=" alert alert-${type}">${msg}</p>

      // `

      // setTimeout(function(){
      //           document.querySelector('.alert-container').innerHTML = ""
      // },3000)

      M.Toast.dismissAll(); // closes all active toasts
      M.toast({
        html: `${msg}`,
        classes: `rounded ${type} white-text`,
      });
    },
  };
})();

const App = (function () {
  function loadAddEventListner() {
    const ul = document.querySelector("#item-list");
    ul.addEventListener("click", UiCtrl.editBtnClick);

    document
      .querySelector(".back-btn")
      .addEventListener("click", UiCtrl.showAddbtnAlone);

    // Add event
    document.querySelector(".add-btn").addEventListener("click", itemAddClick);
    // Delete event
    document
      .querySelector(".delete-btn")
      .addEventListener("click", itemDeleteClick);
    // Clear All
    document.querySelector(".clear-btn").addEventListener("click", function () {
      if (confirm("Are you sure to delete all")) {
        localStorage.removeItem("items");
        UiCtrl.showItems();
        UiCtrl.alertShow("All items deleted", "red");
      }
    });
    // Update event
    document
      .querySelector(".update-btn")
      .addEventListener("click", function (e) {
        ItemCtrl.updateItem();
      });
    // Delete event
    document
      .querySelector(".delete-btn")
      .addEventListener("click", function (e) {
        ItemCtrl.deleteItem();
      });
  }

  const itemAddClick = function () {
    const name = document.querySelector("#item-name").value.trim();
    const money = document.querySelector("#item-money").value.trim();

    if (!name || !money) {
      UiCtrl.alertShow("Please fill all fields !", "red");
    } else {
      const newData = new ItemCtrl.Items(0, name, money);
      console.log(newData);
      ItemCtrl.addItem(newData);
    }
  };
  const itemDeleteClick = function (e) {
    console.log(e.target.parentElement);
  };
  return {
    start: function () {
      loadAddEventListner();
      UiCtrl.showAddbtnAlone();

      const item = ItemCtrl.getItems();

      UiCtrl.showItems(item);
    },
  };
})();

App.start();

// M.toast({ html: 'Your message here', classes: 'rounded' });
