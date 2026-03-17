import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTournament } from "@/context/TournamentContext";
import { CloudService } from "@/tournament/sync/cloud";
import { getTournamentRoute } from "@/tournament/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SharedTournamentPage: React.FC = () => {
  const { shareCode = "" } = useParams<{ shareCode: string }>();
  const navigate = useNavigate();
  const { dispatch } = useTournament();
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current) return;
    hasLoadedRef.current = true;

    const code = shareCode.trim().toUpperCase();
    if (!code) {
      setStatus("error");
      setErrorMessage("Missing tournament code.");
      return;
    }

    const loadTournament = async () => {
      try {
        const snapshot = await CloudService.getSession(code);
        const restoredState = CloudService.restoreState(snapshot);
        dispatch({ type: "SET_STATE", payload: restoredState });
        navigate(getTournamentRoute(restoredState), { replace: true });
      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to load tournament",
        );
      }
    };

    void loadTournament();
  }, [dispatch, navigate, shareCode]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <Card className="text-center">
        {status === "loading" ? (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Loading tournament
            </h1>
            <p className="text-muted-foreground">
              Fetching shared tournament <span className="font-semibold text-foreground">{shareCode.toUpperCase()}</span>.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Could not open tournament
            </h1>
            <p className="text-muted-foreground mb-6">
              {errorMessage || "The shared tournament could not be loaded."}
            </p>
            <Link to="/tournament/history">
              <Button>Go to History</Button>
            </Link>
          </>
        )}
      </Card>
    </div>
  );
};

export default SharedTournamentPage;
