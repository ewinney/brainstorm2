import Head from 'next/head';

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>AI-Powered Brainstorming Board</title>
        <meta name="description" content="Enterprise-level brainstorming tool with AI integration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>{children}</main>
    </>
  );
}