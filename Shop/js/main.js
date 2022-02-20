const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

class List { //класс-предок для всех товаров
    constructor(url, container, list = list2) {
        /**Параметры: 
         * url - файл, из которого мы берем товары 
         * container - div, куда мы рендерим (каталог или корзина)
         * list = list2 - объект, где мы указываем связь м-ду объектами*/
        this.container = container;
        this.list = list;
        this.url = url;
        this.goods = []; //товары
        this.allProducts = []; //масс. объектов класса "товар"
        this.filtered = [];
        this._init(); //этот метод запускается из потомка, поэтому this укажет на потомка
    }
    getJson(url) {
        /* делаем коннект к нашему источнику
        * склеивание строк используется для коннекта к разным JSON-ам
        * API указывает на библиотеку, this.url на конкретный файл */
        return fetch(url ? url : `${API + this.url}`)
            .then(result => result.json())
            .catch(error => {
                console.log(error);
            })
    }
    handleData(data) {
        this.goods = [...data]; //принимаем массив товаров
        this.render(); //рендерим его
    }
    calcSum() {
        return this.allProducts.reduce((accum, item) => accum += item.price, 0);
    }
    render() { // универсальный вывод 
        console.log(this.constructor.name); //тест: выведем имя конструктора
        const block = document.querySelector(this.container); // блок для вывода товаров
        for (let product of this.goods) { // обходим массив товаров
            const productObj = new this.list[this.constructor.name](product);
            /**productObj - новый объект (какого класса?)
             * this.list[родитель - корзина либо каталог](элемент)
             * эта связь берется из list2
             *
             * этот объект товара станет CartItem или ProductItem
             * т.о. мы рендер главного класса применяем ко всему - только меняя содержимое
            */
            console.log(productObj);
            this.allProducts.push(productObj); //вызываем элемент каталога - class ProductItem 
            block.insertAdjacentHTML('beforeend', productObj.render());
        }
    }
    filter(value) { // фильтрация с помощью поиска
        // строим регулярное выражение, на основе введенного значения
        const regexp = new RegExp(value, 'i'); // флаг i значит, что регистр не важен
        //мтд test возвращает t/f в зависимости от того, совпадает ли regexp и (product.product_name)
        //в нашем случае он при t дает "добро" стрлчн. фун. на добавление в массив filtered
        this.filtered = this.allProducts.filter(product => regexp.test(product.product_name));
        this.allProducts.forEach(el => { // обходим ВСЕ товары
            //добавляем их в массив block
            const block = document.querySelector(`.products__item[data-id="${el.id_product}"]`);
            //проверяем, НЕ содержится ли в массиве товаров отфильтрованные товары
            if (!this.filtered.includes(el)) {
                //если среди товаров есть подходящие к фильтру, но невидимые, удаляем у них невидимость
                block.classList.add('invisible');
            } else {
                //если среди товаров есть не подходящие к фильтру, но видимые, делаем их невидимыми
                block.classList.remove('invisible');
            }
        })
    }
    _init() {
        return false
    }
}

class Item {
    constructor(el, img = 'https://placehold.it/200x150') {
        this.product_name = el.product_name;
        this.price = el.price;
        this.id_product = el.id_product;
        this.img = img;
    }
    render() {
        return `<div class="products__item" data-id="${this.id_product}">
                <img class="products__item__image" src="img/${this.id_product}.webp" alt="Some img">
                <div class="desc">
                    <h3 class="products__item__heading">${this.product_name}</h3>
                    <p class="products__item__price">${this.price} $</p>
                    <button class="products__item__buyButton" 
                    data-id="${this.id_product}"
                    data-name="${this.product_name}"
                    data-price="${this.price}">Купить</button>
                </div>
            </div>`
        //обратить внимание, что у кнопки много data-свойств
        //они передают инфу при клике, см ProductsList._init
    }
}

class ProductsList extends List {
    constructor(cart, container = '.products', url = "/catalogData.json") { //см List
        super(url, container); // вызываем конструктор базового класса
        this.cart = cart;
        this.getJson() //в текущем классе нет такого метода, значит он внутри родителя
            //получаем массив товаров из JSON и передаем в handleData
            .then(data => this.handleData(data)); //handleData - тоже внутри родителя
        // запускает отрисовку каталога товаров либо списка корзины 
    }
    _init() {
        //накладываем на контейнер слушатель клика
        document.querySelector(this.container).addEventListener('click', event => {
            //если произошел клик на кн. [купить]
            if (event.target.classList.contains('products__item__buyButton')) {
                //то корзина.addProduct(цель события)
                //добавляем товар, на кнопку которого кликнули, в корзину
                this.cart.addProduct(event.target);
                //обратить внимание: addProduct это метод корзины, хоть и вызывается из метода каталога
            }
        });
        //накладываем на форму поиска слушатель на "содержит ли?"
        document.querySelector('.search__form').addEventListener('submit', event => {
            // 'submit' дает возможность принимать как событие и клик клавиши [enter]
            event.preventDefault(); // отмена события по-умолчанию (перезагрузка страницы)
            // как event принимаем значение, введенное в строку поиска
            // и применяем к нему метод filter
            this.filter(document.querySelector('.search__field').value)
        })
    }
}


class ProductItem extends Item { }
/**Цели конструктора каталога и корзины одни и теже:
 * Регистрация события по клику на кнопку [купить] 
 * Заполнить массив товаров из файла JSON
 * Вывод данных на странице, используя метод handleDate, который
 * заполняет глобальный массив товаров и выводит их на страницу,
 * используя метод render
 */

class Cart extends List {
    constructor(container = ".cart", url = "/getBasket.json") {
        //вызываем базовый конструктор
        super(url, container);
        this.getJson()
            .then(data => {
                this.handleData(data.contents);
            });
    }
    addProduct(element) { // добавление товара в корзину 1:00:00
        this.getJson(`${API}/addToBasket.json`) // здесь хранится 1 - для проверки на авторизацию
            .then(data => {
                if (data.result === 1) { //условная проверка на авторизацию
                    let productId = +element.dataset['id']; // извлекаем data-атрибут ID
                    /* проверка на наличие хотя бы 1 ед товара в корзине.
                     * let find: обходит массив товаров и применяет к ним метод find
                     * этот мтд берет товар из массива, из каждого берет ID и сравнивает его 
                     * с ID добавляемого товара
                     * при нахождении он возвр. true и ++ к-во этого товар
                     * при не находении создается новый элемент
                     * добавляется в массив товаров
                     * рендерится
                    */
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find) {
                        find.quantity++;
                        this._updateCart(find); // пересчет элементов корзины
                    } else {
                        let product = {
                            id_product: productId,
                            price: +element.dataset['price'], //+ цена 1 раз
                            product_name: element.dataset['name'],
                            quantity: 1 //обрати внимание: этим параметром обладает только товар в кОрзине
                        };
                        this.goods = [product];
                        this.render();
                    }
                } else {
                    alert('Error');
                }
            })
    }
    removeProduct(element) { // удаление товара из корзины 
        this.getJson(`${API}/deleteFromBasket.json`) // здесь хранится 1 - для проверки - можно удалять или нет
            .then(data => {
                if (data.result === 1) { // проверка
                    let productId = +element.dataset['id']; //берем ID из кнопки карточки
                    // ищем товар в корзине аналогично мтд addProduct
                    let find = this.allProducts.find(product => product.id_product === productId);
                    if (find.quantity > 1) { // если его > 1
                        find.quantity--; // минусуем, но карточку оставляем
                        this._updateCart(find); // пересчет элементов корзины
                    } else { // если его 1 штука, то полностью удаляем карточку из корзины
                        this.allProducts.splice(this.allProducts.indexOf(find), 1); // методом splice
                        /* splice удаляет элементы из одного массива, возвращая их в другом
                        * let mas = [1, 2, 3, 4, 5];
                        * let del = mas.splice(1,2); 
                        * // (1 - начиная с которой позиции удалять, 2 - сколько удалять)
                        * console.log(mas); // [1, 4, 5]
                        * console.log(del); // [2, 3]
                        * в нашем случае мы удаляем 1 элемент с найденного (т.е. только его)
                        */
                        document.querySelector(`.cart__block[data-id="${productId}"]`).remove();
                        // и удаляем его из верстки
                    }
                } else {
                    alert('Error');
                }
            })
    }
    _updateCart(product) { // пересчет элементов корзины
        // находим элемент
        let block = document.querySelector(`.cart__block[data-id="${product.id_product}"]`);
        // меняем .textContent на новые арифметические данные
        block.querySelector('.cart__item__desc__quantity').textContent = `Quantity: ${product.quantity}`;
        block.querySelector('.cart__item__rightBlock__totalPrice').textContent = `$${product.quantity * product.price}`;
    }
    _init() {
        //показать/ скрыть корзину
        document.querySelector('.cart__button').addEventListener('click', () => {
            document.querySelector(this.container).classList.toggle('invisible');
        });
        //удаление товара из корзины по клику на [удалить] внутри элемента
        document.querySelector(this.container).addEventListener('click', event => {
            if (event.target.classList.contains('cart__item__rightBlock__deleteButton')) {
                this.removeProduct(event.target);
            }
        })
    }

}

class CartItem extends Item {
    constructor(el, img = 'https://placehold.it/50x100') {
        super(el, img);
        this.quantity = el.quantity;
    }
    render() {
        return `<div class="cart__block" data-id="${this.id_product}">
                <div class="cart__item">
                    <img class="cart__item__image" src="img/${this.id_product}.webp" alt="Some image">
                    <div class="cart__item__desc">
                        <p class="cart__item__desc__title">${this.product_name}</p>
                        <p class="cart__item__desc__quantity">Quantity: ${this.quantity}</p>
                        <p class="cart__item__desc__price">$${this.price} each</p>
                    </div>
                    <div class="cart__item__rightBlock">
                        <button class="cart__item__rightBlock__deleteButton" data-id="${this.id_product}">X</button>
                        <p class="cart__item__rightBlock__totalPrice">$${this.quantity * this.price}</p>
                    </div>
                </div>
            </div>`
    }
}
const list2 = {
    // в этом классе каждый эл. описывает связь между классами
    ProductsList: ProductItem, // список: элемент списка
    Cart: CartItem
};

let cart = new Cart();
let products = new ProductsList(cart);
/*Если мы хотим использовать в классе методы другого класса, то удобнее всего
в конструктор передать объект класса, методы к-го нам нужны в данном классе */

products.getJson(`getProducts.json`).then(data => products.handleData(data));
