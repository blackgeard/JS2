Vue.component('search', {
  data() {
    return {
      userSearch: ''//userSearch запрашивается в родителе (main.js)
    }
  },
  template: //$parent используется для связи с родителем (т.е. main.js)
    `
    <form action="#" class="search-form"  @submit.prevent='$parent.filter(userSearch)'>
      <input type="text" class="search-field" v-model='userSearch'>
      <button type="submit" class="btn-search">
          <i class="fas fa-search"></i>
      </button>
    </form>
    `
})

