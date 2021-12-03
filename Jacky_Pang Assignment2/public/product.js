//Description: Array that contains all five products with price, descr, image,. and quantity available.
//Jacky Pang 11/30/2021
//Alright Gotta remake the entire website Shit keep givin me module missing or overflow erros TF? - Jacky 
var products = [
    {
        "name": "Fate",
        "price": 9.99,
        "description": "Fate Unlimited Blade Works",
        "image": "./images/Fate.png",
        "quantity_available": 6
        },
        {
        "name": "Gojo",
        "price": 9.99,
        "description": "From Jujutsu Kaisem Mappa animation",
        "image": "./images/Gojo.jpg",
        "quantity_available": 6
        },
        {
        "name": "Lance",
        "price": 12.99,
        "description": "Brave Frontier from Grand Gaia",
        "image": "./images/Lance.png",
        "quantity_available": 6
        },
        {
        "name": "Demon Slayer Fan Art",
        "price": 9.99,
        "description": "Tanjiro from demon slaer.",
        "image": "./images/DemonSlayer.png",
        "quantity_available": 6
        },
      
        {
          "name": "Unicorn",
          "price": 8.99,
          "description": "For all Space, Sci-fi and mech fans",
          "image": "./images/Unicorn.jpg",
          "quantity_available": 6
        },
        {
          "name": "Susanoo",
          "price": 7.99,
          "description": "God of destruction from Blazblue",
          "image": "./images/GreenDude.png",
          "quantity_available": 6
          }
 ];
 
 if(typeof module != 'undefined') {
     module.exports = products;
 }