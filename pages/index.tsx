import Head from "next/head";
import gql from "graphql-tag";
import { useState } from "react";
import { withUrqlClient } from "next-urql";
import { useQuery } from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import { relayPagination } from "@urql/exchange-graphcache/extras";

const AllLinksQuery = gql`
  query allLinksQuery($limit: Int) {
    links(limit: $limit) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          index
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`;

function Home() {
  const [cursor, setCursor] = useState(null);
  const [result] = useQuery({
    query: AllLinksQuery,
    variables: { cursor: "", limit: 10 },
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  const hasNextPage = data?.links.pageInfo.hasNextPage;
  return (
    <div>
      <Head>
        <title>Hidden Gems</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.links.edges.map(({ node }) => (
            <li key={node.id} className="shadow  max-w-md  rounded">
              <img src={node.imageUrl} />
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-sm text-blue-500">{node.category}</p>
                <p className="text-lg font-medium">{node.title}</p>
                <p className="text-gray-600">{node.description}</p>
                <a href={node.url} className="flex hover:text-blue-500">
                  {/* removes https from url */}
                  {node.url.replace(/(^\w+:|^)\/\//, "")}
                  <svg
                    className="w-6 h-6"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
                  </svg>
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default withUrqlClient(() => ({
  url: "http://localhost:3000/api/graphql",
}))(Home);
