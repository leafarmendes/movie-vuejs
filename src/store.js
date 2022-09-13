import { createStore } from "vuex";
import axios from 'axios'

const BASE_URL = "https://api.themoviedb.org/3";
const POPULARITY_URL = "/discover/movie?sort_by=popularity.desc&";
const MOVIES_URL = '/movie/now_playing?';
const API_KEY = 'api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&page=1&include_adult=false&page=';

export default createStore({
  state: {
    films: [],
    searchArray: [],
    itemsInCart: '0',
    itemsInFav: '0',
    cart: [],
    fav: [],
    currentPage: 1,   
    asideState: false,
    cartState: false,
    favState: false,
  },
  mutations: {
    loadFilms(state, film) {
      state.films.push(film);
    },
    receiveSearch(state, payload) {
      state.searchArray = payload
    },
    cartCount(state, payload) {
      state.itemsInCart = payload
    },
    favCount(state, payload) {
      state.itemsInFav = payload
    },
    openAside(state, payload) {
      state.asideState = payload
    },
    openCart(state, payload) {
      state.cartState = payload
    },
    openFav(state, payload) {
      state.favState = payload
    },
    resetFilms(state, payload) {
      state.films = payload;
    },
    pushCart(state, film) {
      state.cart.push(film);
    },
    pushFav(state, film) {
      state.fav.push(film)
    }
  },
  actions: {
    async loadPopularMovies(context, page = 1) {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&include_adult=false&page=${page}`
      let response = await fetch(url);
      const dataFilms = await response.json();

      if(page >= 1) { 
        dataFilms.results.forEach((film, index) => {
          fetch(BASE_URL + `/movie/${film.id}?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR`)
            .then(r => r.json())
            .then(data => {
              if(data.poster_path && data.genres[0] && data.vote_average) {
                let priceOfMovie = Math.floor(Math.random() * 10) + 1;
                data = {...data, price: priceOfMovie, favorite: false};
                context.commit("loadFilms", data);
              }
            })
        })    
      }         
    },
  },
});