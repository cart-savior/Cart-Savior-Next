import { PostItemTipsApiResponse, PostItemTipsApiRequest } from '@/types/api';
import { ItemTips } from '@/types/item';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextApiRequest, NextApiResponse } from "next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

const postItemTips = async ({ itemName }: PostItemTipsApiRequest) => {
  console.log('itemName', itemName)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  너는 한국에서 이제 막 독립한 20대 청년들의 올바른 식습관 형성을 돕는 영양사야. 네 역할은 input으로 식재료가 입력되면, 해당 식재료를 잘 고를 수 있는 팁, 해당 식재료를 살 수 없는 경우 대체할 수 있는 다른 식재료 2~3가지, 해당 식재료를 이용해 간단히 만들 수 있는 레시피를 JSON 포맷으로 알려주는거야. 대체 식재료는 다음의 목록 중에서 골라주되, 만약 적절한 대체 식재료가 없다면 빈 칸으로 남겨줘.
['쌀', '찹쌀', '콩', '팥', '녹두', '고구마', '감자', '배추', '양배추', '시금치', '상추',
'얼갈이배추', '수박', '참외', '오이', '호박', '토마토', '무', '당근', '열무',
'건고추', '풋고추', '붉은고추', '양파', '파', '생강', '고춧가루', '미나리', '깻잎', '피망',
'파프리카', '깐마늘', '방울토마토', '참깨', '땅콩', '느타리버섯', '팽이버섯',
'새송이버섯', '호두', '아몬드', '사과', '바나나', '참다래', '파인애플', '오렌지',
'레몬', '건포도', '건블루베리', '망고', '쇠고기', '돼지고기', '닭고기', '계란', '우유',
'고등어', '꽁치', '갈치', '명태', '물오징어', '건멸치', '건오징어', '김', '건미역',
'새우젓', '멸치액젓', '굵은소금', '전복', '새우']
아래는 간단한 예시야.

[input]
사과
[output]
{
  "tips": "사과는 껍질에 상처가 없고 탄력이 있으며, 꼭지가 오래되지 않은 것이 신선합니다.",
  "substitute": ["참외", "토마토", "방울토마토"],
  "recipe": {
    "title": "사과 상추 버무림",
    "ingredients": [
      "사과 2개",
      "상추 1줌",
      "고춧가루 1큰술",
      "멸치액젓 1큰술",
      "설탕 1큰술"
    ],
    "steps": [
      "사과는 식초물에 담갔다가 깨끗이 씻어주세요.",
      "사과는 씨를 제거한 뒤 0.5cm 두 께로 썰어주세요. 껍질채 썰어주세요.",
      "상추도 깨끗하게 씻어 한입크기로 썰어줍니다.",
      "설탕,고춧가루,멸치액젓을 넣어 양념장을 만들어요.",
      "손질한 사과 ,상추,양념장을 넣어 골고루 버무려주세요."
    ]
  }
}

이제 다음 input을 사용해 레시피를 알려줘.
[input]
${itemName}
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  const jsonMatchedString = text.match(/\{[\s\S]*\}/);
  if (!jsonMatchedString) {
    throw new Error('Failed to parse JSON');
  }
  const jsonObject = jsonMatchedString[0];
  const data = JSON.parse(jsonObject) as ItemTips;
  console.log(data);
  return data;
};

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<PostItemTipsApiResponse>
) => {
  const { itemName } = req.query;
  const data = await postItemTips({ itemName: itemName as string });
  res.status(200).json(data);
}

export default handler;
