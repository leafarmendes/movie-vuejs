<template>
  <section class="container">
    <section class="content__section">  
      <transition-group name="slide_cart" mode="out-in" tag="div">    
        <div v-if="searchArray.length > 0" class="content__cards">
          <div v-for="(search, index) in searchArray" :key="search.id" class="card__container">
            <div class="card__img">
              <button class="fav__button" @click="setFavorite(searchArray, search, search.id, index, $event)">
                <img v-if ="!search.favorite" class="card__heart" src="../assets/heart_white_outline.svg">
                <Vue3Lottie ref="customControl" :animationData="Heart" :autoPlay="false" :loop="false"/>
              </button>
              <img class="poster" :src="setPosterPath(search.poster_path)" alt="">
              <p>{{formatDate(search.release_date)}}</p>
            </div>

            <div class="card__content">
              <strong>{{search.title}}</strong>

              <div class="card__classification">
                <div class="card__stars">
                  <img src="../assets/star.svg" alt="">
                  <p>{{Math.floor(search.vote_average)}}</p>          
                </div> 
                <p class="card__genre">{{search.genres[0].name}}</p>
              </div>

              <p class="card__price">{{priceToBrl(search.price)}}</p>
            </div>

            <div class="card__button">
              <button @click="getMovie(search, search.id)">Adicionar</button>   
            </div>
          </div>   
        </div>

        <div v-else class="content__cards">
          <div v-for="(film, index) in films" :key="film.id" class="card__container">
            <div class="card__img">
              <button class="fav__button" @click.prevent="setFavorite(films, film, film.id, index, $event)">
                <img v-if ="!film.favorite" class="card__heart" src="../assets/heart_white_outline.svg" alt="">  
                <Vue3Lottie ref="customControl" :animationData="Heart" :autoPlay="false" :loop="false"/>          
              </button>
              <img class="poster" :src="setPosterPath(film.poster_path)" alt="">
              <p>{{formatDate(film.release_date)}}</p>
            </div>

            <div class="card__content">
              <strong>{{film.title}}</strong>

              <div class="card__classification">
                <div class="card__stars">
                  <img src="../assets/star.svg" alt="">
                  <p>{{Math.floor(film.vote_average)}}</p>          
                </div> 
                <p class="card__genre">{{film.genres[0].name}}</p>
              </div>

              <p class="card__price">{{priceToBrl(film.price)}}</p>
            </div>

            <div class="card__button">
              <button @click="getMovie(film, film.id)">Adicionar</button>   
            </div>
      
        </div>   
        </div>
      </transition-group>
    </section>

    <aside class="cart">
      <transition name="aside" :duration="1000" mode="out-in">
        <div v-if="asideMenu" class="cart__wrapper">
            <div v-if="cartMenu" class="cart__container">
              <div class="cart__menu">
                <h3>Carrinho</h3>
                <a v-if="cart.length > 0" href="#" @click.prevent="removeAll(this.cart)">Esvaziar</a>
                <span class="close__bt" @click="closeAside">Fechar</span>
              </div>

              <transition name="cart_content" mode="out-in">          
                <div v-if="cart.length" class="cart__content">
                  <transition-group name="slide_cart" mode="out-in" tag="div">
                      <div v-for="(film, index) in cart" :key="film.id" class="cart__card">
                        <img :src="IMG_URL + film.poster_path" alt="">
                        <p>{{film.title}}</p>
                        <p>{{quantity}}</p>
                        <p>{{priceToBrl(film.price)}}</p>
                        <button @mouseenter="showTooltip($event)" @mouseleave="removeTooltip($event)" class="remove__cart" @click="remove(film, index, cart, film.id)">
                          <img src="../assets/trash.svg" alt="">
                          <span class="tooltip__remove" >Remover do Carrinho</span>
                        </button>
                      </div>
                  </transition-group>
                </div>
              </transition>

              <div v-if="cart.length > 0" class="card__total">
                <div class="card__price">
                  <h2>Total</h2>
                  <h2>{{priceToBrl(total)}}</h2>
                </div>
                <button @click="checkout">Finalizar compra</button>
              </div>
              <div v-else class="cart__empty">
                <Vue3Lottie :animationData="NotFoundCart" :height="200" :width="200"/>
                <p>Seu carrinho está vazio.</p>
                <strong>Faça suas compras!</strong>
              </div>                   
            </div>

            <div v-else class="cart__container">
              <div class="cart__menu">
                <h3>Favoritos</h3>
                <a v-if="fav.length > 0" href="#" @click.prevent="removeAll(this.fav)">Esvaziar</a>
                <span class="close__bt" @click="closeAside">Fechar</span>
              </div>

              <div v-if="fav.length == 0" class="fav__empty">
                <Vue3Lottie :animationData="Heart" :height="400" :width="400" />
                <p>O que??</p>
                <strong>Adicione filmes aos favoritos!</strong>
              </div> 

              <transition name="cart_content" mode="out-in">            
                <div v-if="fav.length" class="cart__content fav__content">
                  <transition-group name="slide_cart" mode="out-in" tag="div">                    
                    <div v-for="(film, index) in fav" :key="film.id" class="fav__card">
                      <img :src="IMG_URL + film.poster_path" alt="">
                      <p>{{film.title}}</p>
                      <p>{{priceToBrl(film.price)}}</p>
                      <button @mouseenter="showTooltip($event)" @mouseleave="removeTooltip($event)" class="add__cart" @click="getMovie(film, film.id)">
                        <img src="../assets/addCart.svg" alt="Adicionar ao carrinho">
                        <span class="tooltip__add">Adicionar ao Carrinho</span>
                      </button>          
                      <button @mouseenter="showTooltip($event)" @mouseleave="removeTooltip($event)" class="remove__cart" @click="remove(film, index, fav, film.id)">
                        <img  src="../assets/trash.svg" alt="Remover do carrinho">
                        <span class="tooltip__remove" >Remover dos favoritos</span>
                      </button>
                    </div>
                  </transition-group>
                </div> 
              </transition>                 
            </div>        
        </div>
      </transition>
    </aside>
  </section>

    <section v-if="searchArray.length == 0" class="pagination">
      <button :disabled="page == 1" @click="fetchData(page--)">Anterior</button>
      <button :disabled="page == 20" @click="fetchData(page++)">Próxima</button>
    </section>  
</template>

<script>
const BASE_URL = "https://api.themoviedb.org/3";
import { Vue3Lottie } from 'vue3-lottie'
import NotFoundCart from '../assets/lotties/notFound.json'
import Heart from '../assets/lotties/heart.json'

import 'vue3-lottie/dist/style.css'

  export default {
    name: "Content",
    components: {
      Vue3Lottie,
    },
    data() {
      return {
        NotFoundCart,
        Heart,
        page: 1,
        setHeartImage: './src/assets/heart_white_outline.svg',
        quantity: 1,
        tooltipTrash: false,
        tooltipAdd: false,
        favorite: false,
        isAsideOpen: false,
        isCartOpen: false,
        isFavOpen: false,
        totalCart: 0,
        IMG_URL: 'https://image.tmdb.org/t/p/w500'
      }
    },
    computed: {
      total() {
        let total = 0;
        if(this.cart) {
          this.cart.forEach(item => {
            total += item.price
          })
          return total;
        }
      },
      films() {
        return this.$store.state.films;
      },
      searchArray() {
        return this.$store.state.searchArray;
      },
      asideMenu() {
        return this.$store.state.asideState
      },
      cartMenu() {
        return this.$store.state.cartState
      },
      favMenu() {
        return this.$store.state.favState
      },
      cart() {
        return this.$store.state.cart;
      },
      fav() {
        return this.$store.state.fav;
      }
    },
    methods: {
      getMovie(item, id) {
        if(item) {
          const found = this.cart.some(equal => equal.id === id);
          if(!found) {
            this.addCartSuccess();
            this.$store.commit("pushCart", item);
            this.$store.commit("cartCount", this.$store.state.cart.length);
          }
        }
      },
      formatDate(returnedDate) {
        if(returnedDate) {
          const date = new Date(returnedDate);
          return new Intl.DateTimeFormat('default', {dateStyle: 'long'}).format(date);          
        }
      },
      priceToBrl(value){
        return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
      },
      remove(item, index, arr, id) {
        const foundInFilms = this.films.findIndex(x => x.id === id);
        const foundInSearch = this.searchArray.findIndex(x => x.id === id);
        item = {...item, favorite: false};
        this.films[foundInFilms] = {...this.films[foundInFilms], favorite: false};
        this.searchArray[foundInSearch] = {...this.searchArray[foundInSearch], favorite: false};

        this.removeSuccess(arr);

        arr.splice(index, 1);
        arr === this.cart ? this.$store.commit("cartCount", arr.length) : this.$store.commit("favCount", arr.length);


      },
      removeAll(arr) {
        this.films.map((item, index) => {
          this.films[index] = {...item, favorite: false};
        })
        this.searchArray.map((item, index) => {
          this.searchArray[index] = {...item, favorite: false};
        })

        if(arr === this.cart) {
          this.$store.state.cart = [];
          this.$store.commit("cartCount", this.cart.length);
        } else {       
          this.$store.state.fav = [];
          this.$store.commit("favCount", this.fav.length)
        }
      },
      setPosterPath(poster) {
        if(poster) {
          return `https://image.tmdb.org/t/p/w500${poster}`
        }
      },
      setFavorite(arr, item, id, index, event) {
        const found = this.fav.some(equal => equal.id === id);
        const foundInFilms = this.films.findIndex(x => x.id === id);
        const foundInFav = this.fav.findIndex(x => x.id === id);
        const foundInSearch = this.searchArray.findIndex(x => x.id === id);
        if(item.favorite) {          
          this.remove(item, foundInFav, this.fav, id);
        }
        if(!found) {
          if(item) {
            this.addFavoriteSuccess();
            const target = event.target;
            target.style.display = "none";
          
            arr === this.films 
              ? this.films[foundInFilms] = {...this.films[foundInFilms], favorite: true}
              : this.searchArray[foundInSearch] = {...this.searchArray[foundInSearch], favorite: true}
            
            item = {...item, favorite: true};
            this.$store.commit("pushFav", item);
            this.$store.commit("favCount", this.$store.state.fav.length);
            this.play(index, 1);
            return
          }
        }

      },
      showTooltip(event) {
        const currentTarget = event.target;
        currentTarget.lastElementChild.classList.toggle("active");
      },
      removeTooltip(event) {
        const currentTarget = event.target;
        currentTarget.lastElementChild.classList.toggle("active");
      },
      closeAside() {
        this.$store.commit("openCart", this.isCartOpen);
        this.$store.commit("openFav", this.isFavOpen);
        this.$store.commit("openAside", this.isAsideOpen);
      },
      async fetchData(page) {
        this.$store.state.films = [];
        
        const url = `https://api.themoviedb.org/3/discover/movie?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR&include_adult=false&page=${this.page}`
        let response = await fetch(url);
        const dataFilms = await response.json();   
        this.fetchById(dataFilms);
      },
      async fetchById(result) {
        await result.results.forEach(film => {
          fetch(BASE_URL + `/movie/${film.id}?api_key=61e9811d154b76faf42b0223cc4d5814&language=pt-BR`)
            .then(r => r.json())
            .then(data => {
              if(data.poster_path && data.genres[0] && data.vote_average) {
                let priceOfMovie = Math.floor(Math.random() * 10) + 1;
                data = {...data, price: priceOfMovie, favorite: false};                
                this.$store.commit("loadFilms", data)
              }                
            });
        })        
      },
      checkout() {
        if(this.$store.state.cart.length > 0) {
          this.$router.push({name: "purchase"})
        } else {
          this.$moshaToast('Carrinho vazio!',
            {
            type: 'danger',
            transition: 'slide',
            position: 'top-center',
            showIcon: true,
            timeout: 1500,
            showCloseButton: false,
            })
        }
      },
      addCartSuccess() {
        this.$moshaToast('Filme adicionado ao carrinho!',
          {
          type: 'success',
          transition: 'slide',
          position: 'top-center',
          showIcon: true,
          timeout: 2000,
          showCloseButton: false,
          })
      },
      addFavoriteSuccess() {
        this.$moshaToast('Filme adicionado aos favoritos!',
          {
          type: 'success',
          transition: 'slide',
          position: 'top-center',
          showIcon: true,
          timeout: 1500,
          showCloseButton: false,
          })        
      },
      removeSuccess(value) {
        this.$moshaToast(value === this.cart 
            ? 'Filme removido do carrinho!' 
            : 'Filme removido dos favoritos!',
          {
          type: 'danger',
          transition: 'slide',
          position: 'top-center',
          showIcon: true,
          timeout: 2000,
          showCloseButton: false,
          })        
      },
      play(index, frame) {
        this.$refs["customControl"][index].goToAndPlay(frame);       
      },          
    },
  }
</script>

<style scoped>
  .cart_content-enter-active {
    transition: all .7s;
  }

  .cart_content-enter-from {
    opacity: 0;
    transform: translate3d(0, 10px, 0);    
  }

  .slide_cart-enter-active {
    transition: all .7s;
  }

  .slide_cart-enter-from {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  .aside-enter-active,
  .aside-leave-active {
    transition: all .7s;
  }

  .aside-enter-from,
  .aside-leave-to {
    transform: translate3d(384px, 0, 0);
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .content__section {
    margin: 6rem 0 2rem 0;
    
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .content__cards {
    max-width: 90rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 2rem;
  }

  .card__container {
    width: 12rem;
    border: 3px solid var(--gray-100);
    padding: 0;
    margin: 0;

    display: grid;
    grid-template-rows: 18rem, 7rem, 2.5rem;
  }

  .card__img {
    width: 100%;
    height: 18rem;
    position: relative;
    display: flex;
    justify-content: center;
    overflow: hidden;
  }

  .fav__button { 
    width: 1.875rem;
    height: 1.875rem;
    position: absolute;
    right: 1.25rem;
    top: 0.625rem; 
    cursor: pointer;
    background: transparent;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .fav__button div {
    transform: scale(5.5)    
  }

  .card__img .card__heart {
    width: 1.875rem;
    filter: drop-shadow(0 0 0.8rem rgba(255, 255, 255, 0.377));
  }

  .card__img .poster {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }

  .card__img p {
    position: absolute;

    bottom: 0.625rem;
    font-size: 0.8rem;
    background: var(--purple-100);
    color: var(---white);

    padding: 0.5rem 0.5rem;
  }

  .card__content {
    width: 100%;
    height: 7rem;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: .5rem .5rem;

    position: relative;
  }

  .card__content strong {
    margin-bottom: .5rem;
    font-size: 0.825rem;
    text-align: center;
  }

  .card__classification {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .card__genre {
    font-size: 1rem;
  }

  .card__stars {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;
  }

  .card__stars img { 
    width: 1rem;
  }

  .card__stars p {
    font-weight: bold;
    font-size: 0.7rem;
  }

  .card__price {
    font-size: 0.825rem;
    margin-top: .5rem;
  }

  .card__button {
    width: 100%;
  }

  .card__button button {
    width: 100%;
    height: 2.5rem;

    border: none;

    background: var(--purple-100);
    color: var(---white);
    cursor: pointer;
  }

  .card__button button:hover {
    background: var(--purple-200);
  }

  .cart {
    width: 24rem;
    position: fixed;
    /* padding: 0 1rem 0 0; */
    margin: 4rem 0;
    z-index: 1;
    right: 0;
  }

  .cart__wrapper {
    height: calc(100vh - 4rem);

    border-left: 1px solid var(--purple-100);
    background: var(---white);

    display: flex;
    flex-direction: column;
  }

  .cart__container {   
    width: 24rem;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .cart__menu {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .cart__menu h3, a {
    font-size: 1rem;
    text-decoration: none;
  }

  .close__bt {
    font-size: 1rem;
    font-weight: 700;
    padding: 0.2rem 1rem;
    background: var(--purple-100);
    color: var(---white);
    
    border-radius: 100px;
    cursor: pointer;
    transition: all .5s
  }

  .close__bt:hover {
    background: var(--purple-200);
  }

  .cart__content {
    width: 24rem;
    height: 38rem;
    margin-top: 2rem;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  .cart__card {
    position: relative;
    width: 100%;
    margin-bottom: 1rem;
    display: grid;
    grid-template-columns: 4rem 8rem 0.8rem 3rem 1rem;
    align-items: center;
    gap: 1rem;
  }

  .cart__card p {
    font-size: .9rem;
  }

  .cart__card img {
    width: 3rem;
  }

  .cart__card .remove__cart {
    width: 30px;
    height: 30px;
    background: transparent;
    overflow: hidden;
    border: none;
    margin-left: 1rem;
    cursor: pointer;
  }

  .remove__cart img:hover {
    filter: brightness(180%);
  }

  .cart__card button img {
    width: 100%;
    height: 100%;
  }


  .cart__card .tooltip__remove {
    display: none;
    position: absolute;
    bottom: -15px;
    right: 0;

    background: black;
    color: var(---white);
    border-radius: 8px;
    padding: 0.5rem;

    font-size: 0.7rem;
  } 
  .cart__card .tooltip__remove.active {
    display: block;
  }

  .tooltip__add:after,
  .tooltip__remove:after {
    content: '';
    position: absolute;
    left: 75%;
    top: -9px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid black;
    clear: both;
  }

  .fav__content {
    height: 50rem;
  }

  .fav__card .tooltip__remove {
    position: absolute;
    bottom: -58px;
    right: -3px;
    background: black;
    color: var(---white);
    border-radius: 8px;
    padding: 0.5rem;

    font-size: 0.7rem;
  } 

  .fav__card .tooltip__add {
    position: absolute;
    bottom: -58px;
    right: 27px;
    background: black;
    color: var(---white);
    border-radius: 8px;
    padding: 0.5rem;

    font-size: 0.7rem;
  }

  .fav__card .tooltip__remove {
    position: absolute;
    bottom: -58px;
    right: -3px;
    background: black;
    color: var(---white);
    border-radius: 8px;
    padding: 0.5rem;

    font-size: 0.7rem;
  }  

  .fav__card {
    position: relative;
    width: 100%;
    height: 2rem;
    margin-bottom: 3rem;
    display: grid;
    grid-template-columns: 4rem 8rem 3rem 1rem 1rem;
    align-items: center;
    gap: 1rem;
  }

  .fav__card p {
    font-size: .9rem;
  }

  .fav__card img {
    width: 3rem;
  }

  .fav__card button {
    width: 30px;
    height: 30px;
    background: transparent;
    overflow: hidden;
    border: none;
    margin-left: 1rem;
    cursor: pointer;
  }

  .fav__card span {
    display: none;
  }

  .fav__card span.active {
    display: block;
  }

  .fav__card button img:hover {
    filter: brightness(110%);
  }

  .fav__card button img {
    width: 100%;
    height: 100%;
  }

  .card__total {
    width: 100%;
    position: absolute;
    bottom: 0;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .card__price {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }

  .card__total button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22rem;
    height: 3rem;

    border: none;
    border-radius: 4px;

    background: var(--purple-100);
    color: var(---white);
    border: none;
    margin: 1rem 0 1rem 0;
    cursor: pointer;
  }

   .card__total button:hover {
     background: var(--purple-200);
   }

   .pagination {
     width: 100%;
     display: flex;
     margin-bottom: 1rem;
   }

   .pagination button {
     width: 10rem;
     padding: 1rem;
     border: none;
     border-radius: 4px;
     background: var(--purple-100);
     color: var(---white);

     font-weight: bold;

     cursor: pointer;

     transition: background .3s
   }

   .pagination button:hover {
     background: var(--purple-200)
   }

   .pagination button:disabled {
     filter: grayscale(100%);
   }

  .cart__empty {
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .cart__empty p {
    margin-top: 1rem;
  }
  
  .fav__empty {
    height: 500px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .fav__empty p {
    margin-top: -5rem;
  }      

  @media (max-width: 1200px) { 
    .content__cards {
    grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (max-width: 970px) { 
    .content__cards {
    grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (max-width: 768px) {
    .content__cards {
      padding: 0 0 0 0;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 0;
      row-gap: 1rem;
      justify-items: center;      
    }

    .card__img {
      width: 100%;
      height: 18rem;
      position: relative;
      display: flex;
      justify-content: center;
      overflow: hidden;
    }

    .card__container {
      width: 95%;
      border: 2px solid var(--gray-100);
    }

    .cart__content {
      width: 24rem;
      height: auto;
      margin-top: 2rem;
      overflow-y: none;
      overflow-x: hidden;
      padding-left: 0.725rem;
    }

    .card__total {
      width: 100%;
      margin-top: 1rem;
      position: static;
      bottom: 0;

      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }   
  }
</style>