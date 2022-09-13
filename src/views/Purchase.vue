<template>
  <Nav />
  <transition name="cart_content" mode="out-in">
    <section v-if="successBuyout" class="modal__container">
        <div class="modal">
          <strong>
            Obrigado, {{this.nome}}!
          </strong>
          <p>Sua compra foi realizada com sucesso!</p>
          <button @click="proceedToStore">Ir para a loja</button>
        </div>
    </section>
  </transition>

  <section class="purchase__container">
    <div class="purchase__content">
      <h1 v-if="cart.length > 0">Finalizar Compra</h1>
      
      <div class="purchase">
        <div v-if="cart.length > 0" class="form__container" >
          <form
            method="post"
            novalidate="true"
          >
            <input ref="nome" v-model="nome"  class="input__full" type="text" placeholder="Nome completo*">
            <div class="gap-10">
              <input ref="cpf" v-model="cpf" v-mask="'###.###.###-##'" class="form__cpf" type="text" placeholder="CPF*">
              <input ref="cel" v-model="cel" v-mask="'(##)#.####-####'" class="form__cel" type="text" placeholder="Celular*">
            </div>
            <input ref="email" v-model="email" class="input__full" type="email" placeholder="E-mail*">
          <div class="gap-10">
              <input ref="cep" v-model="cep" v-mask="'##.###-###'" class="form__cep" type="text" placeholder="CEP*">
              <input ref="end" v-model="end" class="form__end" type="text" placeholder="Endereço*">
            </div>
          <div class="gap-10">
              <input ref="cidade" v-model="cidade"  class="form__city" type="text" placeholder="Cidade*">
              <input onkeydown="return /[a-z]/i.test(event.key)" ref="estado" v-model="estado"  maxlength="2" class="form__state" type="text" placeholder="Estado*">
            </div>               
          </form>
        </div>

        <div class="cart__container">
          <div v-if="cart.length > 0" class="header__cart">
            <p>Imagem</p>
            <p>Nome</p>
            <p>Qtd</p>
            <p>Price</p>
          </div>

          <div v-if="cart.length > 0" class="card__container">
            <div v-for="(film, index) in cart" :key="film.id" class="cart__card">
              <img :src="IMG_URL + film.poster_path" alt="">
                <p>{{film.title}}</p>
                <p></p>
                <p>{{priceToBrl(film.price)}}</p>
              <button class="remove__cart" @click="remove(index, cart)">
                <img src="../assets/trash.svg" alt="">
              </button>
            </div>                                    
          </div>

          <div v-else class="cart__empty">
            <Vue3Lottie :animationData="NotFoundCart" :height="200" :width="200" />
            <p>Seu carrinho está vazio.</p>
            <strong>Faça suas compras!</strong>
          </div>

          <div v-if="cart.length > 0" class="total__container">
            <strong>Total</strong>
            <h2>{{priceToBrl(total)}}</h2>
          </div>

        <button  v-if="cart.length > 0" class="finish__purchase buy__more" @click="returnToBuy">Adicionar mais filmes</button>
        <button v-if="cart.length > 0" type="submit" class="finish__purchase" @click="checkForm">Finalizar compra</button>
        <button v-else class="finish__purchase" @click="returnToBuy">Visitar loja</button>       
        
        <transition name="cart_content" mode="out-in">
          <div class="show__errors" v-if="errors.length > 0">
            <span>Encontramos algo de errado, verifique os campos abaixo:</span>
            <p v-for="error in errors" :key="error">{{error}}</p>
          </div>   
        </transition>           
        </div> 
      </div>     
    </div>
  </section>
</template>

<script>
import Nav from '../components/Nav.vue';
import {mask} from 'vue-the-mask';
import { Vue3Lottie } from 'vue3-lottie'
import NotFoundCart from '../assets/lotties/notFound.json'
import { validate  } from 'gerador-validador-cpf'

import 'vue3-lottie/dist/style.css'

export default {
  directives: {mask},
  components: {
    Nav,
    Vue3Lottie
  },
  data() {
    return {
      NotFoundCart,
      IMG_URL: 'https://image.tmdb.org/t/p/w500',  
      isAsideOpen: false,
      isCartOpen: false,
      isFavOpen: false,
      successBuyout: false,
      resetStore: [],
      errors: [],
      nome: null,
      cpf: null,
      cel: null,
      email: null,
      cep: null,
      endereco: {},
      end: null,
      cidade: null,
      estado: null,
      states: ['AC','AL','AP','AM','BA','CE','DF','ES','GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
    }   
  },
  computed: {
    cart() {
      return this.$store.state.cart;
    },  
    total() {
      let total = 0;
      if(this.$store.state.cart) {
        this.$store.state.cart.forEach(item => {
          total += item.price
        })
        return total;
      }
    },       
  },
  methods: {
    priceToBrl(value){
      return value.toLocaleString("pt-BR", {style: "currency", currency: "BRL"})
    }, 
    remove(index, arr) {
      this.removeSuccess()
      arr.splice(index, 1);
      this.$store.commit("cartCount", arr.length)
    },
    returnToBuy() {
      this.closeAside();
      this.$router.push({name: "home"});
      this.$store.commit("cartCount", this.cart.length);
      this.$store.state.searchArray = [];
    },
    removeSuccess() {
      this.$moshaToast('Filme removido do carrinho!',
        {
        type: 'danger',
        transition: 'slide',
        position: 'top-center',
        showIcon: true,
        timeout: 2000,
        showCloseButton: false,
        })        
    },
    closeAside() {
      this.$store.commit("openCart", this.isCartOpen);
      this.$store.commit("openFav", this.isFavOpen);
      this.$store.commit("openAside", this.isAsideOpen);
    },
    proceedToStore() {
      this.closeAside();        
      this.$router.push({name: "home"});
      this.$store.state.cart = [];
      this.$store.state.fav = [];
      this.$store.state.searchArray = [];

      this.$store.state.films.map(item => item.favorite = false);
      this.$store.state.searchArray.map(item => item.favorite = false);
      this.$store.commit("cartCount", this.cart.length);
      this.$store.commit("favCount", this.$store.state.fav.length);
    },
    checkForm() {
      this.errors = [];
      this.$refs["nome"].classList.remove("error");
      this.$refs["cep"].classList.remove("error");
      this.$refs["cpf"].classList.remove("error");
      this.$refs["cel"].classList.remove("error");
      this.$refs["end"].classList.remove("error");
      this.$refs["estado"].classList.remove("error");
      this.$refs["cidade"].classList.remove("error");
      this.$refs["email"].classList.remove("error");


      if (!this.nome) {
        this.$refs["nome"].classList.add("error");
        this.errors.push("Favor preencher seu NOME!");
      }
      if(!this.cep) {
        this.$refs["cep"].classList.add("error");
        this.errors.push("Favor preencher o CEP!");
      }
      if(!this.cpf) {
        this.$refs["cpf"].classList.add("error");
        this.errors.push("Favor preencher o CPF!");
      } else if(!validate(this.cpf)) {
        this.$refs["cpf"].classList.add("error");
        this.errors.push("CPF inválido!"); 
      }
      if(!this.cel) {
        this.$refs["cel"].classList.add("error");
        this.errors.push("Favor preencher o CELULAR!");
      }
      if(!this.end) {
        this.$refs["end"].classList.add("error");
        this.errors.push("Favor preencher o ENDEREÇO!");
      }
      if(!this.cidade) {
        this.$refs["cidade"].classList.add("error");
        this.errors.push("Favor preencher a CIDADE!");
      }
      if(!this.estado) {
        this.$refs["estado"].classList.add("error");
        this.errors.push("Favor preencher o ESTADO!");
      } else if(!this.validState(this.estado)) {
        this.$refs["estado"].classList.add("error");
        this.errors.push("Estado inválido!");
      }                         
      if (!this.email) {
        this.$refs["email"].classList.add("error");
        this.errors.push("Favor preencher o e-mail.");
      } else if (!this.validEmail(this.email)) {
        this.$refs["email"].classList.add("error");
        this.errors.push("Por favor, coloque um e-mail válido.");
      }

      if (!this.errors.length) {
        this.successBuyout = true;
        return true;
      }
    }, 
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },
    validState(estado) {
      const toUpper = estado.toUpperCase();
      const foundInStates = this.states.some(equal => equal == toUpper);
      return foundInStates
    }       
  },
  watch: {
    nome() {
    },
    cep() {
      const setCep = this.cep.split(".").join("").split("-").join("");
      if(setCep.length === 8) {
        fetch(`https://viacep.com.br/ws/${setCep}/json/`)
        .then(r => r.json())
        .then(r => {
          if(r.erro) {
            this.errors = [];
            this.errors.push("CEP inválido");
          } else {
            this.end = `${r.logradouro}, ${r.bairro}`;
            this.$refs["end"].value = `${r.logradouro}, ${r.bairro}`;
  
            this.cidade = `${r.localidade}`;
            this.$refs["cidade"].value = `${r.localidade}`;
  
            this.estado = `${r.uf}`;
            this.$refs["estado"].value = `${r.uf}`;
          }
        })
      }
    }
  
  }
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

  .slide__modal-enter-active {
    transition: all .7s;
  }

  .slide__modal-enter-from {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  .gap-10 {
    display: flex;
    gap: 10px;
  }

  .purchase__container {
    margin-top: 6rem;
    width: 100%;
    height: 80vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .purchase__content {
    width: 1100px;
    max-width: 1100px;
    display: flex;
    flex-direction: column;  
  }

  .purchase__content h1 {
    margin: 0 0 2rem 3.8rem;
    color: var(--gray-200)
  }

  .purchase {
    width: 68rem;
    max-width: 68rem;
    display: flex;
    flex-direction: row;
  }

  .form__container {
    width: 500px;
  }

  .form__container input:not(:last-child) {
    margin-bottom: 1rem;
  }

  .form__container input {
    padding-left: 12px;
    height: 3rem;
    border-radius: 4px;
    border: 3px solid var(--gray-100);
    font-size: .8rem;
    transition: all 1s;
  }

  .form__container input.error {
    border: 3px solid var(--red-500);
  }

  .form__container .input__full {
     width: 400px;
  }

  .form__container .form__cpf, .form__cel, .form__city, .form__state {
     width: 195px;
  }

  .form__container .form__cep {
     width: 145px;
  }  

  .form__container .form__end {
     width: 245px;
  }   

  .cart__container {
    width: 370px;
  }

  .header__cart {
    display: grid;
    grid-template-columns: 4rem 8rem 2rem 4rem 4rem;
    justify-items: center;
    margin-bottom: 1rem;
  }

  .header__cart p {
    font-size: .8rem;
    font-weight: bold;
    color: var(--gray-200)
  }

  .card__container {
    height: auto;
    max-height: 500px;
    overflow: auto;
  }

  .cart__card {
    position: relative;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    display: grid;
    grid-template-columns: 4rem 8rem 2rem 4rem 4rem;
    align-items: center;
    justify-items: center;
  }

  .cart__card:not(:last-child) {
    border-bottom: 2px solid var(--gray-100);
  }

  .cart__card p {
    font-size: .9rem;
    color: var(--gray-200);
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

  .total__container {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .finish__purchase {
    margin-top: 1rem;
    width: 100%;
    height: 2.5rem;

    border: none;
    border-radius: 4px;

    background: var(--purple-100);
    color: var(---white);
    cursor: pointer;
    transition: all .3s;
  }

  .finish__purchase:hover {
    background: var(--purple-200);
  }
  
  .buy__more {
    border: 1px solid var(--purple-200);
    background: transparent;
    color: var(--purple-200);
    font-weight: bold;
    transition: all .3s;
  }

  .buy__more:hover {
    background: var(--purple-100);
    color: var(---white);
  }

  .cart__empty {
    height: 300px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .cart__empty p {
    margin-top: 1rem;
  }

  .modal__container {
    z-index: 2;
    position: fixed;
    width: 100%;
    height: 100vh;
    background: rgba(0,0,0,0.5);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal {
    width: 400px;
    height: 200px;
    background: var(---white);
    margin-bottom: 5rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    border: 5px solid var(--purple-100);
  }

  .modal strong {
    font-size: 1.3rem;
    color: var(--gray-200);
  }

  .modal p {
    font-size: 1rem;
    color: var(--gray-200);
  }  

  .modal button {
    width: 100%;
    height: 2rem;
    
    border: none;
    border-radius: 4px;
    background: var(--purple-100);
    color: var(---white);
    transition: all 0.3s;
    font-weight: bold;

    cursor: pointer;
  }

  .modal button:hover {
    background: var(--purple-200);
  }

  .show__errors {
    margin-top: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .show__errors span {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .show__errors p {
    width: 100%;
    padding: .7rem;
    font-size: 0.7rem;
    color: var(---white);
    background: var(--red-500);
    border-radius: 4px;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .show__errors p:not(:last-child) {
    margin-bottom: .7rem;
  }

  @media (max-width: 1200px) { 
    .purchase__content {
      max-width: 100%;
      display: flex;
      flex-direction: column;  
      align-items: center;
      justify-content: center;        
      padding: 1rem;
    } 

    .purchase__content h1 {
      margin: 0 0 2rem 0;
      color: var(--gray-200)
    }    

    .purchase {
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    .form__container {
      display: flex;
      margin-bottom: 2rem;
    }

    .cart__container {
      display: flex;
      flex-direction: column;
      margin: 0 auto;
    }

    .total__container {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .modal__container {
      padding: 1rem;
    }

    .modal strong {
      font-size: 1.3rem;
      color: var(--gray-200);
      text-align: center;
    }
    
    .modal p {
      font-size: 1rem;
      text-align: center;
      color: var(--gray-200);
    }      
  }

  @media (max-width: 768px) {
    .purchase__content {
      max-width: 100%;
      display: flex;
      flex-direction: column;
      padding: 1rem;
    } 

    .purchase__content h1 {
      margin: 0 0 2rem 0;
      color: var(--gray-200);
    }    

    .purchase {
      width: 100%;
      display: flex;
      flex-direction: column;
    } 

    .form__container {
      width: 100%;
    }

    .form__container .input__full {
      width: 100%
    }

    .form__container 
    .form__cpf, 
    .form__cel, 
    .form__city, 
    .form__state {
      width: 50%;
    }

    .form__container .form__cep {
      width: 50%;
    }  

    .form__container .form__end {
      width: 50%;
    }   

    .cart__container {
      margin-top: 2rem;
      margin: 0 auto;
      width: 100%;
    }     
  }
</style>