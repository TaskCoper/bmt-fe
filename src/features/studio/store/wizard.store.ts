'use client';

import { create } from 'zustand';

import {
  BUDGET_PACKAGES,
  CONSTRUCTION_TYPES,
  DEFAULT_PRIMARY_COLOR,
  MAX_REGENERATIONS,
  WIZARD_STEPS,
  type DesignStyleId,
} from '../constants/studio.constants';
import { generateResult } from '../services/studio.service';
import type {
  ExportOptions,
  GenerateResult,
  UploadedImage,
  WizardData,
} from '../types/studio.types';

const INITIAL_DATA: WizardData = {
  name: '',
  constructionType: CONSTRUCTION_TYPES.APARTMENT,
  note: '',
  images: [],
  area: 80,
  rooms: '',
  packageId: BUDGET_PACKAGES.STANDARD,
  styles: ['modern'],
  moodboardCount: 0,
  layout: 'open',
  lighting: 'natural',
  direction: 'south',
  primaryColor: DEFAULT_PRIMARY_COLOR,
};

const INITIAL_EXPORT: ExportOptions = {
  coverPage: true,
  projectInfo: true,
  drawings: true,
  estimate: true,
  summary: true,
  renders: true,
  language: 'vi',
};

let imageSeq = 0;

/** Index of the first AI-result step — editing earlier steps invalidates it. */
const RESULT_STEP = WIZARD_STEPS.indexOf('result');

interface WizardState {
  stepIndex: number;
  /** Highest step index the user has reached (for stepper completion marks). */
  furthestStep: number;
  data: WizardData;
  result: GenerateResult | null;
  isGenerating: boolean;
  /** How many times the user has re-run the AI (capped at MAX_REGENERATIONS). */
  regenCount: number;
  exportOptions: ExportOptions;
  /** Pending backward navigation awaiting confirmation (edit-after-result). */
  pendingNav: number | null;

  // navigation
  goTo: (index: number) => void;
  next: () => void;
  back: () => void;
  /** Guarded navigation: warns before editing once an AI result exists. */
  requestGoTo: (index: number) => void;
  confirmNav: () => void;
  cancelNav: () => void;

  // data mutation
  patch: (partial: Partial<WizardData>) => void;
  toggleStyle: (style: DesignStyleId) => void;
  addImages: (floor: number, names: string[]) => void;
  removeImage: (id: string) => void;

  // generation (mock async)
  generate: () => Promise<void>;
  /** Re-run the AI; no-ops once MAX_REGENERATIONS is reached. */
  regenerate: () => Promise<void>;

  // step 5 — render gallery
  toggleFavorite: (id: string) => void;
  setCaption: (id: string, caption: string) => void;

  // step 6 — export
  setExportOption: <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K],
  ) => void;

  reset: () => void;
}

export const useWizardStore = create<WizardState>((set, get) => ({
  stepIndex: 0,
  furthestStep: 0,
  data: INITIAL_DATA,
  result: null,
  isGenerating: false,
  regenCount: 0,
  exportOptions: INITIAL_EXPORT,
  pendingNav: null,

  goTo: (index) =>
    set((s) => {
      const clamped = Math.max(0, Math.min(index, WIZARD_STEPS.length - 1));
      return {
        stepIndex: clamped,
        furthestStep: Math.max(s.furthestStep, clamped),
      };
    }),

  next: () => get().goTo(get().stepIndex + 1),
  back: () => get().requestGoTo(get().stepIndex - 1),

  requestGoTo: (index) => {
    const { result } = get();
    // Editing an input step (before the result) after AI has produced a result
    // requires confirmation — it will discard the result and re-run.
    if (result && index < RESULT_STEP) {
      set({ pendingNav: index });
      return;
    }
    get().goTo(index);
  },

  confirmNav: () =>
    set((s) => {
      const target = s.pendingNav ?? s.stepIndex;
      return {
        pendingNav: null,
        result: null,
        regenCount: 0,
        stepIndex: Math.max(0, Math.min(target, WIZARD_STEPS.length - 1)),
      };
    }),

  cancelNav: () => set({ pendingNav: null }),

  patch: (partial) => set((s) => ({ data: { ...s.data, ...partial } })),

  toggleStyle: (style) =>
    set((s) => {
      const has = s.data.styles.includes(style);
      const styles = has
        ? s.data.styles.filter((x) => x !== style)
        : [...s.data.styles, style];
      return { data: { ...s.data, styles } };
    }),

  addImages: (floor, names) =>
    set((s) => {
      const added: UploadedImage[] = names.map((name) => ({
        id: `img-${++imageSeq}`,
        name,
        floor,
      }));
      return { data: { ...s.data, images: [...s.data.images, ...added] } };
    }),

  removeImage: (id) =>
    set((s) => ({
      data: { ...s.data, images: s.data.images.filter((i) => i.id !== id) },
    })),

  generate: async () => {
    set({ isGenerating: true });
    // Simulate AI processing latency (UI-only mock).
    await new Promise((r) => setTimeout(r, 1400));
    const result = generateResult(get().data, new Date().toISOString());
    set({ isGenerating: false, result });
  },

  regenerate: async () => {
    const { regenCount, isGenerating } = get();
    if (isGenerating || regenCount >= MAX_REGENERATIONS) return;
    set({ regenCount: regenCount + 1 });
    await get().generate();
  },

  toggleFavorite: (id) =>
    set((s) =>
      s.result
        ? {
            result: {
              ...s.result,
              renders: s.result.renders.map((r) =>
                r.id === id ? { ...r, favorite: !r.favorite } : r,
              ),
            },
          }
        : {},
    ),

  setCaption: (id, caption) =>
    set((s) =>
      s.result
        ? {
            result: {
              ...s.result,
              renders: s.result.renders.map((r) =>
                r.id === id ? { ...r, caption } : r,
              ),
            },
          }
        : {},
    ),

  setExportOption: (key, value) =>
    set((s) => ({ exportOptions: { ...s.exportOptions, [key]: value } })),

  reset: () =>
    set({
      stepIndex: 0,
      furthestStep: 0,
      data: INITIAL_DATA,
      result: null,
      isGenerating: false,
      regenCount: 0,
      exportOptions: INITIAL_EXPORT,
      pendingNav: null,
    }),
}));
