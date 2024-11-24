import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { TarotCardCategory, tarotCards } from "~/db/schema";
import { authMiddleware } from "../utils/authMiddleware";
import type { HonoPropsType } from "../utils/createApp";

export const insertSeedApi = createFactory<HonoPropsType>().createHandlers(
  authMiddleware,
  async (c) => {
    const me = c.get("me");
    if (!me) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const db = drizzle(c.env.DB);

    const card = await db.select().from(tarotCards).limit(1).get();
    if (card) {
      return c.json({ error: "Already seeded" }, 400);
    }

    await db.insert(tarotCards).values([
      {
        name: "愚者",
        description: "新しい旅立ち、自由、無限の可能性を象徴するカード",
        uprightMeaning: "冒険心、自由、純粋さ、信念",
        reversedMeaning: "不注意、愚かさ、無計画、リスクを取ることの恐れ",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 0,
      },
      {
        name: "魔術師",
        description: "創造力、行動、意志力を象徴するカード",
        uprightMeaning: "創造力、集中、成功、技術",
        reversedMeaning: "計画の失敗、悪用、不誠実",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 1,
      },
      {
        name: "女司祭",
        description: "知識、直感、秘密を象徴するカード",
        uprightMeaning: "直感、知識、洞察、秘密",
        reversedMeaning: "隠れた意図、不正確な情報、混乱",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 2,
      },
      {
        name: "女帝",
        description: "母性、豊かさ、創造力を象徴するカード",
        uprightMeaning: "豊かさ、成長、創造、育成",
        reversedMeaning: "不安、抑圧、停滞、損失",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 3,
      },
      {
        name: "皇帝",
        description: "権威、秩序、安定を象徴するカード",
        uprightMeaning: "安定、リーダーシップ、成功、保護",
        reversedMeaning: "独裁的、支配欲、柔軟性の欠如",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 4,
      },
      {
        name: "教皇",
        description: "信仰、伝統、導きを象徴するカード",
        uprightMeaning: "精神性、信仰、指導、教育",
        reversedMeaning: "独断、偏見、偽善、不信",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 5,
      },
      {
        name: "恋人たち",
        description: "選択、調和、愛を象徴するカード",
        uprightMeaning: "愛、調和、選択、コミットメント",
        reversedMeaning: "不一致、分裂、誘惑、不信感",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 6,
      },
      {
        name: "戦車",
        description: "意志力、勝利、コントロールを象徴するカード",
        uprightMeaning: "意志、成功、決断、進歩",
        reversedMeaning: "自制心の欠如、敗北、無計画",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 7,
      },
      {
        name: "力",
        description: "内なる強さ、勇気、忍耐を象徴するカード",
        uprightMeaning: "強さ、勇気、忍耐、自己信頼",
        reversedMeaning: "弱さ、不安、無力、恐怖",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 8,
      },
      {
        name: "隠者",
        description: "内省、孤独、知恵を象徴するカード",
        uprightMeaning: "洞察、内省、知恵、ガイド",
        reversedMeaning: "孤立、無目的、自己中心的",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 9,
      },
      {
        name: "運命の輪",
        description: "運命、変化、転換点を象徴するカード",
        uprightMeaning: "転換、運命、チャンス、流れ",
        reversedMeaning: "逆境、不運、制御不能",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 10,
      },
      {
        name: "正義",
        description: "公正、責任、バランスを象徴するカード",
        uprightMeaning: "公平、公正、責任、真実",
        reversedMeaning: "不正、不公平、偏見、無責任",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 11,
      },
      {
        name: "吊るされた男",
        description: "犠牲、視点の変化、内なる探求を象徴するカード",
        uprightMeaning: "内省、新しい視点、忍耐、自己犠牲",
        reversedMeaning: "停滞、無駄な犠牲、犠牲の拒否",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 12,
      },
      {
        name: "死神",
        description: "終わり、新しい始まり、変容を象徴するカード",
        uprightMeaning: "変容、終わり、再生、新しい始まり",
        reversedMeaning: "抵抗、変化への恐れ、停滞",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 13,
      },
      {
        name: "節制",
        description: "調和、バランス、自己制御を象徴するカード",
        uprightMeaning: "調和、自己制御、忍耐、バランス",
        reversedMeaning: "過剰、不均衡、自己管理の欠如",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 14,
      },
      {
        name: "悪魔",
        description: "束縛、誘惑、物質的な執着を象徴するカード",
        uprightMeaning: "誘惑、執着、依存、物質主義",
        reversedMeaning: "解放、執着からの解放、自己認識",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 15,
      },
      {
        name: "塔",
        description: "突然の変化、破壊、啓示を象徴するカード",
        uprightMeaning: "変化、破壊、啓示、再構築",
        reversedMeaning: "抵抗、回避、壊滅的な誤解",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 16,
      },
      {
        name: "星",
        description: "希望、癒し、指針を象徴するカード",
        uprightMeaning: "希望、癒し、インスピレーション、信仰",
        reversedMeaning: "失望、混乱、信念の欠如",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 17,
      },
      {
        name: "月",
        description: "直感、不安、潜在意識を象徴するカード",
        uprightMeaning: "直感、夢、不安、未知",
        reversedMeaning: "明晰、真実、不安の解消",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 18,
      },
      {
        name: "太陽",
        description: "成功、喜び、エネルギーを象徴するカード",
        uprightMeaning: "成功、喜び、生命力、達成",
        reversedMeaning: "自信過剰、楽観的すぎる、停滞",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 19,
      },
      {
        name: "審判",
        description: "決断、再生、カルマを象徴するカード",
        uprightMeaning: "再生、決断、覚醒、カルマ",
        reversedMeaning: "躊躇、後悔、自己批判",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 20,
      },
      {
        name: "世界",
        description: "達成、完成、統合を象徴するカード",
        uprightMeaning: "完成、達成、統合、新たな始まり",
        reversedMeaning: "未完成、不完全、停滞、欠如感",
        category: TarotCardCategory.MajorArcana,
        cardNumber: 21,
      },
    ]);

    return c.json({ data: "ok" });
  },
);
