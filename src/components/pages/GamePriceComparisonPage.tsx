import {ChangeEvent, useEffect, useState} from "react";
import {TextField} from "@mui/material";

async function getNewsFromApi(gamesSearch: string) {
    const requestOptions = {
        method: 'GET',
        redirect: 'follow' as RequestRedirect,
    };

    return fetch(import.meta.env.VITE_GAME_SEARCH_API_URL + gamesSearch, requestOptions)
}

interface IGames {
    gameID: string;
    steamAppID: string | null;
    cheapest: string;
    cheapestDealID: string;
    external: string;
    internalName: string;
    thumb: string;
}

const GamePriceComparisonPage = () => {
    const [gamesSearch, setGamesSearch] = useState<string>("");
    const [games, setGames] = useState<IGames[]>([]);
    useEffect(() => {
        getNewsFromApi(gamesSearch)
            .then(response => response.text())
            .then(result => {
                setGames(JSON.parse(result))
            })
            .catch(error => console.log('error', error));
    }, [gamesSearch])

    return (
        <div
            className='items-center'>
            <h2 className='mt-5 mx-0 mb-[20px] p-0 text-white text-center text-4xl'>הנחות על משחקים</h2>
            <div className="w-full flex justify-center items-center">
                <TextField className='w-[400px]' label="חיפוש משחק" variant="outlined"
                           onChange={(event: ChangeEvent<HTMLInputElement>) => {
                               setGamesSearch(event.target.value);
                           }}/>
            </div>
            {gamesSearch !== "" &&
                <div className='flex flex-wrap justify-center items-center mt-5'>
                    {
                        games.map((game, index) =>
                            <div key={index} className="group relative overflow-hidden rounded-lg">
                                <img
                                    src={game.thumb}
                                    alt={game.external}
                                    className="w-full h-48 object-cover transition duration-500 group-hover:scale-110"
                                />
                                <div
                                    className="absolute inset-0 bg-gradient-to-t from-gray-900 opacity-0 group-hover:opacity-75"></div>
                                <div className="absolute bottom-0 inset-x-0 p-4 text-white group-hover:text-gray-200">
                                    <h3 className="font-bold mb-2">{game.external}</h3>
                                    <p className="line-clamp-2">{game.internalName}</p>
                                    <p>Cheapest: ${game.cheapest}</p>
                                    <a href={import.meta.env.VITE_GAME_ID_URL + game.cheapestDealID}
                                       className="inline-block mt-2 px-3 py-1 rounded-full bg-gray-800 hover:bg-gray-700">
                                        Cheapest Deal
                                    </a>
                                </div>
                            </div>)
                    }
                </div>}
        </div>
    );
};

export default GamePriceComparisonPage;
