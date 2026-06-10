const pokemonImage = document.getElementById("pokemonImage");
const pokemonName = document.getElementById("pokemonName");
const pokemonId = document.getElementById("pokemonId");
const pokemonType = document.getElementById("pokemonType");
const pokemonHeight = document.getElementById("pokemonHeight");
const pokemonWeight = document.getElementById("pokemonWeight");
const pokemonAbilities = document.getElementById("pokemonAbilities");
const pokemonScreen = document.getElementById("pokemonScreen");
const statsContainer = document.getElementById("stats");
const catalog = document.getElementById("pokemonCatalog");
const favoriteBtn = document.getElementById("favoriteBtn");
const favoritesList = document.getElementById("favoritesList");


let pokemonAtual = null;
let todosPokemons = [];

let favoritos =
JSON.parse(localStorage.getItem("favoritos")) || [];

/* ===========================
   TIPOS EM PORTUGUÊS
=========================== */

const tiposPT = {

    normal: "Normal",
    fire: "Fogo",
    water: "Água",
    electric: "Elétrico",
    grass: "Planta",
    ice: "Gelo",
    fighting: "Lutador",
    poison: "Veneno",
    ground: "Terra",
    flying: "Voador",
    psychic: "Psíquico",
    bug: "Inseto",
    rock: "Pedra",
    ghost: "Fantasma",
    dragon: "Dragão",
    dark: "Sombrio",
    steel: "Aço",
    fairy: "Fada"

};

/* ===========================
   CORES DOS TIPOS
=========================== */

const cores = {

    fire:
    "linear-gradient(135deg,#ff9800,#ff5722,#f44336)",

    water:
    "linear-gradient(135deg,#2196f3,#03a9f4,#00bcd4)",

    grass:
    "linear-gradient(135deg,#4caf50,#8bc34a,#cddc39)",

    electric:
    "linear-gradient(135deg,#ffd600,#ffeb3b,#fff176)",

    psychic:
    "linear-gradient(135deg,#e91e63,#f06292,#f8bbd0)",

    ice:
    "linear-gradient(135deg,#81d4fa,#b3e5fc,#e1f5fe)",

    dragon:
    "linear-gradient(135deg,#673ab7,#512da8,#311b92)",

    ground:
    "linear-gradient(135deg,#795548,#8d6e63,#a1887f)",

    rock:
    "linear-gradient(135deg,#8d6e63,#6d4c41,#5d4037)",

    bug:
    "linear-gradient(135deg,#8bc34a,#689f38)",

    poison:
    "linear-gradient(135deg,#9c27b0,#7b1fa2)",

    ghost:
    "linear-gradient(135deg,#5c6bc0,#3949ab)",

    dark:
    "linear-gradient(135deg,#424242,#212121)",

    fairy:
    "linear-gradient(135deg,#f8bbd0,#ec407a)",

    steel:
    "linear-gradient(135deg,#90a4ae,#607d8b)",

    flying:
    "linear-gradient(135deg,#64b5f6,#90caf9)",

    fighting:
    "linear-gradient(135deg,#e53935,#b71c1c)",

    normal:
    "linear-gradient(135deg,#bdbdbd,#9e9e9e)"

};

/* ===========================
   BUSCAR POKÉMON
=========================== */

async function buscarPokemon(nome = null){

    const pesquisa =
    nome ||
    document
        .getElementById("pokemonInput")
        .value
        .toLowerCase();

    if(!pesquisa) return;

    try{

        const resposta =
        await fetch(
        `https://pokeapi.co/api/v2/pokemon/${pesquisa}`
        );

        const dados =
        await resposta.json();

        pokemonAtual = dados;

        preencherPokemon(dados);

    }
    catch{

        alert("Pokémon não encontrado!");

    }

}

/* ===========================
   PREENCHER CARD
=========================== */

function preencherPokemon(dados){

    pokemonImage.src =
    dados.sprites.other["official-artwork"]
    .front_default;

    pokemonName.textContent =
    dados.name.charAt(0).toUpperCase() +
    dados.name.slice(1);

    pokemonId.textContent =
    `#${dados.id}`;

    const tipos = dados.types.map(
        tipo => tiposPT[tipo.type.name]
    );

    pokemonType.textContent =
    "Tipo: " + tipos.join(" / ");

    pokemonHeight.textContent =
    `Altura: ${dados.height / 10} m`;

    pokemonWeight.textContent =
    `Peso: ${dados.weight / 10} kg`;

    pokemonAbilities.textContent =
    "Habilidades: " +
    dados.abilities
    .map(h =>
        h.ability.name
        .replace("-", " ")
    )
    .join(", ");

    const tipoPrincipal =
    dados.types[0].type.name;

    pokemonScreen.style.background =
    cores[tipoPrincipal] ||
    "#dcedc8";

    criarStats(dados.stats);

}

/* ===========================
   STATS
=========================== */

function criarStats(stats){

    statsContainer.innerHTML = "";

    stats.forEach(stat => {

        const valor = stat.base_stat;

        const largura =
        (valor / 255) * 100;

        statsContainer.innerHTML += `
        
        <div class="stat">

            <div class="stat-name">
                ${traduzirStat(stat.stat.name)}
                (${valor})
            </div>

            <div class="bar">

                <div
                    class="fill"
                    style="width:${largura}%"
                ></div>

            </div>

        </div>

        `;

    });

}

function traduzirStat(stat){

    const nomes = {

        hp:"HP",

        attack:"Ataque",

        defense:"Defesa",

        "special-attack":
        "Ataque Especial",

        "special-defense":
        "Defesa Especial",

        speed:"Velocidade"

    };

    return nomes[stat] || stat;

}

/* ===========================
   FAVORITOS
=========================== */

favoriteBtn.addEventListener(
"click",
() => {

    if(!pokemonAtual) return;

    const existe =
    favoritos.find(
    p => p.id === pokemonAtual.id
    );

    if(existe){

        favoritos =
        favoritos.filter(
        p => p.id !== pokemonAtual.id
        );

    }else{

        favoritos.push({

            id:pokemonAtual.id,

            nome:pokemonAtual.name,

            imagem:
            pokemonAtual.sprites.other[
            "official-artwork"
            ].front_default

        });

    }

    salvarFavoritos();

}
);

function salvarFavoritos(){

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    renderizarFavoritos();

}

function renderizarFavoritos(){

    favoritesList.innerHTML = "";

    favoritos.forEach(pokemon => {

        favoritesList.innerHTML += `

        <div
            class="pokemon-card"
            onclick="buscarPokemon('${pokemon.id}')"
        >

            <img src="${pokemon.imagem}">

            <h3>
                ${pokemon.nome}
            </h3>

        </div>

        `;

    });

}

/* ===========================
   CATÁLOGO
=========================== */

async function carregarCatalogo(){

    catalog.innerHTML = "";

    for(let i = 1; i <= 151; i++){

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${i}`
        );

        const pokemon = await resposta.json();

        todosPokemons.push(pokemon);

        const tipo = pokemon.types[0].type.name;

        catalog.innerHTML += criarCardPokemon(
            pokemon,
            tipo
        );

    }

}

function criarCardPokemon(pokemon, tipo){

    return `

    <div
        class="pokemon-card"
        onclick="buscarPokemon(${pokemon.id})"
    >

        <img
            src="${pokemon.sprites.other["official-artwork"].front_default}"
            alt="${pokemon.name}"
        >

        <h3>
            ${pokemon.name}
        </h3>

        <div
            class="pokemon-type"
            style="background:${cores[tipo]}"
        >

            ${tiposPT[tipo]}

        </div>

    </div>

    `;

}

/* ===========================
   ENTER PARA PESQUISAR
=========================== */

document
.getElementById("pokemonInput")
.addEventListener(
"keypress",
function(e){

    if(e.key === "Enter"){

        buscarPokemon();

    }

}
);

/* ===========================
   INICIALIZAÇÃO
=========================== */

renderizarFavoritos();

carregarCatalogo();

buscarPokemon(25);

/* ===========================
   FILTRAR POR TIPO
=========================== */

function filtrarTipo(tipo){

    catalog.innerHTML = "";

    let lista = todosPokemons;

    if(tipo !== "all"){

        lista = todosPokemons.filter(
            pokemon =>

            pokemon.types.some(
                t => t.type.name === tipo
            )
        );

    }

    lista.forEach(pokemon => {

        const tipoPrincipal =
        pokemon.types[0].type.name;

        catalog.innerHTML += criarCardPokemon(
            pokemon,
            tipoPrincipal
        );

    });

}