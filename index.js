// - Movie List api : https://achq.notion.site/movie-list-api-429bfce73c774d12981254d7164a4b13
const BASE_URl = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URl + '/api/movies/'
const POSTER_URL = BASE_URl + '/posters/'//後面加filename就是照片路徑
const MOVIE_PER_AGE = 12 //每頁呈現的個數


// 變數
const movies = [] //存電影清單希望movie是一個個陣列資料
let filteredMovies = [] //原本放在-3 篩選出來的結果丟進去，因為要做到分頁需做判斷是否有執行搜尋資料的動作

//id呼叫方式('#名稱')
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')
let paginator = document.querySelector('#pagination')
let changeFormMode = document.querySelector('#change-form-mode')

// 1 - 電影清單從API獲取的資料到 movies，並放到網頁 & -5：透過分頁呈現資料
axios.get(INDEX_URL).then((response) => {
  //-1 確認資料格式與型態 
  //array(80)，
  //console.log(response.data.results)
  movies.push(...response.data.results)//開運算，等同於for movie的迴圈
  // for (movie of response.data.results) {
  //   movies.push(movie)
  // }
  //console.log(movies)

  //-2 堆疊影像修改html，一次呈現API所有獲取的資料
  //renderMovieLIst(movies)

  // -5 加入分頁後
  renderPagintor(movies.length, 1)
  renderMovieLIst(getMovieByPage(1)) //網頁開啟時先顯式1分頁的電影清單
  // setlocalStorage
  defaultMode = 'card-mode-button'
  localStorage.setItem('carMode', JSON.stringify(defaultMode))
})
  .catch((err) => console.log(err))


function renderMovieLIst(data) {
  let contentHTML = ''
  //-processing
  data.forEach((item) => {
    //-item需要的欄位名稱title,image
    //console.log(item)
    contentHTML += `
    <div class="col-sm-3">
        <!-- 設定每一排之間的間隔大小 -->
        <div class="mb-2">

          <!-- 卡片格式貼近來 : 上面為影像+tilte名稱 ; 下面為footer資料-->
          <div class="card mt-2">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>

            <!-- footer: //car表格中置底，並依需求加入按鈕-->
            <div class="card-footer">
              <!-- Button trigger modal : 點選More之後會跳出視窗提供電影細節，此為modal type-->
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-Modal" data-id='${item.id}'>More</button>  <!--重要！透過htmlElement屬性 dataset將id資料存下 --!>
              <!-- class中的 btn-show-movie，為javascript綁定事件使用的，不能只用id，id只有一個 ，但這個按鈕是一部電影底下就會有一個 -->
              <button type="button" class="btn btn-info btn-show-favorite" data-id='${item.id}' >+</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = contentHTML
}

function renderMovieListMode(data) {
  let contentHTML = ''
  //-processing
  data.forEach((item) => {
    contentHTML += `
      <div class="card">
        <div class="card-body d-flex bd-highlight">
          <div class="flex-grow-1 bd-highlight">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="bd-highlight">
            <!-- Button trigger modal : 點選More之後會跳出視窗提供電影細節，此為modal type-->
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-Modal" data-id='${item.id}'>More</button>  <!--重要！透過htmlElement屬性 dataset將id資料存下 --!>
            <!-- class中的 btn-show-movie，為javascript綁定事件使用的，不能只用id，id只有一個 ，但這個按鈕是一部電影底下就會有一個 -->
            <button type="button" class="btn btn-info btn-show-favorite" data-id='${item.id}' >+</button>
          </div>
        </div>
      </div>
      `
  })
  dataPanel.innerHTML = contentHTML
}


// 2 - 電影清單Ｍore詳情資料  & // 4 - 加入我的最愛清單 
//-設置監聽器，按到class=.bnt-show-movie時帶入movie的詳細資料 ; class=.bnt-show-favorite時帶入我的最愛清單。
dataPanel.addEventListener('click', function onPanelClicked(event) {
  //class 呼叫方式('.名稱')
  if (event.target.matches('.btn-show-movie')) {
    //console.log(event.target.dataset) //透過button Bootstrap data屬性獲取id資料，型態為str因此需改成Number
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-show-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//-透過api網址得知 https://webdev.alphacamp.io/api/movies/:id ，透過id唯一值取得電影詳細知道
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')
  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = 'Release date: ' + data.release_date
    modalImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
    modalDescription.innerText = data.description
  })
}

//-加入我的最愛，透過id唯一值取得電影，需於button時帶入data-id的型態
function addToFavorite(id) {
  //console.log(id)
  //-獲取資料：之後會將我的最愛的清單放置別的頁面，因此會用localStorage的功能
  //如果沒有這個key值回傳一個空的[] ，||的特性會回傳左邊或右邊 True的值，如果都為True則回傳左邊的值
  const list = JSON.parse(localStorage.getItem('favorite')) || []  //LocalStorage取得的“字串”資料，需透過JSON.parse()轉乘JavaScript object

  //- 電影清單加入
  //- 方法1:find（包成函式）
  // function isMoivedMatch(movie) {
  //   return movie.id === id
  // }
  // const movie = movies.find(isMoivedMatch)

  //- 方法2: fine 使用箭頭
  const movie = movies.find(movie => movie.id === id)

  //-判斷是否重複加入清單
  if (list.some((movie) => movie.id === id)) {
    return alert('此電影已經加入收藏清單')
  }

  //資料更新：最後將資料放到list中，並丟到LocalStorage（格式需改成自串）
  list.push(movie)
  localStorage.setItem('favorite', JSON.stringify(list))
  alert('此電影加入收藏清單')
}


// 3 - 搜尋
// button type='submit'
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()//請瀏覽器不要執行預設的動作
  //console.log(event)
  //- 抓取searchInput的value，trim()去頭去尾的空白去掉，統一變成小寫
  const keyWord = searchInput.value.trim().toLowerCase()

  //let filteredMovies = [] //篩選出來的結果丟進去，建議放到外面因為要做到分頁需做判斷是否有執行搜尋資料的動作

  //- 篩選電影清單- 方法1 (for ...of)
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyWord)) {
  //     filteredMovies.push(movie)//搜尋到的Movie title 放進去filteredMovies，movie為整個{}的資料
  //   }
  // }

  //- 篩選電影清單- 方法2 (filter 條件篩選 )，跟他很像的還有 map reduce 
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyWord)
  )

  //- alert顯示方式
  //console.log(keyWord.length)
  // - 當沒有輸入任何關鍵字的時候，顯示所有的電影清單
  // if (!keyWord.length) { // keyWord.length 為0時 False ，前面加驚嘆號！，結果就會變成True。
  //   return alert('please enter a valid string') //alert 告視窗
  // }

  // - 當篩選的長度===0時，此做法假如前一動作在搜尋ant，若下次執行時有錯誤會顯示全部電影清單，不會只有岡剛的搜尋結果。
  if (filteredMovies.length === 0) {
    return alert('Cannot find movies with keyword:' + keyWord)
  }

  //- 將篩選的清單重新放置
  //renderMovieLIst(filteredMovies)

  // -加入分頁功能，搜尋後重新將資料呈現
  renderPagintor(filteredMovies.length, 1)
  renderMovieLIst(getMovieByPage(1))// 預設都顯示1分頁，細節到getMovieByPage調整
})

// 5 - 分頁 ： (切割資料，並在axios get api時調整獲取的資料長度，再將資料放入顯示的 renderMovieLIst )
//- page資料切割 ： 當輸入是第一頁，會給我第一頁需要呈現的元素，ex page 1 (0~11), page 2 (12~23)
function getMovieByPage(page) {
  // 資料來源有分 movies (80筆Raw data ) or filteredMovies （是否有搜尋的資掉）
  //  判斷目前是哪一個狀態，原資料分頁還是搜尋後的分頁。
  const data = filteredMovies.length ? filteredMovies : movies

  const startIndex = (page - 1) * MOVIE_PER_AGE
  //slice 切割某一部分的資料 ,splice比較像是刪除跟移除
  return data.slice(startIndex, startIndex + MOVIE_PER_AGE)
}

// - 計算多少page(電影清單數量總數/每頁呈現的個數），在寫到html分頁架構中
function renderPagintor(amount, curPage) {
  const numberOfPage = Math.ceil(amount / MOVIE_PER_AGE) //無條件進位
  let pageHTML = ''
  //迴圈跑出numberOfPage的數量，並綁data-page資訊以利後續動態獲取分頁
  for (let page = 1; page <= numberOfPage; page++) {
    if (page === Number(curPage)) {
      pageHTML += `<li class="page-item active"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
    } else {
      pageHTML += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
    }
  }
  paginator.innerHTML = pageHTML
}

//- 動態分頁執行
paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return  //'A'<a> </a> 
  const page = Number(event.target.dataset.page) //renderPaginator的<li>中有綁定data-page
  localStorage.setItem('currentPage', JSON.stringify(page))

  const getMode = JSON.parse(localStorage.getItem('carMode'))
  if (getMode === 'card-mode-button') {
    renderPagintor(movies.length, page)
    renderMovieLIst(getMovieByPage(page))
  } else if (getMode === 'list-mode-button') {
    renderPagintor(movies.length, page)
    renderMovieListMode(getMovieByPage(page))
  }
})


//- mode 切換
changeFormMode.addEventListener('click', function onChangeFormModeClicked(event) {
  const target = event.target.id
  localStorage.setItem('carMode', JSON.stringify(target))

  currentPage = JSON.parse(localStorage.getItem('currentPage'))

  if (target === 'card-mode-button') {
    renderPagintor(movies.length, currentPage)
    renderMovieLIst(getMovieByPage(currentPage)) //網頁開啟時先顯式1分頁的電影清單
  } else if (target === 'list-mode-button') {
    renderPagintor(movies.length, currentPage)
    renderMovieListMode(getMovieByPage(currentPage))
  }
})