import { useState, useEffect } from "react";
import { ELECTION_START } from "~/lib/constants";
import { getTimeLeft } from "~/lib/helpers";


export default function useTimeCountDown(date: Date) {
        const [timeLeft, setTimeLeft] = useState(getTimeLeft(date));

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(ELECTION_START));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return timeLeft
}