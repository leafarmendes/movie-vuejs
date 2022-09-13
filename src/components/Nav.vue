<script>

</script>

<template>
  <header class="nav__bar">
        <h3>LOGO</h3>
        <div class="input__container">
          <input type="search" placeholder="Pesquisa" v-model="inputValue">
          <button type="submit"><img class="input__magnifier" src="../assets/magnifier.svg" alt=""></button>
        </div>

        <div class="nav__menu">
          <div class="nav__icons">
            <button :class="cartMenu" @click.prevent="openMenu($event, cartMenu)">
              <span>{{totalCart}}</span>
              <img src="../assets/cart.svg" alt="">              
            </button>
          </div>
          <div class="nav__icons">
            <button :class="favMenu" @click.prevent="openMenu($event, favMenu)">            
              <span>{{totalFav}}</span>
              <img src="../assets/heart.svg" alt="">
            </button>
          </div>
        </div>
  </header>
</template>

<script>

const BASE_URL = "https://api.themoviedb.org/3";
const POPULARITY_URL = "/discover/movie?sort_by=popularity.desc&";
const MOVIES_URL = '/movie/now_playing?';
const API_KEY = 'api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&page=1&include_adult=false&page=';

export default {
  name: "navbar",
  data() {
    return {
      searchResult: [],
      searchFilteredByFilm: [],
      inputValue: '',
      genres: [],
      favMenu: 'favMenu',
      cartMenu: 'cartMenu',
      currentPage: 1,
      asideOpen: false,
      cartOpen: false,
      favOpen: false,
      active: false,
    }
  },
  computed: {
    totalCart() {
      return this.$store.state.itemsInCart
    },
    totalFav() {
      return this.$store.state.itemsInFav
    },
  },
  methods: {
    openMenu(event, className) {
      this.asideOpen = true;
      this.$store.commit("openAside", this.asideOpen);

      className === this.cartMenu 
        ? (
            this.cartOpen = true, 
            this.favOpen = false
          )
        : (
            this.favOpen = true, 
            this.cartOpen = false
          ) 
      this.$store.commit("openCart", this.cartOpen)
      this.$store.commit("openFav", this.favOpen) 
    },
    async redoFetch(page) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&include_adult=false&page=${page}`
      await fetch(url)
        .then(r => r.json())
        .then(data => { 
          data.results.forEach((film) => {
            fetch(BASE_URL + `/movie/${film.id}?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR`)
              .then(r => r.json())
              .then(data => this.$store.commit("loadFilms", data))
          })
      });      
    }
  },
  watch: {
    async inputValue() {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&include_adult=false&query='${this.inputValue}`
      if(this.inputValue.length > 0) {
        await fetch(url)
        .then(response => response.json())
        .then(data => {this.searchResult = data.results,
          this.searchResult.forEach((film) => {
            this.searchFilteredByFilm = [],
            fetch(BASE_URL + `/movie/${film.id}?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR`)
              .then(r => r.json())
              .then(dataResult => {
                if(dataResult.poster_path && dataResult.genres[0] && dataResult.vote_average) {
                  let priceOfMovie = Math.floor(Math.random() * 10) + 1;
                  dataResult = {...dataResult, price: priceOfMovie, favorite: false};                  
                  this.searchFilteredByFilm.push(dataResult),  this.$store.commit("receiveSearch", this.searchFilteredByFilm);
                }
              })
          })
        })
      } else if(this.inputValue.length == 0) {
        this.searchFilteredByFilm = [];
        this.$store.commit("receiveSearch", this.searchFilteredByFilm);
      }
    }
  }
}
</script>

<style scoped>
  .nav__bar {
    width: 100%;
    height: 4rem;
    background: var(--blue-100);
    color: var(---white);
    box-shadow: 0 1px 5px 0 rgba(0,0,0,0.1);

    display: flex;
    align-items: center;
    justify-content: space-around;

    padding: 0 2rem;
  }

  .input__container {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .input__container input {
    width: 30rem;
    max-width: 30rem;
    height: 2.5rem;
    padding: 0 2.5rem 0 1rem;
    border-radius: 4px;
    border: 3px solid var(--blue-200);
  }

  .input__container button {
    background: transparent;
    border: none;
    position: absolute;
    right: 10px;

    cursor: pointer;
  }

  .input__container button img {
    width: 1.5rem;

  }
  
  .nav__bar .nav__menu {
    display: flex;
    gap: 1.5rem;
  }

  .nav__icons {
    position: relative;
  }

  .nav__icons button {
    background: transparent;
    border: none;
    color: var(---white);
    cursor: pointer;
  }

  .nav__icons button:hover {
    filter: brightness(150%)
  }

  .nav__icons span {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    right: -5px;
    top: -5px;
    width: 16px;
    height: 16px;
    border-radius: 8px;
    background: var(--purple-100);
  }

  .nav__bar .nav__menu img {
    height: 1.5rem;
  }

  @media (max-width: 768px) {
    .nav__bar {
      gap: 1rem;
      padding: 0 1rem;
    }

    .nav__bar h3 {
      display: none;
    }
    .input__container input {
      width: 15rem;
    }

  .nav__bar .nav__menu {
    gap: 1rem;
  }    
  }
</style>