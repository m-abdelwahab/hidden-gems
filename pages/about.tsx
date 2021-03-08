const AboutPage = () => {
  return (
    <div className="mx-auto container px-10 md:px-12 prose prose-lg my-24">
      <h1 className="capitalize"> About this project</h1>
      <p>This project is built using the following technologies:</p>
      <ul>
        <li>
          <a href="https://nextjs.org/" rel="noreferrer" target="_blank">
            Next.js
          </a>{" "}
          (Full-stack React framework)
        </li>

        <li>
          <a href="https://nexusjs.org/" rel="noreferrer" target="_blank">
            Nexus
          </a>{" "}
          (Code-first GraphQL API)
        </li>
        <li>
          <a href="https://www.osohq.com/" rel="noreferrer" target="_blank">
            OSO
          </a>{" "}
          (Authorization)
        </li>
        <li>
          <a href="https://tailwindcss.com/" rel="noreferrer" target="_blank">
            TailwindCSS
          </a>{" "}
          (styling)
        </li>
        <li>
          <a href="https://prisma.io" rel="noreferrer" target="_blank">
            Prisma
          </a>{" "}
          (ORM)
        </li>
        <li>
          <a href="https://next-auth.js.org/" rel="noreferrer" target="_blank">
            NextAuth
          </a>{" "}
          (for authentication)
        </li>
        <li>
          <a
            href="https://typescriptlang.org/"
            rel="noreferrer"
            target="_blank"
          >
            TypeScript
          </a>{" "}
          (as the programming language)
        </li>
        <li>
          <a
            href="https://www.postgresql.org/"
            rel="noreferrer"
            target="_blank"
          >
            PostgreSQL
          </a>{" "}
          (database)
        </li>
      </ul>
    </div>
  );
};

export default AboutPage;
