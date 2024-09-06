import { Send } from "lucide-react";
import { Button } from "./ui/button";

export default function CtaFloating() {
  return (
    <div className="fixed right-4 top-4">
      <Button variant="default">
        <Send className="mr-2 size-4" /> Submit
      </Button>
    </div>
  );
}
