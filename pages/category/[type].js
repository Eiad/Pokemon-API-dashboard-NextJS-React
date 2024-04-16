/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import styled from "styled-components";

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 1rem;
  padding: 1rem;
`;

const Card = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  background-color: #f7f7f7;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  &:hover {
    transform: translateY(-5px);
  }
`;

const CardTitle = styled.h3`
  margin: 10px 0 30px 0;
  text-transform: uppercase;
`;

const CategoryPage = () => {
  const router = useRouter();
  const { type } = router.query;

  // Function to generate a random number for the Pokemon image generator
  const getRandomImageId = () => Math.floor(Math.random() * 400) + 1;

  const { data, status } = useQuery({
    queryKey: ["category", type],
    queryFn: async () => {
      if (!type) return; // Avoid fetching if the type is not yet available
      const response = await axios.get(
        `https://pokeapi.co/api/v2/type/${type}`
      );
      return response.data.pokemon;
    },
    enabled: !!type,
  });

  return (
    <div>
      <div>
        <Link className="menu-nav" href={`/`}>
          Home page
        </Link>
      </div>
      <h1 className="title">Category: {type}</h1>
      <div>
        {status === "loading" && <p>Loading...</p>}
        {status === "error" && <p>Error fetching data</p>}
        {status === "success" && (
          <GridContainer>
            {data?.map(({ pokemon }) => (
              <Card key={pokemon.name}>
                <CardTitle>{pokemon.name}</CardTitle>
                <Link href={`/pokemon/${pokemon.name}`} passHref>
                  <img
                    src={`https://lorempokemon.fakerapi.it/pokemon/100/${getRandomImageId()}`}
                    alt={pokemon.name}
                    loading="lazy"
                  />
                </Link>
              </Card>
            ))}
          </GridContainer>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
