export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then(data => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers
      }))
  }

  static pressEnter() {
    const input = document.querySelector('input#input-search')
    const inputBtn = document.querySelector('button.fav')

    input.addEventListener('keypress', pressKey => {
      if (pressKey.key === 'Enter') {
        pressKey.preventDefault()
        inputBtn.click()
      }
    })
  }
}
