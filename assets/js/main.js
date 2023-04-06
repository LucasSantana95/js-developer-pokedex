const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const divModal = document.getElementById('detail-pokemon-modal')
const closeModalButton = document.getElementById('close-modal')

const maxRecords = 151
const limit = 10
let offset = 0;
let selectedPokemonID
let selectedPokemon

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})
pokemonList.addEventListener('click', (e)=>{
    if(e.target.closest('li')){
        if(e.target.closest('li').id){
            selectedPokemonID = e.target.closest('li').id
            pokeApi.getPokemons(selectedPokemonID-1,1).then(result => {
                selectedPokemon = result[0]
                createModal()
            })
        }
    }
    
})
closeModalButton.addEventListener('click', ()=>{
    divModal.lastElementChild.remove()
    divModal.setAttribute('class', 'hidden')
})


const createModal = () =>{
    const modal = document.createElement('div')
    modal.setAttribute('class', `modal-container ${selectedPokemon.type}`)
    const modalInfos = `
        <h1>${selectedPokemon.name}</h1>
        <img src="${selectedPokemon.photo}">
        <span>Número: #${selectedPokemon.number}</span>
        <span>Tipo: ${selectedPokemon.type}</span>
        <span>Peso: ${selectedPokemon.weight}</span>
        <span>Altura: ${selectedPokemon.height}</span>
        <span>Habilidades: ${selectedPokemon.abilities.map((e)=>{return e.ability.name})}</span>
        <span>Status:</span>
        <ul>
            ${selectedPokemon.stats.map((e)=>{
                return `
                        <li>${e.stat.name} : ${e.base_stat}</li>
                        <div class="${e.stat.name} bar" style="width: ${e.base_stat}px"></div>
                        `
            })}
        </ul>
        `

    modal.innerHTML = modalInfos
    divModal.appendChild(modal)
    divModal.setAttribute('class', 'modal')
}