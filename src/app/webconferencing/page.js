import { Suspense } from "react";
import WebConferencing from "@/app/Components/VideoConfrence/videoConference";

export const metadata = {
  title: "Web conferencing | PhaseMatrixMedia",
  description: "1:1 video calls powered by LiveKit (WebRTC)",
};

function WebConferencingFallback() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-slate-950 p-4 text-slate-200">
      Loading…
    </div>
  );
}

export default function WebConferencingPage() {
  return (
    <Suspense fallback={<WebConferencingFallback />}>
      <WebConferencing />
    </Suspense>
  );
}
