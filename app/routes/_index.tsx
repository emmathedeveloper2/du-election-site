import { safeTry } from "~/lib/helpers";
import { Route } from "./+types/_index";
import { getCurrentUser } from "~/.server/db-bridge/user.bridge";
import Header from "~/components/header/header";
import HeroSection from "~/sections/hero-section";
import CandidatesSection from "~/sections/candidates-section";

export const meta = () => {

  return [
    { title: "NACOS DU Elections 2025" },
    { name: "description", content: "NACOS DU Elections 2025 - Meet your candidates and get ready to vote." },
    { name: "keywords", content: "NACOS, DU, Elections, 2025, Candidates, Vote" },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {

  const [success, user] = await safeTry(getCurrentUser(request.headers));

  if (!user || !success) return {}


  return { user }
}

export default function LandingPage({ loaderData }: Route.ComponentProps) {

  const { user } = loaderData;

  return (
    <>
      <Header user={user} />
      <HeroSection />
      <CandidatesSection />
    </>
  );
}
