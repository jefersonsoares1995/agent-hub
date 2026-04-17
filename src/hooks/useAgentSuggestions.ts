import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Returns up to `limit` dynamic suggestions for a given agent based on the
 * user's most recent prompts (first user message of each past session) with
 * that agent. Falls back to the provided `fallback` list when there's not
 * enough history.
 */
export function useAgentSuggestions(
  agentId: string,
  fallback: string[],
  limit = 3,
) {
  const [suggestions, setSuggestions] = useState<string[]>(fallback);
  const [loading, setLoading] = useState(true);
  const [isDynamic, setIsDynamic] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) {
        if (!cancelled) {
          setSuggestions(fallback);
          setIsDynamic(false);
          setLoading(false);
        }
        return;
      }

      // Get recent sessions for this agent
      const { data: sessions } = await supabase
        .from("chat_sessions")
        .select("id")
        .eq("user_id", session.user.id)
        .eq("agent_id", agentId)
        .order("updated_at", { ascending: false })
        .limit(20);

      const sessionIds = (sessions ?? []).map((s) => s.id);
      if (sessionIds.length === 0) {
        if (!cancelled) {
          setSuggestions(fallback);
          setIsDynamic(false);
          setLoading(false);
        }
        return;
      }

      // Fetch user messages from those sessions
      const { data: msgs } = await supabase
        .from("chat_messages")
        .select("content, session_id, created_at")
        .in("session_id", sessionIds)
        .eq("role", "user")
        .order("created_at", { ascending: true });

      // Pick the FIRST user message of each session (the original prompt)
      const firstBySession = new Map<string, string>();
      for (const m of msgs ?? []) {
        if (!firstBySession.has(m.session_id)) {
          firstBySession.set(m.session_id, m.content);
        }
      }

      // Order by session recency, dedupe (case-insensitive), trim long ones
      const seen = new Set<string>();
      const dynamic: string[] = [];
      for (const id of sessionIds) {
        const content = firstBySession.get(id);
        if (!content) continue;
        const cleaned = content.trim().replace(/\s+/g, " ");
        if (!cleaned) continue;
        const key = cleaned.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        const display = cleaned.length > 60 ? cleaned.slice(0, 57) + "..." : cleaned;
        dynamic.push(display);
        if (dynamic.length >= limit) break;
      }

      if (cancelled) return;

      if (dynamic.length > 0) {
        // Top up with fallback if we got fewer than `limit`
        const merged = [...dynamic];
        for (const f of fallback) {
          if (merged.length >= limit) break;
          if (!merged.some((s) => s.toLowerCase() === f.toLowerCase())) {
            merged.push(f);
          }
        }
        setSuggestions(merged);
        setIsDynamic(true);
      } else {
        setSuggestions(fallback);
        setIsDynamic(false);
      }
      setLoading(false);
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [agentId, limit, fallback]);

  return { suggestions, loading, isDynamic };
}
