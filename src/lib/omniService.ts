import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

/* =========================
   IMAGE HANDLER (QUAN TRỌNG)
========================= */

// 👉 đổi sang "local" nếu m đã tải ảnh về
const USE_LOCAL = false;

function getImage(path: string) {
  if (USE_LOCAL) return `/images/${path}.png`;

  // dùng proxy tránh bị Fandom chặn
  const base = `https://static.wikia.nocookie.net/ben10/images/${path}.png`;
  return "https://images.weserv.nl/?url=" + encodeURIComponent(base);
}

/* =========================
   ALIEN DATA
========================= */

export const ALIENS = [
  { id: "heatblast", name: "Heatblast", type: "Pyronite", image: getImage("5/5b/Heatblast_Omniverse"), power: 85, danger: "CAO" },
  { id: "fourarms", name: "Four Arms", type: "Tetramand", image: getImage("d/d6/Four_Arms_Omniverse"), power: 90, danger: "CAO" },
  { id: "xlr8", name: "XLR8", type: "Kineceleran", image: getImage("a/a2/XLR8_Omniverse"), power: 80, danger: "TRUNG BÌNH" },
  { id: "diamondhead", name: "Diamondhead", type: "Petrosapien", image: getImage("a/a3/Diamondhead_Omniverse"), power: 88, danger: "CAO" },
  { id: "greymatter", name: "Grey Matter", type: "Galvan", image: getImage("d/d3/Grey_Matter_Omniverse"), power: 30, danger: "THẤP" },
  { id: "stinkfly", name: "Stinkfly", type: "Lepidopterran", image: getImage("1/1a/Stinkfly_Omniverse"), power: 65, danger: "TRUNG BÌNH" },
  { id: "ripjaws", name: "Ripjaws", type: "Piscciss Volann", image: getImage("4/4e/Ripjaws_Omniverse"), power: 70, danger: "TRUNG BÌNH" },
  { id: "upgrade", name: "Upgrade", type: "Galvanic Mechamorph", image: getImage("d/d4/Upgrade_Omniverse"), power: 85, danger: "CAO" },
  { id: "ghostfreak", name: "Ghostfreak", type: "Ectonurite", image: getImage("8/8e/Ghostfreak_Omniverse"), power: 82, danger: "NGUY HIỂM" },
  { id: "wildmutt", name: "Wildmutt", type: "Vulpimancer", image: getImage("a/a2/Wildmutt_Omniverse"), power: 75, danger: "TRUNG BÌNH" },

  { id: "cannonbolt", name: "Cannonbolt", type: "Arburian Pelarota", image: getImage("2/23/Cannonbolt_Omniverse"), power: 84, danger: "CAO" },
  { id: "wildvine", name: "Wildvine", type: "Florauna", image: getImage("5/5e/Wildvine_Omniverse"), power: 72, danger: "TRUNG BÌNH" },
  { id: "swampfire", name: "Swampfire", type: "Methanosian", image: getImage("2/2a/Swampfire_Omniverse"), power: 88, danger: "CAO" },
  { id: "echoecho", name: "Echo Echo", type: "Sonorosian", image: getImage("b/b3/Echo_Echo_Omniverse"), power: 86, danger: "CAO" },
  { id: "humungousaur", name: "Humungousaur", type: "Vaxasaurian", image: getImage("2/2c/Humungousaur_Omniverse"), power: 95, danger: "NGUY HIỂM" },
  { id: "jetray", name: "Jetray", type: "Aerophibian", image: getImage("2/24/Jetray_Omniverse"), power: 85, danger: "CAO" },
  { id: "bigchill", name: "Big Chill", type: "Necrofriggian", image: getImage("8/8c/Big_Chill_Omniverse"), power: 83, danger: "CAO" },
  { id: "chromastone", name: "Chromastone", type: "Crystalsapien", image: getImage("7/7b/Chromastone_Omniverse"), power: 92, danger: "CAO" },
  { id: "brainstorm", name: "Brainstorm", type: "Cerebrocrustacean", image: getImage("d/d7/Brainstorm_Omniverse"), power: 78, danger: "TRUNG BÌNH" },
  { id: "spidermonkey", name: "Spidermonkey", type: "Arachnichimp", image: getImage("d/d5/Spidermonkey_Omniverse"), power: 74, danger: "TRUNG BÌNH" },

  { id: "goop", name: "Goop", type: "Polymorph", image: getImage("d/d2/Goop_Omniverse"), power: 76, danger: "TRUNG BÌNH" },
  { id: "alienx", name: "Alien X", type: "Celestialsapien", image: getImage("d/d3/Alien_X_Omniverse"), power: 100, danger: "TỐI THƯỢNG" },
  { id: "rath", name: "Rath", type: "Appoplexian", image: getImage("d/d4/Rath_Omniverse"), power: 88, danger: "CAO" },
  { id: "feedback", name: "Feedback", type: "Conductoid", image: getImage("d/d3/Feedback_Omniverse"), power: 94, danger: "NGUY HIỂM" },
  { id: "bloxx", name: "Bloxx", type: "Segmentasapien", image: getImage("5/59/Bloxx_Omniverse"), power: 80, danger: "TRUNG BÌNH" },
  { id: "gravattack", name: "Gravattack", type: "Galilean", image: getImage("3/3b/Gravattack_Omniverse"), power: 92, danger: "CAO" },
  { id: "shocksquatch", name: "Shocksquatch", type: "Gimlinopithecus", image: getImage("a/a5/Shocksquatch_Omniverse"), power: 84, danger: "CAO" },
  { id: "crashhopper", name: "Crashhopper", type: "Orthopterran", image: getImage("1/1b/Crashhopper_Omniverse"), power: 78, danger: "TRUNG BÌNH" },

  // FIX lỗi chính tả
  { id: "ballweevil", name: "Ball Weevil", type: "Insectoid", image: getImage("2/23/Ball_Weevil_Omniverse"), power: 70, danger: "THẤP" },
  { id: "peskydust", name: "Pesky Dust", type: "Nemuina", image: getImage("1/1d/Pesky_Dust_Omniverse"), power: 60, danger: "THẤP" },
  { id: "waybig", name: "Way Big", type: "To'kustar", image: getImage("f/f1/Way_Big_Omniverse"), power: 98, danger: "TỐI THƯỢNG" },
  { id: "upchuck", name: "Upchuck", type: "Gourmand", image: getImage("5/51/Upchuck_Omniverse"), power: 82, danger: "TRUNG BÌNH" },
  { id: "eyeguy", name: "Eye Guy", type: "Opticoid", image: getImage("1/1b/Eye_Guy_Omniverse"), power: 84, danger: "CAO" },
  { id: "ditto", name: "Ditto", type: "Splixson", image: getImage("c/c1/Ditto_Omniverse"), power: 65, danger: "TRUNG BÌNH" },
  { id: "arcticguana", name: "Arcticguana", type: "Manzill", image: getImage("a/a3/Arcticguana_Omniverse"), power: 78, danger: "TRUNG BÌNH" },
  { id: "blitzwolfer", name: "Blitzwolfer", type: "Loboan", image: getImage("2/2e/Blitzwolfer_Omniverse"), power: 85, danger: "CAO" },
  { id: "snareoh", name: "Snare-oh", type: "Thep Khufan", image: getImage("6/6a/Snare-oh_Omniverse"), power: 80, danger: "TRUNG BÌNH" },
  { id: "frankenstrike", name: "Frankenstrike", type: "Transylian", image: getImage("c/c9/Frankenstrike_Omniverse"), power: 88, danger: "CAO" },
  { id: "nanomech", name: "Nanomech", type: "Nanochip", image: getImage("2/2a/Nanomech_Omniverse"), power: 50, danger: "THẤP" },
  { id: "lodestar", name: "Lodestar", type: "Biosovortian", image: getImage("d/d4/Lodestar_Omniverse"), power: 86, danger: "CAO" },
  { id: "ampfibian", name: "AmpFibian", type: "Amperi", image: getImage("4/4b/AmpFibian_Omniverse"), power: 84, danger: "CAO" },
  { id: "armodrillo", name: "Armodrillo", type: "Talpaedan", image: getImage("2/2a/Armodrillo_Omniverse"), power: 90, danger: "CAO" },
  { id: "terraspin", name: "Terraspin", type: "Geochelone Aerio", image: getImage("5/5e/Terraspin_Omniverse"), power: 82, danger: "TRUNG BÌNH" },
  { id: "nrg", name: "NRG", type: "Prypiatosian-B", image: getImage("a/a3/NRG_Omniverse"), power: 92, danger: "NGUY HIỂM" },
  { id: "waterhazard", name: "Water Hazard", type: "Orishan", image: getImage("4/4e/Water_Hazard_Omniverse"), power: 80, danger: "TRUNG BÌNH" },
  { id: "clockwork", name: "Clockwork", type: "Chronosapien", image: getImage("d/d4/Clockwork_Omniverse"), power: 95, danger: "NGUY HIỂM" },
  { id: "juryrigg", name: "Jury Rigg", type: "Planchakule", image: getImage("d/d4/Jury_Rigg_Omniverse"), power: 70, danger: "TRUNG BÌNH" },
  { id: "atomix", name: "Atomix", type: "Unknown", image: getImage("d/d4/Atomix_Omniverse"), power: 99, danger: "TỐI THƯỢNG" },
  { id: "gutrot", name: "Gutrot", type: "Unknown", image: getImage("d/d4/Gutrot_Omniverse"), power: 85, danger: "CAO" },
  { id: "whampire", name: "Whampire", type: "Vladat", image: getImage("d/d4/Whampire_Omniverse"), power: 90, danger: "CAO" },
  { id: "bullfrag", name: "Bullfrag", type: "Incursean", image: getImage("d/d4/Bullfrag_Omniverse"), power: 82, danger: "TRUNG BÌNH" },
  { id: "astrodactyl", name: "Astrodactyl", type: "Unknown", image: getImage("d/d4/Astrodactyl_Omniverse"), power: 84, danger: "CAO" },
  { id: "theworst", name: "The Worst", type: "Atrocian", image: getImage("d/d4/The_Worst_Omniverse"), power: 40, danger: "THẤP" },
  { id: "walkatrout", name: "Walkatrout", type: "Ickthyoid", image: getImage("d/d4/Walkatrout_Omniverse"), power: 35, danger: "THẤP" },
  { id: "molestache", name: "Mole-Stache", type: "Unknown", image: getImage("d/d4/Mole-Stache_Omniverse"), power: 75, danger: "TRUNG BÌNH" },
  { id: "toepick", name: "Toepick", type: "Unknown", image: getImage("d/d4/Toepick_Omniverse"), power: 88, danger: "CAO" },
];

/* =========================
   AI FUSION (KHÔNG ĐỔI)
========================= */

export async function generateFusionImage(alien1: string, alien2: string, stability: string) {
  try {
    let stabilityDesc = "";
    if (stability === "ỔN ĐỊNH") stabilityDesc = "The fusion is stable, maintaining the base structure of the primary alien while incorporating armor and colors from the secondary alien.";
    if (stability === "BẤT ỔN") stabilityDesc = "The fusion is unstable, chaotic, asymmetrical.";
    if (stability === "HỖN MANG") stabilityDesc = "The fusion is monstrous and unpredictable.";

    const prompt = `Ben 10 Biomnitrix fusion of ${alien1} and ${alien2}. ${stabilityDesc}. Omniverse style, cinematic lighting, detailed, dark background.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: prompt }],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Fusion error:", error);
    return null;
  }
}