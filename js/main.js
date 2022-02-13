const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
//let arrPrices = []  массив для цен

class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this._getProducts()
            .then(data => { //data - объект js
                this.goods = data;
                //console.log(data);
                this.render()
            });
    }
    /*    
    this._fetchProducts();
    this.render();//вывод товаров на страницу
    _fetchProducts() {  _ указывает, что данный метод вызывается только в текущем классе
 * Но такой метод все равно можно вызвать где-то еще,
 * хотя это и не рекомендуется.
 * Чтобы его закрыть наглухо, его пишут с решеткой: #fetchProducts()
 * Такой метод называют закрытым.
 */
    _getProducts() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }

    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new ProductItem(product);
            //            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }

    }
}

class ProductItem {
    constructor(product) {
        this.title = product.product_name;
        this.id = product.id_product;
        this.price = product.price;
        // this.img = product.img; убрал, т.к. у меня вывод картинок иначе
    }
    render() {
        //arrPrices.push(this.price)
        return `<div class="products__item">
                <h3 class='products__item__heading'>${this.title}</h3>
                <img class="products__item__image" src="img/${this.id}.webp" alt="${this.title}">
                <p class='products__item__price'>${this.price}</p>
                <button class='products__item__buyButton'>Купить</button>
            </div>`
    }
    /*
    pushPrice() { //добавляем цену в массив
        // попробовать добавить в промис
        arrPrices.push(this.price)
    }
    */
}

let list = new ProductList();


class basket {
    constructor(container = '.cart') {
        this.container = container;
        this.goods = [];

        this._clickBasket();
        this._getBasketItem()
            .then(data => { //data - объект js
                this.goods = data;
                console.log(data);
                this.render()
            });
    }

    addGoods() {

    }
    removeGoods() {

    }
    changeGoods() {

    }
    _getBasketItem() {
        return fetch(`${API}/catalogData.json`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            });
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const productObj = new BasketItem(product);
            //            this.allProducts.push(productObj);
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    _clickBasket() {
        document.querySelector(".cart__button").addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible')
        });
    }
}

class BasketItem {
    // У Вас вроде бы нет в элементе корзины конструктора?
    constructor(product) {
        // this.quantity = product.quantity; // почему-то эта строчка все ломает
        this.title = product.product_name;
        this.id = product.id_product;
        this.price = product.price;
        // this.img = product.img; убрал, т.к. у меня вывод картинок иначе
    }

    render() {
        return `<div class="cart__item">
        <h3 class='cart__item__heading'>${this.title}</br> ${this.quantity} шт</h3>
        <img class="cart__item__image" src="img/${this.id}.webp" alt="${this.title}">
        <p class='cart__item__price'>${this.price * this.quantity}</p>
        <button class='cart__item__button'>x</button>
    </div>`
    }

}


let card = new basket;

/*
// Вывод суммы
document.getElementById('sum').addEventListener('click', () => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    alert(arrPrices.reduce(reducer));
});
*/
//const products = [
//    {id: 1, title: 'Notebook', price: 2000},
//    {id: 2, title: 'Mouse', price: 20},
//    {id: 3, title: 'Keyboard', price: 200},
//    {id: 4, title: 'Gamepad', price: 50},
//];
//
//const renderProduct = (product,img='https://placehold.it/200x150') => {
//    return `<div class="product-item">
//                <img src="${img}">
//                <h3>${product.title}</h3>
//                <p>${product.price}</p>
//                <button class="buy-btn">Купить</button>
//            </div>`
//};
//const renderPage = list => document.querySelector('.products').innerHTML = list.map(item => renderProduct(item)).join('');
//
//renderPage(products);