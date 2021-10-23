import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        const setInitialTheme = `
            function getUserPrefrence() {
                if(localStorage.getItem('theme')) {
                    return localStorage.getItem('theme')
                }
                return window.matchMedia('(prefers-color-scheme: light)').matches
                    ? 'light'
                    : 'dark'
            }
            document.body.dataset.theme = getUserPrefrence();
        `
        return (
            <Html>
                <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans&display=swap" rel="stylesheet" />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:site" content="@keyhansa1" />
                    <meta name="twitter:title" content="Snake made with NextJs" />
                    <meta name="twitter:image" content="https://snake.keyhansa.ir/_next/image?url=%2Fbanner.png&w=1080&q=100" />
                </Head>
                <body>
                    <script dangerouslySetInnerHTML={{ __html: setInitialTheme }} />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument