var cont =1;
let ct=1;
yn = 0;

function traduce(){
    let parrafo = document.getElementById("p1");

    if (cont % 2 === 0){
        parrafo.innerHTML ="A cat café (猫カフェ?) is a public establishment where customers can play with or observe cats. It typically serves coffee or tea, and some have a reading area. Customers pay an entrance fee, usually for a specific time period.";
    }
    else{
        parrafo.innerHTML ="Un cat café (猫カフェ) es un establecimiento público donde los clientes pueden jugar con gatos u observarlos. Por lo general, sirve café o té, y algunos también cuentan con un área de lectura. Los clientes pagan una cuota de entrada, normalmente por un periodo de tiempo específico.";
    }

    parrafo = document.getElementById("where");

    if (cont % 2 === 0){
        parrafo.innerHTML ="Where to visit";
    }
    else{
        parrafo.innerHTML ="A donde ir";
    }

    parrafo = document.getElementById("other");

    if (cont % 2 === 0){
        parrafo.innerHTML ="You can visit more cat cafes in CDMX visiting <a href=\"https://www.dondeir.com/listas/descubre-6-lugares-para-tomar-cafe-rodeada-de-gatitos-en-mexico/\">this</a>";
    }
    else{
        parrafo.innerHTML ="Puedes visitar más cafés de gatos en la CDMX visitando <a href=\"https://www.dondeir.com/listas/descubre-6-lugares-para-tomar-cafe-rodeada-de-gatitos-en-mexico/\">aqui</a>";
    }
    parrafo = document.getElementById("p2");

    if (cont % 2 === 0){
        if (yn === 0){
            parrafo.innerHTML ="If your love for cats is so great that you could even eat at the same table with them, this place is for you. It's called Catfecito in the Condesa neighborhood. At this establishment, felines are the absolute stars. But before you're literally by their side, you should know the <b>rules: no feeding them human food, no pulling their tails or ears, and no bothering them, among others.</b> Upon entering, you'll see a small boutique on the right where you'll find all kinds of cat-themed jewelry: earrings, necklaces, rings, as well as mugs and keychains. There are also pictures of cats for sale on the walls.";
        }
        else {
            parrafo.innerHTML ="Meow Cat Café is a cat-themed café located in Condesa, Mexico City, where visitors can enjoy food and drinks in a cozy environment surrounded by rescued cats. The café offers a unique experience for cat lovers, since guests can relax, spend time with the cats, and learn more about their care. In addition, Meow Cat Café promotes responsible adoption and supports animal welfare, making it both an entertaining and meaningful place to visit.";
        }
    }
    else{
        if (yn === 0){
            parrafo.innerHTML ="Si tu amor por los gatos es tan grande que incluso podrías comer en la misma mesa con ellos, este lugar es para ti. Se llama Catfecito y está en la colonia Condesa. En este establecimiento, los felinos son las verdaderas estrellas. Pero antes de estar literalmente a su lado, debes conocer las <b>reglas: no darles comida humana, no jalarles la cola ni las orejas, y no molestarlos, entre otras.</b> Al entrar, verás a la derecha una pequeña boutique, donde encontrarás todo tipo de joyería temática de gatos: aretes, collares y anillos, así como tazas y llaveros. También hay fotografías de gatos a la venta en las paredes.";
        }
        else {
            parrafo.innerHTML ="Meow Cat Café es una cafetería temática de gatos ubicada en Condesa, Ciudad de México, donde los visitantes pueden disfrutar de comida y bebidas en un ambiente acogedor rodeado de gatos rescatados. La cafetería ofrece una experiencia única para los amantes de los gatos, ya que los visitantes pueden relajarse, pasar tiempo con ellos y aprender más sobre su cuidado. Además, Meow Cat Café promueve la adopción responsable y apoya el bienestar animal, convirtiéndose así en un lugar entretenido y significativo para visitar.";
        }
    }
    cont++;
}

function next(){
    if(ct===0){
        img=document.getElementById("gcafe");
        parrafo=document.getElementById("p2");
        img.src ="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/17/ca/f6/48/has-llegado-al-mejor.jpg?w=600&h=400&s=1"
        parrafo.innerHTML = "If your love for cats is so great that you could even eat at the same table with them, this place is for you. It's called Catfecito in the Condesa neighborhood.At this establishment, felines are the absolute stars. But before you're literally by their side, you should know the <b>rules: no feeding them human food, no pulling their tails or ears, and no bothering them, among others.</b>Upon entering, you'll see a small boutique on the right where you'll find all kinds of cat-themed jewelry: earrings, necklaces, rings, as well as mugs and keychains. There are also pictures of cats for sale on the walls."
        ct++;
        yn=0;
    }
    else if(ct===1){
        img=document.getElementById("gcafe");
        parrafo=document.getElementById("p2");
        img.src ="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQriAcGAnzy0dHSmGWSXElwumbbrEJQv1kPow&s"
        parrafo.innerHTML ="Meow Cat Café is a cat-themed café located in Condesa, Mexico City, where visitors can enjoy food and drinks in a cozy environment surrounded by rescued cats. The café offers a unique experience for cat lovers, since guests can relax, spend time with the cats, and learn more about their care. In addition, Meow Cat Café promotes responsible adoption and supports animal welfare, making it both an entertaining and meaningful place to visit."
        ct=0;
        yn=1;
    }
    
    
}
function surpriseCat(){
    cat=document.getElementById("cuteCat");
    audio=document.getElementById("meow")

    cat.style.display = "block";

    audio.currentTime = 0;
    audio.play();

    setTimeout(() => {
        cat.style.display = "none";
    }, 2000); // 2000 ms = 2 segundos
}