"use client";

import { useCallback, useState } from "react";
import { Puck } from "@puckeditor/core";
import { config, type PuckData } from "@church/puck-config";
import "@puckeditor/core/puck.css";

type EditorClientProps = {
  pageId: string;
  path: string;
  churchName: string;
  initialData: PuckData;
};

export function EditorClient({
  pageId,
  path,
  churchName,
  initialData,
}: EditorClientProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const publish = useCallback(
    async (data: PuckData) => {
      setStatus("saving");
      try {
        const res = await fetch(`/api/pages/${pageId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ puckJson: data }),
        });
        if (!res.ok) throw new Error(await res.text());
        setStatus("saved");
      } catch (error) {
        console.error("Failed to save page", error);
        setStatus("error");
      }
    },
    [pageId],
  );

  return (
    <Puck
      config={config}
      data={initialData}
      onPublish={publish}
      headerTitle={`${churchName} — ${path}`}
      headerPath={
        status === "saving"
          ? "Saving…"
          : status === "saved"
            ? "Saved"
            : status === "error"
              ? "Save failed"
              : path
      }
    />
  );
}
