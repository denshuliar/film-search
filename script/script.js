// Реализовать веб-страницу для поиска фильмов. При открытии страницы пользователю доступна только форма для ввода названия фильма (или части названия) и выбора типа (movie, series, episode).

// После того, как пользователь ввел данные и нажал на кнопку Search, необходимо отправить соответствующий запрос к API ресурса OMDB (http://www.omdbapi.com/) с помощью AJAX.

// Если в качестве ответа на запрос вы получили список фильмов, то его необходимо отобразить под формой поиска. Если по заданным критериям не будут найдены фильмы, то отобразите сообщение Movie not found!.

// Учтите, что OMDB по умолчанию возвращает только первые 10 фильмов. Поэтому необходимо реализовать пагинацию для тех случаев, когда под критерии поиска подходит больше, чем 10 фильмов. Пагинация – это порядковая нумерация страниц, которая обычно находится вверху или внизу страниц сайта. Вероятно, вы видели в интернет-магазинах на страницах с товарами кнопки с цифрами 1, 2, 3 и т. д., при нажатии на которые отбражается другой блок товаров. Вот такие кнопки и называют пагинацией. Таким образом, при первом поиске необходимо выводить первые 10 фильмов и кнопки для перехода по страницам. При клике на такую кнопку необходимо отправить запрос с указанием в параметрах требуемой страницы, и полученный результат вывести на место текущего списка фильмов.

// Возле каждого фильма должна быть кнопка Details, при нажатии на которую будет выводиться подробная информация о фильме. Эту информацию необходимо выводить на этой же странице сразу под списком найденных фильмов и пагинацией.

// Все запросы необходимо отправлять, используя AJAX. То есть при нажатии на любые кнопки ваша веб-страница не должна обновляться.
// Ссылка на API OMDB: http://www.omdbapi.com/ (необходимо зарегистри роваться для получения API KEY).
// Ссылка на альтернативный API с фильмами (для того случая, если OMDB не будет работать): https://developers.themoviedb.org/3/ search/search-movies.
// Если же и этот API не будет работать, вам придется сам остоятельно найти другой доступный ресурс и адаптировать под него задание.

//getting the form elements

let input = document.getElementById("name");
let select = document.getElementById("select");
let submit = document.getElementById("submit");

input.addEventListener("keyup", function () {
    if (event.keyCode === 13) {
        event.preventDefault();
        ClearPage();
        FetchFilm(input.value, select.value, page, 0);
    }
});

//adding the event listener for the main search button
submit.addEventListener('click', function () {
    ClearPage();
    FetchFilm(input.value, select.value, page, 0);
});

//creating the next and last buttons to be appended later
let btn = document.createElement("button");
btn.innerText = "Next Page"
let btnLast = document.createElement("button");
btnLast.innerText = "Last Page"

//adding event listeners to these buttons
btn.addEventListener('click', function () { FetchFilm(input.value, select.value, page, 1); });
btnLast.addEventListener('click', function () { FetchFilm(input.value, select.value, page, -1); });

//setting the page to 1
let page = 1;

//appending the wrapper to the panel
let wrapper = document.createElement("div");
wrapper.setAttribute('id', 'wrapper');
document.getElementById("panel").appendChild(wrapper);

// creating the function to fetch films which takes 4 arguments
function FetchFilm(_name, _type, _page, _increment) {
    _page = _page + _increment; // page should increase or decrease if we use next or last buttons
    page = _page; //also updating the global variable

    let url = `https://www.omdbapi.com/?s=${_name}&type=${_type}&page=${_page}&apikey=c19ba406`; // forming a url

    fetch(url)
        .then(response => response.json())
        .then(myJson => {
            obj = myJson;
            wrapper.innerHTML = '' // clearing the wrapper
            document.getElementById('fav-list').innerHTML = '' // clearing favlist
            for (let i = 0; i < obj.Search.length; i++) { // each element has an image of the poster and two paras with title, year and two buttons
                let element = document.createElement('div'); // base element which contains each film
                element.classList.add("element");

                let inner = document.createElement('div'); // inner contains image
                inner.classList.add("inner");
                let img = document.createElement('img'); // poster image
                img.setAttribute("src", `${obj.Search[i].Poster}`)
                img.setAttribute("onerror", 'imgError(this)')
                inner.appendChild(img) // we place image inside inner

                let p1 = document.createElement('p') //paragraphs for title and year
                p1.classList.add('movie_title')
                p1.innerText = `${obj.Search[i].Title}`
                let p2 = document.createElement('p')
                p2.innerText = `${obj.Search[i].Year}`

                let infobtn = document.createElement('a') // info button
                infobtn.innerText = "Show info"
                infobtn.setAttribute('data-remodal-target', 'modal') // that will be opening a modal window with info
                infobtn.classList.add("btn-more")
                infobtn.addEventListener('click', function () { getInfo(obj.Search[i].imdbID) })

                let fav = document.createElement('a'); // favourite button
                fav.classList.add("btn-more")

                let liked = false;

                for (let j = 0; j < films.length; j++) { // checking if the film is in the favourite section
                    if (obj.Search[i].imdbID == films[j].id) {
                        liked = true
                    }
                }

                if (liked == true) { // if yes, we color the remove button red
                    fav.innerText = 'Remove from favourites'
                    fav.classList.add('btn-red')
                    fav.classList.remove('btn-green')
                } else { // if no, we color the remove button green
                    fav.innerText = 'Add to favourites'
                    fav.classList.add('btn-green')
                    fav.classList.remove('btn-red')
                }

                fav.addEventListener('click', function () { saveId(obj.Search[i].imdbID, this) })

                element.appendChild(inner) // appending everything to the element
                element.appendChild(p1)
                element.appendChild(p2)
                element.appendChild(infobtn)
                element.appendChild(document.createElement('br'))
                element.appendChild(fav)

                wrapper.appendChild(element); // each elment goes inside wrapper
            }

            document.getElementById("nav").appendChild(btnLast); // finally adding the nav buttons
            document.getElementById("nav").appendChild(btn);

            if (_page == 1) { // the prev button should not work on the first page
                btnLast.disabled = true;
            } else {
                btnLast.disabled = false;
            };

            if (_page >= (parseInt(obj.totalResults) / 10)) { // the next button should not work on the last page
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }

        })
        .catch(function (error) { //cathing errors and writing error message
            console.log("ERROR!");
            console.error(error);
            let inst = $('[data-remodal-id=modal-error]').remodal();
            inst.open(); // opening the modal error window
        });

}

function getInfo(_id) {
    fetch(`https://www.omdbapi.com/?i=${_id}&plot=full&apikey=c19ba406`)
        .then(response => response.json())
        .then(myJson => {
            object = myJson;
            document.getElementById(`plot-para`).innerHTML = `${object.Plot}` // modal should have plot
            document.getElementById(`heading`).innerHTML = `${object.Title}` // title
            document.getElementById(`year`).innerHTML = `${object.Year}` //year
            document.getElementById(`image`).setAttribute('src', `${object.Poster}`) // poster
            document.getElementById('image').setAttribute("onerror", 'imgError(this)') // error image should appear if the correct one is not loaded
        })

}
let films = JSON.parse(localStorage.films || '[]');

function saveId(_id, button) {
    let btn = button
    let present = false;
    let arrayindex = ''

    for (let i = 0; i < films.length; i++) {

        if (_id == films[i].id) {
            present = true
            arrayindex = i
        }
    }

    if (present == false) {
        films.push({ 'id': `${_id}` })
        localStorage.setItem("films", JSON.stringify(films));
        console.log(localStorage.getItem("films"))
        btn.innerText = 'Remove from favourites'
        btn.classList.add('btn-red')
        btn.classList.remove('btn-green')
    }

    if (present == true) {
        films.splice(arrayindex, 1)
        localStorage.setItem("films", JSON.stringify(films));
        console.log(localStorage.getItem("films"))
        btn.innerText = 'Add to favourites';
        btn.classList.add('btn-green');
        btn.classList.remove('btn-red');

    }

    present = false;
    arrayindex = ''
}

function ClearPage() { // each new search should start from the first page
    page = 1;
}

function imgError(image) { // backup image for posters in case the links to them are broken
    image.onerror = "";
    image.src = "./img/error.png";
}

function ClearWrapper() {
    wrapper.innerHTML = ''
}

function favouriteListBuild() {
    wrapper.innerHTML = ''
    document.getElementById('fav-list').innerHTML = ''
    document.getElementById('fav-list').innerText = ''

    for (let i = 0; i < films.length; i++) {
        fetch(`https://www.omdbapi.com/?i=${films[i].id}&plot=full&apikey=c19ba406`)
            .then(response => response.json())
            .then(myJson => {
                object = myJson;
                console.log(myJson)
                let fav_element = document.createElement('div');
                fav_element.classList.add('fav-element');
                let fav_title = document.createElement('p')
                fav_title.innerHTML = `${object.Title}`;
                let fav_year = document.createElement('p')
                fav_year.innerHTML = `${object.Year}`
                let fav_img = document.createElement('img')
                fav_img.setAttribute('src', `${object.Poster}`)
                fav_img.setAttribute("onerror", 'imgError(this)')

                let fav_btn = document.createElement('a'); // favourite button
                fav_btn.classList.add("btn-fav")
                fav_btn.innerText = "Remove from favourites"
                fav_btn.addEventListener('click', function () { deleteId(object.imdbID) })

                fav_element.appendChild(fav_img);
                fav_element.appendChild(fav_title);
                fav_element.appendChild(fav_year);
                fav_element.appendChild(fav_btn);

                document.getElementById('fav-list').appendChild(fav_element);

                btn.disabled = true;
                btnLast.disabled = true;
            })
    }

    if (films.length == 0) {
        document.getElementById('fav-list').innerText = 'It is empty here. Add some movies to favourites'
    }

}

document.getElementById('fav-call').addEventListener('click', function () {
    favouriteListBuild();
});

function deleteId(_id) {
    let arrayindex = ''

    for (let i = 0; i < films.length; i++) {

        if (_id == films[i].id) {
            arrayindex = i
        }
    }

    films.splice(arrayindex, 1)
    localStorage.setItem("films", JSON.stringify(films));
    console.log(localStorage.getItem("films"))

    favouriteListBuild();
    arrayindex = ''
}