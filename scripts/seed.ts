import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

// ✅ Load environment variables
const supabaseUrl = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only

// Use service role client (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

async function main() {
  // 1. Create a demo user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: "demo@test.com",
    password: "demo1234",
    email_confirm: true,
  })
  if (userError) throw userError

  const userId = userData.user?.id
  if (!userId) throw new Error("Failed to create user")

  console.log("✅ Created user:", userId)

  // 2. Insert profile
  const { error: profileError } = await supabaseAdmin.from("profiles").insert({
    id: userId,
    username: "demo_user",
    avatar_url: "https://i.pravatar.cc/150?img=5",
    locale: "en",
  })
  if (profileError) throw profileError
  console.log("✅ Inserted profile")

  // 3. Insert quest
  const { data: quest, error: questError } = await supabaseAdmin.from("quests").insert({
    title: "Berlin Adventure",
    description: "Solve riddles across Berlin landmarks",
    city: "Berlin",
    country: "Germany",
    hero_image: "https://picsum.photos/600/400",
    created_by: userId,
  }).select().single()
  if (questError) throw questError
  console.log("✅ Inserted quest:", quest.id)

  // 4. Insert riddles
  const { error: riddlesError } = await supabaseAdmin.from("riddles").insert([
    {
      quest_id: quest.id,
      title: "Checkpoint Charlie",
      prompt: "What historic barrier once stood here?",
      image: "https://picsum.photos/200/150",
      answer: "Berlin Wall",
      hint: "Think Cold War",
      latitude: 52.5076,
      longitude: 13.3904,
      radius_m: 30,
      order_index: 1,
    },
    {
      quest_id: quest.id,
      title: "Brandenburg Gate",
      prompt: "This gate once divided a city. What is its name?",
      image: "https://picsum.photos/200/150?2",
      answer: "Brandenburg Gate",
      hint: "Famous landmark",
      latitude: 52.5163,
      longitude: 13.3777,
      radius_m: 30,
      order_index: 2,
    },
  ])
  if (riddlesError) throw riddlesError
  console.log("✅ Inserted riddles")

  // 5. Insert lobby
  const { data: lobby, error: lobbyError } = await supabaseAdmin.from("lobbies").insert({
    code: "DEMO1234",
    host_id: userId,
    quest_id: quest.id,
    status: "waiting",
  }).select().single()
  if (lobbyError) throw lobbyError
  console.log("✅ Inserted lobby:", lobby.id)

  // 6. Add user to lobby_players
  const { error: playerError } = await supabaseAdmin.from("lobby_players").insert({
    lobby_id: lobby.id,
    player_id: userId,
    is_host: true,
    is_ready: false,
  })
  if (playerError) throw playerError
  console.log("✅ Added user to lobby_players")

  // 7. Seed user credits 💰
  const { error: creditsError } = await supabaseAdmin.from("user_credits").upsert({
    user_id: userId,
    balance: 100, // give demo user 100 credits
    updated_at: new Date().toISOString(),
  })
  if (creditsError) throw creditsError
  console.log("✅ Seeded user credits (100)")

  // 8. Insert a purchase record
  const { error: purchaseError } = await supabaseAdmin.from("purchases").insert({
    user_id: userId,
    package_id: "CREDITS_100",
    credits: 100,
    amount: 5.00,
    currency: "USD",
  })
  if (purchaseError) throw purchaseError
  console.log("✅ Inserted purchase record (100 credits for $5)")

  console.log("🎉 Seed complete!")
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err)
  process.exit(1)
})
