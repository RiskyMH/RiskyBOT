import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import OpenGraph from "../components/OpenGraph";
import TransitionLayout from "../components/TransitionLayout";
import type { NextPage } from "next";

const MyApp: NextPage = ({ Component, pageProps, router }: AppProps) => {

    // useEffect(() => {
    //     router.events?.on('routeChangeComplete', () => {
    //         console.log(document.title)
    //         if (window?.location?.hash) router.scrollToHash(window.location.hash);
    //     })
    // }, [router.route]);

    return (
        <>
            <OpenGraph />
            <div className="flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">
                    <TransitionLayout location={router.route}>
                        <Component {...pageProps} />
                    </TransitionLayout>
                </div>
                <Footer />
            </div>
            {/* {
                (window?.location?.hash) ? (
                    <>
                        <p>{useEffect(()=>router.scrollToHash(window.location.hash), [router.route])+""}</p> 
                        <p>{useEffect(()=>console.log(document.title), [router.route])+""}</p> 
                    </>
                    
                ): null
            } */}
        </>
    );
};

export default MyApp;
