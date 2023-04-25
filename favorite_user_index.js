const BASE_URL = 'https://user-list.alphacamp.io/api/v1/users'
//https://user-list.alphacamp.io/api/v1/users/:id ,帶入id
const carPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const pagination = document.querySelector('#pagination')



const paginationNumber = 16
const users = JSON.parse(localStorage.getItem('userFavorite'))
const filterUserList = []

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
              <button type="button" class="btn btn-danger btn-show-remove" data-id=${item.id}>-</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    `
  })
  carPanel.innerHTML = userHTML
}
renderUserLIst(users)

carPanel.addEventListener('click', function oncarPanelClickedRemove(event) {
  if (event.target.matches('.btn-show-remove')) {
    const removeId = Number(event.target.dataset.id) //htmldataset 記得轉格式!!!
    deleteToFavorite(removeId)
  }
})

function deleteToFavorite(id) {
  if (!users) return //防止 movies 是空陣列的狀況
  const userIndex = users.findIndex((user) => user.id === id) //這邊的movies是從前面一開始localStorage獲得的
  console.log(userIndex)
  users.splice(userIndex, 1)
  localStorage.setItem('userFavorite', JSON.stringify(users))
  renderUserLIst(users)
}
