import {useEffect, useState} from "react";
import axios from "axios";

async function getNewsFromApi() {
    return await axios.get(
        (import.meta.env.VITE_NEWS_API_URL + import.meta.env.VITE_NEWS_API_KEY),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
}

interface IArticles {
    author: string | null,
    description: string,
    title: string | undefined,
    url: string | null,
    urlToImage: string
}

const NewsPage = () => {
    const [articles, setArticles] = useState<IArticles[]>([]);
    useEffect(() => {
        getNewsFromApi().then(value => {
            setArticles(value.data.articles)
            console.log(value.data as string);
        });
    }, [])

    return (
        <div
            className='box-border'>
            <h2 className='mt-0 mx-0 mb-[30px] p-0 text-white text-center text-4xl'>News</h2>
            {
                articles.map((article, index) =>
                    <a key={index}
                       className="relative m-[25px] h-[400px] w-[360px] bg-[#222831] text-[#ffffff] rounded-2xl overflow-hidden float-left"
                       href={article.url ?? undefined}>
                        <div>
                            <div className="bg-[#f1f2f3] flex h-[215px]">
                                <img src={article.urlToImage} alt="no image" className='object-cover w-full h-full'/>
                            </div>
                            <div className="pt-3 p-[10px] bg-[#222831] h-min">
                                <label className="text-2xl">{article.title} - by {article.author}</label>
                                <div className="card-text">
                                    {article.description}
                                </div>
                            </div>
                        </div>
                    </a>)
            }
        </div>
    );
};

export default NewsPage;
