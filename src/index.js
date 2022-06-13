console.log('hello world')

const axios = require('axios')

const cupcakeList = document.querySelector('#cupcake-list')
const customerList = document.querySelector('#customer-list')
const orderList = document.querySelector('#order-list')



const renderCupcake = async()=>{
    //const response = await fetch('/cupcake')
    //const cupcakes = await response.json()
    const response = await axios.get('/cupcake')
    const cupcakes = response.data
    const html = cupcakes.map(cupcake =>{
        return `<li>${cupcake.name}</li>`
    }).join('')
    cupcakeList.innerHTML = html
}

const renderCustomer = async()=>{
    // const response = await fetch('/customer')
    // const customers = await response.json()
    const response = await axios.get('/customer')
    const customers = response.data
    const html = customers.map(customer =>{
        return `<li>${customer.name}</li>`
    }).join('')
    customerList.innerHTML = html
}


const init = async() => {
    await renderCupcake()
    await renderCustomer()
};

init();
