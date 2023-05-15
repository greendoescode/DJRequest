import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link href="/">
              Home
            </Link>
          </li>
          <li>
            <Link href="/queue">
              Queue
            </Link>
          </li>
        </ul>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp
