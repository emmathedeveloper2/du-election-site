import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import useTimeCountDown from '~/hooks/use-election-time';
import { ELECTION_START } from '~/lib/constants';


const HeroSection = () => {

    const { days, hours, minutes, seconds } = useTimeCountDown(ELECTION_START);

    return (
        <div className="flex flex-col items-center">
            <div className="max-width-wrapper">
                <section className="py-16 text-center">
                    <div className="max-w-4xl mx-auto flex flex-col items-center">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                            NACOS DU Elections 2025
                        </h1>
                        <p className="text-lg md:text-xl mb-6">
                            Meet your candidates. Get ready to vote. Election starts{" "}
                            <span className="font-semibold">June 12th, 2025 @ 9:00 AM</span>.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
                            <Button asChild className='rounded-full'>
                                <Link to="#candidates">
                                    Meet the Candidates
                                    <ArrowRightIcon className='rotate-90' />
                                </Link>
                            </Button>

                            <Button className="flex items-center gap-2 rounded-full bg-secondary text-secondary-foreground px-4 py-2 cursor-pointer group hover:bg-primary hover:text-primary-foreground transition-colors w-max">
                                <h1 className="font-bold">{days}d {hours}h {minutes}m {seconds}s</h1>
                                <ArrowRightIcon className="size-[15px] group-hover:rotate-45 transition-transform" />
                            </Button>
                        </div>

                    </div>
                </section>
            </div>
        </div>
    )
}

export default HeroSection