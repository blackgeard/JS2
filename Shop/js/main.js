const products = [
    { id: 1, title: 'Notebook', price: 2000 },
    { id: 2, title: 'Mouse', price: 20 },
    { id: 3, title: 'Keyboard', price: 200 },
    { id: 4, title: 'Gamepad', price: 50 },
];
//Функция для формирования верстки каждого товара
//Добавить в выводе изображение
const renderProduct = (product) => {
    return `<div class='products__item'>
                <h3 class='products__item__heading'>${product.title}</h3>
                <img class="products__item__image" src="img/${product.title}.webp" 
                    alt="${product.title}">
                <p class='products__item__price'>${product.price}</p>
                <button class='products__item__buyButton'>Купить</button>
            </div>`
};

const renderPage = list => {
    let targetToRender = document.querySelector('.products');
    targetToRender.innerHTML = list.map(item =>
        renderProduct(item)).join('');
};
/* В функции renderPage берется аргумент list (в нашем случае это const products), затем  
 находим targetToRender и в его свойство innerHTML записываем новый массив (см метод map())
 обработанный методом join() на основе строки из const renderProduct.
 * Рендер будет выполнен по одному разу на каждый элемент const products.
 */

/*
    * Метод map() создаёт новый массив с результатом вызова 
    * указанной функции для каждого элемента массива.
    * Метод join() объединяет все элементы массива (или массивоподобного объекта) в строку.
    * в скобках указывается необязательный параметр (separator) - определяет строку, 
    * разделяющую элементы массива. В случае необходимости тип разделителя 
    * приводится к типу Строка. Если он не задан, элементы массива разделяются запятой ','.
    * Если разделитель - пустая строка (наш случай), элементы массива 
    * ничем не разделяются в возвращаемой строке.
    *
*/

renderPage(products);