// - Movie List api : https://achq.notion.site/movie-list-api-429bfce73c774d12981254d7164a4b13
const BASE_URl = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URl + '/api/movies/'
const POSTER_URL = BASE_URl + '/posters/'//後面加filename就是照片路徑



// 變數
const movies = JSON.parse(localStorage.getItem('favorite'))   // favorite頁面透過LocalStorage抓取資料，需轉成JSON.parse 
//id呼叫方式('#名稱')
let dataPanel = document.querySelector('#data-panel')
let searchForm = document.querySelector('#search-form')
let searchInput = document.querySelector('#search-input')


function renderMovieLIst(data) {
  if (!data) return
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
              <button type="button" class="btn btn-danger btn-remove-favorite" data-id='${item.id}' >X</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = contentHTML
}

//- 原本從axios獲取資料，現在改由localStorage，因此需要將資料帶入
renderMovieLIst(movies)
// 2 - 電影清單Mo詳情資料  
//-設置監聽器，按到class=.bnt-show-movie時帶入movie的詳細資料 ; class=.bnt-show-favorite時帶入我的最愛清單。
dataPanel.addEventListener('click', function onPanelClicked(event) {
  //class 呼叫方式('.名稱')
  if (event.target.matches('.btn-show-movie')) {
    //console.log(event.target.dataset) //透過button Bootstrap data屬性獲取id資料，型態為str因此需改成Number
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFormFavorite(Number(event.target.dataset.id))
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


//-從收藏清單移除
function removeFormFavorite(id) {
  if (!movies || !movies.length) return //防止 movies 是空陣列的狀況
  const movieIndex = movies.findIndex((movie) => movie.id === id) //這邊的movies是從前面一開始localStorage獲得的
  console.log(movieIndex)
  movies.splice(movieIndex, 1) //刪除資料
  localStorage.setItem('favorite', JSON.stringify(movies))//從新將資料匯入localStoarge，記得轉格式(JSON.stringify)
  renderMovieLIst(movies)//即時更新
}


