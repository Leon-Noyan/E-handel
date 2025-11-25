/* global window, document, fetch, console, localStorage */

// retrives previous saved data on page load
const cart = JSON.parse(localStorage.getItem('shopCart')) || []
const counter = document.getElementById('cart-counter')

function displayCart(cartInfo) {
    const cartContainer = document.getElementById('cart-container')
    cartContainer.innerHTML = ''
    // renders the img, title, price and adds them to the cart
    cartInfo.forEach((e) => {
        cartContainer.innerHTML += `
                   <div>
                      <img class='cart-product-img' src='${e.image}'
                      alt='Product Picture' />
                      <p>${e.title}</p>
                      <p>$${e.price}</p>
                   </div>
                   `
        counter.textContent = cartInfo.length
    })
}

function renderProducts(products) {
    const allProductsBox = document.querySelector('.all-products')
    // clears the page of previous products and renders new ones
    allProductsBox.innerHTML = ''

    products.forEach((e) => {
        const cards = document.createElement('div')
        cards.classList.add('cards')
        cards.innerHTML = `
      <img src='${e.image}' alt='Product Picture' />
      <h3>${e.title}</h3>
      <p>$${e.price}</p>
      <button class='add-cart-btn'>Add To Cart</button>
      `
        allProductsBox.appendChild(cards)
        const cartBtn = cards.querySelector('.add-cart-btn')

        cartBtn.addEventListener('click', () => updateCartData(e))
    })
}
// updates cart info in localstorage and cart content
const updateCartData = (item) => {
    // retrives the cart from localstorage, if it's empty an array is created
    const cartArray = JSON.parse(localStorage.getItem('shopCart')) || []

    // uses push to add the selected products to the cart (array)
    cartArray.push({
        id: item.id,
        title: item.title,
        price: item.price,
        image: item.image
    })
    
    localStorage.setItem('shopCart', JSON.stringify(cartArray))
    displayCart(cartArray)
    cartSum()
}
// function that calculates the total sum and updates the total amount
function cartSum() {
    const initialValue = 0
    const itemsInCart = JSON.parse(localStorage.getItem('shopCart')) || []
    const sum = itemsInCart.reduce(
        (accumulator, currentValue) => accumulator + currentValue.price,
        initialValue
    )
    const totalSum = Math.round(sum * 100) / 100
    document.getElementById('total').textContent = `Total: $${totalSum} `
}
// function that clears the cart in localstorage and resets the display on the page
function clearCart() {
    localStorage.removeItem('shopCart')
    document.getElementById('cart-container').innerHTML = `
            <p class='empty-cart-msg'>Cart is empty</p>
            `
    document.getElementById('total').textContent = 'Total: $0'
    counter.textContent = '0'
}

// Handles opening and closing of the cart window on the page
const shoppingCart = document.querySelector('.shopping-cart')
const openCartBtn = document.getElementById('cart-logo-btn')
const closeBtn = document.querySelector('.close')
// opening
openCartBtn.addEventListener('click', () => {
    shoppingCart.style.display = 'block'
})
// closing
closeBtn.addEventListener('click', () => {
    shoppingCart.style.display = 'none'
})
// closes the cart when it hears a click outside of the cart window
window.addEventListener('click', (e) => {
    if (e.target === shoppingCart) {
        shoppingCart.style.display = 'none'
    }
})

// async function with fakestoreapi that fetches and renders the products
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products')
        const data = await response.json()
        renderProducts(data)
    } catch (error) {
        console.log('An error occured during the fetch', error)
    }
}
// clears the cart on click
const clearBtn = document.querySelector('.clear-cart')
clearBtn.addEventListener('click', clearCart)

displayCart(cart)
cartSum()
fetchProducts()

//Leons Kod
