import { GithubUser } from './GithubUser.js'

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(
        entry => entry.login.toUpperCase() === username.toUpperCase()
      )

      if (userExists) {
        throw new Error('Este usuário já foi cadastrado!')
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
      
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries.filter(
      entry => entry.login !== user.login
    )

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onadd()
  }

  onadd() {
    const addBtn = this.root.querySelector('.fav')
    addBtn.onclick = () => {
      const { value } = this.root.querySelector('#input-search')

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()
    this.createEmptyTable()

    this.entries.forEach(user => {
      const row = this.createRow()

      row.querySelector(
        '.user img'
      ).src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = 'Imagem de ${user.name}'
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm(`Tem certeza que deseja remover ${user.name}?`)

        if (isOk) {
          this.delete(user)
        }
      }
      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td colspan="3">
    <div class="user">
      <img
        src="https://github.com/olucasbrum.png"
        alt="Imagem de Lucas Brum"
      />
      <a href="https://github.com/olucasbrum.com" target="_blank">
        <p>Lucas Brum</p>
        <span>olucasbrum</span>
      </a>
    </div>
  </td>
  <td class="repositories">14</td>
  <td class="followers">8</td>
  <td>
    <button class="remove">Remover</button>
  </td>
    `

    return tr
  }

  createEmptyTable() {
    const isEmpty = this.entries.length == 0

    if (isEmpty) {
      const emptyRow = document.createElement('tr')
      emptyRow.innerHTML = `     
      <td colspan="4">
      <div>
        <svg
          width="132"
          height="125"
          viewBox="0 0 132 125"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M106.917 86.7188C106.257 82.8938 107.538 78.9937 110.356 76.2875L128.381 58.9562C135.469 52.1375 131.555 40.2563 121.761 38.85L96.8522 35.2813C92.9581 34.725 89.5921 32.3125 87.8562 28.8313L76.7153 6.56872C74.524 2.18747 70.2604 0 65.9967 0C61.7396 0 57.476 2.18747 55.2847 6.56872L44.1438 28.8313C42.408 32.3125 39.0419 34.725 35.1478 35.2813L10.2391 38.85C0.444538 40.2563 -3.46934 52.1375 3.61917 58.9562L21.644 76.2875C24.4623 78.9937 25.7427 82.8938 25.0827 86.7188L20.8256 111.194C19.499 118.812 25.6371 125 32.6002 125C34.435 125 36.3293 124.569 38.1641 123.619L60.4394 112.062C62.1819 111.162 64.0893 110.713 65.9967 110.713C67.9107 110.713 69.8182 111.162 71.5606 112.062L93.8359 123.619C95.6708 124.569 97.565 125 99.3998 125C106.363 125 112.501 118.812 111.174 111.194L106.917 86.7188ZM66.0219 60.984H70.7119V42.6376H66.0219V60.984ZM57.1356 60.984H61.8256V42.6376H57.1356V60.984ZM64.8083 91.0294H66.2276C68.5178 91.0294 70.5611 90.7158 72.3576 90.0886C74.1677 89.475 75.7105 88.6023 76.9858 87.4706C78.2612 86.3525 79.2348 85.0162 79.9068 83.4618C80.5788 81.921 80.9147 80.2098 80.9147 78.3281C80.9147 76.4601 80.5788 74.7488 79.9068 73.1944C79.2348 71.6536 78.2612 70.3173 76.9858 69.1856C75.7105 68.0675 74.1677 67.2017 72.3576 66.5881C70.5611 65.9745 68.5178 65.6677 66.2276 65.6677H64.8083C62.5319 65.6677 60.4886 65.9745 58.6784 66.5881C56.8682 67.2153 55.3255 68.0948 54.0501 69.2265C52.7885 70.3583 51.8217 71.6945 51.1497 73.2353C50.4778 74.7897 50.1418 76.501 50.1418 78.369C50.1418 80.2507 50.4778 81.9619 51.1497 83.5027C51.8217 85.0571 52.7885 86.3934 54.0501 87.5115C55.3255 88.6296 56.8682 89.4954 58.6784 90.109C60.4886 90.7226 62.5319 91.0294 64.8083 91.0294ZM66.2688 84.8321H64.8083C63.2313 84.8321 61.8325 84.689 60.612 84.4026C59.4052 84.1163 58.3836 83.7004 57.547 83.155C56.7242 82.6096 56.1003 81.9346 55.6752 81.1302C55.25 80.3257 55.0375 79.4053 55.0375 78.369C55.0375 77.3327 55.25 76.4123 55.6752 75.6078C56.1003 74.8034 56.7242 74.1216 57.547 73.5626C58.3836 73.0035 59.4052 72.5808 60.612 72.2945C61.8325 72.0081 63.2313 71.865 64.8083 71.865H66.2688C67.8595 71.865 69.2583 72.0081 70.4651 72.2945C71.6719 72.5808 72.6867 72.9967 73.5095 73.5421C74.3323 74.1012 74.9494 74.7761 75.3608 75.5669C75.7859 76.3714 75.9985 77.2918 75.9985 78.3281C75.9985 79.3644 75.7859 80.2848 75.3608 81.0892C74.9494 81.8937 74.3323 82.5755 73.5095 83.1346C72.6867 83.6936 71.6719 84.1163 70.4651 84.4026C69.2583 84.689 67.8595 84.8321 66.2688 84.8321Z"
            fill="#4E5455"
          />
        </svg>
        <p>Nenhum Favorito ainda</p>
      </div>
    </td>
      `

      emptyRow.classList.add('empty-table')
      this.tbody.append(emptyRow)
    }
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
