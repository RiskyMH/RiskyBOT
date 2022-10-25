import type { NextPage } from "next";
import dynamic from "next/dynamic";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faUserGroup } from "@fortawesome/free-solid-svg-icons";
import Button from "../components/Button";
import { BOT_INVITE_URL, SERVER_INVITE_URL } from "../constants";
import Fade from "react-reveal";
import Divider from "../components/Divider";
// import IntroExample from "../components/examples/Introduction";

const IntroExample = dynamic(async () => await import("../components/examples/Introduction"), { ssr: false });
const RedditCommand = dynamic(async () => await import("../components/examples/RedditCommand"), { ssr: false });
const AboutUserCommand = dynamic(async () => await import("../components/examples/AboutUserCommand"), { ssr: false });
const RandomToolCommand = dynamic(async () => await import("../components/examples/RandomToolCommand"), { ssr: false });

const Home: NextPage = () => {
    return (
        <div>
            <div className="indexBackground fixed top-0 -z-[999] h-screen w-screen"></div>
            <div className="mt-24 flex flex-col">
                {/* Index Hero */}
                <div className="min-h-[85vh] sm:min-h-[70vh]" >
                    <div className="container mx-auto mb-20 px-6 xl:px-24">
                        <div className="grid grid-cols-1 gap-4 md:mt-24 lg:grid-cols-2">
                            <div className="flex flex-col">
                                <h1 className="font-extrabold leading-none md:leading-tight" style={{ fontSize: "3rem" }}>
                                    Add
                                    <span className="text-discord-red"> Riskybot </span>
                                    for
                                    <br className="hidden sm:block" />
                                    <span className="text-discord-blurple"> fun </span>
                                    commands!
                                </h1>
                                <div className="my-4 text-2xl text-gray-100 md:text-3xl">
                                    Featuring lots of <b>commands</b> to entertain all of your needs.
                                </div>
                                <div className="mt-2">
                                    <Button href={BOT_INVITE_URL} external icon={faDiscord} className="text-center w-full sm:w-max">
                                        Add RiskyBOT
                                    </Button>
                                    <Button href={SERVER_INVITE_URL} className="ml-0 mt-2 sm:ml-4 sm:mt-0 text-center w-full sm:w-max" external icon={faUserGroup}>
                                        Join the Support Server
                                    </Button>
                                </div>
                            </div>
                            <div className="mx-12 hidden flex-col lg:flex">
                                <IntroExample />
                            </div>
                        </div>
                    </div>
                </div>
                <Divider type="curveUp" className="fill-theme-d4" />
                {/* Features */}
                <div className="py-6 bg-theme-d4 md:py-12">
                    <div className="my-12 mx-auto grid max-w-7xl grid-cols-1 justify-center gap-12 px-8 text-left md:my-24 md:grid-cols-2">
                        <Fade bottom>
                            <div className="col-span-1 my-auto justify-center">
                                <h2 className="text-4xl font-bold">Get to do enjoy your server again!</h2>
                                <p className="mt-2 text-xl">
                                    RiskyBOT is <b>designed</b> to make conversations with your friends more fun and exciting.
                                    It&apos;s a great way to hang out, spend time, and learn more about each other!
                                    Not only that, but it&apos;s also a great way to <b>learn</b> new things!
                                    <br className="mb-2" />
                                    And if you are lonely but still want to have fun, you can always use the <b>reddit</b> command to get some memes!
                                </p>
                            </div>
                            <div className="col-span-1 hidden justify-center md:block !rotate-6">
                                <RedditCommand />
                            </div>
                        </Fade>
                    </div>
                    <div className="my-12 mx-auto grid max-w-7xl grid-cols-1 justify-center gap-12 px-8 text-left md:my-24 md:grid-cols-2">
                        <Fade bottom>
                            <div className="col-span-1 my-auto hidden select-none justify-center p-4 md:block !-rotate-6">
                                <RandomToolCommand />
                            </div>
                            <div className="col-span-1 my-auto justify-center">
                                <h2 className="text-4xl font-bold">Many helpful commands!</h2>
                                <p className="mt-2 text-xl">
                                    You can use <b>helpful</b> commands with this bot! Each command has a purpose,
                                    from being helpful to being fun and making your server just that bit better!
                                    <br className="mb-2" />
                                    Even if you don't decide to add this bot, you can still make use of it on other servers that have it added!
                                    <i className="text-gray-400"> (but you should just add it)</i>
                                </p>
                            </div>
                        </Fade>
                    </div>
                    <div className="my-12 mx-auto grid max-w-7xl grid-cols-1 justify-center gap-12 px-8 text-left md:my-24 md:grid-cols-2">
                        <Fade bottom>
                            <div className="col-span-1 my-auto justify-center">
                                <h2 className="text-4xl font-bold">Lots of information!</h2>
                                <p className="mt-2 text-xl">
                                    RiskyBOT has <b>lots</b> of commands that are helpful for you and your friends to use! Our commands
                                    cover many topics from helpful to interesting. Lack of information can be frustrating, so RiskyBOT is here to help!
                                </p>
                            </div>
                            <div className="col-span-1 my-auto hidden justify-center rounded-md p-4 md:block !rotate-6">
                                <AboutUserCommand />
                            </div>
                        </Fade>
                    </div>
                </div>
                <Divider type="curveDown" className="bg-theme-d3 fill-theme-d4" />
                {/* Get Started */}
                <div className="pt-24 pb-8 bg-theme-d3 md:pb-56">
                    <Fade bottom>
                        <div className="mx-auto max-w-4xl px-4 text-center">
                            <h1 className="text-5xl font-extrabold">
                                <Fade bottom cascade>
                                    Get Started
                                </Fade>
                            </h1>
                            <p className="mt-2 text-xl">
                                Ready to have fun? Invite the bot to your server to get started!
                                <br />
                                Don't have friends to play with? Join the community server!
                            </p>
                            <div className="mt-4">
                                <Button href={BOT_INVITE_URL} external icon={faDiscord}>
                                    Add RiskyBOT
                                </Button>
                                <Button href={SERVER_INVITE_URL} className="mt-2 sm:ml-2 sm:mt-0" external icon={faUserGroup}>
                                    Join the Support Server
                                </Button>
                            </div>
                        </div>
                    </Fade>
                </div>
            </div>
        </div>
    );
};

export default Home;
