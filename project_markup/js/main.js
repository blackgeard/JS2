const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';
//ссылка на библиотеку
const app = new Vue({
    el: '#app',//указывает на <div id="app">
    data: {//глобальные свойства - используются во всех методах
        userSearch: '',//для фильтра
        showCart: false,//показатьКорзину: по умолчанию - невидимая
        catalogUrl: '/catalogData.json',//ссылка на конкретный файл + const API
        cartUrl: '/getBasket.json',//ссылка на конкретный файл + const API
        cartItems: [],//массив товаров корзины
        filtered: [],//массив отфильтрованных товаров
        imgCart: 'https://placehold.it/50x100',
        products: [],//массив товаров каталога
        imgProduct: 'https://placehold.it/200x150'
    },
    methods: {
        getJson(url) {
            return fetch(url)//коннект к нашей библиотеке
                //получаем соотв. JSON-строку и преобразуем в массив соотв. товаров:
                .then(result => result.json())
                //выводим ошибку, если что-то пошло не так
                .catch(error => console.log(error))
        },
        addProduct(item) {//добавить товар в корзину
            this.getJson(`${API}/addToBasket.json`)//делаем коннект и получаем result
                .then(data => {
                    if (data.result === 1) {//если этот (result === 1) дает true 
                        let find = this.cartItems.find(el => el.id_product === item.id_product);
                        //проверяем - есть ли такой элемент в корзине мтд find?
                        if (find) {//если есть
                            find.quantity++;//+1
                        } else {//иное
                            const prod = Object.assign({ quantity: 1 }, item);
                            //создание нового объекта на основе двух, указанных в параметрах
                            //т.е. берет данные из товара каталога и длбавляет к ним свойство 
                            //товара корзины - количество
                            this.cartItems.push(prod)
                        }
                    }
                })
        },
        remove(item) {//удалить товар из корзины
            this.getJson(`${API}/addToBasket.json`)//делаем коннект и получаем result
                .then(data => {
                    if (data.result === 1) {//если этот (result === 1) дает true 
                        if (item.quantity > 1) {//проверяем есть ли более 1 ед. товара
                            item.quantity--;//при true => -1 
                        } else {//к-во товара 1 штука
                            this.cartItems.splice(this.cartItems.indexOf(item), 1);
                        }
                    }
                })
        },
        filter(userSearch) {//этот метод привязывает свойство userSearch
            let regexp = new RegExp(userSearch, 'i');//делаем новое регулярное выражение
            //на основе введенного в строку поиска
            this.filtered = this.products.filter(el => regexp.test(el.product_name));
            //применяем метод массива .filter
            //сопоставляем el и регулярное выражение методом строки .test
            //получаем true в случае соответствия
            //и записываем в масс filtered подходящие товары
        }
    },
    mounted() { //монтирование товаров в массивы из даты
        //вызывется по созданию Вью
        this.getJson(`${API + this.cartUrl}`) //1. Обращение через .getJson к JSON строке товаров корзины 
            .then(data => { //при успешном коннекте получаем строку JSON
                for (let item of data.contents) { //с помощью цикла обходим свойство contents
                    this.cartItems.push(item); //пушим содержимое contents в массив cartItems
                }
            });
        this.getJson(`${API + this.catalogUrl}`) //2. Обращение через .getJson к JSON строке товаров каталога
            .then(data => { //при успешном коннекте получаем массив
                for (let item of data) { //с помощью цикла обходим элементы массива
                    this.$data.products.push(item); //$data строго говоря !сейчас! не нужен
                    //он может использоваться для обращения не к локальным переменным,
                    //а явно указывать на data
                    //элемент области видимости
                    this.$data.filtered.push(item);
                }
            });
        this.getJson(`getProducts.json`) //3. Обращение через .getJson к локальному JSON-файлу
            .then(data => { //в остальном - то же, что и 2.
                for (let item of data) {
                    this.products.push(item);
                    this.filtered.push(item);
                }
            })
    }

});



// class List {
//     constructor(url, container){
//         this.container = container;
//         this.url = url;
//         this.goods = [];
//         this.allProducts = [];
//         this.filtered = [];
//         this._init();
//     }
//     getJson(url){
//         return fetch(url ? url : `${API + this.url}`)
//             .then(result => result.json())
//             .catch(error => console.log(error))
//     }
//     calcSum(){
//         return this.allProducts.reduce((accum, item) => accum += item.price, 0);
//     }
//     handleData(data){
//         this.goods = data;
//         this.render();
//     }
//     render(){
//         const block = document.querySelector(this.container);
//         for (let product of this.goods){
//             const productObj = new list[this.constructor.name](product);
//             this.allProducts.push(productObj);
//             block.insertAdjacentHTML('beforeend', productObj.render());
//         }
//     }
//     filter(value){
//         const regexp = new RegExp(value, 'i');
//         this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
//         this.allProducts.forEach(el => {
//             const block = document.querySelector(`.product-item[data-id="${el.id_product}"]`);
//             if(!this.filtered.includes(el)){
//                 block.classList.add('invisible');
//             } else {
//                 block.classList.remove('invisible');
//             }
//         })
//     }
//     _init(){
//         return false
//     }
// }
// class Item {
//     constructor(el, img = 'https://placehold.it/200x150'){
//         this.product_name = el.product_name;
//         this.price = el.price;
//         this.img = img;
//         this.id_product = el.id_product
//     }
//
//     render(){
//         return `<div class="product-item" data-id="${this.id_product}">
//                     <img src="${this.img}" alt="Some img">
//                     <div class="desc">
//                         <h3>${this.product_name}</h3>
//                         <p>${this.price} $</p>
//                         <button class="buy-btn"
//                         data-id="${this.id_product}"
//                         data-price="${this.price}"
//                         data-name="${this.product_name}"
//                         data-img="${this.img}">
//                         Купить
// </button>
//                     </div>
//                 </div>`;
//
//     }
// }
//
//
// class ProductsList extends List {
//     constructor(cart, url = '/catalogData.json',container = '.products'){
//         super(url, container);
//         this.cart = cart;
//         this.getJson()
//             .then(data => this.handleData(data));
//     }
//     _init(){
//         document.querySelector(this.container).addEventListener('click', e => {
//             if(e.target.classList.contains('buy-btn')){
//                 this.cart.addProduct(e.target);
//             }
//         });
//         document.querySelector('.search-form').addEventListener('submit', e => {
//             e.preventDefault();
//             this.filter(document.querySelector('.search-field').value);
//         })
//     }
// }
//
// class Product extends Item{}
// class Cart extends List{
//     constructor(url = '/getBasket.json', container = '.cart-block'){
//         super(url, container);
//         this.getJson()
//             .then(data => this.handleData(data.contents));
//     }
//     addProduct(element){
//         this.getJson(`${API}/addToBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if(find){
//                         find.quantity++;
//                         this._updateCart(find);
//                     } else {
//                         let product = {
//                             id_product: productId,
//                             price: +element.dataset['price'],
//                             product_name: element.dataset['name'],
//                             quantity: 1
//                         };
//                         this.goods = [product];
//                         this.render();
//                     }
//                 } else {
//                     alert('Error')
//                 }
//             })
//     }
//     removeProduct(element){
//         this.getJson(`${API}/deleteFromBasket.json`)
//             .then(data => {
//                 if(data.result === 1){
//                     let productId = +element.dataset['id'];
//                     let find = this.allProducts.find(product => product.id_product === productId);
//                     if(find.quantity > 1){
//                         find.quantity--;
//                         this._updateCart(find);
//                     } else {
//                         this.allProducts.splice(this.allProducts.indexOf(find), 1);
//                         document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
//                     }
//                 } else {
//                     alert('Error')
//                 }
//             })
//     }
//     _updateCart(product){
//         const block = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
//         block.querySelector(`.product-quantity`).textContent = `Quantity: ${product.quantity}`;
//         block.querySelector(`.product-price`).textContent = `$${product.quantity*product.price}`;
//     }
//     _init(){
//         document.querySelector(this.container).addEventListener('click', e => {
//             if(e.target.classList.contains('del-btn')){
//                 this.removeProduct(e.target);
//             }
//         });
//         document.querySelector('.btn-cart').addEventListener('click', () => {
//             document.querySelector(this.container).classList.toggle('invisible')
//         })
//     }
// }
//
// class CartItem extends Item{
//     constructor(el, img = 'https://placehold.it/50x100'){
//         super(el, img);
//         this.quantity = el.quantity;
//     }
//     render(){
//         return `<div class="cart-item" data-id="${this.id_product}">
//     <div class="product-bio">
//         <img src="${this.img}" alt="Some image">
//         <div class="product-desc">
//             <p class="product-title">${this.product_name}</p>
//             <p class="product-quantity">Quantity: ${this.quantity}</p>
//             <p class="product-single-price">$${this.price} each</p>
//         </div>
//     </div>
//     <div class="right-block">
//         <p class="product-price">${this.quantity*this.price}</p>
//         <button class="del-btn" data-id="${this.id_product}">&times;</button>
//     </div>
// </div>`
//     }
// }
//
// const list = {
//     ProductsList: Product,
//     Cart: CartItem
// };
//
//
// const cart = new Cart();
// const products = new ProductsList(cart);
// setTimeout(() => {
//     products.getJson(`getProducts.json`).then(data => products.handleData(data));
// }, 300);

// list.getProducts(() => {
//     list.render();
// });





