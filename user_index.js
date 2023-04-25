const BASE_URL = 'https://user-list.alphacamp.io/api/v1/users'
//https://user-list.alphacamp.io/api/v1/users/:id ,帶入id
const carPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('#pagination')



const paginationNumber = 16
const users = []
let filterUserList = []

// 1- 撈取API資料，並且堆疊出資料呈現
axios.get(BASE_URL).then((response) => {
  //-1 確認資料格式與型態 
  //console.log(response.data.results)
  users.push(...response.data.results)//開運算
  // for (user of response.data.results) {
  //   users.push(user)
  // }
  //-2 堆疊所有影像修改html
  //renderUserLIst(users)
  //-3 透過分頁
  renderPagination(users.length)
  renderUserLIst(getUserByPage(1))//預設地1頁
})
  .catch((err) => console.log(err))

function renderUserLIst(data) {
  let userHTML = ''
  data.forEach((item) => {
    userHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card mt-2">
            <img src="${item.avatar}" class="card-img-top"
              alt="User">
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.region}</h5>
            </div>

            <!-- footer: //car表格中置底，並依需求加入按鈕-->
            <div class="card-footer">
              <button type="button" class="btn btn-info btn-show-favorite" data-id=${item.id}>+</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  carPanel.innerHTML = userHTML
}


// - 搜尋功能
// button type='submit'
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()//請瀏覽器不要執行預設的動作
  //console.log(event)e，trim()去頭去尾的空白去掉，統一變成小寫
  const keyWord = searchInput.value.trim().toLowerCase()
  //console.log(keyWord.length)

  filterUserList = users.filter((user) =>
    user.name.toLowerCase().includes(keyWord) || user.region.toLowerCase().includes(keyWord)
  )

  // - 當篩選的長度===0時，此做法假如前一動作在搜尋ant，若下次執行時有錯誤會顯示全部電影清單，不會只有岡剛的搜尋結果。
  if (filterUserList.length === 0) {
    return alert('Cannot find movies with keyword:' + keyWord)
  }
  // -加入分頁功能，搜尋後重新將資料呈現
  renderPagination(filterUserList.length)
  renderUserLIst(getUserByPage(1))// 預設都顯示1分頁，細節到getMovieByPage調整
})


//- 分頁功能

pagination.addEventListener('click', function onPagationClicked(event) {
  if (event.target.tagName !== 'A') return  //'A'<a> </a> 
  const page = Number(event.target.dataset.page) //renderPaginator的<li>中有綁定data-page
  renderUserLIst(getUserByPage(page))
})

function getUserByPage(page) {
  const data = filterUserList.length ? filterUserList : users
  //console.log(data)
  const startIndex = (page - 1) * paginationNumber
  //slice 切割某一部分的資料 ,splice比較像是刪除跟移除
  return data.slice(startIndex, startIndex + paginationNumber)
}


function renderPagination(dataLength) {
  const pageNumber = Math.ceil(dataLength / paginationNumber) //無條件進位
  let pageHTML = ''
  //迴圈跑出numberOfPage的數量，並綁data-page資訊以利後續動態獲取分頁
  for (let page = 1; page <= pageNumber; page++) {
    pageHTML += `<li class="page-item"><a class="page-link" href="#" data-page = ${page}>${page}</a></li>`
  }
  pagination.innerHTML = pageHTML
}

// 加入我的最愛清單
carPanel.addEventListener('click', function onCarPanelClicked(event) {
  if (event.target.matches('.btn-show-favorite')) {
    const selectBtnID = Number(event.target.dataset.id)
    addToFavorite(selectBtnID)
  }
})

function addToFavorite(id) {
  //使用暫存在localStorage的方式
  const getUserFavoriteList = JSON.parse(localStorage.getItem('userFavorite')) || [] //獲取資料（字串）需轉成javascript可看的格式，如果沒有給予一個空資料

  //從users資料找到對應的id並加入其資料集
  const userFavoriteData = users.find(user => user.id === id)


  //判斷是否加入其清單中了
  if (getUserFavoriteList.some((user) => user.id === id)) {
    return alert('已經加入我的最愛清單中')
  }

  //資料更新：最後將資料放到list中，並丟到LocalStorage（格式需改成自串）
  getUserFavoriteList.push(userFavoriteData)
  console.log(getUserFavoriteList)

  //丟到localstaorage
  localStorage.setItem('userFavorite',JSON.stringify(getUserFavoriteList))

}