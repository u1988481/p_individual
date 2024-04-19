import { options } from "./options.js"
export var game = function(){
    const back = '../resources/back.png';
    const resources = ['../resources/cb.png', '../resources/co.png', '../resources/sb.png','../resources/so.png', '../resources/tb.png','../resources/to.png'];
    const card = {
        current: back,
        clickable: true,
        goBack: function (){
            setTimeout(() => {
                this.current = back;
                this.clickable = true;
                this.callback();
            }, 1000);
        },
        goFront: function (){
            this.current = this.front;
            this.clickable = false;
            this.callback();
        }
    };

    var lastCard;
    var pairs = 2;
    var points = 100;
    var difficulty = "normal";
    
    return {
        init: function (call){
            pairs = options.getPairs();
            difficulty = options.getDiff();
            var items = resources.slice(); // Copiem l'array
            items.sort(() => Math.random() - 0.5); // Aleatòriament
            items = items.slice(0, pairs); // Agafem els primers
            items = items.concat(items);
            items.sort(() => Math.random() - 0.5); // Aleatòriament
            
            var cards = []; // Creem un array per emmagatzemar les cartes
            
            // Creem les cartes amb la cara cap amunt
            items.forEach((item, index) => {
                const newCard = Object.create(card, {front: {value:item}, callback: {value:call}});
                newCard.pointer = $('#c' + index); // Assignem l'element DOM corresponent
                newCard.goFront(); // Mostrem la carta amb la cara cap amunt
                cards.push(newCard); // Afegim la carta a l'array
            });
            
            // Girem totes les cartes cap enrere després d'una temps
            var temps;
            if(difficulty == "easy")temps = 2000;
            else if(difficulty == "normal")temps = 1000;
            else if(difficulty == "hard") temps = 100; 
            setTimeout(() => {
                cards.forEach(card => {
                    card.goBack(); // Girem la carta cap enrere
                });
            }, temps);
            
            return cards; // Retornem l'array de cartes
        },
        click: function (card) {
            if (!card.clickable) return;
            card.goFront();
            if (lastCard){ //Segona carta
                if (card.front === lastCard.front){
                    pairs--;
                    console.log("parella trobada!");
                    if (pairs <= 0){
                        alert("Has guanyat amb " + points + " punts!");
                        window.location.replace("../");
                    }
                }
                else{
                    [card, lastCard].forEach(c=>c.goBack());
                    if(difficulty == "easy") points-=15;
                    else if(difficulty == "normal") points-=25;                    
                    else points-=50;
                    if (points <= 0){
                        alert ("Has perdut");
                        window.location.replace("../");
                    }
                }
                lastCard = null;
                console.log(points);
            }
            else lastCard = card; // Primera carta
        }
    }
}();