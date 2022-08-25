document.addEventListener('alpine:init', () => {
  Alpine.data('pizzaCartWithAPIWidget', function () {
    return {
      init() {

        // alert( 'Pizza cart loading...')
        // call the  ApI to get all the pizzas
        axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas')
          .then((result) => {
            console.log(result.data);
            this.pizzas = result.data.pizzas
          })
          .then(() => {
            return this.createCart();

          })
          .then((result) => {
            console.log(result.data);
            this.cartId = result.data.cart_code;
          });
      },
      createCart() {
        ///api/pizza-cart/create
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },
      showCart() {
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
        axios
          .get(url)
          .then((result) => {
            this.cart = result.data;
          });
      },
      featuredPizzas() {
        //Get a list of featured pizzas
        return axios
          .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },
      postfeaturedPizzas() {
        //Get a list of featured pizzas
        return axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
          .then(() => {

            for (let i = 0; i < 4; i++) {
              return !this.postfeaturedPizzas();
            }

          })
      },
      //  ActiveUser(){
      //   const url = 'https://pizza-cart-api.herokuapp.com/api/pizza-cart/username/:username/active';
      //    axios
      //        .get(url)
      //        .then( (result)=>{
      //         result.data.status;
      //        });
      //       },

      pizzaImage(pizza) {
        return `./img/${pizza.size}.png`
      },






      message: 'AFFORDABLE PIZZAS ',
      username: 'Obiora',
      pizzas: [],
      cartId: '',
      cart: { total: 0 },
      paymentMessage: '',
      payNow: false,
      paymentAmount: 0,
      show: false,



      add(pizza) {
        // to be able to add a pizza to the cart I need cart Id...
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id

        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
          .then(() => {
            this.message = "You ordered pizza added to the cart"
            this.showCart();

          })

          .catch(err => alert(err));
        // alert(pizza.id)  
      },
      remove(pizza) {
        // /api/pizza-cart/remove
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(() => {
            this.message = "pizza removed from the cart"
            this.showCart();
          })
          .catch(err => alert(err));

      },
      pay(pizza) {
        const params = {
          cart_code: this.cartId,

        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(() => {
            if (!this.paymentAmount) {
              this.paymentMessage = 'No amount entered, Check Cart Total!'
            }
            else if (this.paymentAmount >= this.cart.total) {
              this.paymentMessage = 'Payment Sucessful, Enjoy Your Pizza!'
              this.message = this.username + " Paid!"
              setTimeout(() => {
                this.cart.total = '';
                this.cart.total = 0;
                this.paymentMessage = '';
                this.paymentAmount = 0;
                this.message = '';
                window.location.reload()


              }, 2000);

            } else {
              this.paymentMessage = 'Insufficient fund!'
              setTimeout(() => {
                this.cart.total = ''
              }, 2000);
            }

          })
          .catch(err => alert(err));

      },

    }


  })
});
