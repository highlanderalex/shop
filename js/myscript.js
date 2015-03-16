var app = angular.module("ShopApp", ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    .state('index', {
      url: "/",
      templateUrl: "templates/main.html"
    })
    .state('cart', {
      url: "/cart",
      templateUrl: "templates/cart.html"
    })
    .state('product', {
      url: "/product/{productId}",
      templateUrl: "templates/product.html",
	  controller: "ProductDetailCntr",
	  controllerAs:"detail"
	  
    })
    .state('order', {
      url: "/order",
      templateUrl: "templates/order.html"
    });
});

app.service("Products", function($http) {
  return {
	getProducts: function(callback) {
		$http.get('products.json').success(callback); 
	}
  }  
});

app.factory("AddCart", function(){
    return {
        addProduct: function(obj){
			//localStorage.removeItem('cart');
			var cartData = JSON.parse(localStorage.getItem('cart')) || {};
			if(cartData.hasOwnProperty(obj.id)){ // если такой товар уже в корзине, то добавляем +1 к его количеству
				cartData[obj.id]['count'] += 1;
			} else {
				cartData[obj.id] = obj;
			}
			
			localStorage.setItem('cart', JSON.stringify(cartData));
            alert('Product #' + obj.id + ' add to cart');
			//return counter;
        }
	}
	
});

app.factory("RemoveCart", function(){
	return {
		remove: function(id){
			var cartData = JSON.parse(localStorage.getItem('cart'));
			delete cartData[id];
			localStorage.setItem('cart', JSON.stringify(cartData));
			alert('Delete product #' + id);
		} 
	}
   
});

app.controller("CartCntr", function(AddCart, RemoveCart) {
	var cartData = AddCart;
	
	this.load = JSON.parse(localStorage.getItem('cart')) || 1;
	var totalprice = 0;
	var qty = 0;
	$.each(this.load, function(k, val) {
							totalprice += val.price*val.count;
							qty += val.count;
						});
	this.totalprice = totalprice;
	this.qty = qty;
	var removeData = RemoveCart;
	this.remove = function(id){
       return removeData.remove(id);
	};
	console.log(this.load);
	
});

app.controller("OrderCntr", function() {
	this.user = {};
	this.order = function(user) {
        this.user = angular.copy(user);
		alert('Your name: ' + this.user.name + ' your email: ' + this.user.email);
    };
});

app.controller("PostsDataCntr", function(Products, AddCart) {
	//localStorage.clear();
	var _this = this;
	products = Products.getProducts(function(result){
		_this.products = result;
		return _this.products;
	});
	var cart = AddCart;
	//console.log(cart);
	this.add = function(obj){
       return cart.addProduct(obj);
	}
	
	
	
});

app.controller("ProductDetailCntr", function ($stateParams, Products, AddCart) {
	var _this = this;
	products = Products.getProducts(function(result){
		_this.products = result;
		return _this.products;
	})
	this.id = $stateParams.productId;
	var cart = AddCart;
	//console.log(cart);
	this.add = function(obj){
       return cart.addProduct(obj);
	}
	//this.product = _this.products[id];
});

app.directive('headerShop', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      templateUrl: "templates/header.html"
  };
});

app.directive('menuShop', function() {
  return {
      restrict: 'AE',
      replace: 'true',
      templateUrl: "templates/menu.html"
  };
});