import React, { useState, useEffect } from 'react'

function Search() {
  const [data, setdata] = useState();
  const [query, setQuery] = useState("");
  const [loading, setloading] = useState(false);
  const [filter, setFilter] = useState()


  async function getData() {
    let URL = "";
    if (query == "") {
      setFilter("")
    }
    if (query && filter) {
      URL = `https://api.github.com/search/repositories?q=${query}`;

    } else {
      URL = `https://api.github.com/search/repositories?q=${query}`;
    }

    await fetch(URL)
      .then((response) => response.json())
      .then((responseJson) => {
        if (filter) {
          sortSearchResults(responseJson.items);
          setloading(true)

        } else {
          setdata(responseJson.items);
          setloading(true)
        }
      })
      .catch((error) => {
        console.error(error);
      });

  }


  useEffect(() => {
    let timeOut = setTimeout(() => {
      getData();
    }, 500);

    return () => clearTimeout(timeOut);
  }, [query, filter])


  const sortSearchResults = (items) => {

    switch (filter) {
      case "watchers":
        items.sort((a, b) =>
          a.watchers_count > b.watchers_count
            ? 1
            : b.watchers_count > a.watchers_count
              ? -1
              : 0
        );
        break;
      case "score":
        items.sort((a, b) =>
          a.score > b.score ? 1 : b.score > a.score ? -1 : 0
        );
        break;
      case "stars":
        items.sort((a, b) =>
          a.stargazers_count > b.stargazers_count ? 1 : b.stargazers_count > a.stargazers_count ? -1 : 0
        );
        break;
      case "name":

        items.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
        break;
      case "created_at":
        items.sort((a, b) =>
          a.created_at > b.created_at ? 1 : b.created_at > a.created_at ? -1 : 0
        );
        break;
      case "updated_at":
        items.sort((a, b) =>
          a.updated_at > b.updated_at ? 1 : b.updated_at > a.updated_at ? -1 : 0
        );
        break;
      default:
        break;
    }
    setdata(items);
  };


  return (
    <div>

      <div className='container search-container'>

        <h2 className='text'>Search Github repo</h2>
        <div className="search mb-3">

          <input type="search" className="form-control"
            placeholder="Search here"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

        </div>

        {
          loading && data ?

            <div className="select">
              <select
                onChange={(e) => {
                  setFilter(e.target.value);
                }}
                className="custom-select">
                <option value="">Filter by options</option>
                <option value="stars">Stars</option>
                <option value="watchers">watchers</option>
                <option value="score">score</option>
                <option value="name">name</option>
                <option value="created_at">created_at</option>
                <option value="updated_at">updated_at</option>
              </select>

            </div> : ""
        }

      </div>
      <div className='container card-container'>
        {

          loading && data ? data.map((item, key) => (

            <div className="card" style={{ width: "18rem", margin: "10px" }} key={item.id}>
              <img src={item.owner.avatar_url} className="card-img-top" alt="..." />
              <div className="card-body">
                <h5 className="card-title">Name: {item.name}</h5>
                <p className="card-text">Language: {item.language}</p>
                <p className="card-text">Stars:{item.stargazers_count}</p>
                <p className="card-text">{item.description}</p>

              </div>
            </div>

          ))
            : "No data is found"
        }
      </div>
    </div>

  )
}

export default Search