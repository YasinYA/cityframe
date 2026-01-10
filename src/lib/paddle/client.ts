declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (env: "sandbox" | "production") => void;
      };
      Initialize: (options: { token: string }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          customer?: { email?: string };
          customData?: Record<string, string>;
          settings?: {
            successUrl?: string;
            displayMode?: "overlay" | "inline";
            theme?: "light" | "dark";
            locale?: string;
          };
        }) => void;
      };
    };
  }
}

let paddleInitialized = false;

export function initializePaddle(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (paddleInitialized && window.Paddle) {
      resolve();
      return;
    }

    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!clientToken) {
      reject(new Error("NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set"));
      return;
    }

    // Check if script already exists
    if (document.querySelector('script[src*="paddle.js"]')) {
      if (window.Paddle) {
        window.Paddle.Initialize({ token: clientToken });
        if (process.env.NODE_ENV !== "production") {
          window.Paddle.Environment.set("sandbox");
        }
        paddleInitialized = true;
        resolve();
      } else {
        // Wait for Paddle to load
        const checkPaddle = setInterval(() => {
          if (window.Paddle) {
            clearInterval(checkPaddle);
            window.Paddle.Initialize({ token: clientToken });
            if (process.env.NODE_ENV !== "production") {
              window.Paddle.Environment.set("sandbox");
            }
            paddleInitialized = true;
            resolve();
          }
        }, 100);
      }
      return;
    }

    // Load Paddle.js
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;

    script.onload = () => {
      if (window.Paddle) {
        window.Paddle.Initialize({ token: clientToken });
        if (process.env.NODE_ENV !== "production") {
          window.Paddle.Environment.set("sandbox");
        }
        paddleInitialized = true;
        resolve();
      } else {
        reject(new Error("Paddle failed to load"));
      }
    };

    script.onerror = () => {
      reject(new Error("Failed to load Paddle.js"));
    };

    document.head.appendChild(script);
  });
}

export async function openPaddleCheckout(
  priceId: string,
  email?: string,
  customerId?: string
): Promise<void> {
  await initializePaddle();

  if (!window.Paddle) {
    throw new Error("Paddle is not initialized");
  }

  const successUrl = `${window.location.origin}/success?source=paddle`;

  window.Paddle.Checkout.open({
    items: [{ priceId, quantity: 1 }],
    customer: email ? { email } : undefined,
    customData: customerId ? { customerId } : undefined,
    settings: {
      successUrl,
      displayMode: "overlay",
      theme: "dark",
    },
  });
}
