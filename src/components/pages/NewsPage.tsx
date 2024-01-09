import axios from "axios";
import {useEffect, useState} from "react";

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
            <h2 className='mt-5 mx-0 mb-[20px] p-0 text-white text-center text-4xl'>חדשות</h2>
            <div className='flex flex-wrap justify-center items-center'>
                {
                    articles.map((article, index) =>
                        <a key={index}
                           className="relative m-[20px] h-[400px] w-[360px] bg-[#222831] text-[#ffffff] rounded-2xl overflow-hidden float-left"
                           href={article.url ?? undefined}>
                            <div>
                                <div className="bg-[#f1f2f3] flex h-[215px]">
                                    <img src={article.urlToImage} alt="no image" className='object-cover w-full h-full'/>
                                </div>
                                <div className="pt-3 p-[10px] bg-[#222831] h-min">
                                    <label className="text-gray-50">{article.title} - by {article.author}</label>
                                    <div className="card-text text-blue-50">
                                        {article.description}
                                    </div>
                                </div>
                            </div>
                        </a>)
                }
            </div>
        </div>
    );
};

export default NewsPage;
