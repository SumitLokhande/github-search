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
        if (!searchQuery.trim()) {
            toast("Please enter a search term.");
            return;
        }

        setLoading(true);
        try {
            const { data } = await axios.get("https://api.github.com/search/repositories", {
                params: { q: searchQuery, per_page: 10, page: pageNum },
            });
            setRepos(data.items);
            setPage(pageNum);
        } catch (error) {
            toast((error as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => fetchRepos();
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") handleSearch();
    };

    const renderLoader = () => (
        <div role="status" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <svg
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591..."
                    fill="currentColor"
                />
                <path
                    d="M93.9676 39.0409C96.393 38.4038..."
                    fill="currentFill"
                />
            </svg>
            <span className="sr-only">Loading...</span>
        </div>
    );

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
                    disabled={!query || loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                    Search
                </button>
            </div>

            <div className="relative">
                {loading ? renderLoader() : (
                    <>
                        <div className="space-y-4">
                            {repos.map((repo) => (
                                <div key={repo.id} className="rounded-lg p-4 shadow hover:shadow-xl transition bg-white">
                                    <div className="grid grid-cols-12 gap-2">
                                        <div className="col-span-12 md:col-span-6 text-center md:text-left">
                                            <a
                                                href={repo.html_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xl text-blue-600 font-semibold hover:underline block truncate"
                                            >
                                                {repo.full_name}
                                            </a>
                                        </div>
                                        <div className="col-span-12 md:col-span-6 flex justify-center md:justify-end">
                                            <img
                                                src={repo.owner.avatar_url}
                                                alt={`${repo.owner.login}'s avatar`}
                                                className="w-20 h-20 border border-gray-400 rounded-full"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4 space-y-2">
                                        <p className="text-sm text-gray-600">
                                            <strong>Topics:</strong>{" "}
                                            {repo.topics.length ? repo.topics.join(", ") : "No topics"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Description:</strong>{" "}
                                            {repo.description || "No Description"}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                                            <span><strong>Created:</strong> {new Date(repo.created_at).toLocaleDateString()}</span>
                                            <span><strong>Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {repos.length > 0 && (
                            <div className="flex justify-between mt-6">
                                <button
                                    onClick={() => fetchRepos(query, page - 1)}
                                    disabled={page === 1}
                                    className="bg-gray-300 px-4 py-2 rounded-lg disabled:opacity-50"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => fetchRepos(query, page + 1)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default GitSearch;
