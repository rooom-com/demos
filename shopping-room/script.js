const id = 'b9b5ec7af37efc0ccefb77ad5e1b23';

const products = {
    "ring": {
        "price": 120.0,
        "title": "Ring",
        "subtitle": "Silver Edition"
    },
    "necklace": {
        "price": 340.0,
        "title": "Necklace",
        "subtitle": "Hexagon Vol. 1"
    },
    "handbag": {
        "price": 500.0,
        "title": "Handbag",
        "subtitle": ""
    }

}
const cart = new Set([]);
var priceValue = 0;

window.onload = function () {
    const iframe = document.getElementById('viewer');
    const viewer = new SpaceViewer(iframe);
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    const priceSpan = document.getElementById("price");

    //list of buttons
    var shoppingCartButtonDiv = document.getElementById("shopping-cart-button-div");
    const checkoutModal = document.getElementById("checkout-modal");

    viewer.init(id, {
        onSuccess: function onSuccessFn(api) {
            api.on('viewer.start', function () {
                shoppingCartButtonDiv.classList.remove("display-none");

            });

            api.on('click', function (e) {

                switch (e.nodeId) {
                    case '62bad5d897c8d305a47217e2-62c2c83697c8d301d941905f':
                        document.getElementById("necklace").classList.remove("display-none");
                        document.getElementById("necklace-description").classList.remove("display-none");
                        break;
                    case '62bad5d897c8d305a47217e2-62bd9de997c8d37f9360d88d':
                        document.getElementById("ring").classList.remove("display-none");
                        document.getElementById("ring-description").classList.remove("display-none");
                        break; 
                    case '62bad5d897c8d305a47217e2-62c403e397c8d301d17177ca':
                        document.getElementById("handbag").classList.remove("display-none");
                        document.getElementById("handbag-description").classList.remove("display-none");
                        break; 

                }
            });


            addToCartButtons.forEach(function(btn){
                btn.addEventListener("click", function(e){
                    cart.add(btn.id);
                    document.querySelector("." + btn.id).classList.remove("display-none");
                    // var priceOfCurrentObject = products[btn.id].price;
                    priceValue = 0;
                    for (var obj of cart){
                        priceValue += products[obj].price;
                    }
                    priceSpan.innerText = priceValue;
                    document.getElementById("shopping-cart-content-count").innerText = cart.size;

                    btn.innerHTML = '<img src="ricon-check.svg" height="27" style="margin-right: 5px;">added';
                    btn.style.cursor = 'initial';
                    btn.style.pointerEvents = 'none';
                    btn.style.backgroundColor = "#2A313E";
                    iframe.focus();
                })
            })

            document.querySelectorAll(".delete-icon").forEach(function(btn){
                btn.addEventListener("click", function(e){
                    var prod = btn.id.substring(7);
                    cart.delete(prod);
                    document.querySelector("." + prod).classList.add("display-none");
                    var addToCartButton = document.getElementById(prod);
                    addToCartButton.innerHTML = '<img src="shopping_cart_icon_128753-white.svg" height="17" style="margin-right: 5px;">Add to basket';
                    addToCartButton.style.backgroundColor = '#00AEB3';
                    addToCartButton.style.cursor = 'pointer';
                    addToCartButton.style.pointerEvents = 'all';
                    priceValue = priceValue - products[prod].price;
                    document.getElementById("price").innerText = priceValue;
                    document.getElementById("shopping-cart-content-count").innerText = cart.size;


                })
            })

        },
        onError: function onErrorFn() {
            console.log('Viewer error');
        }
    })


    /*
    open modal when clicking on shopping cart button 
    */
    shoppingCartButtonDiv.addEventListener("click", function (e) {
        checkoutModal.classList.remove("display-none");
        document.getElementById("price").innerText = priceValue;
    })

    document.querySelectorAll(".close-modal").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
            checkoutModal.classList.add("display-none");
        })
    })
    window.addEventListener('message', function (message) {
        if (message.data.key == 'modal') {
            if (message.data.value == "1") {
                shoppingCartButtonDiv.classList.add("in-background");
            } else {
                addToCartButtons.forEach(function (btn) {
                    btn.classList.add("display-none");
                    document.querySelectorAll(".description").forEach(function(btn){
                        btn.classList.add("display-none");
                    })
                })
                shoppingCartButtonDiv.classList.remove("in-background");
            }
        }
    })
}

