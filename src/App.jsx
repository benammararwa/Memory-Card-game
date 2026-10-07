import { useEffect } from 'react'
import { useState } from 'react'
import Card from './components/Card.jsx'
import './App.css'
import {shuffleCards} from './utils/shuffle.js'

function App() {
    const [score, setScore] = useState({currentScore: 0, bestScore: 0})
    const [cards, setCards] = useState([])
    const [clicked, setClicked] = useState([])

    useEffect(() => {
        const pokemonsIds = [1, 5, 13, 18, 21, 25, 33, 38, 41];

        async function getPokemons(id) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            return await response.json();
        }

        async function fetchAll() {
            const pokemons = await Promise.all(pokemonsIds.map(async (pokemonId) => {
                const pokemon = await getPokemons(pokemonId);
                return {
                    id: pokemon.id,
                    name: pokemon.name,
                    image: pokemon.sprites.other['official-artwork'].front_default
                }
            }))

            setCards(pokemons);
        }

        fetchAll();
        

    }, [])

    
    function handleChange(pokemonId) {
        setCards(shuffleCards(cards))
        if (clicked.includes(pokemonId)) {
            setScore({ ...score, currentScore: 0 });
            setClicked([])
        } else {
            const newScore = score.currentScore + 1;
            const newBestScore = newScore > score.bestScore ? newScore : score.bestScore;
            setScore({ currentScore: newScore, bestScore: newBestScore });
            setClicked([...clicked, pokemonId]);
        }
         
    }

    return (
        <div className="body">
            <div className="header">
                <h1>Card Memory Game</h1>
                <p>Rules: Do not choose the same card twice</p>
                <p>Score: {score.currentScore}  Best score: {score.bestScore}</p>
                {cards.length > 0 && score.currentScore === cards.length && (
                    <p className="congrats">Congratulations, you win !</p>
                )}
            </div>
            
            <div className="cards">
                {cards.map((card) => (
                    <Card key={card.id} pokemon={card} onClick={() => handleChange(card.id)}/>
                ))}
            </div>
        </div>
        

    )
    
}

export default App
