"use client";

import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let initialized = false;
let initFailed = false;

export function initMixpanel() {
  if (initialized || initFailed || !MIXPANEL_TOKEN || typeof window === "undefined") return;

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: process.env.NODE_ENV === "development",
      track_pageview: true,
      persistence: "localStorage",
      ignore_dnt: false, // Respect Do Not Track
      opt_out_tracking_by_default: false,
    });
    initialized = true;
  } catch (error) {
    console.warn("Mixpanel initialization failed:", error);
    initFailed = true;
  }
}

// Identify user after sign-in
export function identifyUser(userId: string, email?: string) {
  if (!initialized) return;

  try {
    mixpanel.identify(userId);
    if (email) {
      mixpanel.people.set({
        $email: email,
        $last_seen: new Date().toISOString(),
      });
    }
  } catch {
    // Silently fail - analytics shouldn't break the app
  }
}

// Reset on sign-out
export function resetUser() {
  if (!initialized) return;
  try {
    mixpanel.reset();
  } catch {
    // Silently fail
  }
}

// Track events
export function track(event: string, properties?: Record<string, unknown>) {
  if (!initialized) return;
  try {
    mixpanel.track(event, properties);
  } catch {
    // Silently fail - analytics shouldn't break the app
  }
}

// Predefined events
export const analytics = {
  // Page views
  pageView: (page: string) => {
    track("Page View", { page });
  },

  // Wallpaper generation
  generationStarted: (props: {
    city?: string;
    style: string;
    devices: string[];
    aiEnabled: boolean;
  }) => {
    track("Generation Started", props);
  },

  generationCompleted: (props: {
    city?: string;
    style: string;
    devices: string[];
    aiEnabled: boolean;
    durationMs: number;
  }) => {
    track("Generation Completed", props);
  },

  generationFailed: (props: {
    style: string;
    error: string;
  }) => {
    track("Generation Failed", props);
  },

  // Downloads
  wallpaperDownloaded: (props: {
    device: string;
    style: string;
  }) => {
    track("Wallpaper Downloaded", props);
  },

  // Auth
  signUpStarted: () => {
    track("Sign Up Started");
  },

  signUpCompleted: (email: string) => {
    track("Sign Up Completed", { email });
  },

  signInCompleted: (email: string) => {
    track("Sign In Completed", { email });
  },

  signOut: () => {
    track("Sign Out");
    resetUser();
  },

  // Purchases
  checkoutStarted: (props: {
    priceId: string;
    amount: number;
    currency: string;
  }) => {
    track("Checkout Started", props);
  },

  purchaseCompleted: (props: {
    priceId: string;
    amount: number;
    currency: string;
    transactionId?: string;
  }) => {
    track("Purchase Completed", props);
    if (mixpanel.people) {
      mixpanel.people.set({
        plan: "pro",
        $last_purchase: new Date().toISOString(),
      });
    }
  },

  // Style/City interactions
  styleSelected: (style: string) => {
    track("Style Selected", { style });
  },

  citySearched: (query: string) => {
    track("City Searched", { query });
  },

  citySelected: (props: {
    city?: string;
    lat: number;
    lng: number;
  }) => {
    track("City Selected", props);
  },

  deviceToggled: (props: {
    device: string;
    enabled: boolean;
  }) => {
    track("Device Toggled", props);
  },
};
