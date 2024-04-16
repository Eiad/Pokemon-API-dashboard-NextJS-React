// pages/index.js
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import styled from "styled-components";
import Search from "../components/Search"; // Ensure this path is correct based on your directory structure

// Styled component
const CategoryList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  gap: 10px;
`;

export default function Home() {
  // Fetch categories with React Query
  const { data, status } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get("https://pokeapi.co/api/v2/type");
      return response.data.results;
    },
  });

  // Handle loading and error states
  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error fetching data</p>;

  // Return your page content
  return (
    <>
      <header className="header">
        <h1 className="title">Pokemon World</h1>
        <p className="subtitle">Discover and explore the types of Pokemon</p>
      </header>
      <Search />
      <h2 className="title">Or by category</h2>
      <CategoryList>
        {data?.map((category) => (
          <Link
            className="category-item"
            href={`/category/${category.name}`}
            key={category.name}
          >
            <span>{category.name}</span>
          </Link>
        ))}
      </CategoryList>
    </>
  );
}
