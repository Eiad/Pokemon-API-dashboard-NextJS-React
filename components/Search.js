import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";

const StyledInput = styled.input`
  width: 100%;
  padding: 20px 15px;
  margin: 10px 0 0 0;
  box-sizing: border-box;
  border: 2px solid #eee;
  border-radius: 5px;
  font-size: 16px;

  &:focus {
    border-color: #0052cc;
    box-shadow: 0 0 8px 0 rgba(0, 82, 204, 0.3);
    outline: none;
  }
`;

const ResultList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  background: #f7f7f7;
  border: 1px solid #eeeeee;
  width: 400px;
  text-align: left;
  max-height: 300px;
  overflow: scroll;
`;

const ResultItem = styled.li`
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #ffffff;
  }
`;

const StyledLink = styled.a`
  display: block;
  padding: 15px 20px;
  text-decoration: none;
  color: #333;

  &:hover {
    text-decoration: underline;
  }
`;

const Search = () => {
  const [query, setQuery] = useState("");
  const [pokemonList, setPokemonList] = useState([]);

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=1118"
      );
      setPokemonList(response.data.results);
    };
    fetchPokemons();
  }, []);

  const filteredPokemons =
    query === ""
      ? []
      : pokemonList.filter((p) =>
          p.name.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div className="poke-search">
      <StyledInput
        type="text"
        placeholder="Search for a Pokemon"
        onChange={(e) => setQuery(e.target.value)}
      />
      {filteredPokemons.length > 0 && (
        <ResultList>
          {filteredPokemons.map((pokemon) => (
            <ResultItem key={pokemon.name}>
              <StyledLink href={`/pokemon/${pokemon.name}`}>
                {pokemon.name}
              </StyledLink>
            </ResultItem>
          ))}
        </ResultList>
      )}
    </div>
  );
};

export default Search;
