import React from "react";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchInput = () => {
    const [searchTerm, setSearchTerm] = useSearch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const {data} = await axios.get(`${process.env.REACT_APP_API}/api/v1/product/search/${searchTerm.keyword}`);
            setSearchTerm({...searchTerm, results: data?.results || data.products})    
            navigate('/search')
        } 
        catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
        <form className="d-flex" role="search" onSubmit={handleSubmit}>
            <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchTerm.keyword}
                onChange={(e) => setSearchTerm({...searchTerm, keyword: e.target.value})}
            />
            <button className="btn btn-outline-success" type="submit">
                Search
            </button>
        </form>
        </div>
    );
};

export default SearchInput;
