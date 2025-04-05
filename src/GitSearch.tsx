import { useState } from "react";
import axios from "axios";
import { GithubRepo } from "./types";
import { toast } from "react-toastify";

const GitSearch = () => {
    const [query, setQuery] = useState("");
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const fetchRepos = async (searchQuery = query, pageNum = 1) => {
        if (!searchQuery) {
            toast("Please enter a search term.");
            return;
        };
        setLoading(true);

        try {
            const response = await axios.get(
                `https://api.github.com/search/repositories`, {
                params: {
                    q: searchQuery,
                    per_page: 10,
                    page: pageNum
                }
            }
            );
            setRepos(response.data.items);
            setPage(pageNum);
        } catch (err) {
            toast((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => fetchRepos();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    return (
        <div className="p-4 max-w-5xl mx-auto">

            <div className="flex gap-2 mb-4 bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Search GitHub Repository..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSearch}
                    disabled={!query}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Search
                </button>
            </div>
            <>
                <div className="relative items-center block max-w-full p-6 bg-white border border-gray-100 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-800 dark:hover:bg-gray-700">
                    <div>
                        <div className="space-y-4">
                            {repos.map((repo) => (
                                <div key={repo.id} className="rounded-lg p-4 shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
                                    {/* <div className="grid grid-cols-4 my-2">
                                        <div className="">
                                           

                                        </div>
                                        
                                    </div> */}

                                    <div className="grid grid-cols-12 gap-2 p-4">
                                        <div className="col-span-12 md:col-span-6">
                                            <div className="bg-white p-8 md:p-2 rounded-md text-black text-center md:text-start max-w-screen-md w-full overflow-x">
                                                <p className="break-all">
                                                    <a
                                                        href={repo.html_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xl text-blue-600 font-semibold hover:underline overflow-hidden text-ellipsis whitespace-nowrap"
                                                    >
                                                        {repo.full_name}
                                                    </a>
                                                </p>
                                            </div>

                                        </div>
                                        <div className="col-span-12 md:col-span-6"><div className="flex justify-center md:justify-end ml-4">
                                            <img className="w-24 border-3 border-gray-400 rounded-full p-1" src={repo.owner.avatar_url} alt="avatar" />
                                        </div>
                                        </div>
                                    </div>

                                    <div className="w-3/4">
                                        <p className="text-sm text-gray-600 my-2"><span className="font-bold">Topics:</span> {repo.topics.length > 0 ? repo.topics.join(", ") : "No topics"}</p>
                                        <p className="text-sm text-gray-600 my-2"><span className="font-bold text-wrap">Description:</span> {repo.description ? repo.description : 'No Description'}</p>
                                    </div>
                                    <div className="flex flex-row gap-4 mt-2">
                                        <p className="text-sm text-gray-600"><span className="font-bold">Created at:</span> {new Date(repo.created_at).toLocaleDateString()}</p>
                                        <p className="text-sm text-gray-600"><span className="font-bold">Updated at: </span> {new Date(repo.updated_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {repos.length > 0 && (
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => fetchRepos(query, page - 1)}
                                    disabled={page === 1}
                                    className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50 cursor-pointer"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchRepos(query, page + 1)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </div>
                    {loading && <div role="status" className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                        <span className="sr-only">Loading...</span>
                    </div>}
                </div>

            </>

        </div>
    );
};

export default GitSearch;
