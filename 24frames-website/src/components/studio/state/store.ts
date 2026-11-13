"use client";

/* ============================================================
   Consultation state — one reducer, persisted to sessionStorage
   so a reload or back/forward never loses the couple's work.
   sessionStorage (not localStorage): the draft disappears when
   the studio closes the tab, and "New consultation" wipes it.
   ============================================================ */

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { createDraft, createEvent, normaliseDraft, uid } from "@/lib/commission/model";
import { quoteCommission } from "@/lib/commission/pricing";
import type {
  CelebrationEvent,
  CommissionDraft,
  CommissionRecord,
  CoupleDetails,
  ManualOverride,
  PlanningRequest,
  StudioConfig,
} from "@/lib/commission/types";

export const STAGES = [
  { id: "overture", frame: "00", title: "Overture", short: "Welcome" },
  { id: "couple", frame: "01", title: "The Couple", short: "Couple" },
  { id: "planning", frame: "02", title: "The Planning", short: "Planning" },
  { id: "celebration", frame: "03", title: "The Celebration", short: "Events" },
  { id: "crew", frame: "04", title: "The Crew", short: "Crew" },
  { id: "ensemble", frame: "05", title: "The Casting", short: "Team" },
  { id: "delivery", frame: "06", title: "The Delivery", short: "Delivery" },
  { id: "commission", frame: "07", title: "The Commission", short: "Review" },
  { id: "proposal", frame: "08", title: "The Proposal", short: "Proposal" },
] as const;

export type StageId = (typeof STAGES)[number]["id"] | "composed";

export interface StudioState {
  draft: CommissionDraft;
  stage: StageId;
  /** Furthest stage reached — the rail lets the couple jump back to any of them. */
  reached: number;
  /** Set once the commission is stored. Read-only from then on. */
  submitted: CommissionRecord | null;
}

type Action =
  | { type: "hydrate"; state: StudioState }
  | { type: "reset"; config: StudioConfig }
  | { type: "go"; stage: StageId }
  | { type: "couple"; patch: Partial<CoupleDetails> }
  | { type: "addEvent"; event: CelebrationEvent }
  | { type: "updateEvent"; id: string; patch: Partial<CelebrationEvent> }
  | { type: "removeEvent"; id: string }
  | { type: "restoreEvent"; event: CelebrationEvent; index: number; assignments: CommissionDraft["assignments"] }
  | { type: "duplicateEvent"; id: string }
  | { type: "moveEvent"; id: string; delta: number }
  | { type: "sortEventsByDate" }
  | { type: "setQuantity"; eventId: string; serviceId: string; quantity: number }
  | { type: "setPriceOverride"; eventId: string; serviceId: string; price: number | null; reason: string }
  | { type: "setTier"; tierId: string | null }
  | { type: "toggleCharge"; id: string }
  | { type: "setPostOverride"; override: ManualOverride | null }
  | { type: "setPlanning"; planning: PlanningRequest | undefined }
  | { type: "submitted"; record: CommissionRecord }
  | { type: "loadDraft"; draft: CommissionDraft };

const stageIndex = (s: StageId) => {
  const i = STAGES.findIndex((x) => x.id === s);
  return i === -1 ? STAGES.length : i;
};

function touch(draft: CommissionDraft): CommissionDraft {
  return { ...draft, updatedAt: new Date().toISOString() };
}

function reducer(state: StudioState, action: Action): StudioState {
  // A submitted commission is frozen; only navigation/reset are allowed.
  if (state.submitted && !["hydrate", "reset", "go", "loadDraft", "submitted"].includes(action.type)) return state;

  const d = state.draft;
  const withDraft = (draft: CommissionDraft): StudioState => ({ ...state, draft: touch(draft) });

  switch (action.type) {
    case "hydrate":
      return action.state;
    case "reset":
      return { draft: createDraft(action.config), stage: "overture", reached: 0, submitted: null };
    case "loadDraft":
      return { draft: action.draft, stage: "couple", reached: stageIndex("commission"), submitted: null };
    case "go": {
      const idx = stageIndex(action.stage);
      return { ...state, stage: action.stage, reached: Math.max(state.reached, Math.min(idx, STAGES.length - 1)) };
    }
    case "couple":
      return withDraft({ ...d, couple: { ...d.couple, ...action.patch } });
    case "addEvent":
      return withDraft({ ...d, events: [...d.events, action.event] });
    case "updateEvent":
      return withDraft({
        ...d,
        events: d.events.map((e) => (e.id === action.id ? { ...e, ...action.patch } : e)),
      });
    case "removeEvent":
      return withDraft({
        ...d,
        events: d.events.filter((e) => e.id !== action.id),
        // Removing an event removes its team — explicit relationship, no orphans.
        assignments: d.assignments.filter((a) => a.eventId !== action.id),
      });
    case "restoreEvent": {
      const events = [...d.events];
      events.splice(Math.min(action.index, events.length), 0, action.event);
      return withDraft({ ...d, events, assignments: [...d.assignments, ...action.assignments] });
    }
    case "duplicateEvent": {
      const i = d.events.findIndex((e) => e.id === action.id);
      if (i === -1) return state;
      const src = d.events[i];
      const copy: CelebrationEvent = { ...src, id: uid("evt"), name: src.name ? `${src.name} (copy)` : "" };
      const events = [...d.events];
      events.splice(i + 1, 0, copy);
      const copiedTeam = d.assignments
        .filter((a) => a.eventId === src.id)
        .map((a) => ({ ...a, id: uid("asg"), eventId: copy.id }));
      return withDraft({ ...d, events, assignments: [...d.assignments, ...copiedTeam] });
    }
    case "moveEvent": {
      const i = d.events.findIndex((e) => e.id === action.id);
      const j = i + action.delta;
      if (i === -1 || j < 0 || j >= d.events.length) return state;
      const events = [...d.events];
      [events[i], events[j]] = [events[j], events[i]];
      return withDraft({ ...d, events });
    }
    case "sortEventsByDate": {
      const key = (e: CelebrationEvent) => `${e.date || "9999-99-99"}T${e.startTime || "99:99"}`;
      const events = d.events
        .map((e, i) => ({ e, i }))
        .sort((a, b) => key(a.e).localeCompare(key(b.e)) || a.i - b.i)
        .map((x) => x.e);
      return withDraft({ ...d, events });
    }
    case "setQuantity": {
      const q = Math.max(0, Math.floor(action.quantity));
      const existing = d.assignments.find((a) => a.eventId === action.eventId && a.serviceId === action.serviceId);
      let assignments;
      if (q === 0) {
        assignments = d.assignments.filter((a) => a !== existing);
      } else if (existing) {
        assignments = d.assignments.map((a) => (a === existing ? { ...a, quantity: q } : a));
      } else {
        assignments = [
          ...d.assignments,
          {
            id: uid("asg"),
            eventId: action.eventId,
            serviceId: action.serviceId,
            quantity: q,
            unitPriceOverride: null,
            overrideReason: "",
          },
        ];
      }
      return withDraft({ ...d, assignments });
    }
    case "setPriceOverride":
      return withDraft({
        ...d,
        assignments: d.assignments.map((a) =>
          a.eventId === action.eventId && a.serviceId === action.serviceId
            ? { ...a, unitPriceOverride: action.price, overrideReason: action.price === null ? "" : action.reason }
            : a,
        ),
      });
    case "setTier":
      return withDraft({ ...d, deliveryTierId: action.tierId });
    case "toggleCharge":
      return withDraft({
        ...d,
        appliedChargeIds: d.appliedChargeIds.includes(action.id)
          ? d.appliedChargeIds.filter((x) => x !== action.id)
          : [...d.appliedChargeIds, action.id],
      });
    case "setPostOverride":
      return withDraft({ ...d, postProductionOverride: action.override });
    case "setPlanning":
      return withDraft({ ...d, planning: action.planning });
    case "submitted":
      return { ...state, submitted: action.record, stage: "composed" };
  }
}

const STORAGE_KEY = "tf-studio-consultation-v1";

export function clearStoredConsultation() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function stashDraftForNewConsultation(draft: CommissionDraft) {
  try {
    const state: StudioState = { draft, stage: "couple", reached: stageIndex("commission"), submitted: null };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage unavailable */
  }
}

export interface StoreOptions {
  /** sessionStorage key (the online portal keeps one per quotation). */
  storageKey?: string;
  /** A saved quotation to open when nothing newer is stored locally. */
  initialDraft?: CommissionDraft | null;
}

export function useStudioStore(config: StudioConfig, options: StoreOptions = {}) {
  const key = options.storageKey ?? STORAGE_KEY;
  const [state, dispatch] = useReducer(reducer, undefined, () => {
    const seeded = options.initialDraft ? normaliseDraft(options.initialDraft, config) : null;
    const started = !!seeded && (seeded.events.length > 0 || !!seeded.couple.brideName || !!seeded.couple.groomName);
    return {
      draft: seeded ?? createDraft(config),
      stage: (started ? "couple" : "overture") as StageId,
      reached: started ? stageIndex("commission") : 0,
      submitted: null,
    };
  });
  // The blank initial state must never be persisted: on mount (and on React's
  // development double-mount) it would overwrite the saved consultation
  // before hydration reads it.
  const initialState = useRef(state);

  // Hydrate after mount (sessionStorage is client-only).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const saved = JSON.parse(raw) as StudioState;
        const seed = options.initialDraft;
        const stale = !!seed && saved?.draft?.id === seed.id && (saved.draft.updatedAt ?? "") < (seed.updatedAt ?? "");
        if (saved?.draft?.schemaVersion === 1 && !stale && (!seed || saved.draft.id === seed.id)) {
          dispatch({
            type: "hydrate",
            state: { ...saved, draft: normaliseDraft(saved.draft, config) },
          });
        }
      }
    } catch {
      /* corrupted or unavailable — start fresh */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state === initialState.current) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* storage full/unavailable — state still lives in memory */
    }
  }, [state]);

  const quote = useMemo(() => quoteCommission(state.draft, config), [state.draft, config]);

  const actions = useMemo(
    () => ({
      go: (stage: StageId) => dispatch({ type: "go", stage }),
      reset: () => {
        try {
          sessionStorage.removeItem(key);
        } catch {
          /* storage unavailable */
        }
        dispatch({ type: "reset", config });
      },
      couple: (patch: Partial<CoupleDetails>) => dispatch({ type: "couple", patch }),
      addEvent: (type: string, overrides?: Partial<CelebrationEvent>) => {
        const event = createEvent(type, config, overrides);
        dispatch({ type: "addEvent", event });
        return event.id;
      },
      updateEvent: (id: string, patch: Partial<CelebrationEvent>) => dispatch({ type: "updateEvent", id, patch }),
      removeEvent: (id: string) => dispatch({ type: "removeEvent", id }),
      restoreEvent: (event: CelebrationEvent, index: number, assignments: CommissionDraft["assignments"]) =>
        dispatch({ type: "restoreEvent", event, index, assignments }),
      duplicateEvent: (id: string) => dispatch({ type: "duplicateEvent", id }),
      moveEvent: (id: string, delta: number) => dispatch({ type: "moveEvent", id, delta }),
      sortEventsByDate: () => dispatch({ type: "sortEventsByDate" }),
      setQuantity: (eventId: string, serviceId: string, quantity: number) =>
        dispatch({ type: "setQuantity", eventId, serviceId, quantity }),
      setPriceOverride: (eventId: string, serviceId: string, price: number | null, reason: string) =>
        dispatch({ type: "setPriceOverride", eventId, serviceId, price, reason }),
      setTier: (tierId: string | null) => dispatch({ type: "setTier", tierId }),
      toggleCharge: (id: string) => dispatch({ type: "toggleCharge", id }),
      setPostOverride: (override: ManualOverride | null) => dispatch({ type: "setPostOverride", override }),
      setPlanning: (planning: PlanningRequest | undefined) => dispatch({ type: "setPlanning", planning }),
      submitted: (record: CommissionRecord) => dispatch({ type: "submitted", record }),
      loadDraft: (draft: CommissionDraft) => dispatch({ type: "loadDraft", draft }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config],
  );

  const useCallbackGo = useCallback((s: StageId) => actions.go(s), [actions]);
  return { state, quote, actions, go: useCallbackGo };
}

export type StudioActions = ReturnType<typeof useStudioStore>["actions"];
