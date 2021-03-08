import Head from "next/head";
import { useSession } from "next-auth/client";
import gql from "graphql-tag";
import { withUrqlClient } from "next-urql";
import { useQuery } from "urql";

const AllUsersQuery = gql`
  query allUsersQuery {
    users {
      id
      role
      name
      email
      favorites {
        title
        id
        category
        description
      }
    }
  }
`;

function Home() {
  const [session] = useSession();

  if (!session) return <p>You need to login to view this page</p>;
  const [result] = useQuery({
    query: AllUsersQuery,
  });
  const { data, fetching, error } = result;
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;

  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>Hello world</main>
      <ul className="grid grid-cols-1 gap-y-5">
        {data?.users.map((user) => (
          <div key={user.id}>
            <p>{user.name}</p>
            <p>{user.role}</p>
            <p>{user.email}</p>
            <ul>
              {user.favorites.map((link) => (
                <li key={link.id}>
                  <p>{link.title}</p>
                  <p>{link.category}</p>
                  <p>{link.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </ul>
    </div>
  );
}
export default withUrqlClient(() => ({
  url: "http://localhost:3000/api/graphql",
}))(Home);
