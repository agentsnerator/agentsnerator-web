import { NextRequest, NextResponse } from 'next/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const industryStyles: Record<string, string[]> = {
  'صيدلية': [
    'arab female pharmacist wearing hijab white coat smiling pharmacy counter professional',
    'middle eastern pharmacy interior clean shelves medicine products professional lighting',
    'arabic doctor hijab woman consulting patient clinic professional photography',
    'medicine bottles pills organized pharmacy shelf clean professional',
    'arab healthcare team hijab uniforms smiling clinic professional'
  ],
  'صحة': [
    'arab female doctor hijab white coat professional clinic',
    'middle eastern medical team professional healthcare setting',
    'arabic patient consultation doctor clinic professional photography',
    'modern medical equipment hospital clean middle eastern setting',
    'arab healthcare professional hijab smiling wellness center'
  ],
  'مطاعم': [
    'arabic food spread mezze hummus traditional dishes professional photography',
    'middle eastern restaurant interior arabic decor warm lighting',
    'fresh arabic cuisine plated beautifully professional food photography',
    'traditional middle eastern desserts sweets professional photography',
    'arab family dining traditional food restaurant professional'
  ],
  'عقارات': [
    'modern arabic villa exterior architecture middle eastern style',
    'luxury arab apartment interior design professional photography',
    'arabic home interior elegant traditional modern fusion',
    'gulf style residential building exterior professional photography',
    'middle eastern city skyline modern buildings architecture'
  ],
};

function getImageUrl(industry: string, index: number): string {
  const matchedKey = Object.keys(industryStyles).find(k => industry.includes(k));
  const styles = matchedKey
    ? industryStyles[matchedKey]
    : [`${industry} professional photography arabic middle eastern`];
  const style = styles[index % styles.length];
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(style + ', professional photography, 4k, no text, no watermark')}?model=flux&width=1024&height=1024&nologo=true&seed=${1000 + index * 337}`;
}

export async function POST(req: NextRequest) {
  try {
    const { prompt, client_name, industry, language, tone, brand_description } = await req.json();

    const systemPrompt = `أنت خبير سوشال ميديا إبداعي متخصص في السوق العربي.
تكتب محتوى لـ ${client_name} في قطاع ${industry}.
البراند: ${brand_description || 'غير محدد'}. النبرة: ${tone || 'احترافي'}.

أسلوبك الإبداعي:
- ابدأ كل بوست بجملة مشوّقة (سؤال، إحصائية، أو جملة مفاجئة)
- تنوّع الأفكار: تثقيف، تحفيز، عرض، قصة، سؤال تفاعلي
- كل بوست فكرة مختلفة تماماً
- اكتب بأسلوب محادثة طبيعي وليس إعلانياً مباشراً
- اذكر ${client_name} بشكل طبيعي

القواعد:
- ${language === 'en' ? 'اكتب بالإنجليزية' : 'العربية الفصحى المبسطة فقط، ممنوع أي حرف أجنبي'}
- لا تستخدم كلمة "العميل"
- الرد JSON فقط بدون أي نص خارجه

{"posts":[{"number":1,"caption":"...","hashtags":["...","...","..."],"cta":"..."}]}`;

    const userPrompt = `اكتب 5 بوستات Instagram إبداعية ومتنوعة لـ ${client_name}.
الطلب: ${prompt}.
JSON فقط.`;

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        temperature: 0.85,
        max_tokens: 4000,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    });

    const groqData = await groqRes.json();
    const content = groqData.choices[0].message.content;
    const cleaned = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(cleaned);

    parsed.posts = parsed.posts.map((post: any, index: number) => ({
      ...post,
      image_url: getImageUrl(industry || '', index),
    }));

    return NextResponse.json({
      agent: 'Social-Media-Agent',
      status: 'success',
      client: client_name,
      platform: 'Instagram',
      output: JSON.stringify(parsed),
    });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
