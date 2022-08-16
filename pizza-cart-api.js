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
          .then((result)=> {
            console.log(result.data);
            this.cartId = result.data.cart_code;
          });
      },
      createCart(){
        ///api/pizza-cart/create
        return axios
            .get('https://pizza-cart-api.herokuapp.com/api/pizza-cart/create?username=' + this.username)
      },
      showCart(){
        const url = `https://pizza-cart-api.herokuapp.com/api/pizza-cart/${this.cartId}/get`;
         axios
             .get(url)
             .then( (result)=>{
              this.cart = result.data;
             });
      },
      featuredPizzas(){
        //Get a list of featured pizzas
        return axios
            .get('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
      },
      postfeaturedPizzas(){
        //Get a list of featured pizzas
        return axios
            .post('https://pizza-cart-api.herokuapp.com/api/pizzas/featured')
            .then(()=>{
              
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

     
            
 


      message: 'PIZZAS',     
      username:'Obiora',
      pizzas: [],
      cartId: '',
      cart: {total : 0 }, 
      paymentMessage:'',
      payNow: false,
      paymentAmount: 0,



      add(pizza) {
        // to be able to add a pizza to the cart I need cart Id...
        const params = {
          cart_code: this.cartId,
          pizza_id: pizza.id

        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/add', params)
          .then(() => {
            this.message = "Pizza ordered"
            this.showCart() ;

            })
           
          .catch(err => alert(err));
        // alert(pizza.id)  
      },
      remove(pizza){
        // /api/pizza-cart/remove
        const params = {
          cart_code : this.cartId,
          pizza_id : pizza.id
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/remove', params)
          .then(()=>{
            this.message= "Pizza dropped from the cart"
            this.showCart();
          })
          .catch(err=>alert(err));

      },
      pay(pizza){
        const params = {
          cart_code : this.cartId,
        
        }

        axios
          .post('https://pizza-cart-api.herokuapp.com/api/pizza-cart/pay', params)
          .then(()=>{
              if(!this.paymentAmount){
                  this.paymentMessage = 'No Amount. Enter Cart Total, Please!'
              }
              else if(this.paymentAmount >= this.cart.total.toFixed(2)){
                  this.paymentMessage = 'Payment Sucessful!'
                  this.message= this.username  +" Paid!"
                  setTimeout(() => {
                      this.cart.total = ''
                  }, 7000);
  
              }else{
                  this.paymentMessage = 'Insufficient fund!'
                  setTimeout(() => {
                      this.cart.total = ''
                  }, 4000);
              }
          
          })
          .catch(err=>alert(err));
            
      },
    
    }
      

    })
  });
