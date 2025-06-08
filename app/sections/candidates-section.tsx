import ElectionCandidateCard from '~/components/election-candidate-card'

const CandidatesSection = () => {
    return (
        <section id='candidates' className='w-full flex flex-col items-center py-16'>
            <div className='max-width-wrapper'>
                <h1 className={"w-full text-center text-xl md:text-5xl lg:text-7xl font-black mt-2"}>The Candidates</h1>

                                    <div className={'flex flex-col gap-4 mt-5 md:mt-10 lg:mt-20'}>
                    <h1 className={"text-lg md:text-3xl lg:text-5xl font-black flex items-center gap-4"}>
                            Running for President
                        </h1>

                        <div className={"w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-5 md:mt-10"}>
                            <ElectionCandidateCard />
                            <ElectionCandidateCard />
                        </div>
                    </div>
                    <div className={'flex flex-col gap-4 mt-20'}>
                        <h1 className={"text-lg md:text-3xl lg:text-5xl font-black flex items-center gap-4"}>
                            Running for Vice President
                        </h1>

                        <div className={"w-full grid grid-cols-1 md:grid-cols-4 gap-4 mt-10"}>
                            <ElectionCandidateCard />
                            <ElectionCandidateCard />
                        </div>
                    </div>
            </div>
        </section>
    )
}

export default CandidatesSection