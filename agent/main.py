"""
Human Design AI Agent

Pydantic AI agent for interpreting Human Design charts.
Run with: uvicorn agent.main:app --reload
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel
import httpx
from typing import Optional
import os

app = FastAPI(title="Human Design AI Agent")

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", os.getenv("FRONTEND_URL", "")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# MODELS
# ============================================================================

class ChartRequest(BaseModel):
    datetime_utc: str
    lat: float
    lng: float

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    chart_data: Optional[dict] = None

class InterpretationRequest(BaseModel):
    chart_data: dict
    focus: Optional[str] = None  # e.g., "type", "authority", "channels"

# ============================================================================
# AGENT SETUP
# ============================================================================

model = OpenAIModel("gpt-4o")

# System prompt for Human Design interpretation
SYSTEM_PROMPT = """You are an expert Human Design analyst and guide. You help people understand their Human Design charts with accuracy, depth, and practical wisdom.

Key principles:
1. Always be accurate about the mechanics - Type, Strategy, Authority, Profile, Definition, Channels, Gates
2. Explain concepts in accessible language while maintaining technical accuracy
3. Focus on practical application - how can someone use this information in daily life?
4. Be encouraging but honest - Human Design is about accepting who you are, not becoming something else
5. When discussing gates and channels, explain both the energy/theme AND how it might manifest
6. Remember that the chart shows potential - conditioning and awareness affect expression

When given chart data, analyze it holistically. Look for patterns:
- How channels connect centers
- Circuit dominance (Individual, Tribal, Collective)
- Defined vs undefined centers and what this means for the person
- Profile lines and their interplay
- Incarnation Cross theme

Never make up information about gates, channels, or other HD elements. If unsure, say so."""

agent = Agent(
    model=model,
    system_prompt=SYSTEM_PROMPT,
)

# ============================================================================
# ENDPOINTS
# ============================================================================

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.post("/interpret")
async def interpret_chart(request: InterpretationRequest):
    """Generate interpretation of a Human Design chart"""
    
    chart = request.chart_data
    focus = request.focus
    
    # Build prompt based on focus area
    if focus:
        prompt = f"""Analyze this Human Design chart, focusing specifically on {focus}:

Chart Data:
- Type: {chart.get('type')}
- Strategy: {chart.get('strategy')}
- Authority: {chart.get('authority')}
- Profile: {chart.get('profile')}
- Definition: {chart.get('definition')}
- Incarnation Cross: {chart.get('cross', {}).get('name')}
- Channels: {[ch.get('name') for ch in chart.get('channels', [])]}

Provide a focused interpretation of the {focus} aspect."""
    else:
        prompt = f"""Provide a comprehensive interpretation of this Human Design chart:

Type: {chart.get('type')}
Strategy: {chart.get('strategy')}
Signature: {chart.get('signature')}
Not-Self Theme: {chart.get('not_self')}
Authority: {chart.get('authority')}
Profile: {chart.get('profile')}
Definition: {chart.get('definition')}
Incarnation Cross: {chart.get('cross', {}).get('name')} ({chart.get('cross', {}).get('type')})
Quarter: {chart.get('cross', {}).get('quarter')}

Channels:
{chr(10).join([f"- {ch.get('name')} ({ch.get('gates')[0]}-{ch.get('gates')[1]}): {ch.get('circuit')} Circuit" for ch in chart.get('channels', [])])}

Circuitry Balance:
- Individual: {chart.get('circuitry', {}).get('individual', 0)}
- Tribal: {chart.get('circuitry', {}).get('tribal', 0)}
- Collective: {chart.get('circuitry', {}).get('collective', 0)}

Provide a meaningful interpretation covering:
1. Overall design overview
2. How to use Strategy and Authority
3. Key themes from the channels
4. Life purpose from the Incarnation Cross
5. Practical advice for living this design"""

    result = await agent.run(prompt)
    
    return {
        "interpretation": result.data,
        "focus": focus,
    }

@app.post("/chat")
async def chat(request: ChatRequest):
    """Chat about Human Design with optional chart context"""
    
    messages = request.messages
    chart_data = request.chart_data
    
    # Build context from chart if provided
    context = ""
    if chart_data:
        context = f"""
The user's Human Design chart:
- Type: {chart_data.get('type')}
- Strategy: {chart_data.get('strategy')}
- Authority: {chart_data.get('authority')}
- Profile: {chart_data.get('profile')}
- Definition: {chart_data.get('definition')}
- Cross: {chart_data.get('cross', {}).get('name')}
- Channels: {[ch.get('name') for ch in chart_data.get('channels', [])]}

Use this information to personalize your responses when relevant.
"""
    
    # Build conversation
    conversation = context + "\n\nConversation:\n"
    for msg in messages:
        conversation += f"{msg.role.upper()}: {msg.content}\n"
    
    conversation += "\nASSISTANT:"
    
    result = await agent.run(conversation)
    
    return {
        "role": "assistant",
        "content": result.data,
    }

@app.post("/analyze-transit")
async def analyze_transit(chart_data: dict, transit_data: dict):
    """Analyze how current transits affect a natal chart"""
    
    prompt = f"""Analyze how the current transits are affecting this person's Human Design:

Natal Chart:
- Type: {chart_data.get('type')}
- Authority: {chart_data.get('authority')}
- Defined Centers: {[c for c, v in chart_data.get('centers', {}).items() if v.get('defined')]}

Current Transit Activations:
{transit_data}

Explain:
1. Which gates are being activated by transit
2. Any temporary channels being formed
3. How this might affect decision-making and energy
4. Practical advice for navigating this transit period"""

    result = await agent.run(prompt)
    
    return {
        "analysis": result.data,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
