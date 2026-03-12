export async function createDeposit(env, amountCents = 10000) {
  const res = await fetch("https://api.stripe.com/v1/payment_intents", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      amount: amountCents,
      currency: "usd",
      capture_method: "manual"
    })
  });

  return await res.json();
}

export async function captureAmount(env, paymentIntentId, amountCents) {
  const res = await fetch(`https://api.stripe.com/v1/payment_intents/${paymentIntentId}/capture`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.STRIPE_SECRET}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      amount_to_capture: amountCents
    })
  });

  return await res.json();
}
