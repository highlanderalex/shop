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

//Сервис для получения данных
app.service("Products", function($http) {
  return {
	getProducts: function(callback) {
		$http.get('products.json').success(callback); 
	}
  }  
});

//Фабрика для работы с корзиной
app.factory("Cart", function(){
    var mycart={"count":0,
				"arr": new Array(),
				"addToCart": null,
				"delFromCart": null,
				"setStorage": null,
				"getStorage": null
	  };
	  
	  mycart.addToCart=function (exp,count){
			var obj = {
						'exp': exp,
						'count': count
					  };
		var flag = true;
		
		this.arr.forEach(function(entry) {
			if(null !== entry){
				if(entry.exp.id == obj.exp.id){ 
					if(entry.count == obj.count) {
						flag = false;
						return;
					}
					else {
						entry.count = obj.count;
						flag = false;
						return;
					}
				}
			}
		});
		
		if(flag === true){
		
			this.arr.push(obj);
			alert('Product #' + exp.id + ' add to cart');
		} else {
		alert('Product #' + exp.id + ' exist to cart');
		}
		this.count=this.arr.length;
		this.setStorage();
	  }
  
	mycart.delFromCart= function (index)
	{
			this.arr.splice(index,1);
			this.count=this.arr.length;
			this.setStorage();
	}
	
	mycart.setStorage = function ()
	{	
		var tempArr = {
						"count":this.count,
						"arr":this.arr
					  };
		window.localStorage.alexcart = JSON.stringify(tempArr);	
	}
	
	mycart.getStorage = function () {
		
		if(this.count > 0){
			return;
		}
		
		
		if( typeof(window.localStorage.alexcart) == "string"){
			var temp = $.parseJSON('[' + window.localStorage.alexcart + ']');
			if(typeof(temp[0].count) == "number"){
				temp[0].arr.forEach(function(entry) {
					mycart.addToCart(entry.exp, entry.count);
				});	
			}
		}		
	} 
	
	
	mycart.clear= function(){
		this.arr= new Array();
		this.count=0;
		this.setStorage();
	}
	
  return mycart;
	
});


//Контроллер корзины
app.controller("CartCntr", function(Cart) {
	
	Cart.getStorage(); 
	this.cart = Cart;
	   
	   this.items = Cart.arr;
		
		
		this.total= function ()
		{
			var total = 0;
			this.items.forEach(function(item) {
				total += item.exp.price * item.count;
			})
			Cart.setStorage();
			return total;
		}
		
		this.remove = function (index){
			
			Cart.delFromCart(index);
			if(0 == Cart.count) {
				document.location.href = 'index.html#/';
			}
		}
	
});

//Контроллер заказа
app.controller("OrderCntr", function(Cart) {
	   this.error = ''; 
	   this.name = '';
	   this.email = '';
	   this.male = 'male';
	   this.phone = '';
	   	
	   this.order = function (form)
	   {
			
		   if(form.$valid){
				Cart.getStorage(); 
				this.cart = Cart;
				this.items = Cart.arr;
				this.total= function (){
					var total = 0;
					this.items.forEach(function(item) {
						total += item.exp.price * item.count;
					})
					return total;
				}
				alert('Thanks for your purchases \nProducts: ' + this.cart.count + ' Total: $' + this.total());
				document.location.href = 'index.html#/';
				Cart.clear();
				
			}
		}
});

//Контроллер главной страницы
app.controller("PostsDataCntr", function(Products, Cart) {
	var _this = this;
	products = Products.getProducts(function(result){
		_this.products = result;
		return _this.products;
	});
	var myCart = Cart;
	this.buy = function(obj){		
		myCart.addToCart(obj,1);
	}
	
});

//Контроллер отдельного продукта
app.controller("ProductDetailCntr", function ($stateParams, Products, Cart) {
	var _this = this;
	products = Products.getProducts(function(result){
		_this.products = result;
		return _this.products;
	})
	this.id = $stateParams.productId;
	
	var myCart = Cart;
	this.buy = function(obj){		
		myCart.addToCart(obj,1);	
	}
	
});

//Директивы
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