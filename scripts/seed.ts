import { createClient } from "@supabase/supabase-js"
import "dotenv/config"

// ✅ Load environment variables
const supabaseUrl = process.env.SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // server-only

// Use service role client (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey)

async function seed() {
  // Create demo user (if not exists)
  const { data: user } = await supabaseAdmin.auth.admin.createUser({
    email: "demo@example.com",
    password: "password123",
    email_confirm: true,
  })

  const userId = user.user?.id

  // Base quests with ISO country + i18n city keys
  const quests = [
    {
      city: "jerusalem", // ✅ stored as i18n key
      country: "IL",     // ✅ stored as ISO code
      latitude: 31.781817132049294,
      longitude: 35.218340753067416,
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/2/28/Midrachov_jerusalem_mozesy2.jpg",
      translations: {
        en: {
          title: "Ben Yehuda Adventure",
          description: "Explore the famous Ben Yehuda street with fun riddles.",
        },
        he: {
          title: "הרפתקת בן יהודה",
          description: "גלו את רחוב בן יהודה המפורסם עם חידות מהנות.",
        },
      },
    },
    {
      city: "tel_aviv",
      country: "IL",
      latitude: 32.099056731873475,
      longitude: 34.77621753433228,
      heroImage: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FTel_Aviv_Port&psig=AOvVaw3tSeaYrv9EryjRERgh0ShB&ust=1756207379170000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPCWhcfspY8DFQAAAAAdAAAAABAE", 
      translations: {
        en: {
          title: "Tel Aviv Harbor Mystery",
          description: "Solve mysteries around the Tel Aviv Harbor.",
        },
        he: {
          title: "תעלומת נמל תל אביב",
          description: "פתרו חידות סביב נמל תל אביב.",
        },
      },
    },
    {
      city: "jerusalem",
      country: "IL",
      latitude: 31.785738211826477,
      longitude: 35.21224344921162,
      heroImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Mahane_Yehuda_%28I%29_%2845298221191%29.jpg/330px-Mahane_Yehuda_%28I%29_%2845298221191%29.jpg",
      translations: {
        en: {
          title: "Mahane Yehuda Market Challenge",
          description: "Discover secrets hidden in Mahane Yehuda Market.",
        },
        he: {
          title: "אתגר שוק מחנה יהודה",
          description: "גלו סודות חבויים בשוק מחנה יהודה.",
        },
      },
    },
    {
      city: "jerusalem",
      country: "IL",
      latitude: 31.801401531841385,
      longitude: 35.161203252557094,
      heroImage:"",
      translations: {
        en: {
          title: "Dudu's House",
          description: "A quirky quest starting at Dudu’s house.",
        },
        he: {
          title: "הבית של דודו",
          description: "משימה מיוחדת שמתחילה בבית של דודו.",
        },
      },
    },
  ]

  for (const quest of quests) {
    // Insert quest base row
    const { data: questRow, error: questErr } = await supabaseAdmin
      .from("quests")
      .insert({
        created_by: userId,
        city: quest.city,
        country: quest.country,
        latitude: quest.latitude,
        longitude: quest.longitude,
        hero_image: quest.heroImage ?? "", // ✅ optional

      })
      .select()
      .single()

    if (questErr) throw questErr
    const questId = questRow.id

    // Insert translations
    await supabaseAdmin.from("quest_translations").insert([
      { quest_id: questId, locale: "en", ...quest.translations.en },
      { quest_id: questId, locale: "he", ...quest.translations.he },
    ])

    // Insert riddles (2 per quest)
    const riddles = [
      {
        latitude: quest.latitude + 0.0005,
        longitude: quest.longitude + 0.0005,
        order_index: 1,
        image: null,
        translations: {
          en: {
            title: "Find the Sign",
            prompt: "Look around for a blue street sign. What number is on it?",
            hint: "It’s near the main corner.",
          },
          he: {
            title: "מצאו את השלט",
            prompt: "חפשו שלט רחוב כחול. איזה מספר מופיע עליו?",
            hint: "זה ליד הפינה הראשית.",
          },
        },
      },
      {
        latitude: quest.latitude - 0.0005,
        longitude: quest.longitude - 0.0005,
        order_index: 2,
        image: null,
        translations: {
          en: {
            title: "Smell the Market",
            prompt: "Which spice has the strongest smell nearby?",
            hint: "Think of something yellow.",
          },
          he: {
            title: "ריח השוק",
            prompt: "איזה תבלין מריח הכי חזק בסביבה?",
            hint: "חשבו על משהו צהוב.",
          },
        },
      },
    ]

    for (const riddle of riddles) {
      const { data: riddleRow, error: riddleErr } = await supabaseAdmin
        .from("riddles")
        .insert({
          quest_id: questId,
          latitude: riddle.latitude,
          longitude: riddle.longitude,
          order_index: riddle.order_index,
          image: riddle.image ?? null, // ✅ can be seeded or left null
        })
        .select()
        .single()

      if (riddleErr) throw riddleErr
      const riddleId = riddleRow.id

      await supabaseAdmin.from("riddle_answers").insert([
        { riddle_id: riddleId, answer: "42", is_correct: true }
      ])

      await supabaseAdmin.from("riddle_translations").insert([
        { riddle_id: riddleId, locale: "en", ...riddle.translations.en },
        { riddle_id: riddleId, locale: "he", ...riddle.translations.he },
      ])
    }
  }

  console.log("✅ Seed complete with Israel quests + riddles, using ISO country + i18n city keys")
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
