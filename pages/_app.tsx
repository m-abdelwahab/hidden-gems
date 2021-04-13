import "styles/tailwind.css";
import Layout from "components/Layout";
import { Provider } from "next-auth/client";
import { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import { client } from "lib/apollo";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </Provider>
  );
}

export default App;
