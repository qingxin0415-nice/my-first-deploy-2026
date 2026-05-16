import os
import random
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pydantic import BaseModel
import httpx

app = FastAPI()

FALLBACK_TOXIC = [
    "你以为有钱人很快乐吗？他们的快乐你根本想象不到。",
    "只要你坚持，没有什么事是搞不砸的。",
    "加油，你是最胖的。",
    "有时候你不努力一下，都不知道什么叫绝望。",
    "别灰心，人生就是这样起起落落落落落落落。",
    "世上无难事，只要肯放弃。",
    "比你有钱的人还比你努力，那你努力还有什么用。",
    "生活不止眼前的苟且，还有明天的苟且和后天的苟且。",
    "失败是成功之母，但成功经常难产。",
    "不要看脸，要看内涵。但你没有内涵，所以还是看脸吧。",
    "每当你觉得自己又丑又穷的时候，不要悲伤，至少你的判断是对的。",
    "努力不一定成功，但不努力一定会很轻松。",
    "上帝为你关上一扇门，还会顺手把窗户也带上。",
    "如果你觉得累，说明你在走上坡路。但你可能只是太胖了。",
    "哪有什么岁月静好，只是你懒得去拼。",
    "生活就像心电图，一帆风顺就说明你挂了。",
    "你以为自己是千里马，其实你只是头驴。",
    "在这个看脸的世界里，你成功地把自己活成了一个笑话。",
    "别人是祖国的花朵，你是树上的一片叶子——迟早要掉。",
    "你的工资条就像大姨妈，一个月来一次，一次疼一周。",
]

FALLBACK_INSPIRE = [
    "种一棵树最好的时间是十年前，其次是现在。",
    "千里之行，始于足下。",
    "天行健，君子以自强不息。",
    "宝剑锋从磨砺出，梅花香自苦寒来。",
    "长风破浪会有时，直挂云帆济沧海。",
    "会当凌绝顶，一览众山小。",
    "天生我材必有用。",
    "不经一番寒彻骨，怎得梅花扑鼻香。",
    "路漫漫其修远兮，吾将上下而求索。",
    "人生能有几回搏，此时不搏何时搏。",
    "山重水复疑无路，柳暗花明又一村。",
    "沉舟侧畔千帆过，病树前头万木春。",
    "莫愁前路无知己，天下谁人不识君。",
    "海内存知己，天涯若比邻。",
    "志当存高远。",
    "业精于勤，荒于嬉。",
    "书山有路勤为径，学海无涯苦作舟。",
    "吃得苦中苦，方为人上人。",
    "少壮不努力，老大徒伤悲。",
    "只要功夫深，铁杵磨成针。",
    "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
    "天将降大任于斯人也，必先苦其心志，劳其筋骨。",
    "老当益壮，宁移白首之心？穷且益坚，不坠青云之志。",
    "竹杖芒鞋轻胜马，谁怕？一蓑烟雨任平生。",
    "人生如逆旅，我亦是行人。",
    "千淘万漉虽辛苦，吹尽狂沙始到金。",
    "雄关漫道真如铁，而今迈步从头越。",
    "大鹏一日同风起，扶摇直上九万里。",
    "仰天大笑出门去，我辈岂是蓬蒿人。",
]


class GenerateRequest(BaseModel):
    category: str = "toxic"
    theme: str = ""


class ThemeFallback(BaseModel):
    text: str
    category: str
    source: str = "fallback"
    theme: str = ""


@app.get("/api/generate")
async def generate_get(category: str = "toxic", theme: str = ""):
    return await _generate(category, theme)


@app.post("/api/generate")
async def generate_post(req: GenerateRequest = None):
    cat = req.category if req else "toxic"
    theme = req.theme if req else ""
    return await _generate(cat, theme)


async def _generate(category: str, theme: str = ""):
    api_key = os.environ.get("SILICONFLOW_API_KEY", "")

    if not api_key:
        return _fallback(category, theme)

    base_style = "毒鸡汤" if category in ("toxic", "all") else "励志名言"

    if theme:
        prompt = (
            f"请围绕「{theme}」这个主题，创作一句中文{base_style}，"
            f"要求犀利、有共鸣、一针见血。"
            f"直接输出句子本身，不要解释，不要额外文字，不超过40个字。"
        )
    else:
        if category == "inspire":
            prompt = "请生成一句中文励志名言，温暖、鼓舞人心、富有哲理。直接输出句子本身，不要解释，不超过40个字。"
        else:
            prompt = "请生成一句中文毒鸡汤，扎心、幽默、犀利、一针见血。直接输出句子本身，不要解释，不超过40个字。"

    try:
        async with httpx.AsyncClient(timeout=20) as client:
            resp = await client.post(
                "https://api.siliconflow.cn/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "Qwen/Qwen2-7B-Instruct",
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.9,
                    "max_tokens": 100,
                },
            )
            data = resp.json()
            text = data["choices"][0]["message"]["content"].strip().strip("\"'")
            return {
                "text": text,
                "category": category,
                "source": "ai",
                "theme": theme,
            }
    except Exception:
        return _fallback(category, theme)


def _fallback(category, theme=""):
    pool = FALLBACK_TOXIC if category != "inspire" else FALLBACK_INSPIRE
    text = random.choice(pool)

    if theme:
        return {
            "text": f"关于「{theme}」：{text}",
            "category": category,
            "source": "fallback",
            "theme": theme,
        }
    return {
        "text": text,
        "category": category,
        "source": "fallback",
        "theme": "",
    }


@app.get("/")
async def serve_index():
    return FileResponse("index.html")


@app.get("/style.css")
async def serve_css():
    return FileResponse("style.css", media_type="text/css")


@app.get("/script.js")
async def serve_js():
    return FileResponse("script.js", media_type="application/javascript")
