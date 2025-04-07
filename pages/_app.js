import { Geist, Geist_Mono } from "next/font/google";
//import "./globals.css";
import StoreProvider from "@/app/StoreProvider"; // Asegúrate de que esta línea tenga la ruta correcta

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    // ...existing code...
});

function MyApp({ Component, pageProps }) {
    return (
        <StoreProvider>
            <Component {...pageProps} />
        </StoreProvider>
    );
}

export default MyApp;