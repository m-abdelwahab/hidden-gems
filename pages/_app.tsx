import "styles/tailwind.css";
import { Provider } from "next-auth/client";
import Layout from "components/Layout";
import { AppProps } from "next/app";

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default App;
