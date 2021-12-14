//Description: Array that contains all five products with price, descr, image,. and quantity available.
//Jacky Pang 11/30/2021
//Alright Gotta remake the entire website Shit keep givin me module missing or overflow erros TF? - Jacky 
products = [
    {
      "name": "Pantheon The Aspect of War",
      "price": 9.99,
      "description": "A spartan warrior with a vengance to the gods",
      "image": "./images/Fate.png",
      "quantity_available": 6
      },
      {
      "name": "Tryndamere: The Barbarian King",
      "price": 9.99,
      "description": "Angry man that is to angry to die",
      "image": "./images/Gojo.jpg",
      "quantity_available": 6
      },
      {
      "name": "Braum The Frejlord Strongman",
      "price": 12.99,
      "description": "Shielder for the weak and mustache for the righteous",
      "image": "./images/Lance.png",
      "quantity_available": 6
      },
      {
      "name": "Caityln : The Piltover Sherriff",
      "price": 9.99,
      "description": "The enforcer and the Piltover sniper",
      "image": "./images/DemonSlayer.png",
      "quantity_available": 6
      },
    
      {
        "name": "Nautlis: The ancient water giant",
        "price": 8.99,
        "description": "All will pay the ocean, it's tilthe",
        "image": "./images/Unicorn.jpg",
        "quantity_available": 6
      },
      {
        "name": "Sion: The Undead Juggernaut ",
        "price": 7.99,
        "description": "Denied Oblivion, he was resurrected to serve his empire even in depth",
        "image": "./images/GreenDude.png",
        "quantity_available": 6
        }
];
 
 if(typeof module != 'undefined') {
     module.exports = products;
 }