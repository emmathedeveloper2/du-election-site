import { Avatar, AvatarFallback } from "./ui/avatar";

const ElectionCandidateCard = () => {

    return (
        <div className={'border border-secondary p-4 flex flex-col items-center gap-4 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-300 ease-in-out'}>
                <Avatar>
                    <AvatarFallback>
                        <div className={"size-full bg-secondary"}></div>
                    </AvatarFallback>
                </Avatar>
                <h3 className={"font-bold"}>AGAGA GODWIN</h3>
                <p>Software Engineering</p>
                <p>300L</p>
        </div>
    )
}

export default ElectionCandidateCard;