import { supabaseAdmin } from "./supabase-admin";

export async function ensureUserProfile(email) {
  if (!email) throw new Error("Email is required");

  const { data: existingProfile, error: profileFetchError } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (profileFetchError) {
    throw profileFetchError;
  }

  if (!existingProfile) {
    const { error: profileInsertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        email,
        plan: "free",
      });

    if (profileInsertError) {
      throw profileInsertError;
    }
  }

  const { data: existingUsage, error: usageFetchError } = await supabaseAdmin
    .from("usage_counters")
    .select("*")
    .eq("email", email)
    .maybeSingle();

  if (usageFetchError) {
    throw usageFetchError;
  }

  if (!existingUsage) {
    const { error: usageInsertError } = await supabaseAdmin
      .from("usage_counters")
      .insert({
        email,
        free_generations_used: 0,
      });

    if (usageInsertError) {
      throw usageInsertError;
    }
  }
}

export async function getUserPlan(email) {
  await ensureUserProfile(email);

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("email", email)
    .single();

  if (error) {
    throw error;
  }

  return data.plan;
}

export async function setUserPlan(email, plan) {
  await ensureUserProfile(email);

  const { error } = await supabaseAdmin
    .from("profiles")
    .update({ plan })
    .eq("email", email);

  if (error) {
    throw error;
  }
}

export async function getFreeUsage(email) {
  await ensureUserProfile(email);

  const { data, error } = await supabaseAdmin
    .from("usage_counters")
    .select("free_generations_used")
    .eq("email", email)
    .single();

  if (error) {
    throw error;
  }

  return data.free_generations_used;
}

export async function incrementFreeUsage(email) {
  await ensureUserProfile(email);

  const current = await getFreeUsage(email);

  const { data, error } = await supabaseAdmin
    .from("usage_counters")
    .update({
      free_generations_used: current + 1,
    })
    .eq("email", email)
    .select("free_generations_used")
    .single();

  if (error) {
    throw error;
  }

  return data.free_generations_used;
}

export async function resetFreeUsage(email) {
  await ensureUserProfile(email);

  const { error } = await supabaseAdmin
    .from("usage_counters")
    .update({
      free_generations_used: 0,
    })
    .eq("email", email);

  if (error) {
    throw error;
  }
}

export async function canUseAi(email) {
  const plan = await getUserPlan(email);

  if (plan === "pro" || plan === "ultra") {
    return {
      allowed: true,
      plan,
      remainingFreeUses: null,
    };
  }

  const used = await getFreeUsage(email);
  const remaining = Math.max(0, 3 - used);

  if (used >= 3) {
    return {
      allowed: false,
      plan: "free",
      remainingFreeUses: 0,
    };
  }

  return {
    allowed: true,
    plan: "free",
    remainingFreeUses: remaining,
  };
}

export async function consumeAiUsageIfNeeded(email) {
  const plan = await getUserPlan(email);

  if (plan === "free") {
    await incrementFreeUsage(email);
  }
}

export async function canUseUltraFeatures(email) {
  const plan = await getUserPlan(email);

  return plan === "ultra";
}

export async function saveStripeCustomerData({
  email,
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  subscriptionStatus,
}) {
  await ensureUserProfile(email);

  const { error } = await supabaseAdmin
    .from("stripe_customers")
    .upsert({
      email,
      stripe_customer_id: stripeCustomerId || null,
      stripe_subscription_id: stripeSubscriptionId || null,
      stripe_price_id: stripePriceId || null,
      subscription_status: subscriptionStatus || null,
    }, {
      onConflict: "email",
    });

  if (error) {
    throw error;
  }
}
export async function getUserPlanFromDb(email) {
  await ensureUserProfile(email);

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("plan")
    .eq("email", email)
    .single();

  if (error) {
    throw error;
  }

  return data.plan;
}