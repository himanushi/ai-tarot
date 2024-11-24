import { drizzle } from "drizzle-orm/d1";
import { createFactory } from "hono/factory";
import { tarotCards } from "~/db/schema";
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
      },
      {
        name: "魔術師",
        description: "創造力と実現力を象徴するカード",
        uprightMeaning: "創造性、集中力、自己実現、意志力",
        reversedMeaning: "欺瞞、計画の欠如、潜在能力の未活用",
      },
      {
        name: "女司祭",
        description: "直感と秘教的な知識を象徴するカード",
        uprightMeaning: "直感、内なる知恵、神秘、霊的なガイド",
        reversedMeaning: "秘密、混乱、不信感、霊的な停滞",
      },
      {
        name: "女帝",
        description: "豊かさ、創造性、母性を象徴するカード",
        uprightMeaning: "豊穣、愛、成長、自然との調和",
        reversedMeaning: "停滞、不和、依存、過度な過保護",
      },
      {
        name: "皇帝",
        description: "権力、安定、構造を象徴するカード",
        uprightMeaning: "リーダーシップ、安定性、責任、計画性",
        reversedMeaning: "独裁、硬直、無責任、制御不能",
      },
      {
        name: "教皇",
        description: "伝統と精神的な指導を象徴するカード",
        uprightMeaning: "信仰、教育、精神的なガイド、規範",
        reversedMeaning: "反抗、形式的、独自性の欠如、誤った教え",
      },
      {
        name: "恋人たち",
        description: "愛、調和、選択を象徴するカード",
        uprightMeaning: "愛、調和、深い結びつき、重要な選択",
        reversedMeaning: "不和、葛藤、間違った選択、コミットメントの欠如",
      },
      {
        name: "戦車",
        description: "勝利、意思力、成功への推進力を象徴するカード",
        uprightMeaning: "成功、意志力、コントロール、前進",
        reversedMeaning: "挫折、コントロールの欠如、衝動的な行動",
      },
      {
        name: "力",
        description: "内なる力、勇気、忍耐を象徴するカード",
        uprightMeaning: "勇気、忍耐、信念、自己制御",
        reversedMeaning: "弱さ、不安、感情の抑制不能、恐れ",
      },
      {
        name: "隠者",
        description: "内省、孤独、精神的探求を象徴するカード",
        uprightMeaning: "自己反省、探求、知恵、内なる導き",
        reversedMeaning: "孤立、逃避、不安、他人との断絶",
      },
      {
        name: "運命の輪",
        description: "運命の変化、周期、チャンスを象徴するカード",
        uprightMeaning: "幸運、転機、周期の終わりと新しい始まり",
        reversedMeaning: "不運、停滞、機会の喪失、制御の欠如",
      },
      {
        name: "正義",
        description: "公正、真実、バランスを象徴するカード",
        uprightMeaning: "公平、誠実、バランス、責任",
        reversedMeaning: "不公平、偏見、嘘、責任逃れ",
      },
      {
        name: "吊るされた男",
        description: "犠牲、視点の変化、受容を象徴するカード",
        uprightMeaning: "新しい視点、自己犠牲、受容、瞑想",
        reversedMeaning: "犠牲の無意味さ、自己中心的、停滞",
      },
      {
        name: "死神",
        description: "終わりと新しい始まり、変化を象徴するカード",
        uprightMeaning: "変化、浄化、再生、新しい始まり",
        reversedMeaning: "抵抗、停滞、変化への恐れ",
      },
      {
        name: "節制",
        description: "バランス、調和、忍耐を象徴するカード",
        uprightMeaning: "節度、調和、忍耐、協力",
        reversedMeaning: "極端、混乱、不均衡、衝動",
      },
      {
        name: "悪魔",
        description: "束縛、欲望、執着を象徴するカード",
        uprightMeaning: "誘惑、執着、物質主義、自己中心的",
        reversedMeaning: "解放、欲望の克服、自己制御",
      },
      {
        name: "塔",
        description: "突然の変化、崩壊、啓示を象徴するカード",
        uprightMeaning: "変化、崩壊、新たな始まりへの準備",
        reversedMeaning: "回避、変化への抵抗、未解決の問題",
      },
      {
        name: "星",
        description: "希望、癒し、指針を象徴するカード",
        uprightMeaning: "希望、癒し、信仰、明るい未来",
        reversedMeaning: "失望、絶望、混乱、無気力",
      },
      {
        name: "月",
        description: "直感、不安、幻惑を象徴するカード",
        uprightMeaning: "直感、不確実性、夢、潜在意識",
        reversedMeaning: "混乱、幻惑、恐れ、不安定",
      },
      {
        name: "太陽",
        description: "成功、幸福、明瞭さを象徴するカード",
        uprightMeaning: "幸福、成功、喜び、自己実現",
        reversedMeaning: "自己中心的、不透明さ、成功の遅延",
      },
      {
        name: "審判",
        description: "覚醒、評価、再生を象徴するカード",
        uprightMeaning: "再生、判断、自己発見、新しい段階",
        reversedMeaning: "自己批判、迷い、目覚めの遅延",
      },
      {
        name: "世界",
        description: "完成、統合、達成を象徴するカード",
        uprightMeaning: "完成、達成、統一、旅の終わり",
        reversedMeaning: "未完成、停滞、閉塞感、未達成の目標",
      },
    ]);

    return c.json({ data: "ok" });
  },
);
