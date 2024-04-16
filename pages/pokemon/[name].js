/* eslint-disable @next/next/no-img-element */

import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import Link from "next/link";

/* 
  P.S: Work around i do to Dynamically import ApexCharts to avoid SSR issues with window object. 
   So basically i tell Next.js not to use server - side rendering for this component - ssr: false.
*/
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

function PokemonPage() {
  const router = useRouter();
  const { name } = router.query;

  // Fetch the Pokemon details
  const { data, status } = useQuery({
    queryKey: ["pokemon", name],
    queryFn: () =>
      axios
        .get(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then((res) => res.data),
    enabled: !!name,
  });

  // Prepare stats data for the graph
  const chartData = data?.stats.map((stat) => ({
    name: stat.stat.name.replace("-", " "),
    data: [stat.base_stat],
  }));

  const options = {
    chart: {
      type: "radar",
      toolbar: {
        show: true,
      },
      dropShadow: {
        enabled: true,
        blur: 3,
        left: 1,
        top: 1,
        opacity: 0.1,
      },
    },
    title: {
      align: "center",
      style: {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
      },
    },
    stroke: {
      width: 2,
    },
    fill: {
      opacity: 0.7,
    },
    markers: {
      size: 5,
      hover: {
        size: 8,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val;
        },
      },
    },
    xaxis: {
      categories: chartData?.map((stat) => stat.name),
      labels: {
        style: {
          colors: [],
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      tickAmount: 5,
      labels: {
        formatter: function (val) {
          return Math.floor(val);
        },
        style: {
          color: "#000",
          fontSize: "12px",
        },
      },
    },
    legend: {
      position: "bottom",
      horizontalAlign: "center",
      markers: {
        width: 10,
        height: 10,
        radius: 20,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 10,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 300,
          },
          legend: {
            position: "top",
          },
        },
      },
    ],
  };

  const series = [
    {
      name: "Stats",
      data: chartData?.map((stat) => stat.data[0]),
    },
  ];

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") return <p>Error loading data...</p>;

  return (
    <>
      <section>
        <Link className="menu-nav" href={`/`}>
          Home page
        </Link>
      </section>
      <h1 className="title">{data?.name.toUpperCase()}&#39;s base state</h1>
      <section>
        <div>
          <img
            src={`https://lorempokemon.fakerapi.it/pokemon/200/123`}
            loading="lazy"
            alt=""
          />
        </div>
        <div>
          {/* the graph */}
          {chartData && (
            <ReactApexChart
              options={options}
              series={series}
              type="radar"
              height={650}
            />
          )}
        </div>
      </section>
    </>
  );
}

export default PokemonPage;
