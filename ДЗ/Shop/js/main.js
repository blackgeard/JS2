let arrPrices = [] // массив для цен
class ProductList {
    constructor(container = '.products') {
        this.container = container;
        this.goods = [];
        this._fetchProducts();
        this.render();//вывод товаров на страницу
    }
    _fetchProducts() { /* _ указывает, что данный метод вызывается только в текущем классе
        * Но такой метод все равно можно вызвать где-то еще,
        * хотя это и не рекомендуется.
        * Чтобы его закрыть наглухо, его пишут с решеткой: #fetchProducts()
        * Такой метод называют закрытым.
        */
        this.goods = [
            { id: 1, title: 'Notebook', price: 2000 },
            { id: 2, title: 'Mouse', price: 20 },
            { id: 3, title: 'Keyboard', price: 200 },
            { id: 4, title: 'Gamepad', price: 50 },
        ];
    }
    render() {
        const block = document.querySelector(this.container);
        for (let product of this.goods) {
            const item = new ProductItem(product);
            block.insertAdjacentHTML("beforeend", item.render());
            //           block.innerHTML += item.render();
        }
    }
}

class ProductItem {
    constructor(product) {
        this.title = product.title;
        this.id = product.id;
        this.price = product.price;
        // this.img = product.img; убрал, т.к. у меня вывод картинок иначе
        this.pushPrice();
    }
    render() {
        return `<div class="products__item">
                <h3 class='products__item__heading'>${this.title}</h3>
                <img class="products__item__image" src="img/${this.title}.webp" alt="${this.title}">
                <p class='products__item__price'>${this.price}</p>
                <button class='products__item__buyButton'>Купить</button>
            </div>`
    }
    pushPrice() { //добавляем цену в массив
        arrPrices.push(this.price)
    }
}

let list = new ProductList();

// Вывод суммы
document.getElementById('sum').addEventListener('click', () => {
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    alert(arrPrices.reduce(reducer));
});


class Basket {
    addBuy() {
        //добавлять итем по клику на кнопке товара

    }
    removeGoods() {
        //удалять итем из корзины
    }
    changeGoods() {
        //менять к-во одинаковых товаров +/-
    }
    meterGoods() {
        //счетчик товаров в корзине - див с цифрой 
        //это уже инициатива, попробую реализовать сам, вроде не должно быть сложно
    }
    render() {
        //включать / выключать видимость корзины
    }
}
class ElemBasket {
    render() {
        //вывод единицы
    }
}
/*
const products = [
    {id: 1, title: 'Notebook', price: 2000},
    {id: 2, title: 'Mouse', price: 20},
    {id: 3, title: 'Keyboard', price: 200},
    {id: 4, title: 'Gamepad', price: 50},
];

const renderProduct = (product,img='https://placehold.it/200x150') => {
    return `<div class="product-item">
                <img src="${img}">
                <h3>${product.title}</h3>
                <p>${product.price}</p>
                <button class="buy-btn">Купить</button>
            </div>`
};
const renderPage = list => document.querySelector('.products').innerHTML = list.map(item => renderProduct(item)).join('');

renderPage(products);
*/